export type Usuario = {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
};

export { useUsuarios as useUsuariosApi } from './usuariosService';
export * from './usuariosService';
