'use client';

import React, { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Unidade } from '@prisma/client';

interface UnidadeFormProps {
  unidade: Unidade | null;
  onSave: (unidade: Partial<Unidade>) => Promise<void>;
  onCancel: () => void;
}

export default function UnidadeForm({ unidade, onSave, onCancel }: UnidadeFormProps) {
  const [sigla, setSigla] = useState(unidade?.sigla ?? '');
  const [nome, setNome] = useState(unidade?.nome ?? '');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    if (!sigla || !nome) {
      setErro('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      await onSave({
        id: unidade?.id,
        sigla,
        nome,
      });
    } catch (error) {
      setErro('Erro ao salvar a unidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && <p className="text-red-500">{erro}</p>}

      <Input
        label="Sigla"
        value={sigla}
        onChange={(e) => setSigla(e.target.value)}
        placeholder="Ex: kg, l, un"
        required
      />

      <Input
        label="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Ex: Quilograma, Litro, Unidade"
        required
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
