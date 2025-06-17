const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirs = ['./src/app', './src/components', './src/contexts', './src/lib'];
const ignored = ['node_modules', '.next', 'dist', 'build'];

function fixFileContent(content) {
  let newContent = content;

  // Corrige crase no meio de tags JSX
  newContent = newContent.replace(/<div`}>?/g, '<div>');
  newContent = newContent.replace(/<div>}+/g, '<div>');
  newContent = newContent.replace(/<div>}+/g, '<div>');
  newContent = newContent.replace(/<table`}>?/g, '<table>');
  newContent = newContent.replace(/<table>}+/g, '<table>');

  // Corrige spreads quebrados
  newContent = newContent.replace(/\{\.\.\.props\}`}/g, '{...props}');
  newContent = newContent.replace(/\{\.\.\.props\}\}`/g, '{...props}');
  newContent = newContent.replace(/\{\.{3}props\}\}`/g, '{...props}');

  // Corrige imports do prisma
  newContent = newContent.replace(
    /import prisma from '@\/lib\/prisma';/g,
    "import { prisma } from '@/lib/prisma';"
  );

  // Corrige falta de import de headlessui/react
  if (newContent.includes('<Transition') && !newContent.includes('@headlessui/react')) {
    newContent = `import { Transition, Dialog } from '@headlessui/react';\n` + newContent;
  }

  // Corrige inputs e textareas com template literals errados
  newContent = newContent.replace(/<input\s+([^>]*)`}/g, '<input $1 />');
  newContent = newContent.replace(/<textarea\s+([^>]*)`}/g, '<textarea $1 />');

  // Corrige <div`} ou <div`}> ou <div`}>
  newContent = newContent.replace(/<div`[}>]?/g, '<div>');

  return newContent;
}

function formatFile(filePath) {
  try {
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'ignore' });
    console.log(`✨ Formatado com Prettier: ${filePath}`);
  } catch {
    console.warn(`⚠️ Falha ao rodar Prettier em: ${filePath}`);
  }
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixed = fixFileContent(content);

  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✅ Corrigido: ${filePath}`);
    formatFile(filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (ignored.some(exclude => fullPath.includes(exclude))) return;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

console.log('🚀 Corrigindo erros de JSX e imports no projeto...');

dirs.forEach(folder => walk(folder));

console.log('\n✅ Fim das correções. Rode: npm run build');
