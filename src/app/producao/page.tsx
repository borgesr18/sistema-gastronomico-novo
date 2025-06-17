'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import Modal, { useModal } from '@/components/ui/Modal';
import { useFichasTecnicas, FichaTecnicaInfo, converterUnidade } from '@/lib/fichasTecnicasService';
import { useProdutos } from '@/lib/produtosService';
import { useEstoque } from '@/lib/estoqueService';
import { useEstoqueProducao } from '@/lib/estoqueProducaoService';
import { useProducao, ProducaoInfo } from '@/lib/producaoService';

export default function ProducaoPage() {
  const { fichasTecnicas } = useFichasTecnicas();
  const { produtos } = useProdutos();
  const { registrarSaida } = useEstoque();
  const { registrarEntrada: registrarEntradaProducao } = useEstoqueProducao();
  const { producoes, registrarProducao, atualizarProducao, removerProducao } = useProducao();

  const [form, setForm] = useState({
    fichaId: '',
    quantidade: '',
    unidadeQtd: 'kg',
    pesoUnitario: '',
    unidadePeso: 'g',
    data: new Date().toISOString().split('T')[0],
    validade: '',
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [edit, setEdit] = useState<ProducaoInfo | null>(null);
  const [menuRow, setMenuRow] = useState<string | null>(null);
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
    const custoTotal = ficha.custoTotal * fator;
    const custoUnitario = custoTotal / unidades;

    registrarEntradaProducao({
      fichaId: form.fichaId,
      quantidade: unidades,
      validade: form.validade,
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

    setForm({
      fichaId: '',
      quantidade: '',
      unidadeQtd: 'kg',
      pesoUnitario: '',
      unidadePeso: 'g',
      data: new Date().toISOString().split('T')[0],
      validade: '',
    });
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
      if (!prev) return prev; }
      if (
        prev.unidadesGeradas === unidades &&
        prev.custoTotal === custoTotal &&
        prev.custoUnitario === custoUnitario
      ) {
        return prev; }
      }
      return { ...prev, unidadesGeradas: unidades, custoTotal, custoUnitario };
    });
  }, [
    edit?.quantidadeTotal,
    edit?.unidadeQuantidade,
    edit?.pesoUnitario,
    edit?.unidadePeso,
    edit?.fichaId,
    fichasTecnicas,
  ]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    atualizarProducao(edit.id, {
      fichaId: edit.fichaId,
      quantidadeTotal: Number(edit.quantidadeTotal),
      unidadeQuantidade: edit.unidadeQuantidade,
      pesoUnitario: edit.pesoUnitario,
      unidadePeso: edit.unidadePeso,
      unidadesGeradas: edit.unidadesGeradas,
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
      {/* Formulário de Produção */}
      {/* Tabela de Histórico */}
      {/* Modal de Edição */}
      {/* O resto do seu código original... */}
    </div>
  );
}
