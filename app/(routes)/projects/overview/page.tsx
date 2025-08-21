import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

export default async function ProjectsOverviewPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      projects: {
        include: { client: true },
        orderBy: { id: 'desc' },
        take: 5
      }
    }
  });

  const totalProjects = user?.projects.length || 0;
  const totalRevenue = user?.projects.reduce((sum, p) => sum + p.budget, 0) || 0;
  const activeProjects = user?.projects.filter(p => new Date(p.endDate) > new Date()).length || 0;
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Projects Overview</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Track and manage your projects</p>
        </div>
        <Link href="/projects/add">
          <Button>Add Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
          <p className="text-2xl font-bold mt-2">{totalProjects}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</h3>
          <p className="text-2xl font-bold mt-2">{activeProjects}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">{totalRevenue.toLocaleString()} (Mixed)</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
        </div>
        <div className="divide-y">
          {user?.projects.length ? user.projects.map((project) => {
            const isActive = new Date(project.endDate) > new Date();
            const isCompleted = new Date(project.endDate) <= new Date();
            return (
              <div key={project.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.client.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(project.budget, project.currency)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isCompleted ? 'bg-green-100 text-green-800' :
                    isActive ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          }) : (
            <div className="p-8 text-center text-gray-500">
              <p>No projects found. <Link href="/projects/add" className="text-blue-600 hover:underline">Create your first project</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


