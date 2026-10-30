import { randomBytes } from 'node:crypto';
import { readFile, writeFile, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { PREVIEW_TOKEN_PATTERN } from '../src/lib/draft-previews.mjs';

export function editDraft(source, action, rotate = false) {
  const match = /^---[^\S\r\n]*\r?\n([\s\S]*?)^---[^\S\r\n]*(?:\r?\n|$)/m.exec(source);
  if (!match || match.index !== 0) throw new Error('The post needs YAML frontmatter.');
  const header = match[1];
  const data = load(header);
  if (!data || typeof data !== 'object' || data.draft !== true) {
    throw new Error('Only posts with draft: true can be shared or unshared.');
  }
  if (data.previewToken !== undefined &&
      (typeof data.previewToken !== 'string' || !PREVIEW_TOKEN_PATTERN.test(data.previewToken))) {
    throw new Error('Invalid previewToken. Remove the malformed field before sharing.');
  }
  if (!['share', 'unshare'].includes(action)) throw new Error('Expected share or unshare.');
  if (action === 'unshare' && rotate) throw new Error('--rotate is only supported when sharing.');
  if (action === 'share' && data.previewToken && !rotate) return { source, token: data.previewToken };
  if (action === 'unshare' && data.previewToken === undefined) return { source, token: undefined };

  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const token = action === 'share' ? randomBytes(32).toString('base64url') : undefined;
  const field = /^previewToken[\t ]*:[^\r\n]*(?:\r?\n|$)/gm;
  const fields = [...header.matchAll(field)];
  if (data.previewToken !== undefined && fields.length !== 1) {
    throw new Error('Use a single top-level previewToken field on one line. No changes were made.');
  }
  const line = token ? `previewToken: ${token}${newline}` : '';
  const nextHeader = fields.length ? header.replace(field, line) : header + line;
  // Replace only this field; preserve every other frontmatter line and body byte.
  const start = match[0].indexOf('\n') + 1;
  return { source: source.slice(0, start) + nextHeader + source.slice(start + header.length), token };
}

export async function findDraft(directory, id) {
  if (!id || id.includes('\\') || id.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error('Provide a blog content identifier, such as work or essays/work.');
  }
  const root = await realpath(directory);
  const base = id.replace(/\.(md|mdx)$/, '');
  const matches = [];
  for (const ext of ['.md', '.mdx']) {
    try {
      const path = await realpath(resolve(root, base + ext));
      if (!path.startsWith(root + sep)) throw new Error('Post must be inside the blog directory.');
      matches.push(path);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (matches.length !== 1) throw new Error(matches.length ? 'Ambiguous blog identifier.' : `Blog post "${id}" not found.`);
  return matches[0];
}

async function main() {
  const [action, id, ...flags] = process.argv.slice(2);
  if (!['share', 'unshare'].includes(action) || !id || flags.some(flag => flag !== '--rotate') || flags.length > 1) {
    throw new Error('Usage: npm run draft:share -- <id> [--rotate] or npm run draft:unshare -- <id>');
  }
  const path = await findDraft(fileURLToPath(new URL('../src/content/blog/', import.meta.url)), id);
  const source = await readFile(path, 'utf8');
  const result = editDraft(source, action, flags.includes('--rotate'));
  const { default: config } = await import('../astro.config.mjs');
  if (!config.site) throw new Error('Set site in astro.config.mjs before sharing.');
  const url = result.token ? new URL(`/preview/${result.token}/`, config.site).href : undefined;
  if (source !== result.source) await writeFile(path, result.source);
  console.log(url ?? `Sharing is disabled for ${id}.`);
  console.log('Build and deploy to apply changes to the live site. This command does not deploy.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
