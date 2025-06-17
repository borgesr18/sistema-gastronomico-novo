'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      if (res.ok) {
        setUsuarios(data.usuarios);
      } else {
        setErro(data.mensagem || 'Erro ao carregar usuários');
      }
    } catch (error) {
      setErro('Erro ao conectar com a API');
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const excluirUsuario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      alert('Usuário excluído com sucesso');
      carregarUsuarios();
    } else {
      alert(data.mensagem || 'Erro ao excluir');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Nome</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.nome}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <button
                  onClick={() => excluirUsuario(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && !carregando && (
            <tr>
              <td colSpan={4} className="text-center p-4">Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={() => router.push('/usuarios/novo')}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Novo Usuário
      </button>
    </div>
  );
}

)