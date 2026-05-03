import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult } from './mockData';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

const BASE_PROMPT = `
Analyze the following codebase and provide a comprehensive report in JSON format.
You are an expert software architect and security auditor.
The response MUST strictly follow this JSON structure:
{
  "projectName": "string",
  "timestamp": "ISO date string",
  "isDemoData": false,
  "components": [{ "id": "string", "name": "string", "type": "string", "file": "string", "lines": number, "dependencies": ["string"] }],
  "securityVulnerabilities": [{ "id": "string", "type": "string", "severity": "critical" | "high" | "medium" | "low", "title": "string", "description": "string", "file": "string", "line": number, "codeSnippet": "string", "fixedCode": "string", "recommendation": "string" }],
  "codeQualityIssues": [{ "id": "string", "type": "string", "severity": "critical" | "high" | "medium" | "low", "title": "string", "description": "string", "file": "string", "codeSnippet": "string", "fixedCode": "string", "impact": "string", "suggestion": "string" }],
  "dependencies": [{ "id": "string", "name": "string", "currentVersion": "string", "latestVersion": "string", "status": "outdated" | "unused" | "vulnerable" | "ok", "severity": "critical" | "high" | "medium" | "low" | "none", "description": "string" }],
  "performanceIssues": [{ "id": "string", "title": "string", "severity": "critical" | "high" | "medium" | "low", "description": "string", "file": "string", "codeSnippet": "string", "fixedCode": "string", "impact": "string", "improvement": "string", "estimatedGain": "string" }],
  "upgradeSuggestions": [{ "id": "string", "category": "string", "current": "string", "suggested": "string", "reason": "string", "file": "string", "codeSnippet": "string", "fixedCode": "string", "difficulty": "easy" | "medium" | "hard", "benefit": "string" }],
  "uiAnalysis": [{ "id": "string", "component": "string", "category": "string", "issue": "string", "severity": "high" | "medium" | "low", "file": "string", "codeSnippet": "string", "fixedCode": "string", "recommendation": "string", "impactsAccessibility": boolean, "impactsPerformance": boolean }]
}

IMPORTANT: 
1. For "codeSnippet", provide the EXACT original code block that contains the issue. Include enough surrounding lines (2-3 lines before and after) to ensure the snippet is UNIQUE within the file. This is CRITICAL for our patching engine to find the right location.
2. For "fixedCode", provide the fully corrected code that should replace ONLY the "codeSnippet" part. Do not return the whole file here, just the replacement for the snippet.
3. Ensure "fixedCode" maintains the exact indentation and style of the "codeSnippet".
4. Your ENTIRE response must be valid JSON. 
5. DO NOT include any text outside of the JSON object. 
6. In your JSON strings (like codeSnippet and fixedCode), ensure you PROPERLY ESCAPE backslashes as \\ and double quotes as \". 
7. NEVER use single backslashes \ at the end of lines for continuation. Always use \n for newlines within strings.
8. Ensure every single property name is enclosed in double quotes.
`;

function sanitizeJsonString(str: string): string {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (inString) {
      if (escaped) {
        // We are after a backslash. Check if the current char is a valid escape char.
        if (!/[bfnrt"\\/]/.test(char) && char !== 'u') {
          // Invalid escape char. We need to escape the backslash itself.
          result = result.slice(0, -1) + '\\\\' + char;
        } else {
          result += char;
        }
        escaped = false;
      } else {
        if (char === '\\') {
          escaped = true;
          result += char;
        } else if (char === '"') {
          inString = false;
          result += char;
        } else if (char === '\n' || char === '\r') {
          // Literal newline in string - MUST be escaped in JSON
          result += '\\n';
          if (char === '\r' && str[i + 1] === '\n') i++; // Handle CRLF
        } else {
          result += char;
        }
      }
    } else {
      if (char === '"') {
        inString = true;
      }
      result += char;
    }
  }

  // 3. Handle trailing commas in arrays/objects
  return result.replace(/,\s*([\]}])/g, '$1');
}

export interface CodeFile {
  path: string;
  content: string;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const is503 = error.message?.includes('503') || error.status === 503 || error.message?.includes('high demand');
      if (is503 && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Gemini 503 error. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function analyzeCodebase(files: CodeFile[], projectName: string): Promise<AnalysisResult> {
  const filesString = files.map(f => `FILE: ${f.path}\nCONTENT:\n${f.content}\n---`).join('\n');
  const fullPrompt = `${BASE_PROMPT}\nProject Name: ${projectName}\n\n${filesString}`;

  // Try Gemini First
  try {
    if (!GEMINI_API_KEY) throw new Error('Gemini API key is missing');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Safety check for total prompt size
    let finalPrompt = fullPrompt;
    const MAX_CHARS = 200000; // 200k characters is safe (~50k tokens)
    
    if (fullPrompt.length > MAX_CHARS) {
      console.warn(`Prompt is too long (${fullPrompt.length} chars). Truncating to ${MAX_CHARS} chars.`);
      finalPrompt = fullPrompt.slice(0, MAX_CHARS) + "\n\n[PROMPT TRUNCATED DUE TO SIZE]";
    }

    console.log(`Sending to Gemini. Total Payload: ${finalPrompt.length} chars`);

    const result = await withRetry(() => model.generateContent(finalPrompt));
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response received');

    // Improved JSON extraction and cleaning
    const cleanJson = (str: string) => {
      // 1. Remove markdown code blocks if present
      let cleaned = str.replace(/```json/g, '').replace(/```/g, '');

      // 2. Find the first '{' and last '}'
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');

      if (start === -1 || end === -1) return cleaned;
      const jsonPart = cleaned.slice(start, end + 1);

      // 3. Sanitize the string
      return sanitizeJsonString(jsonPart);
    };

    const targetJson = cleanJson(text);
    if (targetJson) {
      try {
        const parsed = JSON.parse(targetJson);
        const usage = response.usageMetadata;

        return {
          ...parsed,
          tokenUsage: {
            input: usage?.promptTokenCount || 0,
            output: usage?.candidatesTokenCount || 0,
            total: usage?.totalTokenCount || 0
          }
        };
      } catch (parseError) {
        console.error('Gemini JSON parse error:', parseError);
        console.log('Raw text:', text);
      }
    }
    throw new Error('Could not parse JSON from Gemini response');
  } catch (geminiError: any) {
    console.error('Gemini analysis failed:', geminiError.message || geminiError);

    // Fallback to Claude
    try {
      if (!CLAUDE_API_KEY) throw new Error('Claude API key is missing');

      console.log('Falling back to Claude...');
      const msg = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 8192,
        messages: [{ role: 'user', content: fullPrompt }],
      });

      const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
      const usage = msg.usage;
      console.log('Claude response received');

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            ...parsed,
            tokenUsage: {
              input: usage?.input_tokens || 0,
              output: usage?.output_tokens || 0,
              total: (usage?.input_tokens || 0) + (usage?.output_tokens || 0)
            }
          };
        } catch (parseError) {
          console.error('Claude JSON parse error:', parseError);
        }
      }
      throw new Error('Could not parse JSON from Claude response');
    } catch (claudeError: any) {
      console.error('Claude analysis also failed:', claudeError.message || claudeError);
      throw new Error(`AI Analysis failed: ${claudeError.message || 'Unknown error'}`);
    }
  }
}

// Keeping the single file version for backwards compatibility if needed
export async function analyzeCode(code: string, fileName: string): Promise<AnalysisResult> {
  return analyzeCodebase([{ path: fileName, content: code }], "Single File Analysis");
}
