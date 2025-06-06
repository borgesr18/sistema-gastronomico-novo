'use client';

import { useState, useEffect } from 'react';

export interface ProducaoInfo {
  id: string;
  fichaId: string;
  quantidade: number;
  produtoFinalId: string;
  pesoUnitario?: number;
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

  const registrarProducao = (dados: Omit<ProducaoInfo, 'id' | 'data'>) => {
    const nova: ProducaoInfo = { ...dados, id: gerarId(), data: new Date().toISOString() };
    const novas = [...producoes, nova];
    setProducoes(novas);
    salvarProducoes(novas);
    return nova;
  };

  return { producoes, registrarProducao };
};
