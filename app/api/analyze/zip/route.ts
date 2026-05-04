import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import { analyzeCodebase, CodeFile } from '@/lib/ai-analysis';
import connectDB from '@/lib/db';
import Analysis from '@/models/Analysis';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or projectId' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    const codeFiles: CodeFile[] = [];
    let totalFiles = 0;

    // Filter and collect relevant files
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;
      
      const fileName = entry.entryName;
      // Skip heavy dependencies, build artifacts, and lockfiles
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
        '.woff',
        '.woff2',
        'dist/',
        'build/'
      ];

      if (skipPatterns.some(pattern => fileName.includes(pattern))) continue;
      
      // Only take relevant code files
      const isCodeFile = 
        fileName.endsWith('.ts') || 
        fileName.endsWith('.tsx') || 
        fileName.endsWith('.js') || 
        fileName.endsWith('.jsx') || 
        fileName.endsWith('.py') || 
        fileName.endsWith('.css');

      if (isCodeFile) {
        // Limit number of files to avoid hitting AI context limits for this demo
        if (codeFiles.length < 50) {
          const content = entry.getData().toString('utf8');
          if (content.length < 50000) { // Skip extremely large individual files
            codeFiles.push({ path: fileName, content });
          }
        }
        totalFiles++;
      }
    }

    if (codeFiles.length === 0) {
      return NextResponse.json({ error: 'No relevant code files found in ZIP' }, { status: 400 });
    }

    await connectDB();

    const result = await analyzeCodebase(codeFiles, file.name);

    // Save to MongoDB
    const analysis = await Analysis.create({
      projectId,
      result,
      sourceType: 'file',
      sourceName: file.name,
    });

    return NextResponse.json({ 
      id: analysis._id,
      ...result 
    });
  } catch (error: any) {
    console.error('ZIP Analysis Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
