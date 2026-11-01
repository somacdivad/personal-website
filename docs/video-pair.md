# VideoPair

[Source](../src/components/VideoPair.astro). Use in MDX posts or Astro pages to
compare two videos, with one optional caption below both players.

```mdx
import VideoPair from '../../components/VideoPair.astro';

<VideoPair
  left={{
    src: '/videos/first-example.mp4',
    poster: '/images/first-example-poster.jpg',
    label: 'Describe the first video',
  }}
  right={{
    src: '/videos/second-example.mp4',
    poster: '/images/second-example-poster.jpg',
    label: 'Describe the second video',
  }}
>

Describe both videos and credit their sources.[^video-source]

</VideoPair>

[^video-source]: Add the creators, titles, source links, licenses, and any changes here.
```

## Props and caption

| Prop | Required | Value |
| --- | --- | --- |
| `left` | Yes | Object with `src`, `poster`, and `label` strings. |
| `right` | Yes | Object with `src`, `poster`, and `label` strings. |

`src` is the video URL; `poster` is the still-image URL shown before playback.
`label` becomes the player's accessible name: describe what the video shows.
Files in `public/videos/` and `public/images/` use URLs starting with `/videos/`
and `/images/`, without `public`. Remote URLs can also be supplied.

The default slot becomes a shared `<figcaption>`. In MDX, leave blank lines
around caption Markdown so links and footnotes are parsed. Omit the slot with
`<VideoPair left={leftVideo} right={rightVideo} />` when no caption is needed.
The component does not add credits automatically.

## Playback and layout

Players appear side by side above 600px and stack, left first, at 600px and
below. Each player has a 16:9 black frame. Videos keep their proportions
without cropping, so some clips have empty space around them.

Both players have native controls, start muted, allow inline playback, and
use `preload="none"`. They do not autoplay, loop, or sync with each other.
A fallback download link is included inside each video element. There is no
caption-track prop; clips with meaningful speech need a separate accessibility
solution or a component change.

For standalone videos, use [VideoFigure](video-figure.md).
Behavior checks: `npm run test:video-pair`.
