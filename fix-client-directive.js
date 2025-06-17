const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx')) {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const alreadyHasUseClient = content.startsWith("'use client';") || content.startsWith('"use client";');
  const usesModal = content.includes('useModal(');

  if (usesModal && !alreadyHasUseClient) {
    console.log(`✔️ Corrigindo: ${filePath}`);
    const newContent = `'use client';\n\n${content}`;
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
}

console.log('🔍 Procurando arquivos que usam useModal...');
walkDir(path.join(__dirname, 'src'), processFile);
console.log('✅ Finalizado.');
