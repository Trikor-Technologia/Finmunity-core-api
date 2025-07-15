import { PrismaClient } from "@prisma/client";
import cloudinary from "cloudinary";
import fs from "fs"
const prisma = new PrismaClient();

export const createPost = async (req, res) => {
    const userId = req.params.id
    const { caption } = req.body;
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
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const newPost = await prisma.post.create({
            data: {
                Caption: caption,
                ImageUrl: result.secure_url,
                userId: userId
            }
        })
        return res.status(200).json(newPost)
    } catch (error) {
        console.error("Upload error:", err);
        res.status(500).json({ error: 'Upload failed' });
        return res.status(500).json({ message: "Internal Server Error! Error creating user post" })

    }
}
export const getUserAllPosts = async (req, res) => {
    const userId = req.params.id
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const userPost = await prisma.post.findMany({
            where: {
                userId: userId
            }
        })
        return res.status(200).json(userPost)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error! Error Fetching user posts" })

    }
}