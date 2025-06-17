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

  const renderizarRelatorioCompleto = () => {
    const relatorio = gerarRelatorioCompleto();
    return (
      <div>
        <h2>Relatório Completo</h2>
        {/* Exemplo simples */}
        <p>Total de Produtos: {relatorio.totalProdutos}</p>
      </div>
    );
  };

  const renderizarRelatorioCustos = () => {
    const relatorio = gerarRelatorioCustos();
    return (
      <div>
        <h2>Relatório de Custos</h2>
        <p>Custo Total: {formatarPreco(relatorio.custoTotalEstoque)}</p>
      </div>
    );
  };

  const renderizarRelatorioIngredientes = () => {
    const relatorio = gerarRelatorioIngredientes();
    return (
      <div>
        <h2>Relatório de Ingredientes</h2>
        <p>Total Ingredientes: {relatorio.ingredientesMaisUsados.length}</p>
      </div>
    );
  };

  const renderizarRelatorioReceitas = () => {
    const relatorio = gerarRelatorioReceitas();
    return (
      <div>
        <h2>Relatório de Receitas</h2>
        <p>Total Fichas Técnicas: {relatorio.totalFichasTecnicas}</p>
      </div>
    );
  };

  const renderizarRelatorioEstoque = () => {
    const relatorio = gerarRelatorioEstoque();
    return (
      <div>
        <h2>Relatório de Estoque</h2>
        <p>Total em Estoque: {formatarPreco(relatorio.valorTotalEstoque)}</p>
      </div>
    );
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

  const handleExportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório: ' + tipoRelatorio, 10, 10);
    doc.save('relatorio.pdf');
  };

  const handleExportarExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([['Relatório:', tipoRelatorio]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatorio');
    XLSX.writeFile(workbook, 'relatorio.xlsx');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleExportarPDF}>
          Exportar PDF
        </Button>
        <Button variant="outline" onClick={handleExportarExcel}>
          Exportar Excel
        </Button>
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
