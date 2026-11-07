# How to add a video

1. Put your video in `public/videos/` and a still image in `public/images/`. Create the folders if needed.
2. In a `.mdx` post or story, add this below the closing frontmatter delimiter. Replace the filenames, player label, caption, and source details.

   ```mdx
   import VideoFigure from '../../components/VideoFigure.astro';

   <VideoFigure
     src="/videos/garden.mp4"
     poster="/images/garden-poster.jpg"
     label="Walking along a garden path"
   >

   A walk through the garden.[^video-source]

   </VideoFigure>

   [^video-source]: Creator, video title, source link, and license or permission.
   ```

3. Keep blank lines around the caption so Markdown and footnotes work. The caption is optional; the video URL, poster URL, and descriptive `label` are required. Public file URLs omit `public/`.
4. In a reading update, change the import to `../../../../components/VideoFigure.astro`. Videos with meaningful speech also need a transcript or another way to provide that information.
5. [Preview locally](preview-locally.md), play the video, and check the caption before you [deploy changes](deploy-changes.md).
