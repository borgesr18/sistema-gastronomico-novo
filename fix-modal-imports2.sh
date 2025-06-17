#!/bin/bash

echo "🔄 Corrigindo imports de Modal que estão vindo errado de ModalContext..."

find ./src -type f -name "*.tsx" | while read -r file; do
  if grep -q "import Modal, { useModal } from '@/contexts/ModalContext';" "$file"; then
    echo "Corrigindo arquivo: $file"
    sed -i "s|import Modal, { useModal } from '@/contexts/ModalContext';|import Modal from '@/components/ui/Modal';\\
import { useModal } from '@/contexts/ModalContext';|g" "$file"
  fi

  if grep -q "import Modal from '@/contexts/ModalContext';" "$file"; then
    echo "Corrigindo arquivo: $file"
    sed -i "s|import Modal from '@/contexts/ModalContext';|import Modal from '@/components/ui/Modal';|g" "$file"
  fi
done

echo "✅ Todos os imports do Modal corrigidos!"
