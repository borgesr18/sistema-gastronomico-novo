'use client';

import { useState, useEffect } from 'react';
import { createHash } from 'crypto';

export type Role = 'admin' | 'editor' | 'viewer' | 'manager';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: Role;
  oculto?: boolean;
}

const adminEmail = 'rba1807@gmail.com';
const adminNome = 'Admin';
const adminSenha = 'Rb180780@';

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
const hashSenha = (senha: string) => createHash('sha256').update(senha).digest('hex');

const getUsuariosStorage = (): Usuario[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('usuarios');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsuarios = (lista: Usuario[]) => {
  localStorage.setItem('usuarios', JSON.stringify(lista));
};

const senhaForte = (senha: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cria admin fixo
  const ensureAdmin = () => {
    const lista = getUsuariosStorage();
    const existe = lista.some(u => u.email === adminEmail);
    if (!existe) {
      const novoAdmin: Usuario = {
        id: 'admin',
        nome: adminNome,
        email: adminEmail,
        senhaHash: hashSenha(adminSenha),
        role: 'admin',
        oculto: true,
      };
      const total = [...lista, novoAdmin];
      saveUsuarios(total);
      setUsuarios(total.filter(u => !u.oculto));
    }
  };

  useEffect(() => {
    const lista = getUsuariosStorage();
    setUsuarios(lista.filter(u => !u.oculto));

    const idLogado = localStorage.getItem('usuarioLogado');
    if (idLogado) {
      const user = lista.find(u => u.id === idLogado) || null;
      setUsuarioAtual(user);
    }

    ensureAdmin();
  }, []);

  const listarUsuarios = async () => {
    setUsuarios(getUsuariosStorage().filter(u => !u.oculto));
  };

  const criarUsuario = async (novo: { nome: string; email: string; senha: string; role?: Role }) => {
    setErro(null);
    const lista = getUsuariosStorage();

    if (lista.some(u => u.email === novo.email)) {
      setErro('Email já cadastrado');
      return null;
    }

    if (!senhaForte(novo.senha)) {
      setErro('Senha fraca: precisa ter maiúscula, minúscula, número e símbolo');
      return null;
    }

    const user: Usuario = {
      id: gerarId(),
      nome: novo.nome,
      email: novo.email,
      senhaHash: hashSenha(novo.senha),
      role: novo.role ?? 'viewer',
    };

    const total = [...lista, user];
    saveUsuarios(total);
    setUsuarios(total.filter(u => !u.oculto));
    return user;
  };

  const editarUsuario = async (id: string, dados: { nome: string; email: string; role: Role }) => {
    const lista = getUsuariosStorage();

    if (lista.some(u => u.email === dados.email && u.id !== id)) {
      setErro('Email já cadastrado');
      return false;
    }

    const novaLista = lista.map(u =>
      u.id === id ? { ...u, nome: dados.nome, email: dados.email, role: dados.role } : u
    );

    saveUsuarios(novaLista);
    setUsuarios(novaLista.filter(u => !u.oculto));
    return true;
  };

  const alterarSenha = async (id: string, novaSenha: string) => {
    if (!senhaForte(novaSenha)) {
      setErro('Senha fraca');
      return;
    }

    const lista = getUsuariosStorage();
    const novaLista = lista.map(u =>
      u.id === id ? { ...u, senhaHash: hashSenha(novaSenha) } : u
    );

    saveUsuarios(novaLista);
    setUsuarios(novaLista.filter(u => !u.oculto));
  };

  const removerUsuario = async (id: string) => {
    const lista = getUsuariosStorage().filter(u => u.id !== id);
    saveUsuarios(lista);
    setUsuarios(lista.filter(u => !u.oculto));

    const idLogado = localStorage.getItem('usuarioLogado');
    if (idLogado === id) logout();
  };

  const login = async (email: string, senha: string) => {
    const lista = getUsuariosStorage();
    const user = lista.find(u => u.email === email && u.senhaHash === hashSenha(senha));

    if (user) {
      setUsuarioAtual(user);
      localStorage.setItem('usuarioLogado', user.id);
      return user;
    } else {
      setErro('Credenciais inválidas');
      return null;
    }
  };

  const logout = () => {
    setUsuarioAtual(null);
    localStorage.removeItem('usuarioLogado');
  };

  return {
    usuarios,
    listarUsuarios,
    criarUsuario,
    removerUsuario,
    alterarSenha,
    editarUsuario,
    login,
    logout,
    usuarioAtual,
    erro,
    loading,
  };
};
