const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetEmail = process.argv[2];
  if (!targetEmail) {
    console.error("Uso seguro: node promote_admin.js <email_do_usuario>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
      where: { email: targetEmail }
  });

  if (!user) {
      console.error(`Usuário com e-mail '${targetEmail}' não encontrado.`);
      process.exit(1);
  }

  await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
  });
  console.log(`✅ Sucesso: O usuário ${user.email} foi promovido a ADMIN.`);
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
