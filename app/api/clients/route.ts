import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, phone } = await request.json();
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email
        }
      });
    }

    // Create client
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        userId: user.id
      }
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { clients: true }
    });

    return NextResponse.json(user?.clients || []);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}