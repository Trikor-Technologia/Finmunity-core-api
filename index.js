import express from "express";
import { database } from "./Database-connection/index.js";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
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