'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Modal, { useModal } from '@/components/ui/Modal';
import { useFichasTecnicas, FichaTecnicaInfo, converterUnidade } from '@/lib/fichasTecnicasService';
import { useProdutos } from '@/lib/produtosService';
import { useEstoque } from '@/lib/estoqueService';
import { useProducao, ProducaoInfo } from '@/lib/producaoService';

export default function ProducaoPage() {
  const { fichasTecnicas } = useFichasTecnicas();
  const { produtos } = useProdutos();
  const { registrarSaida, registrarEntrada } = useEstoque();
  const { producoes, registrarProducao, atualizarProducao, removerProducao } = useProducao();

  const [form, setForm] = useState({
    fichaId: '',
    quantidade: '',
    unidadeQtd: 'kg',
    pesoUnitario: '',
    unidadePeso: 'g',
    data: new Date().toISOString().split('T')[0],
    validade: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [edit, setEdit] = useState<ProducaoInfo | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const calcularCustoNumero = () => {
    if (!form.fichaId || !form.quantidade) return 0;
    const ficha = fichasTecnicas.find(f => f.id === form.fichaId);
    if (!ficha) return 0;
    const qtdTotalG = converterUnidade(Number(form.quantidade), form.unidadeQtd, 'g');
    const fichaRendG = converterUnidade(ficha.rendimentoTotal, ficha.unidadeRendimento, 'g');
    const fator = qtdTotalG / fichaRendG;
    return ficha.custoTotal * fator;
  };
  const calcularCusto = () => formatarMoeda(calcularCustoNumero());

  const calcularUnidades = () => {
    if (!form.pesoUnitario || !form.quantidade) return 0;
    const qtdTotalG = converterUnidade(Number(form.quantidade), form.unidadeQtd, 'g');
    const pesoUnitG = converterUnidade(Number(form.pesoUnitario), form.unidadePeso, 'g');
    return Math.round(qtdTotalG / pesoUnitG);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const errs: Record<string, string> = {};
    if (!form.fichaId) errs.fichaId = 'Ficha é obrigatória';
    if (!form.quantidade || isNaN(Number(form.quantidade))) errs.quantidade = 'Qtd inválida';
    if (!form.pesoUnitario || isNaN(Number(form.pesoUnitario))) errs.pesoUnitario = 'Peso inválido';
    if (!form.data) errs.data = 'Data obrigatória';
    if (!form.validade) errs.validade = 'Validade obrigatória';
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
    const unidades = Math.round(qtdTotalG / pesoUnitG);
    const precoUnit = (ficha.custoPorKg / 1000) * pesoUnitG;
    const custoTotal = ficha.custoTotal * fator;
    const custoUnitario = custoTotal / unidades;
    registrarEntrada({
      produtoId: form.fichaId,
      quantidade: unidades,
      preco: precoUnit,
      fornecedor: 'Producao',
      marca: ficha.nome,
    });
    registrarProducao({
      fichaId: form.fichaId,
      quantidadeTotal: Number(form.quantidade),
      unidadeQuantidade: form.unidadeQtd,
      pesoUnitario: Number(form.pesoUnitario),
      unidadePeso: form.unidadePeso,
      unidadesGeradas: unidades,
      custoTotal,
      custoUnitario,
      validade: form.validade,
      data: form.data,
    });
    setForm({ fichaId: '', quantidade: '', unidadeQtd: 'kg', pesoUnitario: '', unidadePeso: 'g', data: new Date().toISOString().split('T')[0], validade: '' });
  };

  const iniciarEdicao = (p: ProducaoInfo) => {
    setEdit({ ...p });
    openModal();
  };

  useEffect(() => {
    if (!edit) return;
    const ficha = fichasTecnicas.find(f => f.id === edit.fichaId);
    if (!ficha) return;
    const qtdTotalG = converterUnidade(edit.quantidadeTotal, edit.unidadeQuantidade, 'g');
    const fichaRendG = converterUnidade(ficha.rendimentoTotal, ficha.unidadeRendimento, 'g');
    const fator = qtdTotalG / fichaRendG;
    const pesoUnitG = converterUnidade(edit.pesoUnitario, edit.unidadePeso, 'g');
    const unidades = Math.round(qtdTotalG / pesoUnitG);
    const custoTotal = ficha.custoTotal * fator;
    const custoUnitario = unidades ? custoTotal / unidades : 0;
    setEdit(prev => {
      if (!prev) return prev;
      if (
        prev.unidadesGeradas === unidades &&
        prev.custoTotal === custoTotal &&
        prev.custoUnitario === custoUnitario
      )
        return prev;
      return { ...prev, unidadesGeradas: unidades, custoTotal, custoUnitario };
    });
  }, [edit?.quantidadeTotal, edit?.unidadeQuantidade, edit?.pesoUnitario, edit?.unidadePeso, edit?.fichaId, fichasTecnicas]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    atualizarProducao(edit.id, {
      fichaId: edit.fichaId,
      quantidadeTotal: Number(edit.quantidadeTotal),
      unidadeQuantidade: edit.unidadeQuantidade,
      pesoUnitario: Number(edit.pesoUnitario),
      unidadePeso: edit.unidadePeso,
      unidadesGeradas: Number(edit.unidadesGeradas),
      custoTotal: edit.custoTotal,
      custoUnitario: edit.custoUnitario,
      validade: edit.validade,
      data: edit.data,
    });
    closeModal();
  };

  const formatarData = (d: string) => {
    if (!d) return '';
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Produção</h1>
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
          <Input
            label="Unidades Geradas"
            name="unidadesGeradas"
            readOnly
            value={form.pesoUnitario && form.quantidade ? String(calcularUnidades()) : ''}
          />
          <Input
            label="Custo"
            name="custo"
            readOnly
            value={calcularCusto()}
          />
          <Input
            label="Custo por Unidade"
            name="custoUnitario"
            readOnly
            value={form.pesoUnitario && form.quantidade && form.fichaId ? formatarMoeda(calcularCustoNumero() / calcularUnidades()) : ''}
          />
         <Input
            label="Data *"
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            error={erros.data}
          />
          <Input
            label="Validade *"
            type="date"
            name="validade"
            value={form.validade}
            onChange={handleChange}
            error={erros.validade}
          />
          <div className="md:col-span-5 flex justify-end">
            <Button type="submit" variant="primary">Registrar Produção</Button>
          </div>
        </form>
      </Card>
      <Card title="Histórico de Produções">
        <Table
          headers={["Data", "Validade", "Ficha", "Quantidade", "Peso/Unid.", "Unidades", "Custo", "Custo/Unid.", "Ações"]}
          emptyMessage="Nenhuma produção registrada"
          className="text-sm"
        >
          {producoes.map((p: ProducaoInfo) => {
            const ficha = fichasTecnicas.find(f => f.id === p.fichaId);
            return (
              <TableRow key={p.id}>
                <TableCell compact>{formatarData(p.data)}</TableCell>
                <TableCell compact>{formatarData(p.validade)}</TableCell>
                <TableCell compact>{ficha?.nome || 'Ficha removida'}</TableCell>
                <TableCell compact>{p.quantidadeTotal}{p.unidadeQuantidade}</TableCell>
                <TableCell compact>{p.pesoUnitario}{p.unidadePeso}</TableCell>
                <TableCell compact>{p.unidadesGeradas}</TableCell>
                <TableCell compact>{formatarMoeda(p.custoTotal)}</TableCell>
                <TableCell compact>{formatarMoeda(p.custoUnitario)}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(p)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => removerProducao(p.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
      <Modal isOpen={isOpen} onClose={closeModal} title="Editar Produção" size="xl">
        {edit && (
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select
              label="Ficha Técnica"
              name="fichaId"
              value={edit.fichaId}
              onChange={e => setEdit({ ...edit, fichaId: e.target.value })}
              options={fichasTecnicas.map((f: FichaTecnicaInfo) => ({ value: f.id, label: f.nome })).sort((a, b) => a.label.localeCompare(b.label))}
            />
            <Input label="Quantidade" name="quantidadeTotal" value={String(edit.quantidadeTotal)} onChange={e => setEdit({ ...edit, quantidadeTotal: Number(e.target.value) })} />
            <Select
              label="Unidade"
              name="unidadeQuantidade"
              value={edit.unidadeQuantidade}
              onChange={e => setEdit({ ...edit, unidadeQuantidade: e.target.value })}
              options={[{ value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }]}
            />
            <Input label="Peso por unidade" name="pesoUnitario" value={String(edit.pesoUnitario)} onChange={e => setEdit({ ...edit, pesoUnitario: Number(e.target.value) })} />
            <Select
              label="Unidade"
              name="unidadePeso"
              value={edit.unidadePeso}
              onChange={e => setEdit({ ...edit, unidadePeso: e.target.value })}
              options={[{ value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }]}
            />
            <Input label="Unidades Geradas" name="unidadesGeradas" value={String(edit.unidadesGeradas)} readOnly />
            <Input label="Custo Total" name="custoTotal" value={formatarMoeda(edit.custoTotal)} readOnly />
            <Input label="Custo por Unidade" name="custoUnitario" value={formatarMoeda(edit.custoUnitario)} readOnly />
            <Input label="Data" type="date" name="data" value={edit.data} onChange={e => setEdit({ ...edit, data: e.target.value })} />
            <Input label="Validade" type="date" name="validade" value={edit.validade} onChange={e => setEdit({ ...edit, validade: e.target.value })} />
            <div className="md:col-span-6 flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
              <Button type="submit" variant="primary">Salvar</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
