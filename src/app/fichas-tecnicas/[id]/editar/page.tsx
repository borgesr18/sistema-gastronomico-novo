import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useFichasTecnicas, categoriasReceitas, unidadesRendimento } from '@/lib/fichasTecnicasService';
import { useProdutos } from '@/lib/produtosService';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { useModal } from '@/components/ui/Modal';
import Modal from '@/components/ui/Modal';

export default function EditarFichaTecnicaPage() {
  const params = useParams();
  const router = useRouter();
  const { obterFichaTecnicaPorId, atualizarFichaTecnica } = useFichasTecnicas();
  const { produtos } = useProdutos();
  const [isLoading, setIsLoading] = useState(false);
  
  const fichaId = params.id as string;
  const fichaOriginal = obterFichaTecnicaPorId(fichaId);
  
  // Modal para adicionar ingredientes
  const { isOpen, openModal, closeModal } = useModal();
  
  // Estado para o ingrediente sendo adicionado
  const [ingredienteAtual, setIngredienteAtual] = useState({
    produtoId: '',
    quantidade: '',
  });
  
  // Estado para a ficha técnica
  const [fichaTecnica, setFichaTecnica] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    ingredientes: [],
    modoPreparo: '',
    tempoPreparo: '',
    rendimentoTotal: '',
    unidadeRendimento: '',
    observacoes: '',
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  // Carregar dados da ficha técnica
  useEffect(() => {
    if (fichaOriginal) {
      setFichaTecnica({
        nome: fichaOriginal.nome,
        descricao: fichaOriginal.descricao || '',
        categoria: fichaOriginal.categoria,
        ingredientes: fichaOriginal.ingredientes.map(ing => ({
          produtoId: ing.produtoId,
          quantidade: ing.quantidade,
        })),
        modoPreparo: fichaOriginal.modoPreparo,
        tempoPreparo: fichaOriginal.tempoPreparo.toString(),
        rendimentoTotal: fichaOriginal.rendimentoTotal.toString(),
        unidadeRendimento: fichaOriginal.unidadeRendimento,
        observacoes: fichaOriginal.observacoes || '',
      });
    }
  }, [fichaOriginal]);

  // Redirecionar se a ficha técnica não existir
  if (!fichaOriginal) {
    router.push('/fichas-tecnicas');
    return null;
  }

  // Manipular mudanças nos campos da ficha técnica
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFichaTecnica(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manipular mudanças nos campos do ingrediente atual
  const handleIngredienteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIngredienteAtual(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Adicionar ingrediente à lista
  const adicionarIngrediente = () => {
    // Validar campos do ingrediente
    const errosIngrediente: Record<string, string> = {};
    
    if (!ingredienteAtual.produtoId) {
      errosIngrediente.produtoId = 'Selecione um produto';
    }
    
    if (!ingredienteAtual.quantidade) {
      errosIngrediente.quantidade = 'Quantidade é obrigatória';
    } else if (isNaN(Number(ingredienteAtual.quantidade)) || Number(ingredienteAtual.quantidade) <= 0) {
      errosIngrediente.quantidade = 'Quantidade deve ser um número positivo';
    }
    
    if (Object.keys(errosIngrediente).length > 0) {
      setErros(prev => ({ ...prev, ...errosIngrediente }));
      return;
    }
    
    // Adicionar ingrediente à lista
    const novoIngrediente = {
      produtoId: ingredienteAtual.produtoId,
      quantidade: Number(ingredienteAtual.quantidade),
    };
    
    setFichaTecnica(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, novoIngrediente]
    }));
    
    // Limpar campos do ingrediente atual
    setIngredienteAtual({
      produtoId: '',
      quantidade: '',
    });
    
    // Limpar erros
    setErros(prev => {
      const novosErros = { ...prev };
      delete novosErros.produtoId;
      delete novosErros.quantidade;
      return novosErros;
    });
    
    // Fechar modal
    closeModal();
  };

  // Remover ingrediente da lista
  const removerIngrediente = (index: number) => {
    setFichaTecnica(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  };

  // Validar formulário completo
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    
    if (!fichaTecnica.nome) novosErros.nome = 'Nome é obrigatório';
    if (!fichaTecnica.categoria) novosErros.categoria = 'Categoria é obrigatória';
    if (!fichaTecnica.modoPreparo) novosErros.modoPreparo = 'Modo de preparo é obrigatório';
    
    if (!fichaTecnica.tempoPreparo) {
      novosErros.tempoPreparo = 'Tempo de preparo é obrigatório';
    } else if (isNaN(Number(fichaTecnica.tempoPreparo)) || Number(fichaTecnica.tempoPreparo) <= 0) {
      novosErros.tempoPreparo = 'Tempo de preparo deve ser um número positivo';
    }
    
    if (!fichaTecnica.rendimentoTotal) {
      novosErros.rendimentoTotal = 'Rendimento total é obrigatório';
    } else if (isNaN(Number(fichaTecnica.rendimentoTotal)) || Number(fichaTecnica.rendimentoTotal) <= 0) {
      novosErros.rendimentoTotal = 'Rendimento total deve ser um número positivo';
    }
    
    if (!fichaTecnica.unidadeRendimento) novosErros.unidadeRendimento = 'Unidade de rendimento é obrigatória';
    
    if (fichaTecnica.ingredientes.length === 0) {
      novosErros.ingredientes = 'Adicione pelo menos um ingrediente';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Enviar formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setIsLoading(true);
    
    try {
      // Converter valores numéricos
      const fichaTecnicaFormatada = {
        ...fichaTecnica,
        tempoPreparo: Number(fichaTecnica.tempoPreparo),
        rendimentoTotal: Number(fichaTecnica.rendimentoTotal),
      };
      
      atualizarFichaTecnica(fichaId, fichaTecnicaFormatada);
      router.push(`/fichas-tecnicas/${fichaId}`);
    } catch (error) {
      console.error('Erro ao atualizar ficha técnica:', error);
      alert('Ocorreu um erro ao atualizar a ficha técnica. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Obter nome do produto pelo ID
  const getNomeProduto = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  };

  // Formatar quantidade com unidade de medida
  const formatarQuantidade = (produtoId: string, quantidade: number) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? `${quantidade} ${produto.unidadeMedida}` : `${quantidade}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Editar Ficha Técnica</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="Informações Básicas">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome da Receita *"
                  name="nome"
                  value={fichaTecnica.nome}
                  onChange={handleChange}
                  error={erros.nome}
                  placeholder="Ex: Risoto de Cogumelos"
                />
                
                <Select
                  label="Categoria *"
                  name="categoria"
                  value={fichaTecnica.categoria}
                  onChange={handleChange}
                  options={categoriasReceitas}
                  error={erros.categoria}
                />
              </div>
              
              <Textarea
                label="Descrição"
                name="descricao"
                value={fichaTecnica.descricao}
                onChange={handleChange}
                placeholder="Breve descrição da receita"
                rows={2}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Tempo de Preparo (minutos) *"
                  name="tempoPreparo"
                  type="number"
                  min="1"
                  value={fichaTecnica.tempoPreparo}
                  onChange={handleChange}
                  error={erros.tempoPreparo}
                  placeholder="Ex: 45"
                />
                
                <Input
                  label="Rendimento Total *"
                  name="rendimentoTotal"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={fichaTecnica.rendimentoTotal}
                  onChange={handleChange}
                  error={erros.rendimentoTotal}
                  placeholder="Ex: 4"
                />
                
                <Select
                  label="Unidade de Rendimento *"
                  name="unidadeRendimento"
                  value={fichaTecnica.unidadeRendimento}
                  onChange={handleChange}
                  options={unidadesRendimento}
                  error={erros.unidadeRendimento}
                />
              </div>
            </div>
          </Card>
          
          <Card title="Ingredientes">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openModal}
                >
                  <span className="material-icons mr-1 text-sm">add</span>
                  Adicionar Ingrediente
                </Button>
              </div>
              
              {erros.ingredientes && (
                <p className="text-sm text-red-500 mt-1">{erros.ingredientes}</p>
              )}
              
              <Table
                headers={['Produto', 'Quantidade', 'Ações']}
                emptyMessage="Nenhum ingrediente adicionado. Clique em 'Adicionar Ingrediente'."
              >
                {fichaTecnica.ingredientes.map((ingrediente, index) => (
                  <TableRow key={index}>
                    <TableCell>{getNomeProduto(ingrediente.produtoId)}</TableCell>
                    <TableCell>{formatarQuantidade(ingrediente.produtoId, ingrediente.quantidade)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removerIngrediente(index)}
                      >
                        <span className="material-icons text-sm text-red-500">delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          </Card>
          
          <Card title="Modo de Preparo">
            <Textarea
              label="Instruções de Preparo *"
              name="modoPreparo"
              value={fichaTecnica.modoPreparo}
              onChange={handleChange}
              error={erros.modoPreparo}
              placeholder="Descreva passo a passo como preparar a receita"
              rows={6}
            />
          </Card>
          
          <Card title="Observações">
            <Textarea
              label="Observações ou Dicas do Chef"
              name="observacoes"
              value={fichaTecnica.observacoes}
              onChange={handleChange}
              placeholder="Dicas, variações ou informações adicionais sobre a receita"
              rows={4}
            />
          </Card>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/fichas-tecnicas/${fichaId}`)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Atualizar Ficha Técnica
            </Button>
          </div>
        </div>
      </form>
      
      {/* Modal para adicionar ingrediente */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Adicionar Ingrediente"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={adicionarIngrediente}>
              Adicionar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Produto *"
            name="produtoId"
            value={ingredienteAtual.produtoId}
            onChange={handleIngredienteChange}
            error={erros.produtoId}
            options={produtos.map(p => ({ value: p.id, label: `${p.nome} (${p.unidadeMedida})` }))}
          />
          
          <Input
            label="Quantidade *"
            name="quantidade"
            type="number"
            min="0.1"
            step="0.1"
            value={ingredienteAtual.quantidade}
            onChange={handleIngredienteChange}
            error={erros.quantidade}
            placeholder="Ex: 250"
          />
        </div>
      </Modal>
    </div>
  );
}
