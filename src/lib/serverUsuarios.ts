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

export const hashSenha = (senha: string) =>
  createHash('sha256').update(senha).digest('hex');

export const ensureAdmin = () => {
  usuarios = usuarios.filter(
    u => u.email !== adminEmail && u.nome !== adminNome
  );
  usuarios.push({
    id: 'admin',
    nome: adminNome,
    email: adminEmail,
    senhaHash: hashSenha(adminSenha),
    role: 'admin',
    oculto: true
  });

};

ensureAdmin();

export const getUsuarios = () => usuarios.filter(u => !u.oculto);

export const getAllUsuarios = () => usuarios;

export const addUsuario = (dados: Omit<UsuarioInfo, 'id'>) => {
  const novo: UsuarioInfo = { ...dados, id: Date.now().toString(36) + Math.random().toString(36).slice(2) };
  usuarios.push(novo);
  return novo;
};

export const findByEmail = (email: string) => usuarios.find(u => u.email === email);

export const senhaForte = (senha: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);
