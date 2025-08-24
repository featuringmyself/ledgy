import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

export default async function ProjectsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      projects: {
        include: { client: true },
        orderBy: { id: 'desc' }
      }
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Manage your projects</p>
        </div>
        <Link href="/projects/add">
          <Button className="w-full sm:w-auto">Add Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-base sm:text-lg font-semibold">Active Projects</h2>
          </div>
          <div className="divide-y">
            {user?.projects.filter(p => !p.completed && new Date(p.endDate) > new Date()).length ? user.projects.filter(p => !p.completed && new Date(p.endDate) > new Date()).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base truncate">{project.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{project.client.name}</p>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <p className="text-xs sm:text-sm font-medium">{formatCurrency(project.budget, project.currency)}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 self-start sm:self-end mt-1">Active</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <p className="text-sm">No active projects</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-base sm:text-lg font-semibold">Completed Projects</h2>
          </div>
          <div className="divide-y">
            {user?.projects.filter(p => p.completed).length ? user.projects.filter(p => p.completed).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base truncate">{project.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{project.client.name}</p>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <p className="text-xs sm:text-sm font-medium">{formatCurrency(project.budget, project.currency)}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 self-start sm:self-end mt-1">Completed</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <p className="text-sm">No completed projects</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


