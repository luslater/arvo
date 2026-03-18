const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const plans = await prisma.financialPlan.findMany();
  console.log(plans);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
