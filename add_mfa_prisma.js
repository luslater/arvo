const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaEnabled" BOOLEAN NOT NULL DEFAULT false;');
  console.log("Added mfaEnabled");
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaSecret" TEXT;');
  console.log("Added mfaSecret");
}
main().catch(console.error).finally(() => prisma.$disconnect());
