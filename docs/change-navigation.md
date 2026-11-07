# How to change navigation

1. Open [src/components/Header.astro](../src/components/Header.astro) and find `const items` near the top.
2. Edit a link's `label` or `href`, or move its entry to change the order. A normal link looks like this:

   ```js
   { label: 'Blog', href: '/blog' },
   ```

3. For an About me link, edit the appropriate entry inside that item's `children` array. The reading link uses `READING_TITLE` and `READING_BASE` from [src/lib/reading.ts](../src/lib/reading.ts); keep its URL unchanged for a label-only edit. Link only to an existing page.
4. [Preview locally](preview-locally.md). Check each changed destination in the desktop navigation and mobile menu, including About me, then [deploy changes](deploy-changes.md).
