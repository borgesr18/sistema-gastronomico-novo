// fix-trailing-parenthesis.js
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'src');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Remove todas as linhas que contém apenas um parêntese isolado ')'
  const fixedLines = lines.filter(line => line.trim() !== ')');

  if (fixedLines.length !== lines.length) {
    fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf-8');
    console.log(`✅ Corrigido: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  });
}

console.log('🚀 Iniciando limpeza de parênteses isolados nos .tsx...');
walkDir(rootDir);
console.log('✅ Limpeza concluída. Agora rode: npm run build');
