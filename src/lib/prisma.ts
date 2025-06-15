import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
  // fallback to a local sqlite database during build or tests
  process.env.DATABASE_URL = 'file:./dev.db'
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
