# How to add a translation

1. Open a `.mdx` post or story. Add this below the frontmatter to show an original passage beside its translation.

   ```mdx
   import Translation from '../../components/Translation.astro';

   <Translation
     original="ἔργον"
     translation="work; function"
     author="Aristotle"
     work="Nicomachean Ethics"
     reference="Book 1, chapter 7"
     sourceUrl="https://adfonteslibrary.org/work-aristotle-nicomachean-ethics#en-s4-p14"
     note="Vocabulary example, not a full passage translation."
   />
   ```

2. Replace the passages and citation with your source. Include the translator or edition in `note` when needed. Text values are plain text, not Markdown.
3. For a different language pair, set both tags and labels, such as `originalLang="fr" originalLabel="French" translationLang="en" translationLabel="English"`. The defaults are Ancient Greek and English.
4. In a reading update, change the import to `../../../../components/Translation.astro`.
5. [Preview locally](preview-locally.md) at wide and narrow widths, check the source link, then [deploy changes](deploy-changes.md).
