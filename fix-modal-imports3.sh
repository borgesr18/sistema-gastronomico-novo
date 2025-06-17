#!/bin/bash

echo "🔍 Iniciando correção de imports de Modal..."

# Varredura de todos os arquivos TypeScript React
find ./src -type f -name "*.tsx" | while read -r file; do

  # Primeiro caso: import Modal default errado
  if grep -q "import Modal from '@/contexts/ModalContext';" "$file"; then
    echo "✔ Corrigindo default import em: $file"
    sed -i.bak "s|import Modal from '@/contexts/ModalContext';|import Modal from '@/components/ui/Modal';|g" "$file"
  fi

  # Segundo caso: import Modal + useModal juntos
  if grep -q "import Modal, { useModal } from '@/contexts/ModalContext';" "$file"; then
    echo "✔ Corrigindo mixed import em: $file"
    sed -i.bak "s|import Modal, { useModal } from '@/contexts/ModalContext';|import Modal from '@/components/ui/Modal';\\
import { useModal } from '@/contexts/ModalContext';|g" "$file"
  fi

done

echo "✅ Correção concluída!"

echo "📝 Atenção: Foram criados arquivos .bak de backup. Se tudo estiver OK, pode removê-los com:"
echo "find ./src -type f -name '*.bak' -delete"
