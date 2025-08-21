import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        projects: {
          include: {
            client: true
          },
          orderBy: { id: 'desc' }
        }
      }
    });

    return NextResponse.json(user?.projects || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: data.email || 'temp@example.com'
        }
      });
    }

    // Find or create client
    let client = await prisma.client.findFirst({
      where: {
        name: data.clientName,
        userId: user.id
      }
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: data.clientName,
          email: data.email,
          phone: data.phone,
          userId: user.id
        }
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        budget: data.budget,
        currency: data.currency || 'USD',
        deliverables: data.deliverables,
        deliverableStatus: data.deliverables.map(() => false),
        userId: user.id,
        clientId: client.id
      }
    });

    // Create payments based on payment type
    if (data.paymentType === 'full_upfront') {
      await prisma.payment.create({
        data: {
          projectId: project.id,
          type: 'ADVANCE',
          amount: data.fullAmount,
          description: 'Full payment upfront'
        }
      });
    } else if (data.paymentType === 'milestone_only' && data.milestones.length > 0) {
      for (const milestoneData of data.milestones) {
        const milestone = await prisma.paymentMilestone.create({
          data: {
            projectId: project.id,
            title: milestoneData.title,
            amount: parseFloat(milestoneData.amount),
            dueDate: new Date(milestoneData.dueDate)
          }
        });

        await prisma.payment.create({
          data: {
            projectId: project.id,
            type: 'MILESTONE',
            amount: parseFloat(milestoneData.amount),
            milestoneId: milestone.id,
            dueDate: new Date(milestoneData.dueDate),
            description: `Payment for milestone: ${milestoneData.title}`
          }
        });
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}