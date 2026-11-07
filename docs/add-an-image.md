# How to add an image

1. Put a descriptive image file, such as `garden.jpg`, in `src/assets/images/`.
2. In a `.mdx` file directly inside `src/content/blog/` or `src/content/stories/`, add this body image below the frontmatter. Replace the filename and describe the image in the square brackets.

   ```mdx
   ![A garden path lined with lavender](../../assets/images/garden.jpg)
   ```

3. For an optional hero image above the title, add `heroImage: ../../assets/images/garden.jpg` inside the frontmatter. Hero images have empty alternative text; keep any essential information in the body.
4. For a reading note, put the image beside its work's `work.md` and use `../garden.jpg` in the note. For a reading-list cover, add `thumbnail: ./garden.jpg` to `work.md` instead. Paths are relative to the file that uses them.
5. [Preview locally](preview-locally.md) and check the image on the content page, then [deploy changes](deploy-changes.md).
