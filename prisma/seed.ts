import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const senha = 'Rb180780@';
  const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');

  await prisma.usuario.create({
    data: {
      nome: 'Admin',
      email: 'rba1807@gmail.com',
      senhaHash: senhaHash,
      role: 'admin',
      oculto: true
    }
  });

  console.log('Usuário Admin criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

