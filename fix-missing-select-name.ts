import fs from 'fs';
import path from 'path';

const srcPath = path.join(__dirname, 'src');

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx')) {
      callback(dirPath);
    }
  });
}

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  const regex = /<Select([^>]*?)\/?>/gs;

  let changed = false;
  const newContent = content.replace(regex, (match, props) => {
    if (!/name\s*=/.test(props)) {
      const propsWithName = props.replace(/^\s*/, ' name="autoFix" ');
      changed = true;
      return `<Select${propsWithName}/>`;
    }
    return match;
  });

  if (changed) {
    fs.copyFileSync(filePath, `${filePath}.bak`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Corrigido: ${filePath}`);
  }
}

console.log('🚀 Corrigindo Selects sem "name"...');
walkDir(srcPath, fixFile);
console.log('✅ Fim das correções.');
