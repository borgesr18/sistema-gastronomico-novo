'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Usuario } from '@prisma/client';
import { getUsuarioAtualAPI, logoutAPI } from '@/lib/authService'; // Ajuste o caminho se necessário

// Tipagem do contexto
export type AuthContextType = {
  usuarioAtual: Usuario | null;
  logout: () => void;
};

// Criação do contexto com valor padrão
const AuthContext = createContext<AuthContextType>({
  usuarioAtual: null,
  logout: () => {},
});

// Hook personalizado para consumir o contexto
export const useAuth = () => useContext(AuthContext);

// Componente Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuario = await getUsuarioAtualAPI();
        setUsuarioAtual(usuario);
      } catch (error) {
        console.error('Erro ao carregar o usuário atual:', error);
      }
    };

    carregarUsuario();
  }, []);

  const logout = async () => {
    try {
      await logoutAPI();
      setUsuarioAtual(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuarioAtual, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
