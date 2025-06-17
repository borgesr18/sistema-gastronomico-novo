// fix-imports-and-jsx.js
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'src');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Corrigir imports de prisma
  content = content.replace(/import\s+prisma\s+from\s+['"]@\/lib\/prisma['"];/g, "import { prisma } from '@/lib/prisma';");

  // Corrigir imports de useAuth (se vieram antigos)
  content = content.replace(/import\s+{\s*useAuth\s*}\s+from\s+['"]@\/lib\/useAuth['"];/g, "import { useAuth } from '@/contexts/AuthContext';");

  // Corrigir JSX mal formado (exemplos básicos: <div}> ou <div`}>)
  content = content.replace(/<div`}>/g, '<div>');
  content = content.replace(/<table`}/g, '<table>');

  // Remover crases extras ou } desnecessários após tags JSX
  content = content.replace(/<(\w+)[^>]*`}>/g, '<$1>');

  // Corrigir caso alguém tenha deixado spread props com crase errada
  content = content.replace(/\{\.\.\.props\}`/g, '{...props}');

  // Salva apenas se tiver alterações
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Corrigido: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(fullPath);
    }
  });
}

console.log('🚀 Corrigindo imports quebrados e erros comuns de JSX...');
walkDir(rootDir);
console.log('✅ Fim das correções. Agora rode: npm run build');
