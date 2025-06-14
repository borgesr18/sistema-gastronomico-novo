'use client';

import { useState, useEffect } from 'react';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  createdAt?: string;
}

export const useUsuariosApi = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const listarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setErro('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const criarUsuario = async (dados: { nome: string; email: string; senha: string; role: Usuario['role'] }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const erro = await res.json();
        setErro(erro.error || 'Erro ao criar usuário');
        return null;
      }

      const novo = await res.json();
      setUsuarios((prev) => [...prev, novo]);
      return novo;
    } catch {
      setErro('Erro ao criar usuário');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { usuarios, loading, erro, listarUsuarios, criarUsuario };
};
