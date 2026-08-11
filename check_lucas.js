const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.findFirst({ where: { email: { contains: 'lucas' } }, include: { profile: true, financialPlan: true, assets: true } });
    console.log(JSON.stringify(user, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
