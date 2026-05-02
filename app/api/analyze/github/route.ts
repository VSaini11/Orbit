import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { analyzeCodebase, CodeFile } from '@/lib/ai-analysis';
import connectDB from '@/lib/db';
import Analysis from '@/models/Analysis';
import { auth } from '@/auth';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, projectId } = await req.json();

    if (!url || !projectId) {
      return NextResponse.json({ error: 'Missing GitHub URL or projectId' }, { status: 400 });
    }

    // Parse owner and repo from URL
    // Format: https://github.com/owner/repo
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    const owner = match[1];
    const repo = match[2].replace('.git', '');

    // Fetch repository contents (recursively)
    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: 'main', // Assuming 'main' branch, should ideally check default branch
      recursive: 'true',
    });

    const codeFiles: CodeFile[] = [];
    
    // Select key files for analysis
    const relevantFiles = tree.tree.filter((item: any) => 
      item.type === 'blob' && 
      (item.path.endsWith('.ts') || item.path.endsWith('.tsx') || item.path.endsWith('.js') || item.path.endsWith('.json')) &&
      !item.path.includes('node_modules/') && 
      !item.path.includes('.git/')
    ).slice(0, 30); // Limit to 30 files for demo

    for (const file of relevantFiles) {
      const { data: contentData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.path as string,
      });

      if ('content' in contentData) {
        const content = Buffer.from(contentData.content, 'base64').toString('utf8');
        codeFiles.push({ path: file.path as string, content });
      }
    }

    if (codeFiles.length === 0) {
      return NextResponse.json({ error: 'No relevant code files found in repository' }, { status: 400 });
    }

    await connectDB();

    const result = await analyzeCodebase(codeFiles, `${owner}/${repo}`);

    // Save to MongoDB with full context
    const analysis = await Analysis.create({
      projectId,
      result: { ...result, repoUrl: url },
      sourceType: 'github',
      sourceName: `${owner}/${repo}`,
    });

    return NextResponse.json({ 
      id: analysis._id,
      repoUrl: url,
      ...result 
    });
  } catch (error: any) {
    console.error('GitHub Analysis Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
