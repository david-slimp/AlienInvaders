import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(process.cwd());
const targetDirs = ['src'];
const extensions = new Set(['.ts', '.css', '.html', '.md']);

const walk = dir => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (extensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
};

const normalizeContent = content => {
  const normalized = content.replace(/\r\n/g, '\n');
  const trimmed = normalized
    .split('\n')
    .map(line => line.replace(/[ \t]+$/g, ''))
    .join('\n');
  return trimmed.endsWith('\n') ? trimmed : `${trimmed}\n`;
};

const fixFiles = () => {
  const files = targetDirs.flatMap(dir => walk(path.join(rootDir, dir)));
  let updated = 0;

  files.forEach(filePath => {
    const original = fs.readFileSync(filePath, 'utf8');
    const next = normalizeContent(original);
    if (next !== original) {
      fs.writeFileSync(filePath, next, 'utf8');
      updated += 1;
      console.log(`Fixed lint issues in ${path.relative(rootDir, filePath)}`);
    }
  });

  if (updated === 0) {
    console.log('No lint fixes needed.');
  } else {
    console.log(`Lint fixes applied to ${updated} file(s).`);
  }
};

fixFiles();
