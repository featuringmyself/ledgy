import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProjectsOverview from "@/components/ProjectsOverview";

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
        take: 10 // Show more projects
      }
    }
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Transform data for client component
  const projects = user.projects.map(project => ({
    id: project.id,
    name: project.name,
    budget: project.budget,
    currency: project.currency,
    endDate: project.endDate.toISOString(),
    client: {
      name: project.client.name
    }
  }));

  return <ProjectsOverview projects={projects} userCurrency={user.defaultCurrency} />;
}


