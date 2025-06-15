'use client';

import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import UsuariosConfigPage from './usuarios/page';
import CategoriasConfigPage from './categorias/page';
import CategoriasReceitasConfigPage from './categorias-receitas/page';
import UnidadesConfigPage from './unidades/page';

  const [tab, setTab] = useState('usuarios');

  const tabs = [
    { id: 'usuarios', label: 'Usuários' },
    { id: 'categorias', label: 'Categorias de Produtos' },
    { id: 'categorias-receitas', label: 'Categorias de Receitas' },
    { id: 'unidades', label: 'Unidades de Medida' },
  ];

      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'usuarios' && <UsuariosConfigPage />}
      {tab === 'categorias' && <CategoriasConfigPage />}
      {tab === 'categorias-receitas' && <CategoriasReceitasConfigPage />}
      {tab === 'unidades' && <UnidadesConfigPage />}
    </div>
  );
}
