import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from '@faker-js/faker';
export const createProfile = async (req, res) => {
    const userId = req.params.id
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const profileData = await prisma.profile.create({
            data: {
                Ask: faker.internet.username(),
                Community: faker.internet.username(),
                userId: userId
            }
        })
        return res.status(200).json({ message: `profile created with id ${userId}---> ${profileData}` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error! Error Creating user Profile" })
    }
}