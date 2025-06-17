#!/bin/bash

echo "🔍 Corrigindo imports de useModal e ModalProvider..."

find ./src -type f -name "*.tsx" | while read -r file; do
  if grep -q 'from "@/components/ui/Modal"' "$file"; then
    echo "✅ Corrigindo: $file"
    sed -i 's|from "@/components/ui/Modal"|from "@/contexts/ModalContext"|g' "$file"
  fi
done

echo "✅ Substituições concluídas!"
