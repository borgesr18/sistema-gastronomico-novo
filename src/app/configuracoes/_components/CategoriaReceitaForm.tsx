'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CategoriaReceita } from '@prisma/client';

interface CategoriaReceitaFormProps {
  categoria: CategoriaReceita | null;
  onSave: (categoria: Partial<CategoriaReceita>) => void;
  onCancel: () => void;
}

export default function CategoriaReceitaForm({ categoria, onSave, onCancel }: CategoriaReceitaFormProps) {
  const [nome, setNome] = useState(categoria?.nome ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: categoria?.id,
      nome,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
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

)