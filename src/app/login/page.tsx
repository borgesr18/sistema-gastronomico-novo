'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const json = await res.json();
          if (json.sucesso) {
            router.replace('/');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const json = await res.json();

      if (res.ok && json.sucesso) {
        router.push('/');
      } else {
        setErro(json.mensagem || 'Erro ao fazer login');
      }
    } catch (error) {
      setErro('Erro de rede ao tentar login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Verificando login...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <div className="flex justify-center mb-4">
          <Logo className="text-2xl" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Entrar</h1>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" fullWidth>
            Entrar
          </Button>

          <p className="text-sm text-center">
            Não possui conta?{' '}
            <Link href="/usuarios/novo" className="text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
