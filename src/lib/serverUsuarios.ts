import { prisma } from './prisma'
import { hashSenha } from './cryptoUtils'

export type Role = 'admin' | 'editor' | 'viewer' | 'manager'

const adminEmail = 'rba1807@gmail.com'
const adminNome = 'Admin'
const adminSenha = 'Rb180780@'

export const senhaForte = (senha: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha)

export const ensureAdmin = async () => {
  const existe = await prisma.usuario.findUnique({ where: { email: adminEmail } })
  if (!existe) {
    await prisma.usuario.create({
      data: {
        nome: adminNome,
        email: adminEmail,
        senhaHash: hashSenha(adminSenha),
        role: 'admin',
        oculto: true,
      },
    })
  }
}

export const getUsuarios = async () =>
  prisma.usuario.findMany({ where: { oculto: false } })

export const getAllUsuarios = async () => prisma.usuario.findMany()

export const addUsuario = async (dados: {
  nome: string
  email: string
  senha: string
  role?: Role
}) => {
  const user = await prisma.usuario.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senhaHash: hashSenha(dados.senha),
      role: dados.role ?? 'viewer',
    },
  })
  return user
}

export const findByEmail = async (email: string) =>
  prisma.usuario.findUnique({ where: { email } })
