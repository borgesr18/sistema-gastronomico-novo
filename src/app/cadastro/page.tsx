'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const handleCadastro = async () => {
    setMensagem('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const result = await response.json();
      if (response.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setMensagem(result.message || 'Erro ao cadastrar usuário');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setMensagem('Erro interno');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Cadastro de Usuário</h1>
      {mensagem && <p className="mb-2 text-blue-600">{mensagem}</p>}
      <input
        type="text"
        placeholder="Nome"
        className="border w-full p-2 mb-2"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border w-full p-2 mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        className="border w-full p-2 mb-4"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={handleCadastro} className="bg-green-600 text-white w-full p-2">
        Cadastrar
      </button>
    </div>
  );
}
