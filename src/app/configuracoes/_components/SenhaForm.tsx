'use client';

import React, { useState, FormEvent } from 'react';

interface Props {
  usuario: {
    id: string;
    nome: string;
  };
  onSuccess: () => void;
}

export default function SenhaForm({ usuario, onSuccess }: Props) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const res = await fetch(`/api/usuarios/${usuario.id}/alterarSenha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || 'Erro ao alterar senha');
      } else {
        onSuccess();
      }
    } catch (err) {
      setErro('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && <p className="text-red-500">{erro}</p>}

      <input
        type="password"
        placeholder="Nova senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
        {loading ? 'Alterando...' : 'Alterar Senha'}
      </button>
    </form>
  );
}
