const fs = require('fs');
const cssPath = 'src/App.css';
let css = fs.readFileSync(cssPath, 'utf8');

const toggleCSS = `
/* Windows 11 Style Toggle Switch */
.w11-toggle {
  appearance: none;
  -webkit-appearance: none;
  width: 44px;
  height: 22px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background 0.2s ease, border-color 0.2s ease;
  flex-shrink: 0;
  margin: 0;
}

.w11-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.w11-toggle:checked {
  background: #3b82f6; /* Accent color */
  border-color: transparent;
}

.w11-toggle:checked::after {
  transform: translateX(22px);
  background: #fff;
}

.w11-toggle:hover:not(:checked) {
  background: rgba(255, 255, 255, 0.25);
}

.w11-toggle:checked:hover {
  background: #2563eb;
}

.w11.light .w11-toggle {
  background: rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.3);
}

.w11.light .w11-toggle::after {
  background: rgba(0, 0, 0, 0.6);
}

.w11.light .w11-toggle:hover:not(:checked) {
  background: rgba(0, 0, 0, 0.25);
}

.w11.light .w11-toggle:checked::after {
  background: #fff;
}
`;

if (!css.includes('.w11-toggle')) {
    css = css.replace('/* Context Menu */', toggleCSS + '\n/* Context Menu */');
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Added w11-toggle css to App.css');
} else {
    console.log('w11-toggle already exists');
}
