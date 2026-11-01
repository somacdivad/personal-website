import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { build } from 'astro';
import mdx from '@astrojs/mdx';

let fixture;
let markdownHtml;
let mdxHtml;

before(async () => {
  const project = fileURLToPath(new URL('../', import.meta.url));
  const cache = join(project, 'node_modules/.cache');
  await mkdir(cache, { recursive: true });
  fixture = await mkdtemp(join(cache, 'quotes-'));
  const pages = join(fixture, 'src/pages');
  await mkdir(pages, { recursive: true });
  await writeFile(join(fixture, 'package.json'), '{"type":"module"}');
  const quotes = `> A *short* quote with a [link](https://example.com/).

> The **first** paragraph.
>
> The second paragraph.
`;
  await writeFile(join(pages, 'plain.md'), quotes);
  await writeFile(join(pages, 'attributed.mdx'), `${quotes}>
> <footer>
>
> A writer, <cite>A Book</cite>.[^source]
>
> </footer>

[^source]: A source with a [license](https://creativecommons.org/licenses/by/4.0/).
`);
  await build({
    root: pathToFileURL(`${fixture}/`),
    configFile: false,
    integrations: [mdx()],
    logLevel: 'silent',
    vite: { cacheDir: join(fixture, '.vite') },
  });
  [markdownHtml, mdxHtml] = await Promise.all([
    readFile(join(fixture, 'dist/plain/index.html'), 'utf8'),
    readFile(join(fixture, 'dist/attributed/index.html'), 'utf8'),
  ]);
});

after(async () => { if (fixture) await rm(fixture, { recursive: true, force: true }); });

function quotes(html) {
  return [...html.matchAll(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/g)]
    .map(([, content]) => content);
}

test('native Markdown and MDX quotes retain paragraphs, emphasis, and links', () => {
  for (const html of [markdownHtml, mdxHtml]) {
    const rendered = quotes(html);
    assert.equal(rendered.length, 2);
    assert.match(rendered[0], /<p>A <em>short<\/em> quote with a <a href="https:\/\/example.com\/">link<\/a>\.<\/p>/);
    assert.match(rendered[1], /<p>The <strong>first<\/strong> paragraph\.<\/p>\s*<p>The second paragraph\.<\/p>/);
    assert.doesNotMatch(rendered[0], /<footer\b/);
    assert.doesNotMatch(html, /<script\b/);
  }
});

test('optional attribution retains its citation and working footnote links', () => {
  const [plain, attributed] = quotes(mdxHtml);
  assert.doesNotMatch(plain, /<footer\b/);
  assert.doesNotMatch(markdownHtml, /<footer\b/);
  assert.equal((attributed.match(/<footer\b/g) ?? []).length, 1);
  assert.match(attributed, /<footer>\s*<p>A writer, <cite>A Book<\/cite>\./);
  assert.match(attributed, /href="#user-content-fn-source"/);
  assert.match(attributed, /id="user-content-fnref-source"/);
  assert.match(mdxHtml, /id="user-content-fn-source"/);
  assert.match(mdxHtml, /href="#user-content-fnref-source"/);
  assert.match(mdxHtml, /href="https:\/\/creativecommons.org\/licenses\/by\/4.0\/"/);
});
