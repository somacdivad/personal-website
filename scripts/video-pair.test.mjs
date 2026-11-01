import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { build } from 'astro';
import mdx from '@astrojs/mdx';

const project = fileURLToPath(new URL('../', import.meta.url));
const component = JSON.stringify(join(project, 'src/components/VideoPair.astro'));
const singleComponent = JSON.stringify(join(project, 'src/components/VideoFigure.astro'));
const videos = Array.from({ length: 8 }, (_, i) => ({
  src: `/media/example-${i}.mp4`,
  poster: `/posters/example-${i}.jpg`,
  label: `Example video ${i}`,
}));
let fixture;
let astroHtml;
let mdxHtml;

before(async () => {
  const cache = join(project, 'node_modules/.cache');
  await mkdir(cache, { recursive: true });
  fixture = await mkdtemp(join(cache, 'video-pair-'));
  const pages = join(fixture, 'src/pages');
  await mkdir(pages, { recursive: true });
  await writeFile(join(fixture, 'package.json'), '{"type":"module"}');
  await writeFile(join(pages, 'index.astro'), `---
import VideoPair from ${component};
---
<VideoPair left={${JSON.stringify(videos[0])}} right={${JSON.stringify(videos[1])}}>
  A shared <em>caption</em> with <a href="/credits/">credits</a>.
</VideoPair>
<VideoPair left={${JSON.stringify(videos[2])}} right={${JSON.stringify(videos[3])}} />
`);
  await writeFile(join(pages, 'article.mdx'), `import VideoPair from ${component};
import VideoFigure from ${singleComponent};

<VideoPair left={${JSON.stringify(videos[4])}} right={${JSON.stringify(videos[5])}}>

An **MDX caption** with a source.[^source]

</VideoPair>

<VideoFigure {...${JSON.stringify(videos[6])}}>

A standalone caption.[^source]

</VideoFigure>

<VideoFigure {...${JSON.stringify(videos[7])}} />

[^source]: A source with a [license](https://creativecommons.org/licenses/by/4.0/).
`);
  await build({
    root: pathToFileURL(`${fixture}/`),
    configFile: false,
    integrations: [mdx()],
    logLevel: 'silent',
    vite: { cacheDir: join(fixture, '.vite') },
  });
  [astroHtml, mdxHtml] = await Promise.all([
    readFile(join(fixture, 'dist/index.html'), 'utf8'),
    readFile(join(fixture, 'dist/article/index.html'), 'utf8'),
  ]);
});

after(async () => { if (fixture) await rm(fixture, { recursive: true, force: true }); });

// Read rendered player attributes without tying checks to formatting or scoped class names.
function players(html) {
  return [...html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/g)].map(([, attrs, content]) => ({
    attrs: Object.fromEntries([...attrs.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)]
      .map(([, name, value]) => [name, value ?? ''])),
    content,
  }));
}

test('paired and standalone videos retain distinct content, optional captions, and footnotes', () => {
  const rendered = [...players(astroHtml), ...players(mdxHtml)];
  assert.equal(rendered.length, videos.length);
  rendered.forEach(({ attrs, content }, i) => {
    assert.equal(attrs.src, videos[i].src);
    assert.equal(attrs.poster, videos[i].poster);
    assert.equal(attrs['aria-label'], videos[i].label);
    assert.match(content, new RegExp(`href="${videos[i].src}"`));
    assert.ok(content.includes(videos[i].label));
  });
  const figures = [...astroHtml.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)];
  assert.equal(figures.length, 2);
  assert.match(figures[0][1], /<figcaption\b[^>]*>[\s\S]*<em>caption<\/em>[\s\S]*href="\/credits\/"/);
  assert.doesNotMatch(figures[1][1], /<figcaption\b/);
  assert.match(mdxHtml, /<figcaption\b[^>]*>[\s\S]*<strong>MDX caption<\/strong>[\s\S]*href="#user-content-fn-source"/);
  assert.match(mdxHtml, /id="user-content-fn-source"/);
  assert.match(mdxHtml, /href="https:\/\/creativecommons.org\/licenses\/by\/4.0\/"/);
  const mdxFigures = [...mdxHtml.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)];
  assert.equal(mdxFigures.length, 3);
  assert.match(mdxFigures[1][1], /<figcaption\b[^>]*>[\s\S]*A standalone caption\.[\s\S]*href="#user-content-fn-source"/);
  assert.doesNotMatch(mdxFigures[2][1], /<figcaption\b/);
});

test('players use browser controls without automatic playback, preloading, or scripts', () => {
  for (const html of [astroHtml, mdxHtml]) {
    for (const { attrs } of players(html)) {
      for (const name of ['controls', 'muted', 'playsinline']) {
        assert.ok(Object.hasOwn(attrs, name), `Missing ${name} on ${attrs.src}`);
      }
      assert.equal(attrs.preload, 'none');
      for (const name of ['autoplay', 'loop', 'id']) {
        assert.ok(!Object.hasOwn(attrs, name), `Unexpected ${name} on ${attrs.src}`);
      }
    }
    assert.doesNotMatch(html, /<script\b/);
  }
});
