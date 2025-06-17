const fs = require('fs');
const path = require('path');

const foldersToCheck = ['./src/app', './src/components/ui'];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Corrigir casos de retorno JSX sem parênteses
  content = content.replace(/return\s+\n\s*<([^>])/g, 'return (\n<$1');
  content = content.replace(/<\/[^>]+>\s*;$/gm, ');');

  // Corrigir casos onde o component começa com <div}> por erro de replace anterior
  content = content.replace(/<div>}/g, '<div>');

  // Corrigir props quebradas: ex: {...props}`} ou {...props}}`
  content = content.replace(/\{\.\.\.props\}`}/g, '{...props}');
  content = content.replace(/\{\.\.\.props\}\}`/g, '{...props}');

  // Corrigir syntax de Transition/Fragment para caso de erro de indentação
  content = content.replace(/<Transition\s/g, '\n<Transition ');

  // Salvar o arquivo corrigido
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Corrigido: ${filePath}`);
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  });
}

foldersToCheck.forEach(folder => walk(folder));

console.log('\n✅ Processo de correção de JSX concluído.');
