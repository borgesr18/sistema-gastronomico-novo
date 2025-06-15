import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'rba1807@gmail.com';
  const adminNome = 'Admin';
  const adminSenha = 'Rb180780@';

  // Função para gerar o hash SHA256 da senha
  const hashSenha = (senha: string) => {
    return createHash('sha256').update(senha).digest('hex');
  };

  const senhaHash = hashSenha(adminSenha);

  const existingUser = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    await prisma.usuario.create({
      data: {
        nome: adminNome,
        email: adminEmail,
        senha: senhaHash,
        role: 'admin',
        oculto: true,
      },
    });

    console.log('Admin oculto criado com sucesso.');
  } else {
    console.log('Admin oculto já existe. Nenhuma alteração feita.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
