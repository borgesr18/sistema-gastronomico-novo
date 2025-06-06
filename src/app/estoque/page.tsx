'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal, { useModal } from '@/components/ui/Modal';
import { useEstoque } from '@/lib/estoqueService';
import { useProdutos, ProdutoInfo } from '@/lib/produtosService';
import { useFichasTecnicas } from '@/lib/fichasTecnicasService';

export default function EstoquePage() {
  const {
    movimentacoes,
    isLoading,
    registrarEntrada,
    registrarSaida,
    atualizarMovimentacao,
    removerMovimentacao,
  } = useEstoque();
  const { produtos } = useProdutos();
  const { fichasTecnicas } = useFichasTecnicas();

  const [form, setForm] = useState({
    tipo: 'entrada',
    produtoId: '',
    quantidade: '',
    preco: '',
    fornecedor: '',
    marca: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [edit, setEdit] = useState<any>(null);
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const errs: Record<string, string> = {};
    if (!form.produtoId) errs.produtoId = 'Produto é obrigatório';
    if (!form.quantidade || isNaN(Number(form.quantidade))) errs.quantidade = 'Qtd inválida';
    if (form.tipo === 'entrada') {
      if (!form.preco || isNaN(Number(form.preco.replace(',', '.')))) errs.preco = 'Preço inválido';
      if (!form.fornecedor) errs.fornecedor = 'Fornecedor obrigatório';
    }
    setErros(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    if (form.tipo === 'entrada') {
      registrarEntrada({
        produtoId: form.produtoId,
        quantidade: Number(form.quantidade),
        preco: Number(form.preco.replace(',', '.')),
        fornecedor: form.fornecedor,
        marca: form.marca
      });
    } else {
      registrarSaida({
        produtoId: form.produtoId,
        quantidade: Number(form.quantidade)
      });
    }
    setForm({ tipo: 'entrada', produtoId: '', quantidade: '', preco: '', fornecedor: '', marca: '' });
  };

  const iniciarEdicao = (m: any) => {
    setEdit({
      id: m.id,
      quantidade: String(Math.abs(m.quantidade)),
      preco: m.preco?.toString() || '',
      fornecedor: m.fornecedor || '',
      marca: m.marca || '',
    });
    openEditModal();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    atualizarMovimentacao(edit.id, {
      quantidade: Number(edit.quantidade),
      preco: edit.preco ? Number(edit.preco.replace(',', '.')) : undefined,
      fornecedor: edit.fornecedor,
      marca: edit.marca,
    });
    closeEditModal();
  };

  const formatarData = (d: string) => new Date(d).toLocaleDateString();
  const formatarPreco = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Select
            label="Produto *"
            name="produtoId"
            value={form.produtoId}
            onChange={handleChange}
            options={produtos
              .map((p: ProdutoInfo) => ({ value: p.id, label: p.nome }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            error={erros.produtoId}
          />
          <Select
            label="Tipo *"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={[{ value: 'entrada', label: 'Entrada' }, { value: 'saida', label: 'Saída' }]}
          />
          <Input label="Quantidade *" name="quantidade" value={form.quantidade} onChange={handleChange} error={erros.quantidade} />
          {form.tipo === 'entrada' && (
            <>
              <Input label="Preço Unitário *" name="preco" value={form.preco} onChange={handleChange} error={erros.preco} />
              <Input label="Fornecedor *" name="fornecedor" value={form.fornecedor} onChange={handleChange} error={erros.fornecedor} />
              <Input label="Marca" name="marca" value={form.marca} onChange={handleChange} />
            </>
          )}
          <div className="md:col-span-6 flex justify-end">
            <Button type="submit" variant="primary">Registrar {form.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Button>
          </div>
        </form>
      </Card>

      <Card>
        <Table
          headers={["Data", "Produto", "Qtd", "Preço", "Fornecedor", "Marca", "Tipo", "Ações"]}
          isLoading={isLoading}
          emptyMessage="Nenhuma movimentação registrada"
        >
          {movimentacoes.map(m => {
            const prod = produtos.find(p => p.id === m.produtoId);
            const ficha = fichasTecnicas.find(f => f.id === m.produtoId);
            return (
              <TableRow key={m.id}>
                <TableCell>{formatarData(m.data)}</TableCell>
                <TableCell>{prod?.nome || ficha?.nome || 'Produto removido'}</TableCell>
                <TableCell>{m.quantidade}</TableCell>
                <TableCell>{m.preco ? formatarPreco(m.preco) : '-'}</TableCell>
                <TableCell>{m.fornecedor || '-'}</TableCell>
                <TableCell>{m.marca || '-'}</TableCell>
                <TableCell>{m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</TableCell>
                <TableCell className="flex items-center space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(m)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => removerMovimentacao(m.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
      <Modal isOpen={isEditOpen} onClose={closeEditModal} title="Editar Movimentação">
        {edit && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input label="Quantidade" value={edit.quantidade} onChange={e => setEdit({ ...edit, quantidade: e.target.value })} required />
            {movimentacoes.find(m => m.id === edit.id)?.tipo === 'entrada' && (
              <>
                <Input label="Preço Unitário" value={edit.preco} onChange={e => setEdit({ ...edit, preco: e.target.value })} />
                <Input label="Fornecedor" value={edit.fornecedor} onChange={e => setEdit({ ...edit, fornecedor: e.target.value })} />
                <Input label="Marca" value={edit.marca} onChange={e => setEdit({ ...edit, marca: e.target.value })} />
              </>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={closeEditModal}>Cancelar</Button>
              <Button type="submit" variant="primary">Salvar</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
