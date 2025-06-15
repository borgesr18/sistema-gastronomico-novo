'use client';

import { useState } from 'react';
import { useUsuarios } from '@/lib/useUsuarios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function PerfilPage() {
  const { usuarioAtual, editarUsuario } = useUsuarios();
  const [perfilForm, setPerfilForm] = useState({
    nome: usuarioAtual?.nome ?? '',
    email: usuarioAtual?.email ?? '',
    role: usuarioAtual?.role ?? 'viewer',
  });
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState('');

  if (!usuarioAtual) {
    return <p>Carregando perfil...</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfilForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await editarUsuario(usuarioAtual.id, perfilForm);
    if (ok) {
      setToast('Perfil atualizado');
      setErro('');
    } else {
      setErro('Falha ao atualizar perfil');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {toast && <p className="text-sm text-green-600">{toast}</p>}

      <form onSubmit={handleSubmit} className="space-y-2">
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

        <Input
          label="Perfil"
          name="role"
          value={perfilForm.role}
          readOnly
          disabled
        />

        <Button type="submit" variant="primary" fullWidth>
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
}

