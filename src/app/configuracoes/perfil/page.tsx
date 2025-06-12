'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { useUsuarios } from '@/lib/usuariosService';

export default function PerfilPage() {
  const { usuarioAtual, alterarSenha } = useUsuarios();
  const [senhaForm, setSenhaForm] = useState({ senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!usuarioAtual) return <p className="p-4">Nenhum usuário logado.</p>;

  const handleSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaForm.senha !== senhaForm.confirmar) {
      setErro('Senhas não conferem');
      return;
    }
    alterarSenha(usuarioAtual.id, senhaForm.senha);
    setSenhaForm({ senha: '', confirmar: '' });
    setErro('');
    setToast('Senha alterada');
  };

  return (
    <div className="space-y-4">
      <Toast message={toast} onClose={() => setToast('')} />
      <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>
      <div className="space-y-2">
        <p><strong>Nome:</strong> {usuarioAtual.nome}</p>
        <p><strong>Email:</strong> {usuarioAtual.email}</p>
        <p><strong>Perfil:</strong> {usuarioAtual.role === 'admin' ? 'Administrador' : 'Visualizador'}</p>
      </div>
      <form onSubmit={handleSenha} className="space-y-2 max-w-sm">
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <Input label="Nova Senha" type="password" value={senhaForm.senha} onChange={e => setSenhaForm({ ...senhaForm, senha: e.target.value })} required />
        <Input label="Confirmar Senha" type="password" value={senhaForm.confirmar} onChange={e => setSenhaForm({ ...senhaForm, confirmar: e.target.value })} required />
        <Button type="submit" variant="primary">Alterar Senha</Button>
      </form>
    </div>
  );
}
