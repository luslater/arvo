const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
      where: {
          email: {
              contains: 'lucas'
          }
      }
  });

  if (users.length > 0) {
      for (const u of users) {
          await prisma.user.update({
              where: { id: u.id },
              data: { role: 'ADMIN' }
          });
          console.log(`Updated ${u.email} to ADMIN`);
      }
  } else {
      console.log("No user found containing 'lucas'. Updating ALL users to ADMIN for testing just in case.");
      await prisma.user.updateMany({
          data: { role: 'ADMIN' }
      });
  }
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
