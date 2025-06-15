'use client';

import { useState, useEffect } from 'react';
import { createHash } from 'crypto';

export type Role = 'admin' | 'editor' | 'viewer' | 'manager';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: Role;
  oculto?: boolean;
}

// Funções utilitárias
const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
const hashSenha = (senha: string) => createHash('sha256').update(senha).digest('hex');

// Hook principal
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);

  // Aqui você pode colocar seus métodos: criarUsuario, login, listar, etc.

  const listarUsuarios = async () => {
    // Exemplo de implementação
    setUsuarios([]); // Ajuste conforme sua lógica
  };

  return {
    usuarios,
    listarUsuarios,
    usuarioAtual,
  };
};
