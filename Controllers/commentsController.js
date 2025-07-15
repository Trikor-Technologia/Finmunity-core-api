import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userblogComments = async (req, res) => {
    const userId = req.params.id;
    const { text, blogid } = req.body;
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const userBlogComment = await prisma.comments.create({
            data: {
                Text: text,
                userId: userId,
                blogId: blogid,
                postId: "Not required"
            }
        })
        return res.status(200).json(userBlogComment)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error! Error creating user blogComment" })
    }
}
export const userpostComments = async (req, res) => {
    const userId = req.params.id;
    const { text, postid } = req.body;
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const userPostComment = await prisma.comments.create({
            data: {
                Text: text,
                userId: userId,
                postId: postid,
                blogId: "Not required"
            }
        })
        return res.status(200).json(userPostComment)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error! Error creating user blogComment" })
    }
}
