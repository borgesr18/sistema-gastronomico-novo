import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('Rb180780@', 10);

  await prisma.usuario.create({
    data: {
      nome: 'Admin',
      email: 'rba1807@gmail.com',
      senhaHash: senhaHash,
      role: 'admin',
      oculto: true,
    },
  });

  console.log('Usuário admin criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
