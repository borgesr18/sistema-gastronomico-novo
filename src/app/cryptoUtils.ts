import { createHash } from 'crypto';

export const hashSenha = (senha: string) =>
  createHash('sha256').update(senha).digest('hex');
