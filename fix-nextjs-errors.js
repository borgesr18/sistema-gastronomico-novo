const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (f.endsWith('.tsx')) {
      callback(fullPath);
    }
  });
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // ✅ 1. Adicionar 'use client' se usar hooks e não tiver ainda
  const usesHook = /(useState|useEffect|useModal|useRef|useContext|useReducer|useMemo|useCallback)\(/.test(content);
  const hasUseClient = content.startsWith("'use client';") || content.startsWith('"use client";');
  if (usesHook && !hasUseClient) {
    content = `'use client';\n\n${content}`;
    console.log(`✔️ [use client] Adicionado em: ${filePath}`);
    changed = true;
  }

  // ✅ 2. Corrigir imports do Prisma
  if (content.includes("import prisma from '@/lib/prisma'")) {
    content = content.replace(/import prisma from '@\/lib\/prisma'/g, "import { prisma } from '@/lib/prisma'");
    console.log(`✔️ [Import Prisma] Corrigido em: ${filePath}`);
    changed = true;
  }

  // ✅ 3. Remover atributos duplicados no JSX (ex: dois 'variant=')
  const regexDuplicateProps = /<(\w+)[^>]*(\b(\w+)="[^"]*")([^>]*\3="[^"]*")[^>]*>/g;
  if (regexDuplicateProps.test(content)) {
    content = content.replace(regexDuplicateProps, (match, tag, firstAttr, attrName, rest) => {
      console.log(`✔️ [Duplicated prop "${attrName}"] Corrigido em: ${filePath}`);
      return match.replace(new RegExp(`\\s*${attrName}="[^"]*"`, 'g'), '').replace('<', `<${tag} ${firstAttr}`);
    });
    changed = true;
  }

  // ✅ 4. Remover atributos inválidos em componentes que dão erro no build
  const invalidProps = ['compact', 'fullWidth', 'size', 'required', 'className'];
  invalidProps.forEach((prop) => {
    const regex = new RegExp(`\\s+${prop}={.*?}`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, '');
      console.log(`✔️ [Atributo inválido "${prop}"] Removido de: ${filePath}`);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('🔍 Corrigindo arquivos .tsx...');
walkDir(srcDir, fixFile);
console.log('✅ Script finalizado!');
