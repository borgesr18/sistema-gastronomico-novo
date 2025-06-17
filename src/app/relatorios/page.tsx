'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useRelatorios } from '@/lib/relatoriosService';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
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
              label="Tipo de Relatório"
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
