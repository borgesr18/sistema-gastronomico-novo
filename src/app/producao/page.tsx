'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { useFichasTecnicas, FichaTecnicaInfo, converterUnidade } from '@/lib/fichasTecnicasService';
import { useProdutos } from '@/lib/produtosService';
import { useEstoque } from '@/lib/estoqueService';
import { useProducao, ProducaoInfo } from '@/lib/producaoService';

export default function ProducaoPage() {
  const { fichasTecnicas } = useFichasTecnicas();
  const { produtos } = useProdutos();
  const { registrarSaida, registrarEntrada } = useEstoque();
  const { producoes, registrarProducao } = useProducao();

  const [form, setForm] = useState({
    fichaId: '',
    quantidade: '',
    unidadeQtd: 'kg',
    pesoUnitario: '',
    unidadePeso: 'g'
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const errs: Record<string, string> = {};
    if (!form.fichaId) errs.fichaId = 'Ficha é obrigatória';
    if (!form.quantidade || isNaN(Number(form.quantidade))) errs.quantidade = 'Qtd inválida';
    if (!form.pesoUnitario || isNaN(Number(form.pesoUnitario))) errs.pesoUnitario = 'Peso inválido';
    setErros(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    const ficha = fichasTecnicas.find(f => f.id === form.fichaId);
    if (!ficha) return;
    const qtdTotalG = converterUnidade(Number(form.quantidade), form.unidadeQtd, 'g');
    const fichaRendG = converterUnidade(ficha.rendimentoTotal, ficha.unidadeRendimento, 'g');
    const fator = qtdTotalG / fichaRendG;
    ficha.ingredientes.forEach(ing => {
      const prod = produtos.find(p => p.id === ing.produtoId);
      if (!prod) return;
      const qtd = converterUnidade(ing.quantidade * fator, ing.unidade, prod.unidadeMedida);
      registrarSaida({ produtoId: prod.id, quantidade: qtd });
    });
    const pesoUnitG = converterUnidade(Number(form.pesoUnitario), form.unidadePeso, 'g');
    const unidades = qtdTotalG / pesoUnitG;
    const precoUnit = (ficha.custoPorKg / 1000) * pesoUnitG;
    registrarEntrada({
      produtoId: form.fichaId,
      quantidade: unidades,
      preco: precoUnit,
      fornecedor: 'Producao',
      marca: ficha.nome,
    });
    registrarProducao({
      fichaId: form.fichaId,
      quantidadeTotal: qtdTotalG,
      unidadeQuantidade: form.unidadeQtd,
      pesoUnitario: pesoUnitG,
      unidadePeso: form.unidadePeso,
      unidadesGeradas: unidades,
    });
    setForm({ fichaId: '', quantidade: '', unidadeQtd: 'kg', pesoUnitario: '', unidadePeso: 'g' });
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
            options={fichasTecnicas
              .map((f: FichaTecnicaInfo) => ({ value: f.id, label: f.nome }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            error={erros.fichaId}
          />
          <div className="flex space-x-2">
            <Input
              label="Quantidade *"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              error={erros.quantidade}
            />
            <Select
              label="Unidade"
              name="unidadeQtd"
              value={form.unidadeQtd}
              onChange={handleChange}
              options={[{ value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }]}
            />
          </div>
          <div className="flex space-x-2">
            <Input
              label="Peso por unidade *"
              name="pesoUnitario"
              value={form.pesoUnitario}
              onChange={handleChange}
              error={erros.pesoUnitario}
            />
            <Select
              label="Unidade"
              name="unidadePeso"
              value={form.unidadePeso}
              onChange={handleChange}
              options={[{ value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }]}
            />
          </div>
          <Input
            label="Unidades Geradas"
            name="unidadesGeradas"
            readOnly
            value={form.pesoUnitario && form.quantidade ? (converterUnidade(Number(form.quantidade), form.unidadeQtd, 'g') / converterUnidade(Number(form.pesoUnitario), form.unidadePeso, 'g')).toFixed(2) : ''}
          />
          <div className="md:col-span-5 flex justify-end">
            <Button type="submit" variant="primary">Registrar Produção</Button>
          </div>
        </form>
      </Card>
      <Card title="Histórico de Produções">
        <Table headers={["Data", "Ficha", "Quantidade", "Unidades"]} emptyMessage="Nenhuma produção registrada">
          {producoes.map((p: ProducaoInfo) => {
            const ficha = fichasTecnicas.find(f => f.id === p.fichaId);
            return (
              <TableRow key={p.id}>
                <TableCell>{formatarData(p.data)}</TableCell>
                <TableCell>{ficha?.nome || 'Ficha removida'}</TableCell>
                <TableCell>{p.quantidadeTotal}{p.unidadeQuantidade}</TableCell>
                <TableCell>{p.unidadesGeradas.toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
