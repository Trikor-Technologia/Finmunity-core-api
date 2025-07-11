import express from "express";
import { database } from "./Database-connection/index.js";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"
// Import Routes
import userRoutes from "./Routes/userRoutes.js"
import profileRoutes from "./Routes/profileRoutes.js"
import postRoutes from "./Routes/postRoutes.js"
import blogRoutes from "./Routes/blogRoutes.js"
import chalk from 'chalk';
const startServer = () => {
    configDotenv();
    const app = express();
    app.use(bodyParser.json())
    app.use(cors());
    app.use("/api", [userRoutes, profileRoutes, postRoutes, blogRoutes])
    app.get("/", (req, res) => {
        res.json({ message: "Hii API" });
    })
    app.listen(process.env.PORT, () => {
        console.log(chalk.blueBright(`Server working on port ${process.env.PORT}`));
    })
    database();
}
startServer();