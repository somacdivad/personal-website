# Translation

[Source](../src/components/Translation.astro). Show a passage in its original
language next to an English translation, or supply another language pair.

```mdx
import Translation from '../../components/Translation.astro';

<Translation
  original="ἔργον"
  translation="work; function"
  author="Aristotle"
  work="Nicomachean Ethics"
  reference="Book 1, chapter 7"
  sourceUrl="https://adfonteslibrary.org/work-aristotle-nicomachean-ethics#en-s4-p14"
  note="Short vocabulary example; not a full passage translation."
/>
```

## Props

| Prop | Required | Default or purpose |
| --- | --- | --- |
| `original` | Yes | Original passage, as plain text. |
| `translation` | Yes | Translated passage, as plain text. |
| `author` | Yes | Author shown in the citation. |
| `work` | Yes | Work title, rendered in `<cite>`. |
| `reference` | Yes | Passage reference, linked to `sourceUrl`. |
| `sourceUrl` | Yes | Source link; also the `cite` attribute on both quotations. |
| `originalLang` | No | `grc` (Ancient Greek); use a language tag such as `fr`. |
| `originalLabel` | No | `Ancient Greek`. |
| `translationLang` | No | `en`. |
| `translationLabel` | No | `English`. |
| `note` | No | Additional plain-text line below the citation. |
| `showCitation` | No | `true`; set to `{false}` to hide the entire caption, including `note`. |

All props except `showCitation` are strings. Text props do not parse Markdown
or HTML. The component has no content slots. When changing languages, set both
the language tags and the visible labels.

## Appearance and footnotes

The passages use two columns above 600px and stack at 600px and below.
The figure has no borders or horizontal rules. It also removes the ordinary
blockquote's decorative quotation mark. Ancient Greek uses Georgia with serif
fallbacks; other text uses the site's typography and theme colors.

To cite the passage in a footnote instead of below the translation, put a
reference on the lead-up sentence and set `showCitation={false}`:

```mdx
The author describes the human function here.[^passage]

<Translation
  original="ἔργον"
  translation="work; function"
  author="Aristotle"
  work="Nicomachean Ethics"
  reference="Book 1, chapter 7"
  sourceUrl="https://adfonteslibrary.org/work-aristotle-nicomachean-ethics#en-s4-p14"
  showCitation={false}
/>

[^passage]: Add the edition, translator, passage reference, and source link here.
```

Citation props remain required even when the visible citation is hidden.
