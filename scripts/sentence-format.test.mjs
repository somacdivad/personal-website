import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { formatSentences } from './sentence-format.mjs';

function golden(input, expected, options) {
  const result = formatSentences(input, options);
  assert.equal(result, expected);
  assert.equal(formatSentences(result, options), result, 'A second pass must be unchanged');
}

test('sentence boundaries preserve punctuation, abbreviations, names, and inline syntax', () => {
  const cases = [
    ['First sentence. A wrapped\nsecond sentence! Is this done? Yes.',
      'First sentence.\nA wrapped second sentence!\nIs this done?\nYes.'],
    ['Dr. Goodall and Gavin R. Hunt agree. Prof. Smith agrees, too.',
      'Dr. Goodall and Gavin R. Hunt agree.\nProf. Smith agrees, too.'],
    ['Use 3.14, e.g. in a calculation. It costs $2.50. Wait... Is that right?',
      'Use 3.14, e.g. in a calculation.\nIt costs $2.50.\nWait... Is that right?'],
    ['He said “It works.” Then she asked, "Does it?" Yes!',
      'He said “It works.”\nThen she asked, "Does it?"\nYes!'],
    ['*First. Second.* **Third.** One 😀 more.',
      '*First.\nSecond.*\n**Third.**\nOne 😀 more.'],
    ['Use `a.b. c` and [this source](https://example.com/a.b "A. Title."). Next.',
      'Use `a.b. c` and [this source](https://example.com/a.b "A. Title.").\nNext.'],
    ['A journal, suppl. 3 (2004): 88–90. [CC BY 4.0](https://example.com/). Video unchanged.',
      'A journal, suppl. 3 (2004): 88–90.\n[CC BY 4.0](https://example.com/).\nVideo unchanged.'],
    ['One thought.[^source] Another thought.\n\n[^source]: A source.',
      'One thought.[^source]\nAnother thought.\n\n[^source]: A source.'],
    ['One thought.[^a][^b] Next.\n\n[^a]: A.\n\n[^b]: B.',
      'One thought.[^a][^b]\nNext.\n\n[^a]: A.\n\n[^b]: B.'],
  ];
  for (const [input, expected] of cases) golden(input, expected);
  golden('First.\r\nSecond sentence. Third.\r\n', 'First.\r\nSecond sentence.\r\nThird.\r\n');
  golden('\uFEFFFirst. Second.', '\uFEFFFirst.\nSecond.');
  golden('One sentence.\u00a0Kept together.', 'One sentence.\u00a0Kept together.');
});

test('quotes, lists, task items, footnotes, and hard breaks retain their structure', () => {
  const cases = [
    ['> First sentence. Second\nlazy continuation.\n>\n> Another paragraph. More.',
      '> First sentence.\n> Second lazy continuation.\n>\n> Another paragraph.\n> More.'],
    ['> > First. Second.', '> > First.\n> > Second.'],
    ['- First. More.\n  - Nested. More.\n\n+ Separate. More.',
      '- First.\n  More.\n  - Nested.\n    More.\n\n+ Separate.\n  More.'],
    ['> 10. First. Second.\n>     More text.', '> 10. First.\n>     Second.\n>     More text.'],
    ['> - [x] First. Second.\n>   More text.', '> - [x] First.\n>   Second.\n>   More text.'],
    ['- > First. Second.\n  > More text.', '- > First.\n  > Second.\n  > More text.'],
    ['-\tFirst. Second.', '-\tFirst.\n    Second.'],
    ['- Item\n\n  Another paragraph. More.', '- Item\n\n  Another paragraph.\n  More.'],
    ['[^long-id]: First. Second.\n    Wrapped\n    continuation.',
      '[^long-id]: First.\n    Second.\n    Wrapped continuation.'],
    ['First.  \nSecond. Third.\n\nFourth.\\\nFifth. Sixth.',
      'First.  \nSecond.\nThird.\n\nFourth.\\\nFifth.\nSixth.'],
    ['> First.  \n> Second. Third.', '> First.  \n> Second.\n> Third.'],
    ['One `code\nspan. Untouched` here. Next.', 'One `code\nspan. Untouched` here.\nNext.'],
  ];
  for (const [input, expected] of cases) golden(input, expected);
});

test('MDX formatting changes prose only and rejects unsafe or unmatched regions', () => {
  const frontmatter = '---\ntitle: "Do not. Change."\ndescription: |\n  Keep this\n  wrapping.\n---\n';
  const imports = "import VideoPair from './VideoPair.astro';\n\nexport const data = { text: 'Do not. Split.' };\n";
  const props = '<VideoPair\n  left={{ src: "/a.b.mp4", label: "Do not. Split." }}\n>\n';
  const code = '```js\n// sentence-format: off\nconst value = "Keep. This.";\n```';
  const table = '| Text | Value |\n| --- | --- |\n| Keep. Together. | `a.b` |';
  const off = '{/* sentence-format: off */}\nPoetry stays. Together.\n  Across lines.\n{/* sentence-format: on */}';
  const input = `${frontmatter}\n${imports}\n# Keep. Heading.\n\n${props}\nFirst caption. Another caption.[^x]\n\n</VideoPair>\n\n> A quote. Another thought.\n>\n> <footer>\n> An author. <cite>A title.</cite> More.[^x]\n> </footer>\n\nAn {data.text} expression. Next.\n\n${table}\n\n${code}\n\n${off}\n\n[^x]: A source. More detail.\n\n[ref]: https://example.com/a.b "Do not. Split."\n\n<style>{"p { color: red; }"}</style>\n`;
  const expected = input.replace('First caption. Another caption.', 'First caption.\nAnother caption.')
    .replace('> A quote. Another thought.', '> A quote.\n> Another thought.')
    .replace('> An author. <cite>A title.</cite> More.', '> An author. <cite>A title.</cite>\n> More.')
    .replace('An {data.text} expression. Next.', 'An {data.text} expression.\nNext.')
    .replace('[^x]: A source. More detail.', '[^x]: A source.\n    More detail.');
  golden(input, expected, { mdx: true });
  const htmlOff = '<!-- sentence-format: off -->\nLeave. This.\n<!-- sentence-format: on -->';
  golden(`${htmlOff}\n\nFirst. Second.`, `${htmlOff}\n\nFirst.\nSecond.`);
  golden('<div>\nRaw HTML. Unchanged.\n</div>\n\nFirst. Second.',
    '<div>\nRaw HTML. Unchanged.\n</div>\n\nFirst.\nSecond.');
  for (const source of ['<!-- sentence-format: off -->', '<!-- sentence-format: on -->',
    '<!-- sentence-format: off -->\n\n<!-- sentence-format: off -->']) {
    assert.throws(() => formatSentences(source), /sentence-format/);
  }
  assert.throws(() => formatSentences('<X prop={', { mdx: true }));
  assert.throws(() => formatSentences('Done. # Heading'), /structure/);
});

test('CLI selection, check mode, and preflight protect files in a real batch', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'sentence-format-'));
  const cli = fileURLToPath(new URL('./format-sentences.mjs', import.meta.url));
  const invoke = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8' });
  try {
    await mkdir(join(dir, 'src/content/nested'), { recursive: true });
    const first = join(dir, 'src/content/first.md');
    const second = join(dir, 'src/content/nested/second.mdx');
    const outside = join(dir, 'outside.md');
    await writeFile(first, 'First. Second.');
    await writeFile(second, 'Third. Fourth.\n');
    await writeFile(outside, 'Outside. Untouched.');
    const checked = invoke('--all', '--check');
    assert.equal(checked.status, 1);
    assert.match(checked.stdout, /src\/content\/first.md/);
    assert.match(checked.stdout, /src\/content\/nested\/second.mdx/);
    assert.equal(await readFile(first, 'utf8'), 'First. Second.');
    assert.equal(invoke(first, '--check').status, 1);
    assert.equal(invoke(first).status, 0);
    assert.equal(await readFile(first, 'utf8'), 'First.\nSecond.');
    assert.equal(await readFile(second, 'utf8'), 'Third. Fourth.\n');
    assert.equal(invoke(first, '--check').status, 0);
    const bad = join(dir, 'src/content/bad.mdx');
    await writeFile(bad, '<X prop={');
    assert.equal(invoke(second, bad).status, 2);
    assert.equal(await readFile(second, 'utf8'), 'Third. Fourth.\n');
    await rm(bad);
    assert.equal(invoke('--all').status, 0);
    assert.equal(await readFile(second, 'utf8'), 'Third.\nFourth.\n');
    assert.equal(await readFile(outside, 'utf8'), 'Outside. Untouched.');
    assert.equal(invoke('--all', '--check').status, 0);
    for (const args of [[], ['--all', first], ['--unknown'], ['missing.md'], [cli]]) {
      assert.equal(invoke(...args).status, 2);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
