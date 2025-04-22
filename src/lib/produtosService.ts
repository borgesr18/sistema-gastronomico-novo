'use client';
import { useState, useEffect } from 'react';

// Tipos para produtos
export interface ProdutoInfo {
  id: string;
  nome: string;
  marca?: string;
  unidadeMedida: string;
  preco: number;
  fornecedor: string;
  imagem?: string;
  infoNutricional?: {
    calorias: number;
    carboidratos: number;
    proteinas: number;
    gordurasTotais: number;
    gordurasSaturadas: number;
    gordurasTrans: number;
    fibras: number;
    sodio: number;
  };
}

// Função para gerar ID único
const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Função para salvar produtos no localStorage
const salvarProdutos = (produtos: ProdutoInfo[]) => {
  localStorage.setItem('produtos', JSON.stringify(produtos));
};

// Função para obter produtos do localStorage
const obterProdutos = (): ProdutoInfo[] => {
  const produtosString = localStorage.getItem('produtos');
  return produtosString ? JSON.parse(produtosString) : [];
};

// Hook para gerenciar produtos
export const useProdutos = () => {
  const [produtos, setProdutos] = useState<ProdutoInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar produtos do localStorage ao inicializar
  useEffect(() => {
    const produtosArmazenados = obterProdutos();
    setProdutos(produtosArmazenados);
    setIsLoading(false);
  }, []);

  // Adicionar novo produto
  const adicionarProduto = (produto: Omit<ProdutoInfo, 'id'>) => {
    const novoProduto = {
      ...produto,
      id: gerarId(),
    };
    
    const novosProdutos = [...produtos, novoProduto];
    setProdutos(novosProdutos);
    salvarProdutos(novosProdutos);
    return novoProduto;
  };

  // Atualizar produto existente
  const atualizarProduto = (id: string, produto: Omit<ProdutoInfo, 'id'>) => {
    const produtoAtualizado = {
      ...produto,
      id,
    };
    
    const novosProdutos = produtos.map(p => 
      p.id === id ? produtoAtualizado : p
    );
    
    setProdutos(novosProdutos);
    salvarProdutos(novosProdutos);
    return produtoAtualizado;
  };

  // Remover produto
  const removerProduto = (id: string) => {
    const novosProdutos = produtos.filter(p => p.id !== id);
    setProdutos(novosProdutos);
    salvarProdutos(novosProdutos);
  };

  // Obter produto por ID
  const obterProdutoPorId = (id: string) => {
    return produtos.find(p => p.id === id);
  };

  return {
    produtos,
    isLoading,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    obterProdutoPorId,
  };
};

// Dados iniciais para unidades de medida
export const unidadesMedida = [
  { value: 'g', label: 'Gramas (g)' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'un', label: 'Unidade' },
  { value: 'cx', label: 'Caixa' },
  { value: 'pct', label: 'Pacote' },
];
