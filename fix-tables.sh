#!/bin/bash

echo "🔍 Procurando usos inválidos de 'className' em <Table />..."

find ./src -type f -name "*.tsx" | while read file; do
  if grep -q "<Table[^>]*className=" "$file"; then
    echo "✅ Corrigindo: $file"
    # Remove apenas o atributo className dentro da tag Table
    sed -i "/<Table/ s/\s*className=\"[^\"]*\"//g" "$file"
  fi
done

echo "✅ Todas as ocorrências de 'className' dentro de <Table /> foram removidas."
