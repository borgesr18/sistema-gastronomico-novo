#!/bin/bash

echo "🔄 Corrigindo todos os imports de useModal e ModalProvider..."

find ./src -type f -name "*.tsx" | while read -r file; do
  if grep -q "from '@/components/ui/Modal'" "$file"; then
    echo "Corrigindo em: $file"
    sed -i "s|from '@/components/ui/Modal'|from '@/contexts/ModalContext'|g" "$file"
  fi
done

echo "✅ Importações corrigidas para '@/contexts/ModalContext'"
