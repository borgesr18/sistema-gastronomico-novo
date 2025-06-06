'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { useFichasTecnicas, FichaTecnicaInfo, converterUnidade } from '@/lib/fichasTecnicasService';
import { useProdutos, ProdutoInfo } from '@/lib/produtosService';
import { useEstoque } from '@/lib/estoqueService';
import { useProducao, ProducaoInfo } from '@/lib/producaoService';

export default function ProducaoPage() {
  const { fichasTecnicas } = useFichasTecnicas();
  const { produtos } = useProdutos();
  const { registrarSaida, registrarEntrada } = useEstoque();
  const { producoes, registrarProducao } = useProducao();

  const [form, setForm] = useState({ fichaId: '', quantidade: '', produtoFinalId: '', pesoUnitario: '' });
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const errs: Record<string, string> = {};
    if (!form.fichaId) errs.fichaId = 'Ficha é obrigatória';
    if (!form.quantidade || isNaN(Number(form.quantidade))) errs.quantidade = 'Qtd inválida';
    if (!form.produtoFinalId) errs.produtoFinalId = 'Produto final é obrigatório';
    setErros(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    const ficha = fichasTecnicas.find(f => f.id === form.fichaId);
    if (!ficha) return;
    const fator = Number(form.quantidade) / ficha.rendimentoTotal;
    ficha.ingredientes.forEach(ing => {
      const prod = produtos.find(p => p.id === ing.produtoId);
      if (!prod) return;
      const qtd = converterUnidade(ing.quantidade * fator, ing.unidade, prod.unidadeMedida);
      registrarSaida({ produtoId: prod.id, quantidade: qtd });
    });
    registrarEntrada({
      produtoId: form.produtoFinalId,
      quantidade: Number(form.quantidade),
      preco: ficha.custoTotal * fator,
      fornecedor: 'Producao',
      marca: ficha.nome,
    });
    registrarProducao({
      fichaId: form.fichaId,
      quantidade: Number(form.quantidade),
      produtoFinalId: form.produtoFinalId,
      pesoUnitario: form.pesoUnitario ? Number(form.pesoUnitario) : undefined,
    });
    setForm({ fichaId: '', quantidade: '', produtoFinalId: '', pesoUnitario: '' });
  };

  const formatarData = (d: string) => new Date(d).toLocaleDateString();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Produção</h1>
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            label="Ficha Técnica *"
            name="fichaId"
            value={form.fichaId}
            onChange={handleChange}
            options={fichasTecnicas.map((f: FichaTecnicaInfo) => ({ value: f.id, label: f.nome }))}
            error={erros.fichaId}
          />
          <Input label="Quantidade *" name="quantidade" value={form.quantidade} onChange={handleChange} error={erros.quantidade} />
          <Select
            label="Produto Final *"
            name="produtoFinalId"
            value={form.produtoFinalId}
            onChange={handleChange}
            options={produtos.map((p: ProdutoInfo) => ({ value: p.id, label: p.nome }))}
            error={erros.produtoFinalId}
          />
          <Input label="Peso por unidade" name="pesoUnitario" value={form.pesoUnitario} onChange={handleChange} />
          <div className="md:col-span-5 flex justify-end">
            <Button type="submit" variant="primary">Registrar Produção</Button>
          </div>
        </form>
      </Card>
      <Card title="Histórico de Produções">
        <Table headers={["Data", "Ficha", "Quantidade", "Produto Final"]} emptyMessage="Nenhuma produção registrada">
          {producoes.map((p: ProducaoInfo) => {
            const ficha = fichasTecnicas.find(f => f.id === p.fichaId);
            const prod = produtos.find(pr => pr.id === p.produtoFinalId);
            return (
              <TableRow key={p.id}>
                <TableCell>{formatarData(p.data)}</TableCell>
                <TableCell>{ficha?.nome || 'Ficha removida'}</TableCell>
                <TableCell>{p.quantidade}</TableCell>
                <TableCell>{prod?.nome || 'Produto removido'}</TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
