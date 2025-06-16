'use client';

import React, { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CategoriaFormProps {
  categoria: {
    id?: string;
    nome: string;
  } | null;
  onSave: (categoria: { id?: string; nome: string }) => void;
  onCancel: () => void;
}

export default function CategoriaForm({ categoria, onSave, onCancel }: CategoriaFormProps) {
  const [nome, setNome] = useState(categoria?.nome ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ id: categoria?.id, nome });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome da Categoria"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
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
