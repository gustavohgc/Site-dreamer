#!/usr/bin/env node
// sync-header.js
// Sincroniza os arquivos .html da pasta atual no <nav> do index.html
// Uso: node sync-header.js [caminho/para/html]
// Execute a partir da pasta Dreamer Imports/html ou passe o caminho como argumento.

const fs = require('fs').promises;
const path = require('path');

async function syncHeader(targetDir = process.cwd()) {
  const indexPath = path.join(targetDir, 'index.html');

  try {
    const content = await fs.readFile(indexPath, 'utf8');
    const files = await fs.readdir(targetDir);
    const htmlFiles = files.filter(f => /\.html$/i.test(f)).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );

    if (htmlFiles.length === 0) {
      console.log('Nenhum arquivo .html encontrado em:', targetDir);
      return;
    }

    const navLinks = htmlFiles
      .map(f => `    <a href="${f}">${prettifyLabel(f)}</a>`)
      .join('\n');

    const navBlock = `<nav>\n${navLinks}\n  </nav>`;

    // Substitui o bloco <nav> existente por navBlock (primeira ocorrência)
    const newContent = content.replace(/<nav[\s\S]*?<\/nav>/i, navBlock);

    // Faz backup do index.html antes de sobrescrever
    await fs.writeFile(indexPath + '.bak', content, 'utf8');
    await fs.writeFile(indexPath, newContent, 'utf8');

    console.log('Cabeçalho sincronizado com sucesso. Backup: index.html.bak');
  } catch (err) {
    console.error('Erro ao sincronizar cabeçalho:', err.message);
    process.exit(1);
  }
}

function prettifyLabel(fileName) {
  let name = fileName.replace(/\.html$/i, '');

  if (name.toLowerCase() === 'index') return 'INÍCIO';

  // Remove prefixos comuns como "listagem"
  name = name.replace(/^listagem/i, '');
  // Substitui separadores e converte camelCase para espaços
  name = name.replace(/[_-]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  name = name.trim();

  // Se estiver vazio após limpeza, usa o nome original
  if (!name) name = fileName.replace(/\.html$/i, '');

  return name.toUpperCase();
}

// Recebe diretório alvo como argumento opcional
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
syncHeader(targetDir);