'use client';

import { useState, useEffect } from 'react';

export interface ProducaoInfo {
  id: string;
  fichaId: string;
  quantidadeTotal: number;
  unidadeQuantidade: string;
  pesoUnitario: number;
  unidadePeso: string;
  unidadesGeradas: number;
  data: string;
}

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const salvarProducoes = (prods: ProducaoInfo[]) => {
  localStorage.setItem('producoes', JSON.stringify(prods));
};

const obterProducoes = (): ProducaoInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('producoes');
    return str ? JSON.parse(str) : [];
  } catch (err) {
    console.error('Erro ao ler produções do localStorage', err);
    return [];
  }
};

export const useProducao = () => {
  const [producoes, setProducoes] = useState<ProducaoInfo[]>([]);

  useEffect(() => {
    setProducoes(obterProducoes());
  }, []);

  const registrarProducao = (dados: Omit<ProducaoInfo, 'id'>) => {
    const nova: ProducaoInfo = { ...dados, id: gerarId() };
    const novas = [...producoes, nova];
    setProducoes(novas);
    salvarProducoes(novas);
    return nova;
  };

  const atualizarProducao = (id: string, dados: Partial<Omit<ProducaoInfo, 'id'>>) => {
    const index = producoes.findIndex(p => p.id === id);
    if (index === -1) return;
    const atualizada = { ...producoes[index], ...dados } as ProducaoInfo;
    const novas = [...producoes];
    novas[index] = atualizada;
    setProducoes(novas);
    salvarProducoes(novas);
  };

  const removerProducao = (id: string) => {
    const novas = producoes.filter(p => p.id !== id);
    setProducoes(novas);
    salvarProducoes(novas);
  };

  return { producoes, registrarProducao, atualizarProducao, removerProducao };
};
