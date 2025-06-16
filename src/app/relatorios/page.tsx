'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useRelatorios } from '@/lib/relatoriosService';
import { Table,  TableRow, TableCell } from '@/components/ui/Table';
import Link from 'next/link';

export default function RelatoriosPage() {
  const { 
    gerarRelatorioCompleto, 
    gerarRelatorioCustos,
    gerarRelatorioIngredientes,
    gerarRelatorioReceitas,
    gerarRelatorioEstoque
  } = useRelatorios();
  
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };
  
  const gerarDadosExportacao = () => {
    switch (tipoRelatorio) {
      case 'estoque': {
        const r = gerarRelatorioEstoque();
        return {
          titulo: 'Relatório de Estoque',
          cabecalho: ['Produto', 'Quantidade', 'Preço', 'Valor Total'],
          linhas: r.itens.map((i) => [i.nome, String(i.quantidade), formatarPreco(i.preco), formatarPreco(i.valorTotal)]),
          rodape: `Total em estoque: ${formatarPreco(r.valorTotalEstoque)}`
        };
      }
      case 'ingredientes': {
        const r = gerarRelatorioIngredientes();
        return {
          titulo: 'Relatório de Ingredientes',
          cabecalho: ['Ingrediente', 'Quantidade', 'Ocorrências'],
          linhas: r.ingredientesMaisUsados.map((i) => [i.nome, `${i.quantidade} ${i.unidade}`, String(i.ocorrencias)]),
          rodape: ''
        };
      }
      case 'custos': {
        const r = gerarRelatorioCustos();
        const linhasMais = r.fichasMaisCustos.map((f) => [f.nome, formatarPreco(f.custo)]);
        const linhasMenos = r.fichasMenosCustos.map((f) => [f.nome, formatarPreco(f.custo)]);
        return {
          titulo: 'Relatório de Custos',
          cabecalho: ['Nome', 'Custo'],
          linhas: [...linhasMais, ...linhasMenos],
          rodape: `Custo total estimado: ${formatarPreco(r.custoTotalEstoque)}`
        };
      }
      case 'receitas': {
        const r = gerarRelatorioReceitas();
        return {
          titulo: 'Relatório de Receitas',
          cabecalho: ['Categoria', 'Quantidade'],
          linhas: r.distribuicaoCategoriasReceitas.map((c) => [c.categoria, String(c.quantidade)]),
          rodape: `Total de fichas técnicas: ${r.totalFichasTecnicas}`
        };
      }
      default: {
        const r = gerarRelatorioCompleto();
        const linhas = r.fichasMaisCustos.map((f) => [f.nome, formatarPreco(f.custo)]);
        return {
          titulo: 'Relatório Completo',
          cabecalho: ['Nome', 'Custo'],
          linhas,
          rodape: `Total de produtos: ${r.totalProdutos}`
        };
      }
    }
  };

  const handleExportarPDF = async () => {
    const dados = gerarDadosExportacao();
    const doc = new jsPDF();
    doc.text(dados.titulo, 10, 10);
    // @ts-ignore - autoTable typed separately
    autoTable(doc, { head: [dados.cabecalho], body: dados.linhas, startY: 20 });
    if (dados.rodape) {
      const finalY = (doc as any).lastAutoTable.finalY || 20;
      doc.text(dados.rodape, 10, finalY + 10);
    }
    doc.save('relatorio.pdf');
  };

  const handleExportarExcel = () => {
    const dados = gerarDadosExportacao();
    const worksheet = XLSX.utils.aoa_to_sheet([dados.cabecalho, ...dados.linhas]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatorio');
    XLSX.writeFile(workbook, 'relatorio.xlsx');
  };
  
  const renderizarRelatorio = () => {
    switch (tipoRelatorio) {
      case 'completo':
        return renderizarRelatorioCompleto();
      case 'custos':
        return renderizarRelatorioCustos();
      case 'ingredientes':
        return renderizarRelatorioIngredientes();
      case 'receitas':
        return renderizarRelatorioReceitas();
      case 'estoque':
        return renderizarRelatorioEstoque();
      default:
        return renderizarRelatorioCompleto();
    }
  };
  
  const renderizarRelatorioCompleto = () => {
    const relatorio = gerarRelatorioCompleto();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Total de Produtos</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{relatorio.totalProdutos}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Total de Fichas Técnicas</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{relatorio.totalFichasTecnicas}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Custo Total Estimado</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatarPreco(relatorio.custoTotalEstoque)}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Custo Médio por Ficha</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatarPreco(relatorio.custoMedioPorFicha)}</p>
            </div>
          </Card>
        </div>
        
        <Card title="Fichas Técnicas por Custo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Mais Caras</h3>
              {relatorio.fichasMaisCustos.length > 0 ? (
                <Table headers={['Nome', 'Custo']}>
                  {relatorio.fichasMaisCustos.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell>
                        <Link href={`/fichas-tecnicas/${ficha.id}`} className="text-blue-600 hover:underline">
                          {ficha.nome}
                        </Link>
                      </TableCell>
                      <TableCell>{formatarPreco(ficha.custo)}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Mais Econômicas</h3>
              {relatorio.fichasMenosCustos.length > 0 ? (
                <Table headers={['Nome', 'Custo']}>
                  {relatorio.fichasMenosCustos.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell>
                        <Link href={`/fichas-tecnicas/${ficha.id}`} className="text-blue-600 hover:underline">
                          {ficha.nome}
                        </Link>
                      </TableCell>
                      <TableCell>{formatarPreco(ficha.custo)}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card title="Ingredientes Mais Utilizados">
          {relatorio.ingredientesMaisUsados.length > 0 ? (
            <Table headers={['Ingrediente', 'Quantidade Total', 'Presente em']}>
              {relatorio.ingredientesMaisUsados.map((ingrediente) => (
                <TableRow key={ingrediente.id}>
                  <TableCell>{ingrediente.nome}</TableCell>
                  <TableCell>{ingrediente.quantidade} {ingrediente.unidade}</TableCell>
                  <TableCell>{ingrediente.ocorrencias} {ingrediente.ocorrencias === 1 ? 'receita' : 'receitas'}</TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum ingrediente utilizado</p>
          )}
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Distribuição de Categorias de Produtos">
            {relatorio.distribuicaoCategoriasProdutos.length > 0 ? (
              <Table headers={['Categoria', 'Quantidade', 'Percentual']}>
                {relatorio.distribuicaoCategoriasProdutos.map((categoria) => (
                  <TableRow key={categoria.categoria}>
                    <TableCell>{categoria.categoria}</TableCell>
                    <TableCell>{categoria.quantidade}</TableCell>
                    <TableCell>
                      {((categoria.quantidade / relatorio.totalProdutos) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
            )}
          </Card>
          
          <Card title="Distribuição de Categorias de Receitas">
            {relatorio.distribuicaoCategoriasReceitas.length > 0 ? (
              <Table headers={['Categoria', 'Quantidade', 'Percentual']}>
                {relatorio.distribuicaoCategoriasReceitas.map((categoria) => (
                  <TableRow key={categoria.categoria}>
                    <TableCell>{categoria.categoria}</TableCell>
                    <TableCell>{categoria.quantidade}</TableCell>
                    <TableCell>
                      {((categoria.quantidade / relatorio.totalFichasTecnicas) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
            )}
          </Card>
        </div>
      </div>
    );
  };
  
  const renderizarRelatorioCustos = () => {
    const relatorio = gerarRelatorioCustos();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Custo Total Estimado</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatarPreco(relatorio.custoTotalEstoque)}</p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-500">Custo Médio por Ficha</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatarPreco(relatorio.custoMedioPorFicha)}</p>
            </div>
          </Card>
        </div>
        
        <Card title="Fichas Técnicas por Custo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Mais Caras</h3>
              {relatorio.fichasMaisCustos.length > 0 ? (
                <Table headers={['Nome', 'Custo']}>
                  {relatorio.fichasMaisCustos.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell>
                        <Link href={`/fichas-tecnicas/${ficha.id}`} className="text-blue-600 hover:underline">
                          {ficha.nome}
                        </Link>
                      </TableCell>
                      <TableCell>{formatarPreco(ficha.custo)}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Mais Econômicas</h3>
              {relatorio.fichasMenosCustos.length > 0 ? (
                <Table headers={['Nome', 'Custo']}>
                  {relatorio.fichasMenosCustos.map((ficha) => (
                    <TableRow key={ficha.id}>
                      <TableCell>
                        <Link href={`/fichas-tecnicas/${ficha.id}`} className="text-blue-600 hover:underline">
                          {ficha.nome}
                        </Link>
                      </TableCell>
                      <TableCell>{formatarPreco(ficha.custo)}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  const renderizarRelatorioIngredientes = () => {
    const relatorio = gerarRelatorioIngredientes();
    
    return (
      <div className="space-y-6">
        <Card title="Ingredientes Mais Utilizados">
          {relatorio.ingredientesMaisUsados.length > 0 ? (
            <Table headers={['Ingrediente', 'Quantidade Total', 'Presente em']}>
              {relatorio.ingredientesMaisUsados.map((ingrediente) => (
                <TableRow key={ingrediente.id}>
                  <TableCell>{ingrediente.nome}</TableCell>
                  <TableCell>{ingrediente.quantidade} {ingrediente.unidade}</TableCell>
                  <TableCell>{ingrediente.ocorrencias} {ingrediente.ocorrencias === 1 ? 'receita' : 'receitas'}</TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum ingrediente utilizado</p>
          )}
        </Card>
        
        <Card title="Distribuição de Categorias de Produtos">
          {relatorio.distribuicaoCategoriasProdutos.length > 0 ? (
            <Table headers={['Categoria', 'Quantidade', 'Percentual']}>
              {relatorio.distribuicaoCategoriasProdutos.map((categoria) => {
                const totalProdutos = relatorio.distribuicaoCategoriasProdutos.reduce(
                  (total, cat) => total + cat.quantidade, 0
                );
                return (
                  <TableRow key={categoria.categoria}>
                    <TableCell>{categoria.categoria}</TableCell>
                    <TableCell>{categoria.quantidade}</TableCell>
                    <TableCell>
                      {((categoria.quantidade / totalProdutos) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
          )}
        </Card>
      </div>
    );
  };

  const renderizarRelatorioEstoque = () => {
    const relatorio = gerarRelatorioEstoque();
    return (
      <div className="space-y-6">
        <Card title="Estoque Atual">
          {relatorio.itens.length > 0 ? (
            <Table headers={['Produto', 'Quantidade', 'Preço', 'Valor Total']}>
              {relatorio.itens.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{formatarPreco(item.preco)}</TableCell>
                  <TableCell>{formatarPreco(item.valorTotal)}</TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
          )}
          <p className="text-right font-medium mt-4">Total em estoque: {formatarPreco(relatorio.valorTotalEstoque)}</p>
        </Card>
      </div>
    );
  };
  
  const renderizarRelatorioReceitas = () => {
    const relatorio = gerarRelatorioReceitas();
    
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500">Total de Fichas Técnicas</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{relatorio.totalFichasTecnicas}</p>
          </div>
        </Card>
        
        <Card title="Distribuição de Categorias de Receitas">
          {relatorio.distribuicaoCategoriasReceitas.length > 0 ? (
            <Table headers={['Categoria', 'Quantidade', 'Percentual']}>
              {relatorio.distribuicaoCategoriasReceitas.map((categoria) => (
                <TableRow key={categoria.categoria}>
                  <TableCell>{categoria.categoria}</TableCell>
                  <TableCell>{categoria.quantidade}</TableCell>
                  <TableCell>
                    {((categoria.quantidade / relatorio.totalFichasTecnicas) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
          )}
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleExportarPDF}>
            <span className="material-icons mr-1 text-sm">picture_as_pdf</span>
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={handleExportarExcel}>
            <span className="material-icons mr-1 text-sm">table_chart</span>
            Exportar Excel
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="flex items-center space-x-4">
          <label className="font-medium text-gray-700">Tipo de Relatório:</label>
          <div className="w-64">
            <Select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              options={[
                { value: 'completo', label: 'Relatório Completo' },
                { value: 'custos', label: 'Relatório de Custos' },
                { value: 'ingredientes', label: 'Relatório de Ingredientes' },
                { value: 'receitas', label: 'Relatório de Receitas' },
                { value: 'estoque', label: 'Relatório de Estoque' },
              ]}
            />
          </div>
        </div>
      </Card>
      
      {renderizarRelatorio()}
    </div>
  );
}
