# Running locally

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Build for production:
   - `npm run build`
4. Preview production build:
   - `npm run preview`

# GitHub Pages deployment

1. Update the repo name in `vite.config.ts`:
   - `const repoName = "YOUR_REPO_NAME";`
   - Example: if your repo is `https://github.com/yourname/sahil21bday`, use `const repoName = "sahil21bday";`
2. Build output goes to `dist/` (`npm run build`).
3. GitHub Pages settings:
   - Set Pages source to the `gh-pages` branch (recommended) or use GitHub Actions.
   - If using a `gh-pages` branch, publish the `dist/` folder.
4. Optional deployment command (one-time install):
   - `npm install -D gh-pages`
   - `npx gh-pages -d dist`

# Notes

- Vite base path: set in `vite.config.ts` via `base: "/YOUR_REPO_NAME/"`.
- Canvas renders at a small virtual resolution and is scaled up via CSS to keep crisp pixels.
- Add photos to `src/assets/images/` and fill in sign writeups in `src/main.ts`.
