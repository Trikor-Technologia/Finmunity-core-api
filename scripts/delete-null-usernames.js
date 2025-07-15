import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteNullUsernames() {
  try {
    console.log("Deleting users with null or empty usernames...");
    const result = await prisma.user.deleteMany({
      where: {
        OR: [{ username: null }, { username: "" }],
      },
    });
    console.log(`Deleted ${result.count} users.`);
  } catch (error) {
    console.error("Error deleting users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteNullUsernames();
