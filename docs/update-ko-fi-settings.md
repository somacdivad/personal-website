# How to update Ko-fi settings

1. Open [src/components/KoFiButton.astro](../src/components/KoFiButton.astro). Update its `href` from `https://ko-fi.com/R8L129YVR4` to the intended Ko-fi page, and edit `Support me on Ko-fi` if needed.
2. Open [src/components/KoFiOverlay.astro](../src/components/KoFiOverlay.astro). Change `davidamoswrites` in `kofiWidgetOverlay.draw` to the intended account and edit `floating-chat.donateButton.text` for the floating button's label.
3. Check the account against the Floating Button code on your [Ko-fi Widget page](https://ko-fi.com/manage/widgets). Use the account value from that code while keeping the site's existing color and theme code; see [Ko-fi's widget instructions](https://help.ko-fi.com/hc/en-us/articles/360018381678-Ko-fi-tip-widget).
4. [Preview locally](preview-locally.md) on a published blog post or story. Check the inline button's destination and open the floating widget to confirm the account without completing a payment. The floating widget is omitted from the homepage and shared draft previews.
5. [Deploy changes](deploy-changes.md) and check both integrations on a live article.
