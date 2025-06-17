const fs = require('fs');
const path = require('path');

const targetExtensions = ['.tsx'];
const directory = './src';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Corrige className mal fechadas
  content = content.replace(/className={`([^`}]*)}/g, (match, p1) => {
    return `className={\`${p1}\`}`;
  });

  // Corrige inputs com template string aberta
  content = content.replace(/<input([^>]*)className={`([^`}]*)}/g, (match, props, p1) => {
    return `<input${props}className={\`${p1}\`}`;
  });

  // Corrige qualquer <div` ou <div`} ou <div}> etc
  content = content.replace(/<div[`'}>]/g, '<div>');

  // Corrige qualquer <table`} etc
  content = content.replace(/<table[`'}>]/g, '<table>');

  // Corrige qualquer <textarea`} etc
  content = content.replace(/<textarea[`'}>]/g, '<textarea>');

  // Corrige qualquer <select`} etc
  content = content.replace(/<select[`'}>]/g, '<select>');

  // Corrige retorno de functions mal fechados (abrindo parênteses mas sem fechar)
  const openParens = (content.match(/\(\n|=\s\(\n|return\s\(\n/g) || []).length;
  const closeParens = (content.match(/\n\)/g) || []).length;
  if (openParens > closeParens) {
    content += '\n)';
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Corrigido: ${filePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (targetExtensions.includes(path.extname(fullPath))) {
      fixFile(fullPath);
    }
  });
}

console.log('🚀 Corrigindo erros de JSX e interpolações...');
walkDir(directory);
console.log('✅ Fim das correções. Rode novamente: npm run build');
