'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { Categoria } from '@prisma/client';
import { useModal } from '@/components/ui/Modal';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Toast from '@/components/ui/Toast';
import CategoriaForm from './CategoriaForm';

export default function CategoriasConfigPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    listarCategorias();
  }, []);

  const listarCategorias = async () => {
    const res = await fetch('/api/categorias');
    const data = await res.json();
    setCategorias(data);
  };

  const handleSalvar = async (categoria: Partial<Categoria>) => {
    const method = categoria.id ? 'PUT' : 'POST';
    const url = categoria.id ? `/api/categor
