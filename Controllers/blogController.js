import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBlog = async (req, res) => {
    const userId = req.params.id
    const { imageurl, content, title } = req.body;
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const newPost = await prisma.blog.create({
            data: {
                Content: content,
                ImageUrl: imageurl,
                Title: title,
                userId: userId
            }
        })
        return res.status(200).json(newPost)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error! Error creating user blog" })

    }
}
export const getUserAllBlogs = async (req, res) => {
    const userId = req.params.id
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const userBlogs = await prisma.blog.findMany({
            where: {
                userId: userId
            }
        })
        return res.status(200).json(userBlogs)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error! Error Fetching user blogs" })

    }
}