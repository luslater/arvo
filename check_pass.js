const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'lucasdmatos@gmail.com' }
  });
  console.log('User found:', user?.email);
  console.log('Has password:', !!user?.password);
}
main().catch(console.error).finally(() => prisma.$disconnect());
