# Deploy to GitHub Pages

This project is a Vite app configured for GitHub Pages at:

`https://<your-github-username>.github.io/sahil21bday/`

## One-time setup

### 1. Confirm the repo name in `vite.config.ts`

The `base` path must match your GitHub repo name:

```ts
const repoName = "sahil21bday";
```

If your repo is named something else (e.g. `sahil-bday`), change `repoName` to match exactly.

### 2. Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-github-username>/sahil21bday.git
git push -u origin main
```

Replace `<your-github-username>` with your GitHub username.

---

## Deploy (recommended: `gh-pages` package)

`gh-pages` is already listed in `devDependencies`.

### 1. Install dependencies

```bash
npm install
```

### 2. Build and publish

```bash
npm run build
npx gh-pages -d dist
```

The first deploy creates a `gh-pages` branch on your remote with the built site.

### 3. Enable GitHub Pages

In your repo on GitHub:

1. Go to **Settings → Pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Set **Branch** to `gh-pages` and folder to `/ (root)`
4. Click **Save**

After a minute or two, the site should be live at:

`https://<your-github-username>.github.io/sahil21bday/`

### 4. Redeploy after changes

Whenever you update the game or add images:

```bash
npm run build
npx gh-pages -d dist
```

---

## Optional: add a deploy script

Add this to `package.json` under `"scripts"`:

```json
"deploy": "npm run build && gh-pages -d dist"
```

Then deploy with:

```bash
npm run deploy
```

---

## Troubleshooting

### Blank page or 404 on refresh

- Check that `repoName` in `vite.config.ts` matches your GitHub repo name exactly (case-sensitive).
- Rebuild and redeploy: `npm run build && npx gh-pages -d dist`

### Images not showing

- Put photos in `src/assets/images/` with names like `sign_01.jpeg`, `sign_02.jpeg`, etc.
- Rebuild before deploying — Vite bundles images at build time.

### Site not updating

- Hard-refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).
- Confirm the latest deploy finished under **Settings → Pages** or the **Actions** tab.

### Wrong URL

This project is set up for a **project site** (`username.github.io/repo-name`), not a user root site. If you use a custom domain or a user/org root site, update `base` in `vite.config.ts` accordingly (often `base: "/"` for a root site).
