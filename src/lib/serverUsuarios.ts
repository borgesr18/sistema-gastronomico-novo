import { createHash } from 'crypto';

export interface UsuarioInfo {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
}

let usuarios: UsuarioInfo[] = [];

export const getUsuarios = () => usuarios;

export const addUsuario = (dados: Omit<UsuarioInfo, 'id'>) => {
  const novo: UsuarioInfo = { ...dados, id: Date.now().toString(36) + Math.random().toString(36).slice(2) };
  usuarios.push(novo);
  return novo;
};

export const findByEmail = (email: string) => usuarios.find(u => u.email === email);

export const hashSenha = (senha: string) => createHash('sha256').update(senha).digest('hex');

export const senhaForte = (senha: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);
