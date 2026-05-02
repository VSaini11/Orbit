import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Analysis from '@/models/Analysis';
import { auth } from '@/auth';

export async function DELETE(
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

    // 1. Delete all analyses associated with this project
    await Analysis.deleteMany({ projectId });

    // 2. Delete the project itself
    const deletedProject = await Project.findOneAndDelete({
      _id: projectId,
      userId: session.user?.id || session.user?.email, // Ensure security
    });

    if (!deletedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project and all data deleted' });

  } catch (error: any) {
    console.error('Delete Project Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
