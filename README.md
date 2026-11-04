# David Amos

My personal website and blog at [davidamoswrites.com](https://davidamoswrites.com).
Built with Astro and hosted on Vercel. Posts live in `src/content/blog/`.
Stories live in `src/content/stories/`; see the [writing guide](docs/stories.md).
The [reading journal](docs/reading.md) uses `src/content/reading/` for works and dated updates.

RSS feeds: `/rss.xml` includes blog posts and stories, `/blog/rss.xml` includes
blog posts only, and `/stories/rss.xml` includes stories only.
All three list the newest items first and omit drafts in production.
The separate `/about/reading/rss.xml` feed includes reading notes and status changes.
My philosophy and What I'm reading live under `/about/` and appear in the About me dropdown.
Vercel redirects the old `/philosophy` and `/reading/` URLs to their new destinations.

## Local development

```sh
npm install
npm run dev
```

`npm run build` creates the static site. `npm run preview` serves that build locally.

See the [site docs](docs/README.md) for components, quote footers, and draft previews.

Started from Astro’s blog template, based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).
