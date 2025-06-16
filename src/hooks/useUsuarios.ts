'use client';

import { useState } from 'react';
import { Usuario } from '@prisma/client';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function carregarUsuarios() {
    setCarregando(true);
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } finally {
      setCarregando(false);
    }
  }

  async function editarUsuario(id: string, dados: Partial<Usuario>) {
    setCarregando(true);
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!res.ok) throw new Error('Erro ao editar usuário');

      const usuarioAtualizado = await res.json();

      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? usuarioAtualizado : u))
      );

      // Se o usuário editado for o atual logado, atualiza também
      if (usuarioAtual && usuarioAtual.id === id) {
        setUsuarioAtual(usuarioAtualizado);
      }
    } finally {
      setCarregando(false);
    }
  }

  function setUsuarioLogado(usuario: Usuario | null) {
    setUsuarioAtual(usuario);
  }

  return {
    usuarios,
    usuarioAtual,
    carregando,
    carregarUsuarios,
    editarUsuario,
    setUsuarioLogado,
  };
}

