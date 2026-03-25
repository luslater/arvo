import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.findFirst({ where: { email: "lucasdmatos@gmail.com" }, include: { profile: true } })
  console.log(JSON.stringify(user?.profile, null, 2))
}
main().finally(() => prisma.$disconnect())
