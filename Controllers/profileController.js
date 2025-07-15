import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from '@faker-js/faker';
export const createProfile = async (req, res) => {
    const userId = req.params.id
    const { username, bio, profilepiURL, gender, followers, following } = req.body
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const profileData = await prisma.profile.create({
            data: {
                Ask: faker.internet.username(),
                Community: faker.internet.username(),
                Username: username,
                Bio: bio,
                Profilepictureurl: profilepiURL,
                Gender: gender,
                Followers: followers,
                Following: following,
                userId: userId
            }
        })
        return res.status(200).json({ message: `profile created with id ${userId}---> ${profileData}` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error! Error Creating user Profile" })
    }
}
export const getUserProfileData = async (req, res) => {
    const userId = req.params.id
    if (!userId) {
        return res.status(401).json({ message: "No id provided" });
    }
    try {
        const fetchUserProfileData = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!fetchUserProfileData) {
            return res.status(401).json({ message: "Profile not found ! Or invalid userId" })
        }
        return res.status(200).json(fetchUserProfileData)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error! Error fetching user profile" })

    }
}
