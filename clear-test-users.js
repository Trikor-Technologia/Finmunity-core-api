// Script to clear test users from the database
// Run with: node clear-test-users.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearTestUsers() {
  try {
    console.log("🧹 Clearing test users from database...");

    // Delete users with test emails
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: "test@example.com" },
          { email: "test2@example.com" },
          { username: "testuser" },
          { username: "testuser2" },
        ],
      },
    });

    console.log(`✅ Deleted ${deletedUsers.count} test users`);

    // Also clear any test questions created by these users
    const deletedQuestions = await prisma.question.deleteMany({
      where: {
        OR: [{ author: "testuser" }, { author: "testuser2" }],
      },
    });

    console.log(`✅ Deleted ${deletedQuestions.count} test questions`);

    console.log("🎉 Database cleanup completed!");
  } catch (error) {
    console.error("❌ Error clearing test users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearTestUsers();
