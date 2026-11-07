# How to record reading progress

1. Open the work's `work.md` under `src/content/reading/`. Find the current session ID and check whether it has `totalPages`.
2. Create a file such as `src/content/reading/a-room-of-ones-own/updates/2026-11-07-01.mdx`. Replace the work folder and date. The filename must match the update date; use `-02`, `-03`, and so on for later updates that day, keeping the same number width.
3. For page-based progress, add this example with your session, quoted date, current page, and optional location. Use a whole page number from zero through `totalPages`, not pages read since the last update.

   ```mdx
   ---
   session: first-read
   date: '2026-11-07'
   pages: 32
   location: Chapter 2
   ---
   ```

4. If the session has no `totalPages`, replace `pages: 32` with `percent: 25`, using a value from 0 to 100. Never supply both fields. Leave the body empty for progress only, or write a note below the frontmatter.
5. [Preview locally](preview-locally.md) and check the work's latest progress, then [deploy changes](deploy-changes.md). The date must not precede the session start. Reaching 100% does not finish the session; [change its status](change-reading-status.md) separately. Closed sessions accept notes only.
