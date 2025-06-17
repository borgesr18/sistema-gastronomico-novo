'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextType {
  usuarioAtual: Usuario | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ usuarioAtual: null, logout: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded) {
          setUsuarioAtual({
            id: decoded.id,
            nome: decoded.nome,
            email: decoded.email,
            role: decoded.role,
          });
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }, []);

  const logout = () => {
    Cookies.remove('token');
    setUsuarioAtual(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ usuarioAtual, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

)