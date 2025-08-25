import { ensureUser } from '@/lib/user';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard-content';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

async function DashboardData() {
  const user = await ensureUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  const [projects, payments, clients] = await Promise.all([
    prisma.project.findMany({
      where: { userId: user.id },
      include: { client: true },
      orderBy: { startDate: 'desc' },
      take: 5
    }),
    prisma.payment.findMany({
      where: { project: { userId: user.id } },
      include: { project: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.client.count({ where: { userId: user.id } })
  ]);

  // Calculate total revenue using base currency amounts for accurate totals
  const totalRevenue = await prisma.payment.aggregate({
    where: { 
      project: { userId: user.id },
      status: 'PAID'
    },
    _sum: { amountInBaseCurrency: true }
  });

  // Convert total revenue from base currency (USD) to user's default currency
  let convertedTotalRevenue = totalRevenue._sum.amountInBaseCurrency || 0;
  
  if (user.defaultCurrency !== 'USD') {
    // Get the latest exchange rate from USD to user's default currency
    const exchangeRate = await prisma.exchangeRate.findFirst({
      where: {
        fromCurrency: 'USD',
        toCurrency: user.defaultCurrency
      },
      orderBy: { date: 'desc' }
    });
    
    if (exchangeRate) {
      convertedTotalRevenue = convertedTotalRevenue * exchangeRate.rate;
    }
  }

  const activeProjects = projects.filter(p => !p.completed).length;
  const pendingPayments = await prisma.payment.count({
    where: { 
      project: { userId: user.id },
      status: 'PENDING'
    }
  });

  // Transform data to match DashboardData interface
  const dashboardData = {
    totalRevenue: convertedTotalRevenue,
    activeProjects,
    totalClients: clients,
    pendingPayments,
    projects: projects.map(project => ({
      id: project.id.toString(),
      name: project.name,
      client: { name: project.client.name },
      completed: project.completed
    })),
    payments: payments.map(payment => ({
      id: payment.id.toString(),
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      project: { client: { name: payment.project.client.name } }
    }))
  };

  return <DashboardContent initialData={dashboardData} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}


