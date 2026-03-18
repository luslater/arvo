const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.sijgmjffsgnhnjppzmbg:WFSkCTAuf8T1pNyb@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
    }
  }
});

async function main() {
  try {
    const result = await prisma.$executeRawUnsafe(`ALTER TABLE "FinancialPlan" ADD COLUMN "currentCapital" DOUBLE PRECISION`);
    console.log("Column added successfully via Direct Connection 5432!");
  } catch (err) {
    if (err.message.includes("already exists")) {
       console.log("Column already existed.");
    } else {
       console.error("Error:", err);
    }
  }
}

main().finally(() => prisma.$disconnect());
