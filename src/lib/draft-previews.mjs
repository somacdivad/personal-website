// 32 random bytes encoded as unpadded, canonical Base64url.
export const PREVIEW_TOKEN_PATTERN = /^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/;

export function validatePreviewTokens(posts) {
  const owners = new Map();
  for (const post of posts) {
    const token = post.data.previewToken;
    if (token === undefined) continue;
    if (typeof token !== 'string' || !PREVIEW_TOKEN_PATTERN.test(token)) {
      throw new Error(`Invalid previewToken in blog post "${post.id}".`);
    }
    if (owners.has(token)) {
      throw new Error(`Duplicate previewToken in blog posts "${owners.get(token)}" and "${post.id}".`);
    }
    owners.set(token, post.id);
  }
}
