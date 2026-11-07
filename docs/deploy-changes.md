# How to deploy changes

Run these commands from the repository root. Replace the sample file and commit message with your own.

1. Confirm `git branch --show-current` prints `main`. Review `git status --short` and `git diff`; open any new files too. Include only changes you intend to publish. Reading entries have no draft mode.
2. Build the production site and fix any reported errors before continuing:

   ```sh
   npm run build
   ```

3. Stage specific files. List each intended path; avoid staging unrelated changes.

   ```sh
   git add src/content/blog/my-new-post.mdx
   ```

4. Check `git diff --cached` and `git status --short`, then commit:

   ```sh
   git commit -m "Publish my new post"
   ```

5. Push to the live site's main branch:

   ```sh
   git push origin main
   ```

6. Open the site's project in the Vercel dashboard. Wait for the production deployment for your commit to show Ready. If it fails, inspect the build logs, fix the issue, and repeat these steps.
7. Open the affected page at [davidamoswrites.com](https://davidamoswrites.com). Check the content, links, and any media. A successful local build alone does not update the live site.
