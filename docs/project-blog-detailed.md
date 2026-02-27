# Building a Windows 11 Style Portfolio with React + TypeScript

## Table of Contents

- [1) Why this project exists and what it does](#1-why-this-project-exists-and-what-it-does)
- [2) Unique points](#2-unique-points)
- [5) File-by-file code explanation](#5-file-by-file-code-explanation)
- [6) Features list](#6-features-list)
- [7) How anyone can personalize this project](#7-how-anyone-can-personalize-this-project)
- [8) Screenshots of project](#8-screenshots-of-project)

## 1) Why this project exists and what it does

- Recreates a Windows 11 inspired desktop in the browser.
- Provides app-like windows for About, Projects, Gallery, Blogs, Jobs, Timeline, Contact, Settings, and Terminal.
- Supports window behaviors: open, close, drag, resize, minimize, maximize.
- Adds Start Menu + Taskbar + Search interactions.
- Includes theme system with multiple visual presets and persistence.
- Includes terminal command interface for navigation and discovery.

## 2) Unique points

This portfolio is intentionally engineered as an interactive frontend system, not a static page. The unique value is in how familiar desktop UX is combined with typed app state and modular rendering.

### What is technically unique

1. **Windowed portfolio architecture**
   - Every section behaves like an app window (open, drag, resize, minimize, maximize, close).
2. **Single-source typed state model**
   - App IDs and window state are strongly typed, reducing invalid transitions.
3. **Command-driven terminal app**
   - Terminal is integrated with app controls (`open`, `close`, theme/sound toggles).
4. **Theme-aware UI and terminal**
   - One active theme updates shell chrome, panel visuals, and terminal palette.
5. **Content-driven rendering**
   - Portfolio data is separated into JSON and parsed into TypeScript types.
6. **Reproducible static deployment**
   - Vite output is deterministic (`app.js`, `style.css`) and works with relative paths.

### Core functionality flow

1. UI interaction triggers a handler in `App.tsx`.
2. Handler updates typed state records (`positions`, `sizes`, `windows`, etc.).
3. `DesktopWindows.tsx` rerenders shell-level windows.
4. `WindowPanels.tsx` renders content based on active `AppId`.
5. CSS theme class controls visual tokens across all modules.

## 5) File-by-file code explanation

This section maps each file to its runtime role and the exact edits needed to reproduce the portfolio for another person.

### Root + build

- `package.json`
  - Scripts and dependency versions.
  - Edit only project metadata unless changing tooling.
- `vite.config.ts`
  - Build behavior (`base`, output names).
  - Keep `base: './'` for portable static hosting.

### App bootstrap

- `src/main.tsx`
  - App entry mount.
  - Edit only if adding providers/boundaries.
- `src/index.css`
  - Global baseline styles.
  - Edit base typography/body defaults.

### Core shell

- `src/App.tsx`
  - Central state machine for windows, search, theme, sound, terminal.
  - Primary edit point for app behavior and terminal commands.
- `src/App.css`
  - Desktop shell visuals, window chrome, taskbar/start, terminal themes.
  - Primary edit point for branding and theme tokens.

### App modules (`src/app/*`)

- `types.ts`
  - Defines `AppId` and state contracts.
  - Update first when adding a new app.
- `constants.ts`
  - Pinned apps, initial positions/sizes, theme options.
  - Update default records for every new app id.
- `icons.tsx`
  - SVG icon components used across shell.
  - Swap icons for personal branding.
- `DesktopWindows.tsx`
  - Desktop shortcuts + window shell rendering.
  - Update app shortcut visibility and window labels.
- `StartMenu.tsx`
  - Start menu structure and pinned app actions.
  - Update launcher grouping/order.
- `Taskbar.tsx`
  - Dock and tray behavior.
  - Update quick actions and running indicators.
- `WindowPanels.tsx`
  - Panel content switch by `AppId` + terminal UI.
  - Update content blocks and terminal prompt/presentation.

### Data layer (`src/data/*`)

- `portfolio-content.json`
  - Main personalization file (about, jobs, projects, blogs, contact).
- `portfolioData.ts`
  - Typed parser for content schema.
  - Update types if JSON schema changes.

## 6) Features list

### Core functionality

1. Windows-style desktop shell with app-like navigation.
2. Start menu + taskbar launch and state indicators.
3. Window system:
   - open/close
   - minimize/maximize/restore
   - drag and resize
4. Search across portfolio entities.
5. Theming with persistent preference.
6. Sound toggle with persistent preference.
7. Terminal app with command parser and history.
8. Data-driven panels fed from typed JSON content.
9. Responsive layout for desktop/tablet/mobile.

### Terminal-focused functionality

- Command execution pipeline (input -> parse -> route -> output).
- History navigation with keyboard controls.
- Autocomplete support.
- Alias support for common commands.
- Commands that can control app/window behavior.

### Reproduction-critical functionality checklist

- [ ] Data source decoupled from UI (`portfolio-content.json`).
- [ ] Every `AppId` has complete defaults in state records.
- [ ] Theme options and CSS theme blocks are aligned.
- [ ] Desktop + Start + Taskbar expose the same app ids.
- [ ] Terminal command routing uses valid app ids and handlers.

## 7) How anyone can personalize this project

### Minimal reproduction path (fastest)

1. Clone repo and install dependencies.
2. Run `npm run dev` and verify baseline app starts.
3. Replace content in `src/data/portfolio-content.json`.
4. Replace resume file + link target.
5. Add gallery images to `public/gallery/`.
6. Update social/contact links.
7. Tune theme variables in `src/App.css`.
8. Build and preview with `npm run build && npm run preview`.

### What to edit for another person (exact map)

1. **Profile and experience data**
   - Edit `src/data/portfolio-content.json`:
   - `about`, `jobs`, `projects`, `blogs`, `certifications`, `contact`.
2. **Resume and links**
   - Replace resume file and update `contact.links` resume `href`.
3. **Theme and visual branding**
   - Edit `src/App.css` (theme tokens, wallpaper, shadows, terminal colors).
   - Optionally edit `src/app/icons.tsx` for custom icon shapes.
4. **Window defaults and app catalog**
   - Edit `src/app/constants.ts` for pinned apps, positions, and sizes.
5. **Add/remove app panels**
   - Update `src/app/types.ts` (`AppId`), then sync
     `constants.ts`, `DesktopWindows.tsx`, `StartMenu.tsx`,
     `Taskbar.tsx`, and `WindowPanels.tsx`.
6. **Terminal behavior**
   - Edit command router in `src/App.tsx`.
   - Edit terminal UI in `src/app/WindowPanels.tsx`.
   - Edit terminal theme variables in `src/App.css`.

### Personalization pitfalls to avoid

- Missing default state entries for a newly added app id.
- Adding a theme name without a matching CSS theme block.
- Breaking type parity between JSON content and `PortfolioData`.
- Updating only one launcher surface (desktop/start/taskbar) for app ids.

## 8) Screenshots of project

> Recommended: create `docs/screenshots/` and store all screenshots there.

## Suggested screenshots to add

1. Desktop Home - `docs/screenshots/01-desktop-home.png`
2. Start Menu Open - `docs/screenshots/02-start-menu.png`
3. Projects Window - `docs/screenshots/03-projects-window.png`
4. Terminal (Oceanic Theme) - `docs/screenshots/06-terminal-oceanic.png`
5. Mobile Responsive View - `docs/screenshots/07-mobile-view.png`

## Markdown embed template

```md
### Desktop Home
![Desktop Home](./screenshots/01-desktop-home.png)

### Start Menu
![Start Menu](./screenshots/02-start-menu.png)

### Terminal (Oceanic)
![Terminal Oceanic](./screenshots/06-terminal-oceanic.png)
```
