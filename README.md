# Kaustubh Pathak Portfolio (Windows 11 Style)

A desktop-inspired portfolio built with **React + TypeScript + Vite**.

The UI mimics a Windows 11 environment with draggable app windows, taskbar/start menu interactions, search, theme switching, and social/contact integrations.

---

## Features

- Windows-style desktop layout with:
  - Start menu
  - Taskbar + tray actions
  - Search panel
  - Multiple app windows (About, Projects, Blogs, Jobs, Contact)
- Draggable, minimizable, maximizable windows
- Light/Dark theme toggle with localStorage persistence
- Sound control with user-gesture enable support
- Right-side floating social rail (Instagram, GitHub, LinkedIn, Kaggle)
- Responsive behavior for desktop/tablet/mobile
- Content sourced from a **JSON file** (`portfolio-content.json`)

---

## Screenshot

> Add your latest screenshot at `docs/screenshots/portfolio-home.png` and keep this section updated.

![Portfolio Home Screen](docs/screenshots/portfolio-home.png)

---

## Tech Stack

- **React 19**
- **TypeScript 5**
- **Vite 7**
- **CSS (custom, no UI framework)**
- ESLint for linting

See dependencies in `package.json`.

---

## Project Structure

```text
portfolio/
├─ src/
│  ├─ App.tsx                  # Main UI and app logic
│  ├─ App.css                  # Full styling and responsive rules
│  ├─ main.tsx                 # React entry point
│  ├─ data/
│  │  ├─ portfolio-content.json # Content source (direct JSON)
│  │  └─ portfolioData.ts       # Parses JSON raw content into typed data
│  └─ assets/
├─ public/
├─ vite.config.ts              # Relative base + output naming
└─ package.json
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build production bundle

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

---

## Scripts

- `npm run dev` — starts Vite dev server
- `npm run build` — type-checks and builds app
- `npm run lint` — runs ESLint
- `npm run preview` — serves built output locally

---

## Content Management (Important)

All portfolio data is now maintained in:

- `src/data/portfolio-content.json`

The app reads this file as raw JSON (`?raw`) and parses it via:

- `src/data/portfolioData.ts`

### Editable content sections

- `about`
- `socialLinks`
- `contact`
- `jobs`
- `blogs`
- `projects`
- `certifications`

### Update workflow

1. Edit JSON content inside `portfolio-content.json`
2. Save file
3. Run `npm run dev` or `npm run build`

> Keep JSON valid (quotes, commas, brackets) or parsing will fail at runtime/build time.

---

## Theming

- Theme state is persisted in `localStorage` with key: `w11-theme`
- Sound preference persists with key: `w11-muted`
- Theme can be toggled from tray and start options

---

## Build Output Behavior

`vite.config.ts` is configured to:

- Use relative base path (`base: './'`) for static hosting/subfolder usage
- Output predictable files:
  - JS entry: `dist/app.js`
  - CSS: `dist/style.css`

---

## Deployment

Because Vite is configured with `base: './'` in `vite.config.ts`, this project works well with static hosting.

### Option 1: GitHub Pages (recommended for this repo)

1. Build locally:

```bash
npm install
npm run build
```

2. Push the project to GitHub.
3. Deploy the `dist/` folder using either:
   - a GitHub Action workflow, or
   - `gh-pages` branch publishing.
4. In repository settings, set **Pages** source to the deployed branch/folder.

Minimal GitHub Actions workflow example (`.github/workflows/deploy.yml`):

```yml
name: Deploy Portfolio

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Option 2: Netlify

1. Connect the GitHub repository in Netlify.
2. Set build command:

```bash
npm run build
```

3. Set publish directory:

```text
dist
```

4. Deploy.

### Option 3: Vercel

1. Import project in Vercel.
2. Framework preset: **Vite**.
3. Build command:

```bash
npm run build
```

4. Output directory:

```text
dist
```

5. Deploy.

### Option 4: Any Static Server

After build, serve the `dist/` folder with any static host (Nginx, Apache, S3 + CloudFront, etc.).

---

## Notes

- If media assets are missing, Vite may warn but build can still succeed.
- For social/contact links, keep `https://` URLs for external pages.
- Resume download link currently points to `./Kaustubh_Pathak_Resume.pdf`.

---

## Future Improvements (Optional)

- Add schema validation for `portfolio-content.json` before parse
- Add unit tests for content parser and data contract
- Add E2E tests for window interactions/theme toggle/search

---

## License

Personal portfolio project.
