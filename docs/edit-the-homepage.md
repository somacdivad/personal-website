# How to edit the homepage

1. Open [src/pages/index.astro](../src/pages/index.astro).
2. Edit `greeting` and the introduction inside `HeroWithFigure`, or edit the headings and paragraphs inside `<main>`. Keep the introduction to text and inline markup such as `<em>`; do not put another paragraph inside it.
3. To replace the portrait, add an image to `public/images/` and update `figure.src` and `figure.alt`. For example, replace the current `figure` value with:

   ```astro
   figure={{ src: '/images/new-portrait.jpg', alt: 'Portrait of David Amos' }}
   ```

   Replace the filename and alternative text with your image's details.
4. [Preview locally](preview-locally.md) at `/`. Check the text and portrait at wide and narrow widths, then [deploy changes](deploy-changes.md).
