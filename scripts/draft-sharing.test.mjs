import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { editDraft, findDraft } from './draft-sharing.mjs';
import { PREVIEW_TOKEN_PATTERN, validatePreviewTokens } from '../src/lib/draft-previews.mjs';

const original = '---\ntitle: "Keep my quotes" # and comment\ndraft: true\ndescription: |\n  First line\n  Second line\n---\n\nBody with Greek: ἔργον.\n';
test('sharing is stable; rotation and removal preserve the original document', () => {
  for (const source of [original, original.replaceAll('\n', '\r\n')]) {
    const shared = editDraft(source, 'share');
    assert.match(shared.token, PREVIEW_TOKEN_PATTERN);
    assert.equal(Buffer.from(shared.token, 'base64url').length, 32);
    assert.deepEqual(editDraft(shared.source, 'share'), shared);
    const rotated = editDraft(shared.source, 'share', true);
    assert.notEqual(rotated.token, shared.token);
    assert.equal(editDraft(rotated.source, 'unshare').source, source);
    assert.equal(editDraft(source, 'unshare').source, source);
  }
});
test('commands reject published posts, malformed tokens and invalid flags', () => {
  assert.throws(() => editDraft(original.replace('draft: true', 'draft: false'), 'share'), /draft: true/);
  assert.throws(() => editDraft(original.replace('draft: true', 'draft: true\npreviewToken: short'), 'share'), /Invalid/);
  assert.throws(() => editDraft(original, 'unshare', true), /--rotate/);
  assert.throws(() => editDraft(original.replace('draft: true', 'draft: true\ndraft: false'), 'share'));
});
test('build validation rejects malformed and duplicate tokens, including on published posts', () => {
  const token = editDraft(original, 'share').token;
  const post = { id: 'one', data: { draft: true, previewToken: token } };
  assert.doesNotThrow(() => validatePreviewTokens([post, { id: 'private-draft', data: { draft: true } }]));
  assert.throws(() => validatePreviewTokens([post, { id: 'two', data: { draft: false, previewToken: token } }]), /Duplicate/);
  assert.throws(() => validatePreviewTokens([{ id: 'bad', data: { previewToken: 'short' } }]), /Invalid/);
});
test('identifiers resolve nested posts and reject missing, ambiguous or escaping paths', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'draft-sharing-'));
  try {
    await mkdir(join(dir, 'essays'));
    await writeFile(join(dir, 'essays/work.mdx'), original);
    assert.equal(await findDraft(dir, 'essays/work'), await realpath(join(dir, 'essays/work.mdx')));
    await assert.rejects(findDraft(dir, '../work'), /identifier/);
    await assert.rejects(findDraft(dir, '/work'), /identifier/);
    await assert.rejects(findDraft(dir, 'missing'), /not found/);
    await writeFile(join(dir, 'essays/work.md'), original);
    await assert.rejects(findDraft(dir, 'essays/work'), /Ambiguous/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
