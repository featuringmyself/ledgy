import { currentUser } from '@clerk/nextjs/server';
import prisma from './prisma';

export async function ensureUser() {
  const user = await currentUser();
  if (!user) return null;

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id }
  });

  if (!existingUser) {
    return await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  return existingUser;
}