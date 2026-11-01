# Markdown quote footers

Use a normal Markdown blockquote for quoted text. Add a native `<footer>`
inside it for attribution. No component import or custom quote syntax is needed.
The attributed example below is tested in MDX; use `.mdx` for this pattern
when the footer contains Markdown or footnote references.

```mdx
> The first paragraph of a quotation, with *emphasis*.
>
> Another paragraph from the same quotation.
>
> <footer>
>
> — A writer, <cite>A Book</cite>.[^quotation-source]
>
> </footer>

[^quotation-source]: Author, *Book Title*, translator if applicable, edition (Publisher, year), page or passage. [Source](https://example.com/).
```

## Spacing and attribution

- Keep the `>` prefix on the footer tags, attribution, and intervening blank lines.
  That keeps the footer inside the quotation.
- Leave a quoted blank line (`>`) after `<footer>` and before `</footer>` so
  Markdown and footnotes inside the footer can be parsed.
- Put the footnote definition outside the blockquote, without a `>` prefix.
  Give each source a distinct footnote label within the post.
- Use `<cite>` around the work title. The dash before the author is optional
  text you supply; the site does not insert it.

The same paragraph can include a source link instead of a footnote:

```mdx
> A short quotation.
>
> <footer>
>
> A writer, <cite>A Book</cite>, [source](https://example.com/).
>
> </footer>
```

The footer is optional. Plain quotes work in Markdown and MDX:

```markdown
> A quotation without attribution.
```

## Appearance

[custom.css](../src/styles/custom.css) styles quotes with italic text and a
large Permanent Marker opening quotation mark, without a border. Footers use
smaller, upright text and the muted theme color. Footer links use the site's
link color. There is no automatic bibliography or copyright check: write the
source and license details in the attribution or footnote as needed.

This footer belongs to the quotation, unlike the separate [site Footer](footer.md).
For bilingual passages, use [Translation](translation.md), which has its own styling.
Behavior checks: `npm run test:quotes`.
