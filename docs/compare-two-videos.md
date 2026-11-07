# How to compare two videos

1. Put both videos in `public/videos/` and their poster images in `public/images/`. Create the folders if needed.
2. Add this below the frontmatter in a `.mdx` post or story. Replace both sets of filenames, labels, and source details.

   ```mdx
   import VideoPair from '../../components/VideoPair.astro';

   <VideoPair
     left={{
       src: '/videos/before.mp4',
       poster: '/images/before.jpg',
       label: 'Garden before planting',
     }}
     right={{
       src: '/videos/after.mp4',
       poster: '/images/after.jpg',
       label: 'Garden after planting',
     }}
   >

   The garden before and after planting.[^video-sources]

   </VideoPair>

   [^video-sources]: Creators, titles, source links, and licenses or permissions.
   ```

3. Keep blank lines around the shared caption. Each player needs a video URL, poster URL, and descriptive `label`. In a reading update, use `../../../../components/VideoPair.astro` for the import.
4. [Preview locally](preview-locally.md) at wide and narrow widths. Check both players and the caption; playback is independent. Provide transcripts for meaningful speech, then [deploy changes](deploy-changes.md).
