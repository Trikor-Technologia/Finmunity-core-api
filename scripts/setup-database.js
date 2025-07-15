import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import chalk from "chalk";

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log(chalk.blue("🚀 Setting up Finmunity database..."));

    // Test database connection
    await prisma.$connect();
    console.log(chalk.green("✅ Database connection successful"));

    // Create sample users
    console.log(chalk.yellow("📝 Creating sample users..."));

    const hashedPassword = await bcrypt.hash("Password123!", 12);

    const users = [
      {
        username: "admin",
        email: "admin@finmunity.com",
        passwordHash: hashedPassword,
        bio: "System administrator",
        profilePicture: "/images/default-avatar.png",
      },
      {
        username: "demo_user",
        email: "demo@finmunity.com",
        passwordHash: hashedPassword,
        bio: "Demo user for testing",
        profilePicture: "/images/default-avatar.png",
      },
      {
        username: "finance_expert",
        email: "expert@finmunity.com",
        passwordHash: hashedPassword,
        bio: "Financial advisor with 10+ years experience",
        profilePicture: "/images/default-avatar.png",
      },
    ];

    for (const userData of users) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { username: userData.username }],
        },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: userData,
        });
        console.log(chalk.green(`✅ Created user: ${userData.username}`));
      } else {
        console.log(
          chalk.yellow(`⚠️ User already exists: ${userData.username}`)
        );
      }
    }

    // Create sample news articles
    console.log(chalk.yellow("📰 Creating sample news articles..."));

    const newsArticles = [
      {
        title: "Federal Reserve Signals Rate Cut in Q4",
        description:
          "The Federal Reserve has indicated a potential rate cut in the fourth quarter to stimulate economic growth and address inflation concerns.",
        shortDescription: "Fed hints at Q4 rate cut to boost economy.",
        image: "/images/placeholder-news.jpg",
        category: "economy",
        author: "Financial Times",
        username: "admin",
        isTrending: true,
        views: 1250,
        sources: ["Federal Reserve", "Financial Times"],
      },
      {
        title: "Tesla Stock Surges After Q3 Earnings",
        description:
          "Tesla stock experienced a significant surge following the release of their third-quarter earnings report, beating analyst expectations.",
        shortDescription: "Tesla shares soar post Q3 earnings.",
        image: "/images/placeholder-news.jpg",
        category: "stocks",
        author: "Market Watch",
        username: "admin",
        isTrending: true,
        views: 890,
        sources: ["Tesla Inc.", "Market Watch"],
      },
      {
        title: "Bitcoin Reaches New All-Time High",
        description:
          "Bitcoin has reached a new all-time high, driven by increased institutional adoption and growing interest in cryptocurrency investments.",
        shortDescription: "Bitcoin hits new record high.",
        image: "/images/placeholder-news.jpg",
        category: "crypto",
        author: "Crypto News",
        username: "admin",
        isTrending: false,
        views: 567,
        sources: ["Coinbase", "Crypto News"],
      },
    ];

    for (const newsData of newsArticles) {
      const existingNews = await prisma.news.findFirst({
        where: { title: newsData.title },
      });

      if (!existingNews) {
        const user = await prisma.user.findFirst({
          where: { username: newsData.username },
        });

        if (user) {
          await prisma.news.create({
            data: {
              ...newsData,
              userId: user.id,
            },
          });
          console.log(chalk.green(`✅ Created news: ${newsData.title}`));
        }
      } else {
        console.log(chalk.yellow(`⚠️ News already exists: ${newsData.title}`));
      }
    }

    // Create sample stocks
    console.log(chalk.yellow("📈 Creating sample stocks..."));

    const stocks = [
      {
        name: "NIFTY 50",
        exchange: "NSE",
        category: "Index",
        value: "22,510.23",
        change: "+1.2%",
        isUp: true,
        isTrending: true,
      },
      {
        name: "SENSEX",
        exchange: "BSE",
        category: "Index",
        value: "74,210.45",
        change: "+0.8%",
        isUp: true,
        isTrending: false,
      },
      {
        name: "RELIANCE",
        exchange: "NSE",
        category: "Oil & Gas",
        value: "2,450.75",
        change: "+2.1%",
        isUp: true,
        isTrending: true,
      },
      {
        name: "TCS",
        exchange: "NSE",
        category: "IT",
        value: "3,890.50",
        change: "-0.5%",
        isUp: false,
        isTrending: false,
      },
    ];

    for (const stockData of stocks) {
      const existingStock = await prisma.stock.findFirst({
        where: { name: stockData.name },
      });

      if (!existingStock) {
        await prisma.stock.create({
          data: stockData,
        });
        console.log(chalk.green(`✅ Created stock: ${stockData.name}`));
      } else {
        console.log(chalk.yellow(`⚠️ Stock already exists: ${stockData.name}`));
      }
    }

    // Create sample questions
    console.log(chalk.yellow("❓ Creating sample questions..."));

    const questions = [
      {
        title: "What are the best investment strategies for beginners?",
        content:
          "I'm new to investing and would like to know what strategies work best for beginners. Any advice on where to start and what to avoid?",
        category: "investment",
        author: "Demo User",
        username: "demo_user",
      },
      {
        title: "How to analyze cryptocurrency before investing?",
        content:
          "I want to invest in cryptocurrency but don't know how to analyze different coins. What factors should I consider before making an investment?",
        category: "crypto",
        author: "Demo User",
        username: "demo_user",
      },
    ];

    for (const questionData of questions) {
      const existingQuestion = await prisma.question.findFirst({
        where: { title: questionData.title },
      });

      if (!existingQuestion) {
        const user = await prisma.user.findFirst({
          where: { username: questionData.username },
        });

        if (user) {
          await prisma.question.create({
            data: {
              ...questionData,
              userId: user.id,
            },
          });
          console.log(
            chalk.green(`✅ Created question: ${questionData.title}`)
          );
        }
      } else {
        console.log(
          chalk.yellow(`⚠️ Question already exists: ${questionData.title}`)
        );
      }
    }

    console.log(chalk.green("🎉 Database setup completed successfully!"));
    console.log(chalk.blue("📋 Sample data created:"));
    console.log(chalk.blue("   - 3 users (admin, demo_user, finance_expert)"));
    console.log(chalk.blue("   - 3 news articles"));
    console.log(chalk.blue("   - 4 stocks"));
    console.log(chalk.blue("   - 2 questions"));
    console.log(
      chalk.yellow("🔑 Default password for all users: Password123!")
    );
  } catch (error) {
    console.error(chalk.red("❌ Database setup failed:"), error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
