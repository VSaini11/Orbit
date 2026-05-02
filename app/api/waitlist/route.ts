import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Waitlist from '@/models/Waitlist';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Check if already exists
    const existing = await Waitlist.findOne({ email });
    if (existing) {
      return NextResponse.json({ 
        message: 'You are already in our waitlist queue! Thank you for your interest, we will notify you as soon as we go live.',
        alreadyIn: true 
      }, { status: 200 });
    }

    // Create new entry
    await Waitlist.create({ email });

    return NextResponse.json({ 
      message: 'Successfully joined the waitlist!',
      alreadyIn: false
    }, { status: 201 });

  } catch (error: any) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist. Please try again later.' }, { status: 500 });
  }
}
