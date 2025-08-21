import { PrismaClient } from "./app/generated/prisma";

const prisma = new PrismaClient();

export async function main() {
  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const user = await prisma.user.create({
    data: {
      clerkId: "user_demo123",
      email: "demo@example.com"
    }
  });

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      name: "TechCorp Inc",
      email: "contact@techcorp.com",
      phone: "+1-555-0123",
      userId: user.id
    }
  });

  const client2 = await prisma.client.create({
    data: {
      name: "StartupXYZ",
      email: "hello@startupxyz.com",
      phone: "+1-555-0456",
      userId: user.id
    }
  });

  // Create projects
  await prisma.project.create({
    data: {
      name: "E-commerce Platform",
      description: "Build a modern e-commerce platform with React and Node.js",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-04-15"),
      budget: 25000,
      currency: "USD",
      deliverables: ["Frontend Development", "Backend API", "Payment Integration", "Admin Dashboard"],
      userId: user.id,
      clientId: client1.id
    }
  });

  await prisma.project.create({
    data: {
      name: "Mobile App Design",
      description: "Design and develop a mobile app for iOS and Android",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-03-30"),
      budget: 18000,
      currency: "USD",
      deliverables: ["UI/UX Design", "iOS Development", "Android Development", "Testing"],
      userId: user.id,
      clientId: client2.id
    }
  });

  await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete redesign of company website with modern UI",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-01"),
      budget: 12000,
      currency: "USD",
      deliverables: ["Homepage Design", "Product Pages", "Contact Form", "SEO Optimization"],
      userId: user.id,
      clientId: client1.id
    }
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });