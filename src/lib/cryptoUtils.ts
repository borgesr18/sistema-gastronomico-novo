import { createHash } from 'crypto';

export function hashSenha(senha: string) {
  return createHash('sha256').update(senha).digest('hex');
}
