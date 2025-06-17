'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SenhaFormProps {
  onSave: (novaSenha: string) => void;
  onCancel: () => void;
}

export default function SenhaForm({ onSave, onCancel }: SenhaFormProps) {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmacao) {
      setErro('As senhas não coincidem');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres');
      return;
    }

    onSave(senha);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && <p className="text-red-500">{erro}</p>}

      <Input
        label="Nova Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      <Input
        label="Confirmação"
        type="password"
        value={confirmacao}
        onChange={(e) => setConfirmacao(e.target.value)}
        required
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Salvar
        </Button>
      </div>
    </form>
  );
}
