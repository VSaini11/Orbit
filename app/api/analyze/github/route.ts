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

    // 1. Fetch repository details to get the default branch
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    const defaultBranch = repoData.default_branch;

    // 2. Fetch repository contents using the default branch
    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: 'true',
    });

    const codeFiles: CodeFile[] = [];
    
    const skipPatterns = [
      'node_modules/', 
      '.git/', 
      '.next/', 
      'package-lock.json', 
      'yarn.lock', 
      'pnpm-lock.yaml',
      '.svg',
      '.png',
      '.jpg',
      '.jpeg',
      '.ico',
      'dist/',
      'build/'
    ];

    // Select key files for analysis
    const relevantFiles = tree.tree.filter((item: any) => {
      const isFile = item.type === 'blob';
      const isRelevantExtension = item.path.endsWith('.ts') || 
                                  item.path.endsWith('.tsx') || 
                                  item.path.endsWith('.js') || 
                                  item.path.endsWith('.jsx') ||
                                  item.path.endsWith('.py');
      const isSkipped = skipPatterns.some(pattern => item.path.includes(pattern));
      
      return isFile && isRelevantExtension && !isSkipped;
    }).slice(0, 40); // Increased limit slightly since we're filtering better

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
