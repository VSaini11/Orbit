import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const password = req.headers.get('x-admin-password');
    
    // Debug logging (will show in terminal)
    console.log('Delete Request ID:', id);
    console.log('Password Match:', password === process.env.ADMIN_PASSWORD);

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized: Password Mismatch' }, { status: 401 });
    }
    await connectDB();
    const job = await Job.findByIdAndDelete(id);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
