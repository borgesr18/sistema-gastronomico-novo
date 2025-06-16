'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('viewer');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, role }),
    });

    const resultado = await response.json();

    if (response.ok) {
      setMensagem('Usuário criado com sucesso!');
      router.push('/configuracoes/usuarios'); // Ou qualquer rota que você queira
    } else {
      setMensagem(`Erro: ${resultado.mensagem}`);
    }
  };

  return (
    <div>
      <h1>Criar Novo Usuário</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Criar Usuário</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
