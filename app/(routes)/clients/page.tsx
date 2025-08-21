import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      clients: {
        include: { _count: { select: { projects: true } } },
        orderBy: { id: 'desc' }
      }
    }
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Manage your clients</p>
        </div>
        <Link href="/clients/add">
          <Button>Add Client</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">All Clients</h2>
        </div>
        <div className="divide-y">
          {user?.clients.length ? user.clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.email}</p>
                  <p className="text-sm text-gray-500">{client.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{client._count.projects} projects</p>
                </div>
              </div>
            </Link>
          )) : (
            <div className="p-8 text-center text-gray-500">
              <p>No clients found. <Link href="/clients/add" className="text-blue-600 hover:underline">Add your first client</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}