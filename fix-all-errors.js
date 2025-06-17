const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const foldersToCheck = ['./src/app', './src/components/ui', './src/contexts', './src/lib', './src/pages'];

const ignoredDirs = ['node_modules', '.next', 'dist', 'build'];

function fixJSX(content) {
  let newContent = content;

  // Corrige returns soltos
  newContent = newContent.replace(/return\s*\n\s*</g, 'return (\n<');

  // Corrige fechamento de tags errados
  newContent = newContent.replace(/<div`>/g, '<div>');
  newContent = newContent.replace(/<div`}>/g, '<div>');
  newContent = newContent.replace(/<div>}+/g, '<div>');

  newContent = newContent.replace(/<table`>/g, '<table>');
  newContent = newContent.replace(/<div>}/g, '<div>');

  // Corrige ...props com erro
  newContent = newContent.replace(/\{\.\.\.props\}`}/g, '{...props}');
  newContent = newContent.replace(/\{\.\.\.props\}\}`/g, '{...props}');
  newContent = newContent.replace(/\{\.{3}props\}\}`/g, '{...props}');

  // Corrige Transition e Fragment soltos
  newContent = newContent.replace(/<Transition\s/g, '\n<Transition ');
  newContent = newContent.replace(/<Fragment\s/g, '\n<Fragment ');

  // Corrige fechamento de elementos incompletos
  newContent = newContent.replace(/>\s*`;/g, '>');

  // Corrige elementos mal iniciados
  newContent = newContent.replace(/<div>\s*`/g, '<div>');

  return newContent;
}

function fixImports(content) {
  let newContent = content;

  // Corrigir prisma
  if (newContent.includes("import prisma from '@/lib/prisma'")) {
    newContent = newContent.replace(
      /import prisma from '@\/lib\/prisma';/g,
      "import { prisma } from '@/lib/prisma';"
    );
  }

  // Corrigir Transition/Fragment faltando imports
  if (newContent.includes('<Transition') && !newContent.includes("from '@headlessui/react'")) {
    newContent = `import { Transition, Dialog } from '@headlessui/react';\n` + newContent;
  }

  return newContent;
}

function runPrettier(filePath) {
  try {
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'ignore' });
    console.log(`✨ Prettier formatado: ${filePath}`);
  } catch (error) {
    console.warn(`⚠️ Prettier falhou em: ${filePath}`);
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const original = content;

  content = fixJSX(content);
  content = fixImports(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigido: ${filePath}`);
    runPrettier(filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!ignoredDirs.some(ignored => fullPath.includes(ignored))) {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

console.log('🚀 Iniciando correção de arquivos...');

foldersToCheck.forEach(folder => walk(folder));

console.log('\n✅ Todas correções feitas. Agora rode: npm run build');
