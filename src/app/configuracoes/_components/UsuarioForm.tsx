'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Usuario } from '@prisma/client';

interface UsuarioFormProps {
  usuario: Usuario | null;
  onSave: (usuario: Partial<Usuario>) => void;
  onCancel: () => void;
}

const roles = ['admin', 'editor', 'viewer', 'manager'];

export default function UsuarioForm({ usuario, onSave, onCancel }: UsuarioFormProps) {
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [role, setRole] = useState(usuario?.role ?? 'viewer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dados: Partial<Usuario> = {
      id: usuario?.id,
      nome,
      email,
      role,
    };

    onSave(dados);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <Select label="Função" value={role} onChange={(e) => setRole(e.target.value)}>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>

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
