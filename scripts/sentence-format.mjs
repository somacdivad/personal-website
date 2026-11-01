import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';

const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
const abbreviations = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|e\.g|i\.e|cf|Fig|Figs|No|Nos|p|pp|vol|ed|eds|trans|suppl|al|ca|approx|Inc|Ltd)\.$/i;
const opaque = new Set(['inlineCode', 'link', 'linkReference', 'image', 'imageReference', 'mdxTextExpression']);

function walk(node, visit, ancestors = []) {
  visit(node, ancestors);
  for (const child of node.children ?? []) walk(child, visit, [...ancestors, node]);
}

function overlaps(start, end, ranges) {
  return ranges.some(range => start < range.end && end > range.start);
}

// Compare meaning, not positions or the ordinary whitespace that this tool changes.
function meaning(node) {
  if (Array.isArray(node)) return node.map(meaning);
  if (!node || typeof node !== 'object') return node;
  return Object.fromEntries(Object.entries(node)
    .filter(([key]) => key !== 'position' && key !== 'data')
    .map(([key, value]) => [key, node.type === 'text' && key === 'value'
      ? value.replace(/[\t \r\n]+/g, ' ') : meaning(value)]));
}

function exclusions(tree, source) {
  const directives = [];
  walk(tree, node => {
    if (!['html', 'mdxFlowExpression', 'mdxTextExpression'].includes(node.type)) return;
    const match = /^(?:<!--\s*sentence-format:\s*(off|on)\s*-->|\/\*\s*sentence-format:\s*(off|on)\s*\*\/)$/
      .exec(node.value.trim());
    if (!match) return;
    const { start, end } = node.position;
    const before = source.slice(source.lastIndexOf('\n', start.offset - 1) + 1, start.offset);
    const after = source.slice(end.offset).split(/\r?\n/, 1)[0];
    if (/^[\t >]*$/.test(before) && /^[\t ]*$/.test(after)) {
      directives.push({ start: start.offset, end: end.offset, action: match[1] ?? match[2] });
    }
  });
  const ranges = [];
  let open;
  for (const directive of directives.sort((a, b) => a.start - b.start)) {
    if (directive.action === 'off') {
      if (open) throw new Error('Nested sentence-format: off directive.');
      open = directive;
    } else {
      if (!open) throw new Error('Unmatched sentence-format: on directive.');
      ranges.push({ start: open.start, end: directive.end });
      open = undefined;
    }
  }
  if (open) throw new Error('Unmatched sentence-format: off directive.');
  return ranges;
}

function paragraphEdits(node, ancestors, source, newline) {
  const { start, end } = node.position;
  const lineStart = source.lastIndexOf('\n', start.offset - 1) + 1;
  let prefix = source.slice(lineStart, start.offset).replace(/^\uFEFF/, '');
  prefix = [...prefix].reduce((expanded, character) => expanded +
    (character === '\t' ? ' '.repeat(4 - expanded.length % 4) : character), '');
  // Checkboxes are content, rather than part of a list's continuation indent.
  if (ancestors.some(parent => parent.type === 'listItem' && parent.checked != null)) {
    prefix = prefix.replace(/\[[ xX]\][\t ]+$/, '');
  }
  prefix = prefix.replace(/\[\^[^\]]+\]:[\t ]+/, '    ')
    .replace(/(^|[>\s])([-+*]|\d+[.)])([\t ]+)/g,
      (_, lead, marker, space) => lead + ' '.repeat(marker.length + space.length));

  const protectedRanges = [];
  const mask = [];
  function protect(from, to, character = 'A') {
    protectedRanges.push({ start: from, end: to });
    mask.push({ start: from, end: to, character });
  }
  walk(node, child => {
    const span = child.position;
    if (!span) return;
    if (opaque.has(child.type) || child.type === 'break') {
      protect(span.start.offset, span.end.offset);
    } else if (child.type === 'footnoteReference' || child.type === 'html') {
      protect(span.start.offset, span.end.offset, ' ');
    } else if (child.type === 'mdxJsxTextElement') {
      const children = child.children ?? [];
      if (!children.length) protect(span.start.offset, span.end.offset);
      else {
        protect(span.start.offset, children[0].position.start.offset, ' ');
        protect(children.at(-1).position.end.offset, span.end.offset, ' ');
      }
    }
  });

  // Strip container prefixes only in this view. Edits still address the original source.
  const offsets = [];
  let text = '';
  for (let offset = start.offset; offset < end.offset; offset++) {
    if (offset > start.offset && source[offset - 1] === '\n') {
      offset += /^[\t ]*(?:>[\t ]*)*/.exec(source.slice(offset, end.offset))[0].length;
      if (offset >= end.offset) break;
    }
    offsets.push(offset);
    text += source[offset];
  }
  const masked = text.split('');
  for (let i = 0; i < offsets.length; i++) {
    const range = mask.find(range => offsets[i] >= range.start && offsets[i] < range.end);
    if (range) masked[i] = range.character;
    else if (/[*_~]/.test(masked[i])) masked[i] = ' ';
  }
  const gaps = [...text.matchAll(/[\t \r\n]+/g)].map(gap => ({
    index: gap.index,
    boundary: gap.index + gap[0].length,
    text: gap[0],
    start: offsets[gap.index],
    end: offsets[gap.index + gap[0].length] ?? end.offset,
  })).filter(gap => !overlaps(gap.start, gap.end, protectedRanges));
  const boundaries = new Set();
  const detection = masked.join('');
  for (const segment of segmenter.segment(detection)) {
    const boundary = segment.index + segment.segment.length;
    const ending = segment.segment.trimEnd().replace(/["'”’\])}]+$/, '').trimEnd();
    if (boundary < text.length && /[.!?]$/.test(ending) &&
        !abbreviations.test(ending) && !/\b[A-Z]\.$/.test(ending) &&
        !/(?:\.{2,}|…)$/.test(ending)) {
      // Attach closing markup to the old sentence and opening markup to the new one.
      const gap = gaps.findLast(gap => gap.boundary <= boundary &&
        /^\s*$/.test(detection.slice(gap.boundary, boundary)));
      // A leading HTML/JSX tag can turn inline content into a different block type.
      if (gap && text[gap.boundary] !== '<') boundaries.add(gap.index);
    }
  }
  const edits = [];
  for (const gap of gaps) {
    const replacement = boundaries.has(gap.index)
      ? newline + prefix : /[\r\n]/.test(gap.text) ? ' ' : undefined;
    if (replacement !== undefined && source.slice(gap.start, gap.end) !== replacement) {
      edits.push({ start: gap.start, end: gap.end, replacement });
    }
  }
  return edits;
}

export function formatSentences(source, { mdx = false } = {}) {
  const parser = unified().use(remarkParse).use(remarkFrontmatter).use(remarkGfm);
  if (mdx) parser.use(remarkMdx);
  const tree = parser.parse(source);
  const excluded = exclusions(tree, source);
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const edits = [];
  walk(tree, (node, ancestors) => {
    if (node.type !== 'paragraph' || ancestors.some(parent =>
      parent.type === 'table' || (parent.type === 'mdxJsxFlowElement' &&
        ['script', 'style', 'pre', 'code'].includes(parent.name)))) return;
    if (!overlaps(node.position.start.offset, node.position.end.offset, excluded)) {
      edits.push(...paragraphEdits(node, ancestors, source, newline));
    }
  });
  let result = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
  }
  if (JSON.stringify(meaning(tree)) !== JSON.stringify(meaning(parser.parse(result)))) {
    throw new Error('Formatting would change document structure or protected content. Use an off/on region for the affected passage.');
  }
  return result;
}
