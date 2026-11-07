# How to change reading status

1. Find the work's current session in `src/content/reading/<work-id>/work.md`, replacing `<work-id>` with its folder name. A new session starts as Reading.
2. Create a dated file in that work's `updates/` folder, such as `2026-11-07-01.mdx`. Use the next sequence for that day, keeping the same number width. The filename and quoted date must match and cannot precede the session start.
3. Add this example with your session and date. Choose `paused` to pause, `reading` to resume, `stopped` to abandon, or `finished` to finish.

   ```mdx
   ---
   session: first-read
   date: '2026-11-07'
   status: paused
   ---
   ```

4. Add an optional note below the frontmatter. Do not repeat the existing status on ordinary updates. Finished sessions show 100% when progress tracking exists; paused and stopped sessions keep their last progress.
5. [Preview locally](preview-locally.md), check the status on the work's page and journal, then [deploy changes](deploy-changes.md). Stopped and finished sessions accept later notes but no new progress or status changes. Correct mistakes in the original update; to return to the work, [start a reread](start-a-reread.md).
