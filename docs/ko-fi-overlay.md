# KoFiOverlay

[Source](../src/components/KoFiOverlay.astro). The official Ko-fi floating chat
widget for `davidamoswrites`. It uses the label `Support me` and the same heading
ink and page background colors as Subscribe and the post's support button.

[BaseLayout](base-layout.md) places the component just before the closing body
tag. It appears on all pages using that layout except the homepage and draft
previews.

The scripts use Astro's `is:inline` directive to run in place and in order.
The component has no props. Edit the `kofiWidgetOverlay.draw` call to change its
account or label.

Ko-fi renders separate desktop and mobile buttons in frames. The component
copies the site's resolved colors, serif font, and field corner radius into
both buttons. It updates their colors when the theme changes, preserving any
open donation form.

The floating widget is separate from [KoFiButton](ko-fi-button.md), which remains
centered above the subscribe form on published posts.
