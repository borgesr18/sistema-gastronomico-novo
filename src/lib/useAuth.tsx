'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextType {
  usuario: User | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  const verificarUsuarioLogado = async () => {
    try {
      const res = await fetch('/api/me', { cache: 'no-store' });
      const data = await res.json();
      setUsuario(data.user || null);
    } catch (error) {
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    verificarUsuarioLogado();
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (data.sucesso) {
        await verificarUsuarioLogado();
        router.push('/');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUsuario(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth precisa estar dentro de AuthProvider');
  }
  return context;
};
