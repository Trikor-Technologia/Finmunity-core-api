import { database } from "./Database-connection/index.js";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
<<<<<<< HEAD
import cors from "cors"
import cloudinary from "cloudinary";
import multer from "multer";
import fs from "fs"
import chalk from 'chalk';
// Import Routes
import userRoutes from "./Routes/userRoutes.js"
import profileRoutes from "./Routes/profileRoutes.js"
import postRoutes from "./Routes/postRoutes.js"
import blogRoutes from "./Routes/blogRoutes.js"
import commentRoutes from "./Routes/commentRoutes.js"
const startServer = () => {
    configDotenv();
    const app = express();
    app.use(bodyParser.json())
    app.use(cors());
    app.use("/api", [userRoutes, profileRoutes, postRoutes, blogRoutes, commentRoutes])
    app.get("/", (req, res) => {
        res.json({ message: "Hii API" });
    })
    app.listen(process.env.PORT, () => {
        console.log(chalk.blueBright(`Server working on port ${process.env.PORT}`));
    })
    database();



    /// test
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });

    const upload = multer({ dest: 'uploads/' });

    app.post('/upload', upload.single('image'), async (req, res) => {
        try {
            const filePath = req.file.path;
            console.log("Uploading file:", filePath);

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'mern_uploads'
            });

            // Delete local file after upload
            fs.unlinkSync(filePath);

            console.log("Upload success:", result.secure_url);
            res.json({ imageUrl: result.secure_url });
        } catch (err) {
            console.error("Upload error:", err);
            res.status(500).json({ error: 'Upload failed' });
        }
    });

}
startServer();
=======
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import chalk from "chalk";

// Import Socket.io setup
import { app, server } from "./socket/socket.js";

// Import Routes
import authRoutes from "./Routes/authRoutes.js";
import newsRoutes from "./Routes/newsRoutes.js";
import questionRoutes from "./Routes/questionRoutes.js";
import communityRoutes from "./Routes/communityRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import marketRoutes from "./Routes/marketRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";

// Import middleware
import { authenticateToken, optionalAuth } from "./middleware/auth.js";

const startServer = async () => {
  configDotenv();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // limit each IP to 1000 requests per minute (much more reasonable for development)
    message: {
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later",
      },
    },
    // Skip rate limiting for development
    skip: (req) =>
      process.env.NODE_ENV === "development" &&
      req.headers.host?.includes("localhost"),
  });
  app.use(limiter);

  // Body parsing middleware
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Finmunity API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/news", optionalAuth, newsRoutes);
  app.use("/api/questions", optionalAuth, questionRoutes);
  app.use("/api/community", optionalAuth, communityRoutes);
  app.use("/api/users", optionalAuth, userRoutes);
  app.use("/api/market", optionalAuth, marketRoutes);
  app.use("/api/notifications", authenticateToken, notificationRoutes);
  app.use("/api/messages", authenticateToken, messageRoutes);

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to Finmunity API",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        news: "/api/news",
        questions: "/api/questions",
        community: "/api/community",
        users: "/api/users",
        market: "/api/market",
        notifications: "/api/notifications",
        messages: "/api/messages",
      },
      documentation: "API documentation coming soon",
    });
  });

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Endpoint not found",
      },
    });
  });

  // Global error handler
  app.use((error, req, res) => {
    console.error("Global error handler:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong on the server",
      },
    });
  });

  const PORT = process.env.PORT || 5000;

  // Initialize database connection
  await database();

  server.listen(PORT, () => {
    console.log(
      chalk.blueBright(`🚀 Finmunity API server running on port ${PORT}`)
    );
    console.log(
      chalk.green(`📊 Health check: http://localhost:${PORT}/health`)
    );
    console.log(chalk.yellow(`🔗 API Base URL: http://localhost:${PORT}/api`));
    console.log(chalk.cyan(`🔌 Socket.io enabled for real-time features`));
  });
};

startServer().catch((error) => {
  console.error(chalk.red("Failed to start server:", error));
  process.exit(1);
});
>>>>>>> abhinav/main
