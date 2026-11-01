# Sentence formatting

Put each English sentence on its own source line without changing how the post
renders. This is a manual writing tool. It does not run on save or during builds.

```sh
npm run format:sentences -- src/content/blog/example.mdx
npm run format:sentences -- first.md second.mdx
npm run format:sentences -- --all
npm run format:sentences -- --all --check
npm run test:sentence-format
```

Named paths select only those files. `--all` selects `.md` and `.mdx` files under
`src/content`, including drafts. Do not combine paths with `--all`. With no
targets, the command prints usage and makes no changes.

`--check` prints paths that would change without writing them. Exit codes are
`0` for success, `1` when a check finds changes, and `2` for argument, parsing,
or file errors.

The formatter joins soft wraps within a paragraph and starts new sentences on
new lines. It preserves paragraph breaks and explicit Markdown hard breaks
(two trailing spaces or a backslash). Quote markers and list indentation carry
onto continuation lines, including nested lists, task items, and footnotes.
Footnote references stay with their sentence.

It also formats Markdown paragraphs inside MDX components and HTML wrappers,
such as captions and quote attribution footers. It leaves frontmatter, headings,
tables, code, link destinations, reference definitions, imports, tags, attributes,
expressions, and raw HTML blocks unchanged. It never evaluates MDX code.

Sentence detection favors keeping uncertain cases together. Initials, common
abbreviations, decimals, URLs, and ellipses are protected. Links and inline code
are treated as single units. A break before an inline HTML or JSX tag is skipped
because starting a line with that tag can change the document structure. No
wording, punctuation, capitalization, or PDF hyphenation is corrected.

## Preserve a passage exactly

Put paired comments on their own lines. They may also appear inside a quote or
list, using that container’s normal prefix or indentation.

In Markdown:

```md
<!-- sentence-format: off -->
Preserve this passage. Exactly.
Including its existing line breaks.
<!-- sentence-format: on -->
```

In MDX:

```mdx
{/* sentence-format: off */}
Preserve this passage. Exactly.
Including its existing line breaks.
{/* sentence-format: on */}
```

Use this for lyrics, poetry, or unusual sentence boundaries. Unmatched or nested
directives are errors. Excluded passages must still be valid Markdown or MDX.

## Safety checks

The tool edits paragraph source ranges rather than reprinting whole files. It
preserves line endings and final-newline presence. Running it twice produces
the same result.

Before writing, it reparses the result and checks that only ordinary prose
whitespace changed in the syntax tree. For example, it rejects a sentence break
that would turn text into a heading or list. Use an off/on region when that
happens. A parsing or structure error stops the batch before any files are
written. Files are checked again before writing to catch concurrent edits.

Review the diff after formatting. A later disk error or concurrent edit can stop
a write batch after earlier files have already been formatted.
