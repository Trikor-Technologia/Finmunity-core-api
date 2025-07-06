import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user already exists
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      }
    })
    if (findUser) {
      return res.status(400).json({ message: "Email already Exists Please login! or Use another email" });
    }
    const newUser = await prisma.user.create({ data: { email, password } });
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error)

    return res.status(500).json({ message: "Internal Server Error! Error registering user" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        email: email,
        password: password
      }
    })
    if (!foundUser) {
      return res.status(401).json({ message: "User not found ! Please check - If registered or entered email or password" })
    }
    return res.status(200).json({ message: "Login Successful" })
  } catch (error) {
    console.log(error)

    return res.status(500).json({ message: "Internal Server Error! Error user login" })
  }
}
