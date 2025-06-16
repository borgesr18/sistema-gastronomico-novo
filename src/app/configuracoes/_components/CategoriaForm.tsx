'use client';

import React, { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Categoria } from '@prisma/client';

interface CategoriaFormProps {
  categoria: Categoria | null;
  onSave: (categoria: Partial<Categoria>) => void;
  onCancel: () => void;
}

export default function CategoriaForm({ categoria, onSave, onCancel }: CategoriaFormProps) {
  const [nome, setNome] = useState(categoria?.nome ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const dados: Partial<Categoria> = {
      id: categoria?.id,
      nome,
    };

    onSave(dados);
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
