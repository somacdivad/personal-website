# How to add a reading note

1. Find the work's folder under `src/content/reading/` and the session ID in its `work.md`. Notes may be added to reading, paused, stopped, or finished sessions.
2. Create an update such as `updates/2026-11-07-01.mdx` inside that folder. Use the note's date and the next unused sequence that day (`-01`, `-02`, and so on), with a consistent number width.
3. Add this example, replacing the session, quoted date, and body. The filename's date must match the frontmatter and must not precede the session start.

   ```mdx
   ---
   session: first-read
   date: '2026-11-07'
   ---

   What does having a room of one's own make possible?
   ```

4. Omit progress and status fields to leave them unchanged. The first text paragraph supplies a preview of up to 40 words, keeping inline formatting such as italics, bold, and strikethrough; optionally add `summary: A short plain-text preview.` inside the frontmatter to override it. An empty body can serve as a placeholder for later.
5. To add media, follow [Add an image](add-an-image.md), [Add a video](add-a-video.md), or [Add a translation](add-a-translation.md). Put imports after frontmatter and use the reading-update paths shown in those guides.
6. [Preview locally](preview-locally.md) and check the dated note on the work's page, then [deploy changes](deploy-changes.md). Reading notes have no draft mode.
