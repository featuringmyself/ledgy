import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { index, checked } = await request.json();
    console.log('Updating deliverable:', { id, index, checked });
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: { 
        id: parseInt(id),
        userId: user.id 
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log('Current project deliverableStatus:', project.deliverableStatus);
    
    const currentStatus = Array.isArray(project.deliverableStatus) ? project.deliverableStatus : [];
    const newStatus = [...currentStatus];
    
    while (newStatus.length < project.deliverables.length) {
      newStatus.push(false);
    }
    newStatus[index] = checked;

    console.log('New status array:', newStatus);

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { deliverableStatus: newStatus }
    });

    console.log('Updated successfully:', updatedProject.deliverableStatus);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating deliverable status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update deliverable status' }, { status: 500 });
  }
}