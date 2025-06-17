'use client';

import React, { useState, ChangeEvent } from 'react';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Table, TableRow, TableCell } from '@/components/ui/Table';

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState<string>('estoque');
  const [resultado, setResultado] = useState<any[]>([]);

  const handleGerarRelatorio = () => {
    // Aqui você pode colocar sua lógica de geração de relatório
    if (tipoRelatorio === 'estoque') {
      setResultado([
        { nome: 'Farinha', quantidade: 10, unidade: 'kg' },
        { nome: 'Açúcar', quantidade: 5, unidade: 'kg' },
      ]);
    } else if (tipoRelatorio === 'producoes') {
      setResultado([
        { produto: 'Bolo de Chocolate', quantidade: 20, data: '2025-06-15' },
        { produto: 'Bolo de Cenoura', quantidade: 15, data: '2025-06-14' },
      ]);
    } else {
      setResultado([]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>

      <Card>
        <div className="flex space-x-3 items-end">
          <Select
            label="Tipo de Relatório"
            name="tipoRelatorio"
            value={tipoRelatorio}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTipoRelatorio(e.target.value)}
            options={[
              { value: 'estoque', label: 'Estoque Atual' },
              { value: 'producoes', label: 'Produções' },
            ]}
          />

          <Button type="button" variant="primary" onClick={handleGerarRelatorio}>
            Gerar Relatório
          </Button>
        </div>
      </Card>

      {resultado.length > 0 && (
        <Card title="Resultado">
          {tipoRelatorio === 'estoque' && (
            <Table headers={['Nome', 'Quantidade', 'Unidade']} emptyMessage="Nenhum item.">
              {resultado.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{item.unidade}</TableCell>
                </TableRow>
              ))}
            </Table>
          )}

          {tipoRelatorio === 'producoes' && (
            <Table headers={['Produto', 'Quantidade', 'Data']} emptyMessage="Nenhuma produção.">
              {resultado.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.produto}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{item.data}</TableCell>
                </TableRow>
              ))}
            </Table>
          )}
        </Card>
      )}
    </div>
  );
}
