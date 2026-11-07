# How to quote a source

1. Open the `.mdx` post, story, or reading note where the quotation belongs.
2. Add this in the body, replacing the passage and source details. No component import is needed.

   ```mdx
   > The quoted passage goes here.
   >
   > <footer>
   >
   > — A writer, <cite>A Book</cite>.[^quotation-source]
   >
   > </footer>

   [^quotation-source]: Author, *Book Title*, translator if needed, edition (Publisher, year), page. [Source](https://example.com/).
   ```

3. Keep `>` on every line inside the quote, including blank lines. Leave a quoted blank line after `<footer>` and before `</footer>`. Put the footnote definition outside the quote and use a unique footnote label for each source.
4. [Preview locally](preview-locally.md) and check the passage, attribution, and footnote link. Then [deploy changes](deploy-changes.md).
