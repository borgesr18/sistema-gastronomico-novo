import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = createHash('sha256').update('Rb180780@').digest('hex');

  await prisma.usuario.upsert({
    where: { email: 'rba1807@gmail.com' },
    update: {},
    create: {
      nome: 'Admin',
      email: 'rba1807@gmail.com',
      senhaHash: senhaHash,
      role: 'admin',
      oculto: true,
    },
  });

  console.log('Usuário admin criado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
