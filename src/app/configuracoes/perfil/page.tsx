'use client';

import React, { useState } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';

export default function PerfilPage() {
  const { usuarioAtual, editarUsuario } = useUsuarios();
  const [toast, setToast] = useState<string | null>(null);

  const [perfilForm, setPerfilForm] = useState({
    nome: usuarioAtual?.nome ?? '',
    email: usuarioAtual?.email ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfilForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioAtual) {
      setToast('Usuário não encontrado');
      return;
    }

    try {
      await editarUsuario(usuarioAtual.id, {
        nome: perfilForm.nome,
        email: perfilForm.email,
      });
      setToast('Perfil atualizado com sucesso!');
    } catch (error) {
      setToast('Erro ao atualizar o perfil.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome"
          name="nome"
          value={perfilForm.nome}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={perfilForm.email}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="primary">
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
}

)