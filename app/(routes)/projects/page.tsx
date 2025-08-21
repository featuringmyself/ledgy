import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Manage your projects</p>
        </div>
        <Link href="/projects/add">
          <Button>Add Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Active Projects</h2>
          </div>
          <div className="divide-y">
            {user?.projects.filter(p => !p.completed && new Date(p.endDate) > new Date()).length ? user.projects.filter(p => !p.completed && new Date(p.endDate) > new Date()).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.client.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.currency} {project.budget.toLocaleString()}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Active</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <p>No active projects</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Completed Projects</h2>
          </div>
          <div className="divide-y">
            {user?.projects.filter(p => p.completed).length ? user.projects.filter(p => p.completed).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.client.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.currency} {project.budget.toLocaleString()}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <p>No completed projects</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


