import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const users = await prisma.user.findMany({ include: { profile: true } })
  console.log(JSON.stringify(users.map(u => ({ email: u.email, profile: u.profile })), null, 2))
}
main().finally(() => prisma.$disconnect())
