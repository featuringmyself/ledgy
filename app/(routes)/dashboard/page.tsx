import { ensureUser } from '@/lib/user';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
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

  const totalRevenue = await prisma.payment.aggregate({
    where: { 
      project: { userId: user.id },
      status: 'PAID'
    },
    _sum: { amount: true }
  });

  const activeProjects = projects.filter(p => !p.completed).length;
  const pendingPayments = await prisma.payment.count({
    where: { 
      project: { userId: user.id },
      status: 'PENDING'
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-black/60 dark:text-white/60 mt-2">Overview of your business</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-xl sm:text-2xl font-bold mt-2">${totalRevenue._sum.amount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</h3>
          <p className="text-xl sm:text-2xl font-bold mt-2">{activeProjects}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</h3>
          <p className="text-xl sm:text-2xl font-bold mt-2">{clients}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</h3>
          <p className="text-xl sm:text-2xl font-bold mt-2">{pendingPayments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Recent Projects</h2>
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map(project => (
                <div key={project.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b last:border-b-0 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{project.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{project.client.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-center shrink-0 ${
                    project.completed 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {project.completed ? 'Completed' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No projects yet</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Recent Payments</h2>
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b last:border-b-0 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">${payment.amount.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{payment.project.client.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-center shrink-0 ${
                    payment.status === 'PAID'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : payment.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No payments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}


