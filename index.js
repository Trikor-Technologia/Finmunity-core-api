import express from "express";
import { database } from "./Database-connection/index.js";
import { configDotenv } from "dotenv";
const startServer = () => {
    configDotenv();
    const app = express();
    app.get("/", (req, res) => {
        res.json({ message: "Hii API" });
    })
    app.listen(process.env.PORT, () => {
        console.log(`Server working on port ${process.env.PORT}`);
    })
    database()
}
startServer();