import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

export default async function PaymentsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      projects: {
        include: {
          payments: {
            include: {
              transactions: true,
              milestone: true,
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  const allPayments = user?.projects.flatMap(project => 
    project.payments.map(payment => ({ ...payment, project }))
  ) || [];

  const pendingPayments = allPayments.filter(p => p.status === 'PENDING');
  const paidPayments = allPayments.filter(p => p.status === 'PAID');
  

  
  // Group by currency for display
  const pendingByCurrency = pendingPayments.reduce((acc, p) => {
    const currency = p.project.currency;
    acc[currency] = (acc[currency] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const paidByCurrency = paidPayments.reduce((acc, p) => {
    const currency = p.project.currency;
    acc[currency] = (acc[currency] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const totalByCurrency = allPayments.reduce((acc, p) => {
    const currency = p.project.currency;
    acc[currency] = (acc[currency] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Track all payments and transactions</p>
        </div>
        <Link href="/payments/add">
          <Button>Create Invoice</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Pending</h3>
          <div className="text-2xl font-bold text-yellow-600">
            {Object.entries(pendingByCurrency).map(([currency, amount]) => (
              <div key={currency}>{formatCurrency(amount, currency)}</div>
            ))}
            {Object.keys(pendingByCurrency).length === 0 && <div>No pending payments</div>}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
          <div className="text-2xl font-bold text-green-600">
            {Object.entries(paidByCurrency).map(([currency, amount]) => (
              <div key={currency}>{formatCurrency(amount, currency)}</div>
            ))}
            {Object.keys(paidByCurrency).length === 0 && <div>No paid payments</div>}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <div className="text-2xl font-bold">
            {Object.entries(totalByCurrency).map(([currency, amount]) => (
              <div key={currency}>{formatCurrency(amount, currency)}</div>
            ))}
            {Object.keys(totalByCurrency).length === 0 && <div>No revenue</div>}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">All Payments</h2>
        </div>
        <div className="divide-y">
          {allPayments.length ? allPayments.map((payment) => (
            <div key={payment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{payment.project.name}</h3>
                  <p className="text-sm text-gray-500">{payment.type} Payment</p>
                  {payment.milestone && (
                    <p className="text-sm text-blue-600">{payment.milestone.title}</p>
                  )}
                  {payment.description && (
                    <p className="text-sm text-gray-600">{payment.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{formatCurrency(payment.amount, payment.project.currency)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    payment.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                    payment.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.status}
                  </span>
                  {payment.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {payment.transactions.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2">Transactions:</p>
                  {payment.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between text-sm">
                      <span>{transaction.method} - {formatCurrency(transaction.amount, payment.project.currency)}</span>
                      <span className="text-gray-500">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500">
              <p>No payments found. <Link href="/payments/add" className="text-blue-600 hover:underline">Create your first payment</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}