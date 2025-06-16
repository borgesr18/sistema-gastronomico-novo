'use client';

import { useState, useEffect } from 'react';
import { Usuario } from '@prisma/client';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      try {
        const res = await fetch('/api/usuarios');
        const data = await res.json();
        setUsuarios(data.usuarios);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  const editarUsuario = async (usuario: Usuario) => {
    try {
      await fetch(`/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
    }
  };

  return {
    usuarios,
    usuarioAtual,
    setUsuarioAtual,
    editarUsuario,
    loading,
  };
}
