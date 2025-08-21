import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MilestonesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      projects: {
        include: {
          milestones: {
            include: {
              payments: true,
            },
            orderBy: { dueDate: 'asc' }
          }
        }
      }
    }
  });

  const allMilestones = user?.projects.flatMap(project => 
    project.milestones.map(milestone => ({ ...milestone, project }))
  ) || [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Payment Milestones</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Track project milestones and payments</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">All Milestones</h2>
        </div>
        <div className="divide-y">
          {allMilestones.length ? allMilestones.map((milestone) => {
            const totalPaid = milestone.payments.reduce((sum, p) => sum + p.amount, 0);
            const isCompleted = milestone.status === 'COMPLETED';
            const isOverdue = new Date(milestone.dueDate) < new Date() && !isCompleted;
            
            return (
              <div key={milestone.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">{milestone.project.name}</p>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${milestone.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isCompleted ? 'bg-green-100 text-green-800' :
                      isOverdue ? 'bg-red-100 text-red-800' :
                      milestone.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status}
                    </span>
                    {totalPaid > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Paid: ${totalPaid.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-8 text-center text-gray-500">
              <p>No milestones found. Create milestones when adding projects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}