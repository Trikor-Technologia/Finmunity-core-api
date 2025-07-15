import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function migrateUsers() {
  try {
    console.log("Starting user migration...");

    // First, let's see what users we have
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    console.log(`Found ${allUsers.length} total users`);

    // Find users without usernames or with empty usernames
    const usersToUpdate = allUsers.filter(
      (user) => !user.username || user.username === "" || user.username === null
    );

    console.log(`Found ${usersToUpdate.length} users that need usernames`);

    // Update each user with a unique username
    for (const user of usersToUpdate) {
      let username;
      let isUnique = false;
      let attempts = 0;

      // Generate unique username
      while (!isUnique && attempts < 10) {
        username = faker.internet
          .userName()
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "");

        // Check if username already exists
        const existingUser = allUsers.find((u) => u.username === username);

        if (!existingUser) {
          isUnique = true;
        } else {
          attempts++;
        }
      }

      if (isUnique) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { username },
          });
          console.log(`Updated user ${user.email} with username: ${username}`);
        } catch (error) {
          console.log(`Failed to update user ${user.email}:`, error.message);
        }
      } else {
        console.log(
          `Failed to generate unique username for user ${user.email}`
        );
      }
    }

    console.log("User migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateUsers();
