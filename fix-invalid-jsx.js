const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.tsx')) {
      callback(fullPath);
    }
  });
}

function fixInvalidJSX(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Remove crases soltas antes de ">"
  const regexCraseTag = /<([^>]*?)`}>/g;
  if (regexCraseTag.test(content)) {
    content = content.replace(regexCraseTag, '<$1}>');
    console.log(`✔️ Corrigido crase perdida antes de ">": ${filePath}`);
    changed = true;
  }

  // Remove crases perdidas dentro de spreads {...props`}
  const regexCraseSpread = /\{\.\.\.[^}]*?`}/g;
  if (regexCraseSpread.test(content)) {
    content = content.replace(regexCraseSpread, (match) => match.replace('`', ''));
    console.log(`✔️ Corrigido crase dentro de spread: ${filePath}`);
    changed = true;
  }

  // Corrigir aberturas de tags com crase tipo: <div`> ou <div`}
  const regexCraseTagStart = /<(\w+)\s*`>/g;
  if (regexCraseTagStart.test(content)) {
    content = content.replace(regexCraseTagStart, '<$1>');
    console.log(`✔️ Corrigido crase em abertura de tag: ${filePath}`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

console.log('🔍 Corrigindo problemas de JSX quebrado...');
walkDir(srcDir, fixInvalidJSX);
console.log('✅ Correção finalizada!');
