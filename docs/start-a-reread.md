# How to start a reread

1. Open the existing work's `work.md` under `src/content/reading/`. Keep its folder and existing session IDs unchanged.
2. Make sure the most recent session is Stopped or Finished. If needed, [change its status](change-reading-status.md) first.
3. Append a session to the end of `sessions`; do not replace the earlier entries. For example:

   ```yaml
   sessions:
     - id: first-read
       started: '2026-11-07'
       totalPages: 128
     - id: second-read
       started: '2027-02-01'
       totalPages: 128
   ```

4. Replace the new ID, quoted date, and page count with your values. Use a unique lowercase, hyphenated ID. The new start and updates must not precede the previous session's closing date. Omit `started` if unknown and `totalPages` if not tracking pages.
5. [Record progress](record-reading-progress.md) or [add a note](add-a-reading-note.md) using the new session ID and new dated files. Only the newest session can remain Reading or Paused.
6. [Preview locally](preview-locally.md), check that both sessions appear on the same work page, then [deploy changes](deploy-changes.md).
