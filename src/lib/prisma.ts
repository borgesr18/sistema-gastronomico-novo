import { PrismaClient } from '@prisma/client';

declare global {
  // Garantimos que o Prisma não gere múltiplas instâncias em modo dev
  var prisma: PrismaClient | undefined;
}

// Garantir DATABASE_URL para evitar erros em builds locais ou testes
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
