# How to change social links

1. Open [src/consts.ts](../src/consts.ts) and find `SOCIAL_LINKS`.
2. Edit the desired entry's `href`, or add an entry with `name`, `href`, and `icon`. For example:

   ```js
   {
     name: 'GitHub',
     href: 'https://github.com/somacdivad',
     icon: 'logos/github'
   },
   ```

3. Use an icon already in [src/icons/logos/](../src/icons/logos/), or add an SVG there. For `service.svg`, use `icon: 'logos/service'`. Keep the `Medium` entry unless you also update the homepage's lookup for that name.
4. If changing Mastodon, also update the `rel="me"` profile URL in [src/components/BaseHead.astro](../src/components/BaseHead.astro).
5. [Preview locally](preview-locally.md). Check the footer icons and destinations, plus the homepage's Medium link if affected, then [deploy changes](deploy-changes.md).
