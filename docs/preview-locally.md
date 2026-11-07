# How to preview locally

1. Open a terminal in the repository root, `personal-website/`. Install Node.js and npm if the `npm` command is unavailable.
2. Install the project's dependencies on first use or after they change:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed in the terminal. Check the page you edited; saved changes appear automatically. Blog and story drafts are visible in this mode.
5. To check production output, stop the server with Ctrl+C, then run `npm run build` followed by `npm run preview`. Open the printed URL. Production output excludes ordinary drafts; shared blog previews remain available at their token URLs.
6. Stop the server with Ctrl+C when finished. To make changes live, follow [Deploy changes](deploy-changes.md).
