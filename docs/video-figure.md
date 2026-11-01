# VideoFigure

[Source](../src/components/VideoFigure.astro). A single video with an optional
caption. Use it in MDX posts or Astro pages.

```mdx
import VideoFigure from '../../components/VideoFigure.astro';

<VideoFigure
  src="/videos/example.mp4"
  poster="/images/example-poster.jpg"
  label="Describe what the video shows"
>

Describe the video and credit its source.[^source]

</VideoFigure>
```

All three props are required strings. `label` supplies the accessible player
name. The optional caption accepts Markdown, including source footnotes. Leave
blank lines around caption Markdown in MDX. Omit the slot for a video without
a caption.

The video fills the article width in a 16:9 black frame without cropping. It
uses native controls, starts muted, allows inline playback, and waits to load
until played. It does not autoplay or loop. Playback and caption checks run
with `npm run test:video-pair`.
