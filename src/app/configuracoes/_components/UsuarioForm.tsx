'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Role, Usuario } from '@prisma/client';

interface UsuarioFormProps {
  usuario: Usuario | null;
  onSave: (usuario: Partial<Usuario>) => void;
  onCancel: () => void;
}

const roles: Role[] = ['admin', 'editor', 'viewer', 'manager'];

export default function UsuarioForm({ usuario, onSave, onCancel }: UsuarioFormProps) {
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [role, setRole] = useState<Role>(usuario?.role ?? 'viewer');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const dados: Partial<Usuario> = {
      id: usuario?.id,
      nome,
      email,
      role,
    };

    onSave(dados);
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Select
        label="Função"
        value={role}
        onChange={handleRoleChange}
        options={roles.map((r) => ({
          value: r,
          label: r.charAt(0).toUpperCase() + r.slice(1),
        }))}
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
