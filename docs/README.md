# Site docs

Notes for writing posts and maintaining this personal site. These files are
repository docs, not published site routes.

| Document | Description |
| --- | --- |
| [VideoPair](video-pair.md) | Two video players with an optional shared caption. |
| [VideoFigure](video-figure.md) | One video player with an optional caption. |
| [Translation](translation.md) | Original text beside its translation, with an optional citation. |
| [Markdown quote footers](markdown-quote-footers.md) | Add attribution and footnotes inside a blockquote. |
| [HeroWithFigure](hero-with-figure.md) | Home-page greeting, portrait, introduction, and optional links. |
| [FormattedDate](formatted-date.md) | Display a date with machine-readable HTML. |
| [BaseHead](base-head.md) | Page metadata, social previews, analytics, and preview behavior. |
| [Header](header.md) | Site navigation and the saved light/dark theme choice. |
| [Footer](footer.md) | Social links and the copyright line. |
| [BaseLayout](base-layout.md) | Shared page shell and the rotating handwritten dividers. |
| [BlogPost](blog-post.md) | Article layout, hero image, dates, tags, and content. |
| [Draft previews](draft-previews.md) | Keep drafts unpublished and share an unlisted preview link. |
| [Sentence formatting](sentence-format.md) | Put prose sentences on separate source lines in Markdown and MDX. |

Examples that import components from `../../components/` assume an MDX post
in `src/content/blog/`. In an Astro page, put imports between the opening
`---` lines and adjust the import path for the file's location. In MDX, put
imports after the closing frontmatter delimiter, outside a `---` block.
