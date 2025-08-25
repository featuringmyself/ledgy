import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@/prisma/app/generated/prisma/client';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { defaultCurrency: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      defaultCurrency: user.defaultCurrency
    });
  } catch (error) {
    console.error('Error fetching user currency:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { defaultCurrency } = await request.json();

    // Validate currency code
    const isValidCurrency = SUPPORTED_CURRENCIES.some(
      currency => currency.code === defaultCurrency
    );

    if (!isValidCurrency) {
      return NextResponse.json(
        { error: 'Invalid currency code' },
        { status: 400 }
      );
    }

    // Update or create user with new default currency
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { defaultCurrency },
      create: {
        clerkId: userId,
        email: '', // This should be populated from Clerk webhook
        defaultCurrency
      }
    });

    return NextResponse.json({
      success: true,
      defaultCurrency: user.defaultCurrency,
      message: 'Currency preference updated successfully'
    });
  } catch (error) {
    console.error('Error updating user currency:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}