import { ensureUser } from '@/lib/user';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const user = await ensureUser();
  
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
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-black/60 dark:text-white/60 mt-2">Overview of your business</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">${totalRevenue._sum.amount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</h3>
          <p className="text-2xl font-bold mt-2">{activeProjects}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</h3>
          <p className="text-2xl font-bold mt-2">{clients}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</h3>
          <p className="text-2xl font-bold mt-2">{pendingPayments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map(project => (
                <div key={project.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.client.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
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
            <p className="text-gray-500">No projects yet</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">${payment.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{payment.project.client.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
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
            <p className="text-gray-500">No payments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}


