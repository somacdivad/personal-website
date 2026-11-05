# CollectionIndex

[Source](../src/components/CollectionIndex.astro).
The Blog and Stories pages use this shared list and toolbar.
It shows topic filters, a result count, sorting, and an RSS subscribe link with an icon.
Selected topics use hand-drawn underlines.
Each topic has its own stable stroke, shared across its index and tag pages.

Pass `entries`, `title`, `basePath`, `itemLabel`, and `itemPlural`.
`entries` accepts blog or story collection entries.
Use `/blog` or `/stories` for `basePath`.
Optional `tagNames` maps tag values to display names.
Optional `initialTopic` selects a topic when rendering a tag page.

Items start in newest-first order.
With JavaScript enabled, readers can filter topics and sort by newest, oldest,
or title without loading a new page.
The selected topic and sort order stay in the URL as `tag` and `sort` parameters.
Back and Forward restore those choices.
Without JavaScript, topic links open static tag pages and sorting stays hidden.

The RSS link always points to the collection's feed, even when a topic is selected.
It remains visible when the collection is empty.
The shared `RssLink.astro` component supplies the icon, label, and link styles
for Blog, Stories, and the reading journal.
