const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
    try {
        console.log('🚀 Iniciando migração manual...');

        // Adicionando role
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';
        `);
        console.log('✅ Coluna "role" verificada/adicionada.');

        // Adicionando subscriptionStatus
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT DEFAULT 'FREE';
        `);
        console.log('✅ Coluna "subscriptionStatus" verificada/adicionada.');

        console.log('🎉 Migração concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro na migração:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
