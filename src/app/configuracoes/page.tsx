"use client";
import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import Usuarios from "./usuarios/page";
import Categorias from "./categorias/page";
import CategoriasReceitas from "./categorias-receitas/page";
import Unidades from "./unidades/page";

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState("usuarios");
  const tabs = [
    { id: "usuarios", label: "Usuários" },
    { id: "categorias", label: "Categorias de Produtos" },
    { id: "categorias-receitas", label: "Categorias de Receitas" },
    { id: "unidades", label: "Unidades de Medida" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === "usuarios" && <Usuarios />}
      {tab === "categorias" && <Categorias />}
      {tab === "categorias-receitas" && <CategoriasReceitas />}
      {tab === "unidades" && <Unidades />}
    </div>
  );
}
