import { useProdutos } from './produtosService';
import { useFichasTecnicas } from './fichasTecnicasService';

// Interface para dados de relatórios
export interface DadosRelatorio {
  // Métricas gerais
  totalProdutos: number;
  totalFichasTecnicas: number;
  
  // Métricas de custos
  custoTotalEstoque: number;
  custoMedioPorFicha: number;
  fichasMaisCustos: Array<{id: string, nome: string, custo: number}>;
  fichasMenosCustos: Array<{id: string, nome: string, custo: number}>;
  
  // Métricas de ingredientes
  ingredientesMaisUsados: Array<{id: string, nome: string, quantidade: number, unidade: string, ocorrencias: number}>;
  
  // Métricas de categorias
  distribuicaoCategoriasProdutos: Array<{categoria: string, quantidade: number}>;
  distribuicaoCategoriasReceitas: Array<{categoria: string, quantidade: number}>;
}

// Hook para gerar relatórios
export const useRelatorios = () => {
  const { produtos } = useProdutos();
  const { fichasTecnicas } = useFichasTecnicas();
  
  // Gerar relatório completo
  const gerarRelatorioCompleto = (): DadosRelatorio => {
    // Métricas gerais
    const totalProdutos = produtos.length;
    const totalFichasTecnicas = fichasTecnicas.length;
    
    // Calcular custo total do estoque (considerando que não temos quantidade em estoque, apenas preço unitário)
    const custoTotalEstoque = produtos.reduce((total, produto) => total + produto.preco, 0);
    
    // Calcular custo médio por ficha técnica
    const custoMedioPorFicha = fichasTecnicas.length > 0 
      ? fichasTecnicas.reduce((total, ficha) => total + ficha.custoTotal, 0) / fichasTecnicas.length 
      : 0;
    
    // Fichas técnicas ordenadas por custo (mais caras e mais baratas)
    const fichasOrdenadasPorCusto = [...fichasTecnicas].sort((a, b) => b.custoTotal - a.custoTotal);
    const fichasMaisCustos = fichasOrdenadasPorCusto.slice(0, 5).map(ficha => ({
      id: ficha.id,
      nome: ficha.nome,
      custo: ficha.custoTotal
    }));
    
    const fichasMenosCustos = [...fichasOrdenadasPorCusto].reverse().slice(0, 5).map(ficha => ({
      id: ficha.id,
      nome: ficha.nome,
      custo: ficha.custoTotal
    }));
    
    // Calcular ingredientes mais usados
    const contagemIngredientes: Record<string, {quantidade: number, ocorrencias: number}> = {};
    
    fichasTecnicas.forEach(ficha => {
      ficha.ingredientes.forEach(ingrediente => {
        if (!contagemIngredientes[ingrediente.produtoId]) {
          contagemIngredientes[ingrediente.produtoId] = {
            quantidade: 0,
            ocorrencias: 0
          };
        }
        
        contagemIngredientes[ingrediente.produtoId].quantidade += ingrediente.quantidade;
        contagemIngredientes[ingrediente.produtoId].ocorrencias += 1;
      });
    });
    
    const ingredientesMaisUsados = Object.entries(contagemIngredientes)
      .map(([produtoId, dados]) => {
        const produto = produtos.find(p => p.id === produtoId);
        return {
          id: produtoId,
          nome: produto ? produto.nome : 'Produto não encontrado',
          quantidade: dados.quantidade,
          unidade: produto ? produto.unidadeMedida : '',
          ocorrencias: dados.ocorrencias
        };
      })
      .sort((a, b) => b.ocorrencias - a.ocorrencias)
      .slice(0, 10);
    
    // Distribuição de categorias de produtos
    const categoriasProdutos: Record<string, number> = {};
    produtos.forEach(produto => {
      const categoria = produto.categoria || 'Não informado';
      if (!categoriasProdutos[categoria]) {
        categoriasProdutos[categoria] = 0;
      }
      categoriasProdutos[categoria] += 1;
    });
    
    const distribuicaoCategoriasProdutos = Object.entries(categoriasProdutos)
      .map(([categoria, quantidade]) => ({ categoria, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade);
    
    // Distribuição de categorias de receitas
    const categoriasReceitas: Record<string, number> = {};
    fichasTecnicas.forEach(ficha => {
      const categoria = ficha.categoria;
      if (!categoriasReceitas[categoria]) {
        categoriasReceitas[categoria] = 0;
      }
      categoriasReceitas[categoria] += 1;
    });
    
    const distribuicaoCategoriasReceitas = Object.entries(categoriasReceitas)
      .map(([categoria, quantidade]) => ({ categoria, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade);
    
    return {
      totalProdutos,
      totalFichasTecnicas,
      custoTotalEstoque,
      custoMedioPorFicha,
      fichasMaisCustos,
      fichasMenosCustos,
      ingredientesMaisUsados,
      distribuicaoCategoriasProdutos,
      distribuicaoCategoriasReceitas
    };
  };
  
  // Gerar relatório de custos
  const gerarRelatorioCustos = () => {
    const relatorioCompleto = gerarRelatorioCompleto();
    
    return {
      custoTotalEstoque: relatorioCompleto.custoTotalEstoque,
      custoMedioPorFicha: relatorioCompleto.custoMedioPorFicha,
      fichasMaisCustos: relatorioCompleto.fichasMaisCustos,
      fichasMenosCustos: relatorioCompleto.fichasMenosCustos
    };
  };
  
  // Gerar relatório de ingredientes
  const gerarRelatorioIngredientes = () => {
    const relatorioCompleto = gerarRelatorioCompleto();
    
    return {
      ingredientesMaisUsados: relatorioCompleto.ingredientesMaisUsados,
      distribuicaoCategoriasProdutos: relatorioCompleto.distribuicaoCategoriasProdutos
    };
  };
  
  // Gerar relatório de receitas
  const gerarRelatorioReceitas = () => {
    const relatorioCompleto = gerarRelatorioCompleto();
    
    return {
      totalFichasTecnicas: relatorioCompleto.totalFichasTecnicas,
      distribuicaoCategoriasReceitas: relatorioCompleto.distribuicaoCategoriasReceitas
    };
  };
  
  return {
    gerarRelatorioCompleto,
    gerarRelatorioCustos,
    gerarRelatorioIngredientes,
    gerarRelatorioReceitas
  };
};
