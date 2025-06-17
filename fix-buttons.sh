#!/bin/bash

echo "🔍 Iniciando correção de atributos inválidos em <Button>..."

# Corrigir duplicados de variant
find ./src -type f -name "*.tsx" -exec sed -i 's/variant="secondary" size="sm" variant="secondary"/variant="secondary" size="sm"/g' {} +
find ./src -type f -name "*.tsx" -exec sed -i 's/variant="secondary" size="sm" variant="danger"/variant="danger" size="sm"/g' {} +

# Corrigir erros de className em TableRow ou TableCell
find ./src -type f -name "*.tsx" -exec sed -i 's/<TableCell className=/<TableCell /g' {} +
find ./src -type f -name "*.tsx" -exec sed -i 's/<TableRow className=/<TableRow /g' {} +

# Corrigir Buttons com 'size' e 'variant' mal posicionados
find ./src -type f -name "*.tsx" -exec sed -i 's/size="sm" variant="secondary"/variant="secondary" size="sm"/g' {} +
find ./src -type f -name "*.tsx" -exec sed -i 's/size="sm" variant="danger"/variant="danger" size="sm"/g' {} +
find ./src -type f -name "*.tsx" -exec sed -i 's/size="sm" variant="outline"/variant="outline" size="sm"/g' {} +
find ./src -type f -name "*.tsx" -exec sed -i 's/size="sm" variant="success"/variant="success" size="sm"/g' {} +

# Corrigir uso de atributos inexistentes como fullWidth
find ./src -type f -name "*.tsx" -exec sed -i 's/fullWidth/ fullWidth={true}/g' {} +

# Corrigir uso de isLoading
find ./src -type f -name "*.tsx" -exec sed -i 's/isLoading=\(.*\)/isLoading={\1}/g' {} +

echo "✅ Correção concluída! Agora rode novamente: npm run build"
