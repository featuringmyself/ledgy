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
    const { projectId, type, amount, dueDate, description, milestoneId } = body;

    const payment = await prisma.payment.create({
      data: {
        projectId,
        type,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        description,
        milestoneId,
      },
      include: {
        project: true,
        milestone: true,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
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

    const payments = await prisma.payment.findMany({
      where: projectId ? { projectId: parseInt(projectId) } : undefined,
      include: {
        project: true,
        milestone: true,
        transactions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}