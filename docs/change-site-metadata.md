# How to change site metadata

1. Open [src/consts.ts](../src/consts.ts). Edit `SITE_TITLE` and `SITE_DESCRIPTION` to change the default browser title and page description. Preserve the surrounding quotes; escape apostrophes in single-quoted strings with a backslash.
2. To change the default social preview image, replace [src/assets/social-image.png](../src/assets/social-image.png), keeping its filename and PNG format.
3. For a specific post or story, edit its `title` and `description` in frontmatter instead. Its `heroImage`, when supplied, also overrides the default social image; see [Add an image](add-an-image.md).
4. [Preview locally](preview-locally.md). Check the browser title and use View Page Source to inspect `description`, `og:title`, and `og:image`. Shared draft previews intentionally omit social metadata. [Deploy changes](deploy-changes.md) and check a normal live page's source too.
