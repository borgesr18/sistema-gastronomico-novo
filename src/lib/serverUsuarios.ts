import { prisma } from './prisma';
import { hashSenha } from './cryptoUtils';

export type Role = 'admin' | 'editor' | 'viewer' | 'manager';

const adminEmail = 'rba1807@gmail.com';
const adminNome = 'Admin';
const adminSenha = 'Rb180780@';

/** Validação de senha forte */
export const senhaForte = (senha: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);

/** Garante que o Admin fixo sempre exista no banco */
export const ensureAdmin = async (): Promise<void> => {
  const existe = await prisma.usuario.findUnique({ where: { email: adminEmail } });
  if (!existe) {
    await prisma.usuario.create({
      data: {
        nome: adminNome,
        email: adminEmail,
        senhaHash: hashSenha(adminSenha),
        role: 'admin',
        oculto: true,
      },
    });
  }
};

/** Retorna todos os usuários visíveis (não ocultos) */
export const getUsuarios = async () => {
  return prisma.usuario.findMany({
    where: { oculto: false },
  });
};

/** Retorna todos os usuários, incluindo ocultos */
export const getAllUsuarios = async () => {
  return prisma.usuario.findMany();
};

/** Adiciona um novo usuário ao banco */
export const addUsuario = async (dados: {
  nome: string;
  email: string;
  senha: string;
  role?: Role;
}) => {
  return prisma.usuario.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senhaHash: hashSenha(dados.senha),
      role: dados.role ?? 'viewer',
    },
  });
};

/** Busca usuário por e-mail */
export const findByEmail = async (email: string) => {
  return prisma.usuario.findUnique({
    where: { email },
  });
};
