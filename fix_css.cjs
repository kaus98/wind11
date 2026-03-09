const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'App.css');
const content = fs.readFileSync(cssPath, 'utf8');

const lines = content.split('\n');

// Find where the corrupted text starts (after typewriter-blink keyframes)
// Actually we know it's around line 4283.
let cutIndex = lines.findIndex(line => line.includes('C l o c k'));
if (cutIndex === -1) {
    // maybe it's purely null bytes, let's just cut at the known line 4283
    // Line 4283 in 1-indexed is index 4282. But let's find the closing brace of typewriter-blink
    cutIndex = lines.findIndex((line, idx) => line.includes('opacity: 0;') && lines[idx + 2] === '}') + 3;
}

if (cutIndex > 0 && cutIndex < lines.length) {
    const goodLines = lines.slice(0, cutIndex);

    const validCSS = `
/* Clock and Calendar Widget */
.desktop-widgets {
  position: absolute;
  top: 18px;
  right: 68px; /* Room for social rail */
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1; /* Below windows */
}

.clock-calendar-widget {
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 16px;
  width: 280px;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.clock-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.clock-time {
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
  letter-spacing: -0.5px;
}

.clock-date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

.calendar-header {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  border-radius: 4px;
}

.calendar-cell:not(.empty):not(.day-name):hover {
  background: rgba(255, 255, 255, 0.1);
  cursor: default;
}

.calendar-cell.day-name {
  font-weight: 600;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.calendar-cell.today {
  background: rgba(59, 130, 246, 0.8);
  color: white;
  font-weight: 600;
}

/* Context Menu */
.context-menu {
  position: absolute;
  z-index: 9999;
  background: rgba(30, 41, 59, 0.65);
  backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 6px;
  min-width: 220px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  color: #fff;
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.context-menu-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 150ms ease;
  user-select: none;
}

.context-menu-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.context-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 4px 0;
}

/* System Tray Flyout */
.system-tray-flyout {
  position: absolute;
  bottom: 60px;
  right: 12px;
  width: 320px;
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: flyoutSlide 0.2s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

@keyframes flyoutSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flyout-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
}

.flyout-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.flyout-row.mt-2 {
  margin-top: 12px;
}

.flyout-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.flyout-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flyout-title {
  font-weight: 500;
  font-size: 0.95rem;
}

.flyout-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

.flyout-slider-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.flyout-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
}

.flyout-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.flyout-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

/* Markdown Reader */
.markdown-reader-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.md-back-btn {
  align-self: flex-start;
  background: transparent;
  color: #3b82f6;
  border: none;
  font-size: 0.95rem;
  padding: 8px 0;
  cursor: pointer;
  margin-bottom: 16px;
  font-weight: 500;
}

.md-back-btn:hover {
  text-decoration: underline;
}

.markdown-reader-content {
  flex: 1;
  overflow-y: auto;
  line-height: 1.6;
  font-size: 0.95rem;
}

.markdown-reader-content h1,
.markdown-reader-content h2,
.markdown-reader-content h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-reader-content h1 {
  font-size: 1.75em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.3em;
}

.markdown-reader-content h2 {
  font-size: 1.4em;
}

.markdown-reader-content h3 {
  font-size: 1.2em;
}

.markdown-reader-content p,
.markdown-reader-content ul,
.markdown-reader-content ol {
  margin-bottom: 1.25em;
}

.markdown-reader-content ul {
  list-style-type: disc;
  padding-left: 1.5em;
}

.markdown-reader-content pre {
  background: rgba(0, 0, 0, 0.5);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1.25em;
}

.markdown-reader-content code {
  font-family: monospace;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-reader-content pre code {
  background: transparent;
  padding: 0;
}

/* Window Animations & Glassmorphism */
.window {
  animation-duration: 0.2s;
  animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1);
  animation-fill-mode: forwards;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
}

.window-enter {
  animation-name: windowPopIn;
}

.window-exit {
  animation-name: windowPopOut;
}

@keyframes windowPopIn {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes windowPopOut {
  0% { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.95) translateY(10px); }
}

/* Base Semi-Transparent Backgrounds for Light/Dark themes to support Mica/Glass */
.w11.light .window {
  background: rgba(255, 255, 255, 0.65);
}

.w11.aurora .window, .w11.matrix .window, .w11.retro .window, .w11.solar .window {
  background: var(--bg-fallback, color-mix(in srgb, currentColor 10%, transparent));
}

.taskbar,
.start,
.search-results-window {
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
}
`;

    fs.writeFileSync(cssPath, goodLines.join('\n') + '\n' + validCSS, 'utf8');
    console.log('Fixed App.css successfully.');
} else {
    console.error('Could not find the cut index.');
}
