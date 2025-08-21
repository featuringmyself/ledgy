import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user) {
    redirect("/sign-in");
  }

  const client = await prisma.client.findFirst({
    where: { 
      id: parseInt(params.id),
      userId: user.id 
    },
    include: {
      projects: {
        orderBy: { id: 'desc' }
      }
    }
  });

  if (!client) {
    redirect("/clients");
  }

  const totalRevenue = client.projects.reduce((sum, p) => sum + p.budget, 0);
  const activeProjects = client.projects.filter(p => new Date(p.endDate) > new Date()).length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Client Details</p>
        </div>
        <Link href="/clients">
          <Button variant="outline">Back to Clients</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Info</h3>
          <p className="text-lg font-medium mt-2">{client.email}</p>
          <p className="text-sm text-gray-600">{client.phone}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
          <p className="text-2xl font-bold mt-2">{client.projects.length}</p>
          <p className="text-xs text-blue-600 mt-1">{activeProjects} active</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Projects</h2>
        </div>
        <div className="divide-y">
          {client.projects.length ? client.projects.map((project) => {
            const isActive = new Date(project.endDate) > new Date();
            const isCompleted = new Date(project.endDate) <= new Date();
            return (
              <div key={project.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{project.currency} {project.budget.toLocaleString()}</p>
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
              <p>No projects found for this client.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}