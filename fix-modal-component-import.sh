#!/bin/bash

echo "🔄 Corrigindo imports errados do Modal..."

find ./src -type f -name "*.tsx" | while read -r file; do
  if grep -q "import Modal from '@/contexts/ModalContext'" "$file"; then
    echo "Corrigindo Modal em: $file"
    sed -i "s|import Modal from '@/contexts/ModalContext'|import Modal from '@/components/ui/Modal'|g" "$file"
  fi
done

echo "✅ Imports do Modal corrigidos para '@/components/ui/Modal'"
