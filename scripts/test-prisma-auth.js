const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

async function main() {
    const prisma = new PrismaClient()
    const email = 'test-error@arvo.com'
    const password = 'senhaSegura123'

    console.log('--- TESTANDO CADASTRO ---')
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: 'Teste Local',
                password: hashedPassword
            }
        })
        console.log('Sucesso ou Usuário já existente:', user.id)
    } catch (err) {
        console.error('Erro no cadastro:', err.message)
    }

    console.log('--- TESTANDO LOGIN (SIMULAÇÃO NEXTAUTH) ---')
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            console.log('FALHA: Usuário não encontrado no banco!')
        } else {
            console.log('Usuário encontrado. Validando senha...')
            const isValid = await bcrypt.compare(password, user.password)
            console.log('Senha é válida?', isValid)
        }
    } catch (err) {
        console.error('Erro no login:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
