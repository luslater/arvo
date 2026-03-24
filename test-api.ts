import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const user = await prisma.user.findFirst({ where: { email: "lucasdmatos@gmail.com" }});
  if (!user) { console.log("User not found"); return; }
  
  // 1. Fetch current
  const profile = await prisma.profile.findUnique({ where: { userId: user.id }});
  console.log("Current DB Profile:", profile);
  
  // 2. Simulate GET /api/user/profile
  // It uses upsert if not found, let's assume it found it.
}
main()
