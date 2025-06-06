'use client';

import { useState, useEffect } from 'react';

// Tipos para produtos
export interface ProdutoInfo {
  id: string;
  nome: string;
  categoria: string;
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
export const salvarProdutos = (produtos: ProdutoInfo[]) => {
  localStorage.setItem('produtos', JSON.stringify(produtos));
};

// Função para obter produtos do localStorage de forma segura
export const obterProdutos = (): ProdutoInfo[] => {
  if (typeof window === 'undefined') return [];

  try {
    const produtosString = localStorage.getItem('produtos');
    const armazenados = produtosString ? JSON.parse(produtosString) : [];
    if (Array.isArray(armazenados)) {
      return armazenados.map((p: any) => ({
        ...p,
        categoria: p.categoria ?? '',
        preco: Number(p.preco) || 0,
        infoNutricional: p.infoNutricional
          ? {
              calorias: Number(p.infoNutricional.calorias) || 0,
              carboidratos: Number(p.infoNutricional.carboidratos) || 0,
              proteinas: Number(p.infoNutricional.proteinas) || 0,
              gordurasTotais: Number(p.infoNutricional.gordurasTotais) || 0,
              gordurasSaturadas: Number(p.infoNutricional.gordurasSaturadas) || 0,
              gordurasTrans: Number(p.infoNutricional.gordurasTrans) || 0,
              fibras: Number(p.infoNutricional.fibras) || 0,
              sodio: Number(p.infoNutricional.sodio) || 0
            }
          : undefined
      }));
    }
  } catch (error) {
    console.error('Erro ao ler produtos do localStorage', error);
  }

  return [];
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
    
    const novosProdutos = produtos.map((p: ProdutoInfo) =>
      p.id === id ? produtoAtualizado : p
    );
    
    setProdutos(novosProdutos);
    salvarProdutos(novosProdutos);
    return produtoAtualizado;
  };

  // Remover produto
  const removerProduto = (id: string) => {
    const novosProdutos = produtos.filter((p: ProdutoInfo) => p.id !== id);
    setProdutos(novosProdutos);
    salvarProdutos(novosProdutos);
  };

  // Obter produto por ID
  const obterProdutoPorId = (id: string) => {
    return produtos.find((p: ProdutoInfo) => p.id === id);
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


// Categorias de produtos para classificacao em relatorios
export const categoriasProdutos = [
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'graos', label: 'Grãos e Cereais' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'temperos', label: 'Temperos' },
  { value: 'outros', label: 'Outros' },
];

// Obter rótulo legível de uma categoria pelo valor armazenado
export const obterLabelCategoria = (valor: string) => {
  if (!valor) return 'Não informado';
  const encontrado = categoriasProdutos.find(c => c.value === valor);
  return encontrado ? encontrado.label : valor;
};
