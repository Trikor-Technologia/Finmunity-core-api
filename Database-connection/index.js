import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const prisma = new PrismaClient();

export const database = async () => {
  try {
    // Test the connection
    await prisma.$connect();
    console.log(chalk.green("✅ Connected to MongoDB via Prisma"));
  } catch (error) {
    console.error(chalk.red("❌ Error connecting to MongoDB:", error));
    process.exit(1);
  }
};

export { prisma };
