'use client';

import { useEffect, useState } from 'react';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const res = await fetch('/api/me');
    const data = await res.json();
    setUsuario(data.user);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, senha: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    if (res.ok) {
      await fetchUser();
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUsuario(null);
  };

  return { usuario, loading, login, logout };
};
