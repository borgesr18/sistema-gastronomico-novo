'use client';

import { useState, useEffect } from 'react';
import { createHash } from 'crypto';

export interface UsuarioInfo {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: 'admin' | 'viewer';
}

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const hashSenha = (senha: string) => {
  return createHash('sha256').update(senha).digest('hex');
};
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const hashSenha = (senha: string) => createHash('sha256').update(senha).digest('hex');

const salvarUsuarios = (usuarios: UsuarioInfo[]) => {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
};

const obterUsuarios = (): UsuarioInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const usuariosString = localStorage.getItem('usuarios');
    const lista = usuariosString ? JSON.parse(usuariosString) : [];
    return lista.map((u: any) => ({ role: 'viewer', ...u }));
    return usuariosString ? JSON.parse(usuariosString) : [];
  } catch (err) {
    console.error('Erro ao ler usuarios do localStorage', err);
    return [];
  }
};

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioInfo[]>(() => obterUsuarios());
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioInfo | null>(() => {
    if (typeof window === 'undefined') return null;
    const armazenados = obterUsuarios();
    const idLogado = localStorage.getItem('usuarioLogado');
    return idLogado ? armazenados.find(u => u.id === idLogado) || null : null;
  });
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

  const registrarUsuario = (dados: { nome: string; email: string; senha: string; role?: 'admin' | 'viewer' }) => {
      setUsuarioAtual(armazenados.find(u => u.id === idLogado) || null);
    }
  }, []);

  const registrarUsuario = (dados: { nome: string; email: string; senha: string }) => {
    const novo = {
      id: gerarId(),
      nome: dados.nome,
      email: dados.email,
      senhaHash: hashSenha(dados.senha),
      role: dados.role || 'viewer'
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
    if (localStorage.getItem('usuarioLogado') === id) {
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
      setUsuarioAtual(atualizados.find(u => u.id === id) || null);
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
  return { usuarios, usuarioAtual, registrarUsuario, removerUsuario, alterarSenha, login, logout };
};
