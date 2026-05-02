import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Analysis from '@/models/Analysis';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    await connectDB();

    const latestAnalysis = await Analysis.findOne({ projectId })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestAnalysis) {
      return NextResponse.json({ error: 'No analysis found' }, { status: 404 });
    }

    return NextResponse.json({
      ...latestAnalysis.result,
      repoUrl: latestAnalysis.result.repoUrl || '',
      sourceType: latestAnalysis.sourceType,
      sourceName: latestAnalysis.sourceName
    });

  } catch (error: any) {
    console.error('Fetch Analysis Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
