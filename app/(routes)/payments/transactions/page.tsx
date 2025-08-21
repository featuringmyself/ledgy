import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function TransactionsPage() {
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
              transactions: {
                orderBy: { transactionDate: 'desc' }
              },
              project: true,
            }
          }
        }
      }
    }
  });

  const allTransactions = user?.projects.flatMap(project => 
    project.payments.flatMap(payment => 
      payment.transactions.map(transaction => ({ 
        ...transaction, 
        payment: { ...payment, project } 
      }))
    )
  ) || [];

  const totalTransactions = allTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">All payment transactions</p>
        </div>
        <Link href="/payments/transactions/add">
          <Button>Record Payment</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
        <p className="text-2xl font-bold text-green-600">${totalTransactions.toLocaleString()}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Transaction History</h2>
        </div>
        <div className="divide-y">
          {allTransactions.length ? allTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{transaction.payment.project.name}</h3>
                  <p className="text-sm text-gray-500">{transaction.method}</p>
                  {transaction.reference && (
                    <p className="text-sm text-gray-600">Ref: {transaction.reference}</p>
                  )}
                  {transaction.notes && (
                    <p className="text-sm text-gray-600 mt-1">{transaction.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    +${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500">
              <p>No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}