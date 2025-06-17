#!/bin/bash

echo "🔍 Corrigindo problemas com <Button /> e outros componentes UI..."

FILES=$(find ./src -type f -name "*.tsx")

for FILE in $FILES; do
  FIXED=false

  # Corrigir múltiplos 'variant=' no <Button>
  if grep -q "<Button" "$FILE" && grep -q "variant=" "$FILE"; then
    sed -i -E 's/(<Button[^>]*?)\svariant="[^"]+"\svariant="([^"]+)"/\1 variant="\2"/g' "$FILE"
    FIXED=true
  fi

  # Corrigir atributos inválidos no Button
  sed -i -E '/<Button[^>]*isLoading=/s/\s*isLoading="[^"]*"//' "$FILE" && FIXED=true
  sed -i -E '/<Button[^>]*fullWidth/s/\s*fullWidth//' "$FILE" && FIXED=true
  sed -i -E '/<Button[^>]*className=/s/\s*className="[^"]*"//' "$FILE" && FIXED=true
  sed -i -E '/<Button[^>]*size=/s/\s*size="[^"]*"//' "$FILE" && FIXED=true
  sed -i -E '/<Button[^>]*error=/s/\s*error="[^"]*"//' "$FILE" && FIXED=true

  # Corrigir TableRow e TableCell - Remover className
  sed -i -E '/<TableRow[^>]*className=/s/\s*className="[^"]*"//' "$FILE" && FIXED=true
  sed -i -E '/<TableCell[^>]*className=/s/\s*className="[^"]*"//' "$FILE" && FIXED=true

  # Corrigir Select - Remover error e className se tiver
  sed -i -E '/<Select[^>]*error=/s/\s*error="[^"]*"//' "$FILE" && FIXED=true
  sed -i -E '/<Select[^>]*className=/s/\s*className="[^"]*"//' "$FILE" && FIXED=true

  # Corrigir Input - Remover error e className se tiver
  sed -i -E '/<Input[^>]*error=/s/\s*error="[^"]*"//' "$FILE" && FIXED=true
  sed -i -E '/<Input[^>]*className=/s/\s*className="[^"]*"//' "$FILE" && FIXED=true

  if $FIXED; then
    echo "✅ Corrigido: $FILE"
  fi
done

echo "🚀 Correção concluída! Agora tente rodar: npm run build"
