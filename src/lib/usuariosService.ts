'use client';

import { useState, useEffect } from 'react';
import { createHash } from 'crypto';

export interface UsuarioInfo {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
}

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const hashSenha = (senha: string) => {
  return createHash('sha256').update(senha).digest('hex');
};

const salvarUsuarios = (usuarios: UsuarioInfo[]) => {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
};

const obterUsuarios = (): UsuarioInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const usuariosString = localStorage.getItem('usuarios');
    return usuariosString ? JSON.parse(usuariosString) : [];
  } catch (err) {
    console.error('Erro ao ler usuarios do localStorage', err);
    return [];
  }
};

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioInfo[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioInfo | null>(null);

  useEffect(() => {
    const armazenados = obterUsuarios();
    setUsuarios(armazenados);
    const idLogado = localStorage.getItem('usuarioLogado');
    if (idLogado) {
      const encontrado = armazenados.find(u => u.id === idLogado) || null;
      setUsuarioAtual(encontrado);
    }
  }, []);

  const registrarUsuario = (dados: { nome: string; email: string; senha: string }) => {
    const novo = {
      id: gerarId(),
      nome: dados.nome,
      email: dados.email,
      senhaHash: hashSenha(dados.senha)
    };
    const novos = [...usuarios, novo];
    setUsuarios(novos);
    salvarUsuarios(novos);
    return novo;
  };

  const removerUsuario = (id: string) => {
    const filtrados = usuarios.filter(u => u.id !== id);
    setUsuarios(filtrados);
    salvarUsuarios(filtrados);
    const idLogado = localStorage.getItem('usuarioLogado');
    if (idLogado === id) {
      logout();
    }
  };

  const alterarSenha = (id: string, novaSenha: string) => {
    const atualizados = usuarios.map(u =>
      u.id === id ? { ...u, senhaHash: hashSenha(novaSenha) } : u
    );
    setUsuarios(atualizados);
    salvarUsuarios(atualizados);
    if (usuarioAtual?.id === id) {
      const atualizado = atualizados.find(u => u.id === id) || null;
      setUsuarioAtual(atualizado);
    }
  };

  const login = (email: string, senha: string) => {
    const usuario = usuarios.find(u => u.email === email && u.senhaHash === hashSenha(senha));
    if (usuario) {
      setUsuarioAtual(usuario);
      localStorage.setItem('usuarioLogado', usuario.id);
      return usuario;
    }
    return null;
  };

  const logout = () => {
    setUsuarioAtual(null);
    localStorage.removeItem('usuarioLogado');
  };

  return { usuarios, usuarioAtual, registrarUsuario, login, logout, removerUsuario, alterarSenha };
};
