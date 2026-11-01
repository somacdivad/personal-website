import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatSentences } from './sentence-format.mjs';

const usage = 'Usage: npm run format:sentences -- <file.md|file.mdx>... [--check] OR --all [--check]';

async function contentFiles(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await contentFiles(path));
    else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) paths.push(path);
  }
  return paths.sort();
}

export async function run(args, { cwd = process.cwd(), log = console.log } = {}) {
  const flags = args.filter(arg => arg.startsWith('--'));
  const paths = args.filter(arg => !arg.startsWith('--'));
  if (flags.some(flag => !['--all', '--check'].includes(flag)) ||
      new Set(flags).size !== flags.length ||
      (flags.includes('--all') ? paths.length : !paths.length)) throw new Error(usage);
  const files = [...new Set(flags.includes('--all')
    ? await contentFiles(join(cwd, 'src/content')) : paths.map(path => resolve(cwd, path)))];
  const prepared = [];
  for (const path of files) {
    if (!/\.mdx?$/i.test(path)) throw new Error(`Expected a Markdown or MDX file: ${path}`);
    try {
      const source = await readFile(path, 'utf8');
      const result = formatSentences(source, { mdx: extname(path).toLowerCase() === '.mdx' });
      if (source !== result) prepared.push({ path, source, result });
    } catch (error) { throw new Error(`${relative(cwd, path)}: ${error.message}`); }
  }
  if (flags.includes('--check')) {
    for (const { path } of prepared) log(relative(cwd, path));
    return prepared.length ? 1 : 0;
  }
  // Check the whole batch again before writing, then recheck each file at its write.
  async function unchanged({ path, source }) {
    if (await readFile(path, 'utf8') !== source) throw new Error(`File changed during formatting: ${path}`);
  }
  for (const file of prepared) await unchanged(file);
  for (const file of prepared) {
    await unchanged(file);
    await writeFile(file.path, file.result);
    log(relative(cwd, file.path));
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).then(code => { process.exitCode = code; })
    .catch(error => { console.error(error.message); process.exitCode = 2; });
}
