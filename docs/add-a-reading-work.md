# How to add a reading work

Reading entries have no draft mode. They publish on the next deployment.

1. Create `src/content/reading/a-room-of-ones-own/work.md`. Replace the folder name with a stable ID using lowercase letters, numbers, and single hyphens. It becomes `/about/reading/a-room-of-ones-own/`; keep it unchanged after publishing.
2. Add this metadata with no body. Replace the example with your work, actual start date, and edition's page count.

   ```yaml
   ---
   title: A Room of One's Own
   authors:
     - Virginia Woolf
   kind: book
   sessions:
     - id: first-read
       started: '2026-11-07'
       totalPages: 128
   ---
   ```

3. Use `authors: []` for an unattributed work. Choose `book`, `article`, `essay`, `paper`, `short story`, or `other` for `kind`. Keep the session ID stable. Omit `started` if unknown; otherwise use a quoted `YYYY-MM-DD` date. Omit `totalPages` to track percentages or no progress.
4. Optionally add `sourceUrl` (an HTTP or HTTPS link), `description`, or `tags` to the frontmatter. For a cover, put `cover.jpg` beside `work.md` and add `thumbnail: ./cover.jpg`.
5. [Preview locally](preview-locally.md) and check `/about/reading/` and the work's page, then [deploy changes](deploy-changes.md). A new session starts as Reading; next you can [record progress](record-reading-progress.md) or [add a note](add-a-reading-note.md).
