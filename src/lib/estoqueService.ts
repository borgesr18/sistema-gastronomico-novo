'use client';

import { useState, useEffect } from 'react';
import { obterProdutos, salvarProdutos, ProdutoInfo } from './produtosService';
import {
  useFichasTecnicas,
  FichaTecnicaInfo,
  IngredienteFicha
} from './fichasTecnicasService';

export interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  fornecedor: string;
  marca?: string;
  data: string;
}

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const salvarMovimentacoes = (movs: MovimentacaoEstoque[]) => {
  localStorage.setItem('movimentacoesEstoque', JSON.stringify(movs));
};

const obterMovimentacoes = (): MovimentacaoEstoque[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('movimentacoesEstoque');
    return str ? JSON.parse(str) : [];
  } catch (err) {
    console.error('Erro ao ler movimentacoes do localStorage', err);
    return [];
  }
};

export const useEstoque = () => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fichasTecnicas, atualizarFichaTecnica } = useFichasTecnicas();

  useEffect(() => {
    const armaz = obterMovimentacoes();
    setMovimentacoes(armaz);
    setIsLoading(false);
  }, []);

  const registrarCompra = (dados: Omit<MovimentacaoEstoque, 'id' | 'data'>) => {
    const nova = { ...dados, id: gerarId(), data: new Date().toISOString() };
    const novas = [...movimentacoes, nova];
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);

    // Atualizar produto com novo preco/fornecedor/marca
    const produtos = obterProdutos();
    const atualizados = produtos.map((p: ProdutoInfo) =>
      p.id === nova.produtoId
        ? { ...p, preco: nova.preco, fornecedor: nova.fornecedor, marca: nova.marca || p.marca }
        : p
    );
    salvarProdutos(atualizados);

    // Atualizar fichas tecnicas que utilizam este produto
    fichasTecnicas
      .filter((f: FichaTecnicaInfo) =>
        f.ingredientes.some((i: IngredienteFicha) => i.produtoId === nova.produtoId)
      )
      .forEach((f: FichaTecnicaInfo) => {
        const dadosFicha = {
          nome: f.nome,
          descricao: f.descricao,
          categoria: f.categoria,
          ingredientes: f.ingredientes.map(
            (i: IngredienteFicha) => ({ produtoId: i.produtoId, quantidade: i.quantidade })
          ) as Omit<IngredienteFicha, 'custo' | 'id'>[],
          modoPreparo: f.modoPreparo,
          tempoPreparo: f.tempoPreparo,
          rendimentoTotal: f.rendimentoTotal,
          unidadeRendimento: f.unidadeRendimento,
          observacoes: f.observacoes || ''
        } as Omit<
          FichaTecnicaInfo,
          'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'ultimaAtualizacao'
        >;
        atualizarFichaTecnica(f.id, dadosFicha);
      });

    return nova;
  };

  const obterHistoricoPorProduto = (produtoId: string) =>
    movimentacoes.filter((m: MovimentacaoEstoque) => m.produtoId === produtoId);

  const calcularEstoqueAtual = (produtoId: string) =>
    movimentacoes
      .filter((m: MovimentacaoEstoque) => m.produtoId === produtoId)
      .reduce((total: number, m: MovimentacaoEstoque) => total + m.quantidade, 0);

  return { movimentacoes, isLoading, registrarCompra, obterHistoricoPorProduto, calcularEstoqueAtual };
};
