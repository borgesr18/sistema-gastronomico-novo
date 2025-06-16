'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { useUsuarios } from '@/hooks/useUsuarios';

export default function PerfilPage() {
  const { usuarioAtual, editarUsuario } = useUsuarios();

  const [perfilForm, setPerfilForm] = useState({
    nome: usuarioAtual?.nome ?? '',
    email: usuarioAtual?.email ?? '',
  });

  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioAtual) return;

    setLoading(true);
    setToast(null);

    try {
      await editarUsuario(usuarioAtual.id, {
        nome: perfilForm.nome,
        email: perfilForm.email,
      });
      setToast('Perfil atualizado com sucesso!');
    } catch (error) {
      setToast('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Meu Perfil</h1>

      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome"
          value={perfilForm.nome}
          onChange={(e) =>
            setPerfilForm({ ...perfilForm, nome: e.target.value })
          }
          required
        />

        <Input
          label="Email"
          type="email"
          value={perfilForm.email}
          onChange={(e) =>
            setPerfilForm({ ...perfilForm, email: e.target.value })
          }
          required
        />

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  );
}
