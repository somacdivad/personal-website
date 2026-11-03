# David Amos

My personal website and blog at [davidamoswrites.com](https://davidamoswrites.com).
Built with Astro and hosted on Vercel. Posts live in `src/content/blog/`.
Stories live in `src/content/stories/`; see the [writing guide](docs/stories.md).

RSS feeds: `/rss.xml` includes blog posts and stories, `/blog/rss.xml` includes
blog posts only, and `/stories/rss.xml` includes stories only.
All three list the newest items first and omit drafts in production.

## Local development

```sh
npm install
npm run dev
```

`npm run build` creates the static site. `npm run preview` serves that build locally.

See the [site docs](docs/README.md) for components, quote footers, and draft previews.

Started from Astro’s blog template, based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).
