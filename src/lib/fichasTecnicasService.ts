'use client';

import { useState, useEffect } from 'react';
import { ProdutoInfo, useProdutos } from './produtosService';

// Tipos para fichas técnicas
export interface IngredienteFicha {
  id: string;
  produtoId: string;
  quantidade: number;
  custo: number;
}

export interface InfoNutricionalFicha {
  calorias: number;
  carboidratos: number;
  proteinas: number;
  gordurasTotais: number;
  gordurasSaturadas: number;
  gordurasTrans: number;
  fibras: number;
  sodio: number;
}

export interface FichaTecnicaInfo {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  ingredientes: IngredienteFicha[];
  modoPreparo: string;
  tempoPreparo: number; // em minutos
  rendimentoTotal: number;
  unidadeRendimento: string;
  custoTotal: number;
  custoPorcao: number;
  infoNutricional?: InfoNutricionalFicha;
  infoNutricionalPorcao?: InfoNutricionalFicha;
  observacoes?: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
}

// Função para gerar ID único
const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Função para salvar fichas técnicas no localStorage
const salvarFichasTecnicas = (fichas: FichaTecnicaInfo[]) => {
  localStorage.setItem('fichasTecnicas', JSON.stringify(fichas));
};

// Função para obter fichas técnicas do localStorage
const obterFichasTecnicas = (): FichaTecnicaInfo[] => {
  const fichasString = localStorage.getItem('fichasTecnicas');
  return fichasString ? JSON.parse(fichasString) : [];
};

// Hook para gerenciar fichas técnicas
export const useFichasTecnicas = () => {
  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnicaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { produtos } = useProdutos();

  // Carregar fichas técnicas do localStorage ao inicializar
  useEffect(() => {
    const fichasArmazenadas = obterFichasTecnicas();
    setFichasTecnicas(fichasArmazenadas);
    setIsLoading(false);
  }, []);

  // Calcular custo dos ingredientes
  const calcularCustoIngredientes = (ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[]) => {
    return ingredientes.map(ingrediente => {
      const produto = produtos.find(p => p.id === ingrediente.produtoId);
      if (!produto) {
        return {
          ...ingrediente,
          id: gerarId(),
          custo: 0
        };
      }

      // Calcular custo baseado na quantidade e preço do produto
      const custo = (ingrediente.quantidade * produto.preco);
      
      return {
        ...ingrediente,
        id: gerarId(),
        custo
      };
    });
  };

  // Calcular informações nutricionais
  const calcularInfoNutricional = (ingredientes: IngredienteFicha[], rendimentoTotal: number) => {
    // Inicializar com zeros
    const infoTotal: InfoNutricionalFicha = {
      calorias: 0,
      carboidratos: 0,
      proteinas: 0,
      gordurasTotais: 0,
      gordurasSaturadas: 0,
      gordurasTrans: 0,
      fibras: 0,
      sodio: 0
    };

    // Somar valores nutricionais de cada ingrediente
    ingredientes.forEach(ingrediente => {
      const produto = produtos.find(p => p.id === ingrediente.produtoId);
      if (produto?.infoNutricional) {
        // Calcular proporção baseada na quantidade do ingrediente
        const proporcao = ingrediente.quantidade / 100; // Valores nutricionais são por 100g/ml
        
        infoTotal.calorias += produto.infoNutricional.calorias * proporcao;
        infoTotal.carboidratos += produto.infoNutricional.carboidratos * proporcao;
        infoTotal.proteinas += produto.infoNutricional.proteinas * proporcao;
        infoTotal.gordurasTotais += produto.infoNutricional.gordurasTotais * proporcao;
        infoTotal.gordurasSaturadas += produto.infoNutricional.gordurasSaturadas * proporcao;
        infoTotal.gordurasTrans += produto.infoNutricional.gordurasTrans * proporcao;
        infoTotal.fibras += produto.infoNutricional.fibras * proporcao;
        infoTotal.sodio += produto.infoNutricional.sodio * proporcao;
      }
    });

    // Calcular valores por porção
    const infoPorcao: InfoNutricionalFicha = {
      calorias: infoTotal.calorias / rendimentoTotal,
      carboidratos: infoTotal.carboidratos / rendimentoTotal,
      proteinas: infoTotal.proteinas / rendimentoTotal,
      gordurasTotais: infoTotal.gordurasTotais / rendimentoTotal,
      gordurasSaturadas: infoTotal.gordurasSaturadas / rendimentoTotal,
      gordurasTrans: infoTotal.gordurasTrans / rendimentoTotal,
      fibras: infoTotal.fibras / rendimentoTotal,
      sodio: infoTotal.sodio / rendimentoTotal
    };

    return { infoTotal, infoPorcao };
  };

  // Adicionar nova ficha técnica
  const adicionarFichaTecnica = (ficha: Omit<FichaTecnicaInfo, 'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'ultimaAtualizacao'>) => {
    // Calcular custo dos ingredientes
    const ingredientesComCusto = calcularCustoIngredientes(ficha.ingredientes);
    
    // Calcular custo total
    const custoTotal = ingredientesComCusto.reduce((total, ingrediente) => total + ingrediente.custo, 0);
    
    // Calcular custo por porção
    const custoPorcao = custoTotal / ficha.rendimentoTotal;
    
    // Calcular informações nutricionais
    const { infoTotal, infoPorcao } = calcularInfoNutricional(ingredientesComCusto, ficha.rendimentoTotal);
    
    const dataAtual = new Date().toISOString();
    
    const novaFicha: FichaTecnicaInfo = {
      ...ficha,
      id: gerarId(),
      ingredientes: ingredientesComCusto,
      custoTotal,
      custoPorcao,
      infoNutricional: infoTotal,
      infoNutricionalPorcao: infoPorcao,
      dataCriacao: dataAtual,
      ultimaAtualizacao: dataAtual
    };
    
    const novasFichas = [...fichasTecnicas, novaFicha];
    setFichasTecnicas(novasFichas);
    salvarFichasTecnicas(novasFichas);
    return novaFicha;
  };

  // Atualizar ficha técnica existente
  const atualizarFichaTecnica = (id: string, ficha: Omit<FichaTecnicaInfo, 'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'ultimaAtualizacao'>) => {
    // Calcular custo dos ingredientes
    const ingredientesComCusto = calcularCustoIngredientes(ficha.ingredientes);
    
    // Calcular custo total
    const custoTotal = ingredientesComCusto.reduce((total, ingrediente) => total + ingrediente.custo, 0);
    
    // Calcular custo por porção
    const custoPorcao = custoTotal / ficha.rendimentoTotal;
    
    // Calcular informações nutricionais
    const { infoTotal, infoPorcao } = calcularInfoNutricional(ingredientesComCusto, ficha.rendimentoTotal);
    
    const fichaOriginal = fichasTecnicas.find(f => f.id === id);
    
    const fichaAtualizada: FichaTecnicaInfo = {
      ...ficha,
      id,
      ingredientes: ingredientesComCusto,
      custoTotal,
      custoPorcao,
      infoNutricional: infoTotal,
      infoNutricionalPorcao: infoPorcao,
      dataCriacao: fichaOriginal?.dataCriacao || new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString()
    };
    
    const novasFichas = fichasTecnicas.map(f => 
      f.id === id ? fichaAtualizada : f
    );
    
    setFichasTecnicas(novasFichas);
    salvarFichasTecnicas(novasFichas);
    return fichaAtualizada;
  };

  // Remover ficha técnica
  const removerFichaTecnica = (id: string) => {
    const novasFichas = fichasTecnicas.filter(f => f.id !== id);
    setFichasTecnicas(novasFichas);
    salvarFichasTecnicas(novasFichas);
  };

  // Obter ficha técnica por ID
  const obterFichaTecnicaPorId = (id: string) => {
    return fichasTecnicas.find(f => f.id === id);
  };

  return {
    fichasTecnicas,
    isLoading,
    adicionarFichaTecnica,
    atualizarFichaTecnica,
    removerFichaTecnica,
    obterFichaTecnicaPorId,
  };
};

// Dados iniciais para categorias de receitas
export const categoriasReceitas = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'prato-principal', label: 'Prato Principal' },
  { value: 'acompanhamento', label: 'Acompanhamento' },
  { value: 'sobremesa', label: 'Sobremesa' },
  { value: 'bebida', label: 'Bebida' },
  { value: 'molho', label: 'Molho/Condimento' },
  { value: 'outro', label: 'Outro' },
];

// Dados iniciais para unidades de rendimento
export const unidadesRendimento = [
  { value: 'porcoes', label: 'Porções' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'g', label: 'Gramas (g)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'ml', label: 'Mililitros (ml)' },
];
