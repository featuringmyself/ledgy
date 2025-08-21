import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, title, description, amount, dueDate } = body;

    const milestone = await prisma.paymentMilestone.create({
      data: {
        projectId,
        title,
        description,
        amount,
        dueDate: new Date(dueDate),
      },
      include: {
        project: true,
        payments: true,
      },
    });

    return NextResponse.json(milestone);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const milestones = await prisma.paymentMilestone.findMany({
      where: projectId ? { projectId: parseInt(projectId) } : undefined,
      include: {
        project: true,
        payments: true,
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(milestones);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 });
  }
}