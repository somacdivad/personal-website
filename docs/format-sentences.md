# How to format sentences

1. Save the Markdown or MDX file you want to format. Run all commands from the repository root; replace the example path with your file.
2. Protect poetry, lyrics, or passages whose line breaks must stay exact. In MDX, put these comments on their own lines around the passage:

   ```mdx
   {/* sentence-format: off */}
   Keep this passage. Exactly.
   Including its line breaks.
   {/* sentence-format: on */}
   ```

   In plain Markdown, use `<!-- sentence-format: off -->` and `<!-- sentence-format: on -->`. Always pair the comments without nesting them.
3. Check whether formatting would change the file:

   ```sh
   npm run format:sentences -- src/content/blog/my-new-post.mdx --check
   ```

   A printed path and exit code `1` mean changes are needed. Exit code `2` means an error; fix the reported issue first.
4. Apply the formatting by running the same command without `--check`. Use `--all` instead of a path only when you intend to format every Markdown and MDX file under `src/content/`, including drafts.
5. Review `git diff -- src/content/blog/my-new-post.mdx`. The tool changes sentence line breaks, not wording. [Preview locally](preview-locally.md) to confirm the page still looks right, then [deploy changes](deploy-changes.md) when ready.
