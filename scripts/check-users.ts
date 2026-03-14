import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Conectando ao Supabase via Prisma...")
    const users = await prisma.user.findMany()
    console.log(`Encontrei ${users.length} usuários na base de dados:`)
    console.log(users.map(u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt })))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
