import Cookies from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setErro('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const erro = await response.json();
        setErro(erro.message || 'Erro ao fazer login');
        return;
      }

      const data = await response.json();
      Cookies.set('token', data.token, { expires: 1 });
      router.push('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Erro interno');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {erro && <p className="text-red-600 mb-2">{erro}</p>}
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
      <button onClick={handleLogin} className="bg-blue-600 text-white w-full p-2">
        Entrar
      </button>
    </div>
  );
}
