import { NextRequest, NextResponse } from 'next/server';
import { analyzeCode } from '@/lib/ai-analysis';
import connectDB from '@/lib/db';
import Analysis from '@/models/Analysis';

export async function POST(req: NextRequest) {
  try {
    const { code, fileName, projectId, sourceType } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code content is required' }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await connectDB();

    const result = await analyzeCode(code, fileName || 'unknown-file');

    // Save to MongoDB
    const analysis = await Analysis.create({
      projectId,
      result,
      sourceType: sourceType || 'file',
      sourceName: fileName || 'uploaded-file',
    });

    return NextResponse.json({ 
      id: analysis._id,
      ...result 
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
