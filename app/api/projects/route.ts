import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    console.log(`Fetching projects for user: ${userId}`);
    
    const projects = await Project.find({ userId }).sort({ createdAt: -1 }).lean();
    
    // Optimized: Fetch all projects and their latest analysis in parallel more efficiently
    const Analysis = (await import('@/models/Analysis')).default;
    const projectsWithAnalysis = await Promise.all(projects.map(async (project) => {
      const latestAnalysis = await Analysis.findOne({ projectId: project._id })
        .select('sourceName sourceType createdAt')
        .sort({ createdAt: -1 })
        .lean();
      return { ...project, latestAnalysis };
    }));

    return NextResponse.json(projectsWithAnalysis);
  } catch (error: any) {
    console.error('GET Projects Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    
    await connectDB();
    const userId = (session.user as any).id;
    console.log(`Creating project for user: ${userId}, Name: ${name}`);
    
    const project = await Project.create({ 
      name, 
      description, 
      userId 
    });
    
    console.log(`Project created successfully: ${project._id}`);
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('POST Projects Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
