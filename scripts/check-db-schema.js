const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchema() {
    try {
        const users = await prisma.user.findMany({
            take: 1,
            select: {
                id: true,
                email: true,
                subscriptionStatus: true
            }
        });
        console.log('✅ Conexão com banco OK.');
        console.log('✅ Coluna subscriptionStatus encontrada:', users[0] ? users[0].subscriptionStatus : 'Sem usuários no banco, mas coluna existe');
    } catch (error) {
        console.error('❌ Erro ao validar schema:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

checkSchema();
