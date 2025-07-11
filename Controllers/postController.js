import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPost = async (req, res) => {
    const userId = req.params.id
    const { caption, imageurl, author } = req.body;
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const newPost = await prisma.post.create({
            data: {
                Caption: caption,
                ImageUrl: imageurl,
                Author: author,
                userId: userId
            }
        })
        return res.status(200).json(newPost)
    } catch (error) {
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