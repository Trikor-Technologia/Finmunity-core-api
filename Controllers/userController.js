import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.create({ data: { email, password } });
  res.json(user);
}
