import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const projectId = parseInt(id);

    const project = await prisma.project.update({
      where: {
        id: projectId,
        userId: user.id
      },
      data: {
        completed: true
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error marking project as complete:', error);
    return NextResponse.json({ error: 'Failed to mark project as complete' }, { status: 500 });
  }
}