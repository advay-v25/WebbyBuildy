/* eslint-disable */
const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// 1. Update text colors logic based on data-theme
css = css.replace(
  /:root {([\s\S]*?--font-sans:[^;]+;\n}/,
  `:root {
  --accent: #E63946;
  --black: #0A0A0A;
  --charcoal: #222222;
  --gray-mid: #8A8A8A;
  --gray-light: #E5E5E5;
  --off-white: #F7F5F2;
  --text-light: #FFFFFF;
  --text-muted-light: #A0A0A0;
  --text-dark: #0A0A0A;
  --text-muted-dark: #555555;
  --bg-color: var(--black);
  --text-color: var(--text-light);
  --text-muted-color: var(--text-muted-light);
  --font-sans: 'Inter', sans-serif;
}

body[data-theme="dark"] {
  --text-color: var(--text-light);
  --text-muted-color: var(--text-muted-light);
}

body[data-theme="light"] {
  --text-color: var(--text-dark);
  --text-muted-color: var(--text-muted-dark);
}`
);

// 2. Change body transition
css = css.replace(
  /transition: background-color 0.1s ease-out, color 0.3s ease;/,
  `transition: background-color 0.1s ease-out, color 0.15s ease;`
);

// 3. Work Section and Cards styling
const workGridStyles = `
/* Work Section */
.work-section {
  position: relative;
  background-color: var(--bg-color); /* ensures opacity to hide DNA */
  z-index: 20;
}

.dna-placeholder-container {
  display: none;
}

.work-content {
  max-width: 1200px;
  width: 100%;
}

.work-grid {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-bottom: 6rem;
  width: 100%;
  align-items: stretch;
}

.work-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #141414;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: flex-basis 0.35s ease, transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
  will-change: flex-basis, transform, opacity;
}

/* Hover expansion */
@media (min-width: 769px) {
  .work-grid:has(.work-card:hover) .work-card:not(:hover) {
    flex: 0.7;
    opacity: 0.4;
    transform: scale(0.98);
  }
  .work-grid .work-card:hover {
    flex: 1.5;
    transform: translateY(-4px) scale(1.02);
    border-color: var(--accent);
    box-shadow: 0 10px 30px rgba(230, 57, 70, 0.15);
    opacity: 1;
    z-index: 2;
  }
}

.work-card-content h3 {
  color: #FFFFFF;
}

.work-card-content p, .work-card-content .pull-quote {
  color: #A0A0A0;
}

@media (max-width: 768px) {
  .work-grid {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 2rem;
    scrollbar-width: none; /* Firefox */
  }
  .work-grid::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  .work-card {
    min-width: 85vw;
    scroll-snap-align: center;
  }
}

.client-type {
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  display: block;
}

.work-details {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.built-in {
  color: #A0A0A0;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.pull-quote {
  font-size: 1rem;
  font-style: italic;
  border-left: 2px solid var(--accent);
  padding-left: 1rem;
  color: #A0A0A0;
}
`;

// Replace everything from /* Work Section */ to the start of /* About Section */
const regexWorkSection = /\/\* Work Section \*\/[\s\S]*?(?=\/\* About Section \*\/)/;
css = css.replace(regexWorkSection, workGridStyles);

fs.writeFileSync('src/app/globals.css', css);
console.log('CSS updated successfully');
