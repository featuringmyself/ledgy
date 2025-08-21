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
    const { paymentId, amount, method, reference, notes } = body;

    const transaction = await prisma.transaction.create({
      data: {
        paymentId,
        amount,
        method: method || "OTHER",
        reference: reference || null,
        notes: notes || null,
      },
      include: {
        payment: {
          include: {
            project: true,
          },
        },
      },
    });

    // Update payment status based on total transactions
    const totalPaid = await prisma.transaction.aggregate({
      where: { paymentId },
      _sum: { amount: true },
    });

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (payment && totalPaid._sum.amount) {
      const status = totalPaid._sum.amount >= payment.amount ? "PAID" : "PARTIAL";
      await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status,
          paidDate: status === "PAID" ? new Date() : null,
        },
      });
    }

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}