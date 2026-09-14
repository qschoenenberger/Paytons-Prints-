# Payton's Prints React Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Vite + React + TypeScript site under `site/` that replaces the Squarespace storefront, and a GitHub Actions workflow that builds and deploys it to GitHub Pages on every push to `main`.

**Architecture:** A single-page React app (React Router v6, client-side routing) with six routes — Home, Shop, per-product detail, Gallery, About, Contact — built entirely from static data (`src/data/products.ts`) and local images. No backend: checkout goes through per-product Stripe Payment Links, and the Contact form posts directly to Formspree from the browser.

**Tech Stack:** Vite 5, React 18, TypeScript 5, React Router 6. Plain CSS (custom properties + CSS Modules) — no CSS framework. GitHub Actions + `actions/deploy-pages` for CI/CD.

**Spec:** `docs/superpowers/specs/2026-09-14-react-site-design.md`

## Global Constraints

- Fully static site — no backend server, no Node/Express process, no Railway or similar host.
- App code lives under the top-level `site/` directory in this repo.
- Checkout: Stripe Payment Links only, one per product, no cart.
- Contact/commissions form: Formspree only.
- External account IDs (Stripe Payment Links, Formspree endpoint) are not knowable by the
  implementer — wire them as clearly marked `TODO(Quinn)` placeholders, never fabricated IDs.
- No automated test framework (static content/shop site, no complex logic — matches this
  repo's "no tooling unless needed" convention in root `CLAUDE.md`). Verification = a
  successful `npm run build` (includes a full `tsc --noEmit` type check) plus a manual
  click-through of every page in Chrome.
- Vite `base` is `/Paytons-Prints-/` (matches the GitHub repo `qschoenenberger/Paytons-Prints-`)
  until a custom domain is configured — that's an out-of-scope follow-up per the spec.
- Deploy trigger: push to `main` touching `site/**` or the workflow file itself.

---

### Task 1: Project scaffold

**Files:**
- Create: `site/package.json`
- Create: `site/tsconfig.json`
- Create: `site/vite.config.ts`
- Create: `site/index.html`
- Create: `site/public/404.html`
- Create: `site/.gitignore`
- Create: `site/src/main.tsx`
- Create: `site/src/App.tsx`

**Interfaces:**
- Produces: a buildable Vite React TS project at `site/` with `npm run build` / `npm run dev`
  / `npm run preview` scripts. Later tasks add to `src/` inside this scaffold.

- [ ] **Step 1: Create `site/package.json`**

```json
{
  "name": "paytons-prints-site",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.2"
  }
}
```

- [ ] **Step 2: Create `site/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 3: Create `site/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Paytons-Prints-/',
  plugins: [react()],
});
```

- [ ] **Step 4: Create `site/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payton's Prints | Custom Pen &amp; Ink Illustrations</title>
    <meta name="description" content="Custom pen and ink illustrations and prints by Payton's Prints." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap"
      rel="stylesheet"
    />
    <script>
      // Restores the real path after public/404.html's GitHub Pages SPA redirect.
      // https://github.com/rafgraph/spa-github-pages
      (function (l) {
        if (l.search[1] === '/') {
          var decoded = l.search
            .slice(1)
            .split('&')
            .map(function (s) {
              return s.replace(/~and~/g, '&');
            })
            .join('?');
          window.history.replaceState(null, '', l.pathname.slice(0, -1) + decoded + l.hash);
        }
      })(window.location);
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `site/public/404.html`**

GitHub Pages has no server-side rewrites, so a direct link to e.g. `/shop` 404s. This file
redirects any 404 back through `index.html`, which decodes it (script above) so React Router
ends up on the right client-side route.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Payton's Prints</title>
    <script>
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 1; // keeps the "/Paytons-Prints-" repo segment
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 6: Create `site/.gitignore`**

```
node_modules
dist
.env
.env.local
```

- [ ] **Step 7: Create `site/src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 8: Create `site/src/App.tsx`**

```tsx
export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Payton's Prints</h1>
      <p>Site scaffold running.</p>
    </div>
  );
}
```

- [ ] **Step 9: Install dependencies and verify the build**

Run:
```bash
cd site && npm install
```
Expected: installs cleanly, creates `site/package-lock.json` and `site/node_modules/`.

Run:
```bash
cd site && npm run build
```
Expected: `tsc --noEmit` reports no errors, `vite build` succeeds, `site/dist/index.html` exists.

- [ ] **Step 10: Commit**

```bash
git add site/package.json site/package-lock.json site/tsconfig.json site/vite.config.ts \
  site/index.html site/public/404.html site/.gitignore site/src/main.tsx site/src/App.tsx
git commit -m "$(cat <<'EOF'
Scaffold Vite + React + TypeScript site

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 2: Design tokens and global styles

**Files:**
- Create: `site/src/styles/tokens.css`
- Create: `site/src/styles/global.css`
- Modify: `site/src/main.tsx` (import the two stylesheets)

**Interfaces:**
- Consumes: nothing new.
- Produces: CSS custom properties (`--color-bg`, `--color-bg-alt`, `--color-ink`,
  `--color-ink-soft`, `--color-accent`, `--color-accent-soft`, `--color-border`,
  `--font-display`, `--font-body`, `--space-1`..`--space-5`, `--radius`, `--max-width`) and a
  global `.container` utility class, both available to every component/page from here on.

- [ ] **Step 1: Create `site/src/styles/tokens.css`**

Palette and type pulled from the existing logo (`logo/Paytons Prints Logo - Front.png`): pale
cool-gray background, charcoal ink, serif display face, with a warm terracotta accent.

```css
:root {
  --color-bg: #eef0f2;
  --color-bg-alt: #ffffff;
  --color-ink: #201f1d;
  --color-ink-soft: #55524c;
  --color-accent: #a6552f;
  --color-accent-soft: #c98a63;
  --color-border: #d8d3cb;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;

  --radius: 4px;
  --max-width: 1100px;
}
```

- [ ] **Step 2: Create `site/src/styles/global.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4 {
  font-family: var(--font-display);
  color: var(--color-ink);
  margin: 0 0 var(--space-2);
  letter-spacing: 0.02em;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}

button {
  font-family: var(--font-body);
  cursor: pointer;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
}
```

- [ ] **Step 3: Modify `site/src/main.tsx`** — add the two imports above the `App` import

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: Verify the build**

Run: `cd site && npm run build`
Expected: succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add site/src/styles site/src/main.tsx
git commit -m "$(cat <<'EOF'
Add design tokens and global styles

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 3: Layout shell, routing, and page stubs

**Files:**
- Create: `site/src/components/Nav.tsx`
- Create: `site/src/components/Nav.module.css`
- Create: `site/src/components/Footer.tsx`
- Create: `site/src/components/Footer.module.css`
- Create: `site/src/router.tsx`
- Create: `site/src/pages/Home.tsx`
- Create: `site/src/pages/Shop.tsx`
- Create: `site/src/pages/ProductDetail.tsx`
- Create: `site/src/pages/Gallery.tsx`
- Create: `site/src/pages/About.tsx`
- Create: `site/src/pages/Contact.tsx`
- Modify: `site/src/App.tsx` (replace entire contents — becomes the route Layout)
- Modify: `site/src/main.tsx` (replace entire contents — renders `RouterProvider`)

**Interfaces:**
- Consumes: `.container` utility and CSS tokens from Task 2.
- Produces: `Nav` (no props), `Footer` (no props), `router` (default export of `router.tsx`,
  a `RouterProvider`-compatible router with routes `/`, `/shop`, `/shop/:productId`,
  `/gallery`, `/about`, `/contact`). Page components in this task are minimal stubs that
  Tasks 4–8 replace entirely.

- [ ] **Step 1: Create `site/src/components/Nav.tsx`**

```tsx
import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand}>
          Payton&rsquo;s Prints
        </NavLink>
        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `site/src/components/Nav.module.css`**

```css
.header {
  background: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-2);
  padding-bottom: var(--space-2);
  flex-wrap: wrap;
  gap: var(--space-2);
}
.brand {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--color-ink);
  text-decoration: none;
  letter-spacing: 0.03em;
}
.nav {
  display: flex;
  gap: var(--space-3);
}
.link {
  font-family: var(--font-body);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-ink-soft);
  text-decoration: none;
}
.link:hover {
  color: var(--color-accent);
  text-decoration: none;
}
.active {
  color: var(--color-accent);
}
```

- [ ] **Step 3: Create `site/src/components/Footer.tsx`**

```tsx
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>&copy; {new Date().getFullYear()} Payton&rsquo;s Prints. Custom pen and ink illustrations.</p>
        <Link to="/contact">Request a custom drawing</Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create `site/src/components/Footer.module.css`**

```css
.footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-5);
  padding: var(--space-3) 0;
  color: var(--color-ink-soft);
  font-size: 0.85rem;
}
.inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-1);
}
```

- [ ] **Step 5: Create minimal stub pages**

`site/src/pages/Home.tsx`:
```tsx
export default function Home() {
  return (
    <div className="container">
      <h1>Home</h1>
    </div>
  );
}
```

`site/src/pages/Shop.tsx`:
```tsx
export default function Shop() {
  return (
    <div className="container">
      <h1>Shop</h1>
    </div>
  );
}
```

`site/src/pages/ProductDetail.tsx`:
```tsx
export default function ProductDetail() {
  return (
    <div className="container">
      <h1>Product Detail</h1>
    </div>
  );
}
```

`site/src/pages/Gallery.tsx`:
```tsx
export default function Gallery() {
  return (
    <div className="container">
      <h1>Gallery</h1>
    </div>
  );
}
```

`site/src/pages/About.tsx`:
```tsx
export default function About() {
  return (
    <div className="container">
      <h1>About</h1>
    </div>
  );
}
```

`site/src/pages/Contact.tsx`:
```tsx
export default function Contact() {
  return (
    <div className="container">
      <h1>Contact</h1>
    </div>
  );
}
```

- [ ] **Step 6: Create `site/src/router.tsx`**

```tsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: 'shop', element: <Shop /> },
        { path: 'shop/:productId', element: <ProductDetail /> },
        { path: 'gallery', element: <Gallery /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
```

- [ ] **Step 7: Replace `site/src/App.tsx` entirely**

```tsx
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 8: Replace `site/src/main.tsx` entirely**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/tokens.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

- [ ] **Step 9: Build and click through routing**

Run: `cd site && npm run build`
Expected: succeeds with no errors.

Run: `cd site && npm run preview` (leave running)
Using claude-in-chrome, navigate to the printed local URL and click each of the five nav
links (Home, Shop, Gallery, About, Contact). Expected: each route renders its stub heading,
the active link highlights in the nav, and `read_console_messages` shows no errors. Stop the
preview server afterward.

- [ ] **Step 10: Commit**

```bash
git add site/src/components site/src/pages site/src/router.tsx site/src/App.tsx site/src/main.tsx
git commit -m "$(cat <<'EOF'
Add layout shell, routing, and page stubs

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 4: Product data, Shop grid, and product detail page

**Files:**
- Create: `site/src/assets/shop/wisconsin-print.jpg` (copied from `Marketing/design-canvas/images/wisconsin.jpg`)
- Create: `site/src/assets/shop/bagel-deli-placeholder.svg`
- Create: `site/src/data/products.ts`
- Create: `site/src/components/ProductCard.tsx`
- Create: `site/src/components/ProductCard.module.css`
- Modify: `site/src/pages/Shop.tsx` (replace entire contents)
- Create: `site/src/pages/Shop.module.css`
- Modify: `site/src/pages/ProductDetail.tsx` (replace entire contents)
- Create: `site/src/pages/ProductDetail.module.css`

**Interfaces:**
- Consumes: `.container` utility, CSS tokens (Task 2).
- Produces: `Product` interface and `products: Product[]` / `getProductById(id): Product | undefined`
  from `src/data/products.ts`; `ProductCard` component (props: `{ product: Product }`) —
  both consumed by Home (Task 5).

- [ ] **Step 1: Copy the Wisconsin Print photo and create a Bagel Deli placeholder graphic**

There is no product photo for "Bagel Deli Shop Print" anywhere in this repo (the work log
mentions `bagel_deli_paper_only.jpg` was sent to Quinn directly, not committed here) — using
a fabricated image would misrepresent the actual product, so this uses a plain labeled
placeholder tile instead, with a `TODO` in the data file pointing at where the real photo
goes.

Run:
```bash
mkdir -p site/src/assets/shop
cp "Marketing/design-canvas/images/wisconsin.jpg" "site/src/assets/shop/wisconsin-print.jpg"
```

Create `site/src/assets/shop/bagel-deli-placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#e4e0d8" />
  <rect x="1" y="1" width="798" height="598" fill="none" stroke="#c9c2b4" stroke-width="2" stroke-dasharray="10 8" />
  <text x="400" y="290" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#8a8478">Bagel Deli Shop Print</text>
  <text x="400" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#a39d8f">Photo coming soon</text>
</svg>
```

- [ ] **Step 2: Create `site/src/data/products.ts`**

```ts
import wisconsinPrint from '../assets/shop/wisconsin-print.jpg';
import bagelDeliPlaceholder from '../assets/shop/bagel-deli-placeholder.svg';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  imageAlt: string;
  stripeLink: string;
}

export const products: Product[] = [
  {
    id: 'wisconsin-print',
    name: 'Wisconsin Print',
    price: 20,
    description:
      'A hand-drawn pen and ink illustration inspired by the state of Wisconsin. Printed at 8x10.',
    image: wisconsinPrint,
    imageAlt: 'Pen and ink illustration of Wisconsin',
    // TODO(Quinn): replace with the real Stripe Payment Link for this product
    // (Stripe Dashboard -> Payment Links -> create one for Wisconsin Print, $20).
    stripeLink: 'https://buy.stripe.com/TODO_WISCONSIN_PRINT',
  },
  {
    id: 'bagel-deli-shop-print',
    name: 'Bagel Deli Shop Print',
    price: 15,
    description: 'A hand-drawn pen and ink illustration of a bagel deli storefront.',
    // TODO(Quinn): no product photo exists in this repo yet. Drop the real photo at
    // site/src/assets/shop/bagel-deli-shop-print.jpg and swap the import + fields below.
    image: bagelDeliPlaceholder,
    imageAlt: 'Photo coming soon for the Bagel Deli Shop Print',
    // TODO(Quinn): replace with the real Stripe Payment Link for this product ($15).
    stripeLink: 'https://buy.stripe.com/TODO_BAGEL_DELI_PRINT',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
```

- [ ] **Step 3: Create `site/src/components/ProductCard.tsx`**

```tsx
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/shop/${product.id}`} className={styles.card}>
      <img src={product.image} alt={product.imageAlt} className={styles.image} />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Create `site/src/components/ProductCard.module.css`**

```css
.card {
  display: block;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  text-decoration: none;
  color: var(--color-ink);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.card:hover {
  box-shadow: 0 6px 16px rgba(32, 31, 29, 0.1);
  transform: translateY(-2px);
  text-decoration: none;
}
.image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
.body {
  padding: var(--space-2);
}
.name {
  font-size: 1.05rem;
  margin: 0 0 var(--space-1);
}
.price {
  color: var(--color-accent);
  font-weight: 600;
  margin: 0;
}
```

- [ ] **Step 5: Replace `site/src/pages/Shop.tsx` entirely**

```tsx
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from './Shop.module.css';

export default function Shop() {
  return (
    <div className="container">
      <h1>Shop Prints</h1>
      <p className={styles.intro}>Hand-drawn pen and ink illustrations, printed and ready to frame.</p>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create `site/src/pages/Shop.module.css`**

```css
.intro {
  color: var(--color-ink-soft);
  max-width: 60ch;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-3);
  margin: var(--space-4) 0 var(--space-5);
}
```

- [ ] **Step 7: Replace `site/src/pages/ProductDetail.tsx` entirely**

```tsx
import { useParams, Link, Navigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? getProductById(productId) : undefined;

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <Link to="/shop" className={styles.back}>
        &larr; Back to Shop
      </Link>
      <div className={styles.layout}>
        <img src={product.image} alt={product.imageAlt} className={styles.image} />
        <div>
          <h1>{product.name}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <a href={product.stripeLink} target="_blank" rel="noopener noreferrer" className={styles.buyButton}>
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Create `site/src/pages/ProductDetail.module.css`**

```css
.wrap {
  padding-top: var(--space-3);
  padding-bottom: var(--space-5);
}
.back {
  display: inline-block;
  margin-bottom: var(--space-3);
  font-size: 0.85rem;
}
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
@media (min-width: 720px) {
  .layout {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}
.image {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.price {
  color: var(--color-accent);
  font-weight: 600;
  font-size: 1.2rem;
}
.buyButton {
  display: inline-block;
  margin-top: var(--space-2);
  padding: 0.75rem 1.75rem;
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.03em;
  text-decoration: none;
}
.buyButton:hover {
  background: var(--color-ink);
  text-decoration: none;
}
```

- [ ] **Step 9: Build and visually verify**

Run: `cd site && npm run build`
Expected: succeeds with no errors.

Run: `cd site && npm run preview` (leave running). Using claude-in-chrome, visit `/shop` —
confirm both product cards render with images and prices — then click into each product
detail page and confirm the image, price, description, and "Buy Now" button all render.
Stop the preview server afterward.

- [ ] **Step 10: Commit**

```bash
git add site/src/assets/shop site/src/data/products.ts site/src/components/ProductCard.tsx \
  site/src/components/ProductCard.module.css site/src/pages/Shop.tsx site/src/pages/Shop.module.css \
  site/src/pages/ProductDetail.tsx site/src/pages/ProductDetail.module.css
git commit -m "$(cat <<'EOF'
Add product data, shop grid, and product detail page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 5: Home page

**Files:**
- Create: `site/src/assets/logo.png` (copied from `logo/Paytons Prints Logo - Front.png`)
- Modify: `site/src/pages/Home.tsx` (replace entire contents)
- Create: `site/src/pages/Home.module.css`

**Interfaces:**
- Consumes: `products` from `src/data/products.ts` and `ProductCard` (Task 4).
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Copy the logo asset**

Run:
```bash
mkdir -p site/src/assets
cp "logo/Paytons Prints Logo - Front.png" "site/src/assets/logo.png"
```

- [ ] **Step 2: Replace `site/src/pages/Home.tsx` entirely**

```tsx
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import logo from '../assets/logo.png';
import styles from './Home.module.css';

export default function Home() {
  const featured = products[0];

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <img src={logo} alt="Payton's Prints" className={styles.logo} />
          <p className={styles.tagline}>Custom pen &amp; ink illustrations, printed for your walls.</p>
          <div className={styles.actions}>
            <Link to="/shop" className={styles.primaryButton}>
              Shop Prints
            </Link>
            <Link to="/contact" className={styles.secondaryButton}>
              Request a Custom Drawing
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        <h2>Featured Print</h2>
        <div className={styles.featuredGrid}>
          <ProductCard product={featured} />
        </div>
      </section>

      <section className={`container ${styles.about}`}>
        <h2>Hand-drawn, one line at a time</h2>
        <p>
          Every Payton&rsquo;s Prints illustration starts as pen on paper &mdash; homes, favorite places,
          and keepsakes turned into detailed line art you can hang on your wall.
        </p>
        <p>
          <Link to="/gallery">See more of the gallery &rarr;</Link>
        </p>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Create `site/src/pages/Home.module.css`**

```css
.hero {
  background: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border);
}
.heroInner {
  text-align: center;
  padding: var(--space-5) var(--space-3);
}
.logo {
  max-width: 480px;
  margin: 0 auto var(--space-3);
}
.tagline {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--color-ink-soft);
  margin-bottom: var(--space-3);
}
.actions {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
}
.primaryButton,
.secondaryButton {
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius);
  font-weight: 600;
  letter-spacing: 0.03em;
  text-decoration: none;
}
.primaryButton {
  background: var(--color-accent);
  color: #fff;
}
.primaryButton:hover {
  background: var(--color-ink);
  text-decoration: none;
}
.secondaryButton {
  border: 1px solid var(--color-ink);
  color: var(--color-ink);
}
.secondaryButton:hover {
  background: var(--color-ink);
  color: #fff;
  text-decoration: none;
}
.featuredGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 320px));
  margin: var(--space-3) 0 var(--space-5);
}
.about {
  padding-bottom: var(--space-5);
  max-width: 65ch;
}
```

- [ ] **Step 4: Build and visually verify**

Run: `cd site && npm run build`
Expected: succeeds with no errors.

Run: `cd site && npm run preview` (leave running). Using claude-in-chrome, visit `/` and
confirm the logo, tagline, both CTA buttons, the featured product card, and the about blurb
all render. Click "Shop Prints" and "Request a Custom Drawing" and confirm they navigate
correctly. Stop the preview server afterward.

- [ ] **Step 5: Commit**

```bash
git add site/src/assets/logo.png site/src/pages/Home.tsx site/src/pages/Home.module.css
git commit -m "$(cat <<'EOF'
Add Home page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 6: Gallery page

**Files:**
- Create: `site/src/assets/gallery/{house,wisconsin,corsair,armyplane,kingair,t6trainer,helmet}.jpg`
  (copied from `Marketing/design-canvas/images/`)
- Create: `site/src/components/GalleryGrid.tsx`
- Create: `site/src/components/GalleryGrid.module.css`
- Modify: `site/src/pages/Gallery.tsx` (replace entire contents)
- Create: `site/src/pages/Gallery.module.css`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `GalleryGrid` component (props: `{ images: GalleryImage[] }`, where
  `GalleryImage = { src: string; alt: string }`) — not consumed elsewhere in this plan, but
  available for future gallery-like pages.

- [ ] **Step 1: Copy the gallery images**

Run:
```bash
mkdir -p site/src/assets/gallery
cp "Marketing/design-canvas/images/house.jpg" "site/src/assets/gallery/house.jpg"
cp "Marketing/design-canvas/images/wisconsin.jpg" "site/src/assets/gallery/wisconsin.jpg"
cp "Marketing/design-canvas/images/corsair.jpg" "site/src/assets/gallery/corsair.jpg"
cp "Marketing/design-canvas/images/armyplane.jpg" "site/src/assets/gallery/armyplane.jpg"
cp "Marketing/design-canvas/images/kingair.jpg" "site/src/assets/gallery/kingair.jpg"
cp "Marketing/design-canvas/images/t6trainer.jpg" "site/src/assets/gallery/t6trainer.jpg"
cp "Marketing/design-canvas/images/helmet.jpg" "site/src/assets/gallery/helmet.jpg"
```

- [ ] **Step 2: Create `site/src/components/GalleryGrid.tsx`**

```tsx
import styles from './GalleryGrid.module.css';

export interface GalleryImage {
  src: string;
  alt: string;
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} className={styles.image} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `site/src/components/GalleryGrid.module.css`**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-2);
}
.image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
```

- [ ] **Step 4: Replace `site/src/pages/Gallery.tsx` entirely**

```tsx
import GalleryGrid, { type GalleryImage } from '../components/GalleryGrid';
import house from '../assets/gallery/house.jpg';
import wisconsin from '../assets/gallery/wisconsin.jpg';
import corsair from '../assets/gallery/corsair.jpg';
import armyplane from '../assets/gallery/armyplane.jpg';
import kingair from '../assets/gallery/kingair.jpg';
import t6trainer from '../assets/gallery/t6trainer.jpg';
import helmet from '../assets/gallery/helmet.jpg';
import styles from './Gallery.module.css';

const images: GalleryImage[] = [
  { src: house, alt: 'Pen and ink illustration of a house' },
  { src: wisconsin, alt: 'Pen and ink illustration of Wisconsin' },
  { src: corsair, alt: 'Pen and ink illustration of a Corsair airplane' },
  { src: armyplane, alt: 'Pen and ink illustration of an army airplane' },
  { src: kingair, alt: 'Pen and ink illustration of a King Air airplane' },
  { src: t6trainer, alt: 'Pen and ink illustration of a T-6 Trainer airplane' },
  { src: helmet, alt: 'Pen and ink illustration of a helmet' },
];

export default function Gallery() {
  return (
    <div className="container">
      <h1>Gallery</h1>
      <p>A look at past pen and ink commissions and prints.</p>
      <div className={styles.wrap}>
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `site/src/pages/Gallery.module.css`**

```css
.wrap {
  margin-top: var(--space-3);
  margin-bottom: var(--space-5);
}
```

- [ ] **Step 6: Build and visually verify**

Run: `cd site && npm run build`
Expected: succeeds with no errors.

Run: `cd site && npm run preview` (leave running). Using claude-in-chrome, visit `/gallery`
and confirm all seven images render in a responsive grid with no broken images. Stop the
preview server afterward.

- [ ] **Step 7: Commit**

```bash
git add site/src/assets/gallery site/src/components/GalleryGrid.tsx \
  site/src/components/GalleryGrid.module.css site/src/pages/Gallery.tsx site/src/pages/Gallery.module.css
git commit -m "$(cat <<'EOF'
Add Gallery page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 7: About page

**Files:**
- Modify: `site/src/pages/About.tsx` (replace entire contents)
- Create: `site/src/pages/About.module.css`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed elsewhere.

- [ ] **Step 1: Replace `site/src/pages/About.tsx` entirely**

Bio text is a draft — `website/website-work-log.md` already tracks "About page: bio text
still needs writing/finalizing" as an open item; this is a reasonable placeholder draft, not
final copy, and Task 11 carries that open item forward.

```tsx
import { Link } from 'react-router-dom';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={`container ${styles.wrap}`}>
      <h1>About Payton</h1>
      <p>
        Payton&rsquo;s Prints started with sketching homes for friends and family as gifts, and grew
        into a small custom illustration business based in Wisconsin. Every piece is drawn by hand in
        pen and ink before it&rsquo;s printed &mdash; from favorite homes and travel landmarks to
        keepsakes and special-occasion commissions.
      </p>
      <p>
        Want something drawn for you? Head over to the <Link to="/contact">Contact page</Link> to
        start a custom order.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create `site/src/pages/About.module.css`**

```css
.wrap {
  max-width: 65ch;
  padding-top: var(--space-3);
  padding-bottom: var(--space-5);
}
```

- [ ] **Step 3: Build and visually verify**

Run: `cd site && npm run build`
Expected: succeeds with no errors.

Run: `cd site && npm run preview` (leave running). Using claude-in-chrome, visit `/about` and
confirm the bio renders and the Contact link navigates correctly. Stop the preview server
afterward.

- [ ] **Step 4: Commit**

```bash
git add site/src/pages/About.tsx site/src/pages/About.module.css
git commit -m "$(cat <<'EOF'
Add About page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 8: Contact page

**Files:**
- Create: `site/src/data/contact.ts`
- Modify: `site/src/pages/Contact.tsx` (replace entire contents)
- Create: `site/src/pages/Contact.module.css`

**Interfaces:**
- Consumes: nothing new.
- Produces: `FORMSPREE_ENDPOINT` constant from `src/data/contact.ts` (a `TODO`-marked
  placeholder — not consumed elsewhere).

- [ ] **Step 1: Create `site/src/data/contact.ts`**

```ts
// TODO(Quinn): replace with the real Formspree endpoint from your Formspree account
// (Formspree dashboard -> your form -> "Your form's endpoint" looks like
// https://formspree.io/f/xxxxxxxx). Until this is swapped in, submissions will fail.
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/TODO_FORMSPREE_ID';
```

- [ ] **Step 2: Replace `site/src/pages/Contact.tsx` entirely**

```tsx
import { useState, type FormEvent } from 'react';
import { FORMSPREE_ENDPOINT } from '../data/contact';
import styles from './Contact.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <h1>Commissions &amp; Contact</h1>
      <p>
        Interested in a custom drawing, or have a question about an order? Fill out the form below and
        Payton will get back to you.
      </p>

      {status === 'success' ? (
        <p className={styles.success}>Thanks! Your message has been sent.</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Name
            <input type="text" name="name" required />
          </label>
          <label className={styles.field}>
            Email
            <input type="email" name="email" required />
          </label>
          <label className={styles.field}>
            What are you interested in?
            <select name="subject" defaultValue="Custom Drawing Request">
              <option>Custom Drawing Request</option>
              <option>Question about an order</option>
              <option>Something else</option>
            </select>
          </label>
          <label className={styles.field}>
            Message
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'error' && (
            <p className={styles.error}>Something went wrong sending your message &mdash; please try again.</p>
          )}
        </form>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `site/src/pages/Contact.module.css`**

```css
.wrap {
  max-width: 60ch;
  padding-top: var(--space-3);
  padding-bottom: var(--space-5);
}
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--color-ink-soft);
}
.field input,
.field select,
.field textarea {
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-alt);
  color: var(--color-ink);
}
.submit {
  align-self: flex-start;
  padding: 0.75rem 1.75rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  letter-spacing: 0.03em;
}
.submit:hover:not(:disabled) {
  background: var(--color-ink);
}
.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.success {
  color: var(--color-accent);
  font-weight: 600;
}
.error {
  color: #b3261e;
  font-size: 0.9rem;
}
```

- [ ] **Step 4: Build and visually verify**

Run: `cd site && npm run build`
Expected: succeeds with no errors.

Run: `cd site && npm run preview` (leave running). Using claude-in-chrome, visit `/contact`
and confirm all four fields and the submit button render; typing into each field and
submitting will fail against the placeholder Formspree ID (expected — not a bug) but should
show the form's error state rather than crashing the page. Stop the preview server afterward.

- [ ] **Step 5: Commit**

```bash
git add site/src/data/contact.ts site/src/pages/Contact.tsx site/src/pages/Contact.module.css
git commit -m "$(cat <<'EOF'
Add Contact page with Formspree submission

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 9: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `site/package.json` scripts (`build`) and `site/package-lock.json` from Task 1.
- Produces: a deploy pipeline; no code interface.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'site/**'
      - '.github/workflows/deploy.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: site
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: site/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Sanity-check the YAML**

Run:
```bash
python -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml')); print('valid')"
```
Expected: prints `valid` (Pillow's environment on this machine has PyYAML available via
Python; if not installed, visually re-check indentation instead — no need to install a new
dependency for a one-time syntax check).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "$(cat <<'EOF'
Add GitHub Actions workflow to deploy site to GitHub Pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```

---

### Task 10: Full verification pass

**Files:** none (verification only; fix forward in whichever file has the bug if something's found).

**Interfaces:** none.

- [ ] **Step 1: Build and start preview**

Run:
```bash
cd site && npm run build
```
Expected: succeeds with no errors (fresh confirmation after Tasks 4–9's changes).

Run: `cd site && npm run preview` (leave running, note the printed local URL).

- [ ] **Step 2: Click through every page**

Using claude-in-chrome:
- Load `/`. Confirm logo, tagline, both CTAs, featured product, about blurb.
- Click "Shop Prints" → confirm both products render.
- Click into each product's detail page → confirm image/price/description/Buy button.
- Click "Gallery" in the nav → confirm all 7 images render.
- Click "About" in the nav → confirm bio and Contact link.
- Click "Contact" in the nav → confirm all form fields render.
- Click the "Payton's Prints" brand link in the nav → confirm it returns to Home.
- Click "Request a custom drawing" in the footer → confirm it goes to `/contact`.

Take a screenshot of at least Home, Shop, and one product detail page as a saved record.

- [ ] **Step 3: Check the console for errors**

Use `read_console_messages` on the tab after the click-through above. Expected: no errors
(warnings about the placeholder Stripe/Formspree URLs not resolving are fine and expected;
any React warnings, 404s for images, or thrown exceptions are not — fix them in the relevant
file from Tasks 3–8 before continuing).

- [ ] **Step 4: Stop the preview server**

Close the tab(s) opened for this check and stop the `npm run preview` process.

- [ ] **Step 5: Commit only if fixes were needed**

If Step 3 required a fix, stage and commit just the changed file(s):
```bash
git add <fixed files>
git commit -m "$(cat <<'EOF'
Fix issue found during full site verification pass

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```
If nothing needed fixing, skip this step — there's nothing to commit.

---

### Task 11: Documentation updates

**Files:**
- Modify: `CLAUDE.md`
- Modify: `website/website-work-log.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Update `CLAUDE.md`**

In the "What this repository is" section, the sentence "there is no build, lint, or test
tooling, and none should be added speculatively" is now inaccurate for `site/` — update it to
scope that claim correctly, e.g.:

```markdown
This is primarily an asset and record-keeping repo for **Payton's Prints**, a custom pen-and-ink
illustration / print shop business — marketing collateral, logo/brand assets, QR codes — plus,
as of the `site/` directory, the actual React source for the live website. Don't add build/lint/
test tooling speculatively outside of `site/`; inside `site/`, follow its existing `package.json`
scripts (`npm run dev` / `npm run build` / `npm run preview`).
```

In the "Repository structure" section, add a bullet after the `logo/` bullet:

```markdown
- `site/` — the React (Vite + TypeScript) source for the live website, deployed to GitHub
  Pages by `.github/workflows/deploy.yml` on every push to `main` that touches `site/**`.
  Product data lives in `site/src/data/products.ts`; the Stripe Payment Link and Formspree
  endpoint used for checkout/contact are `TODO`-marked placeholders in that file and
  `site/src/data/contact.ts` until real IDs are dropped in.
```

Update the `website/` bullet to note the site moved off Squarespace:

```markdown
- `website/website-work-log.md` — the running record of edits made to the site. As of
  2026-09-14 the site moved from Squarespace to the React app in `site/`; entries before that
  date describe the retired Squarespace configuration, kept for history.
```

- [ ] **Step 2: Append to `website/website-work-log.md`**

Add a new dated entry under "Completed", and update "Open / carried over" with the items this
build didn't (and structurally can't) finish:

```markdown

## 2026-09-14 — Replaced Squarespace with a React site

- Built a new static site (Vite + React + TypeScript) in `site/`, deployed by
  `.github/workflows/deploy.yml` to GitHub Pages on every push to `main` touching `site/**`.
  Pages: Home, Shop, per-product detail, Gallery, About, Contact.
- Shop: Wisconsin Print ($20) and Bagel Deli Shop Print ($15), matching current pricing.
  Checkout is per-product Stripe Payment Links (no cart, no backend).
- Contact/commissions form posts to Formspree (no backend).
- Gallery reuses the illustration images already in `Marketing/design-canvas/images/`.
- See `docs/superpowers/specs/2026-09-14-react-site-design.md` for the full design.

### Still open from this build
- **Stripe Payment Links**: `site/src/data/products.ts` has TODO placeholder URLs — create
  real Payment Links in Stripe for both products and drop the URLs in.
- **Formspree endpoint**: `site/src/data/contact.ts` has a TODO placeholder — create a
  Formspree form and drop the real endpoint in.
- **Bagel Deli Shop Print photo**: no product photo exists in this repo; the shop currently
  shows a "photo coming soon" placeholder tile for it. Drop the real photo at
  `site/src/assets/shop/bagel-deli-shop-print.jpg` and update `products.ts`.
- **GitHub Pages source setting**: repo Settings → Pages → Source must be set to "GitHub
  Actions" (needs repo admin access) before the workflow's deploy step will succeed.
- **Custom domain**: `www.paytonsprints.com` DNS still needs to be pointed at GitHub Pages,
  and `site/vite.config.ts`'s `base` + `public/404.html`'s `pathSegmentsToKeep` will need
  updating once it no longer serves from the `/Paytons-Prints-/` subpath.
- **About bio**: `site/src/pages/About.tsx` has draft copy — still needs Payton's
  review/finalization (carried over from the previous entry below).
- **Squarespace decommission**: the Squarespace subscription itself hasn't been cancelled yet.
```

Leave the pre-existing "Open / carried over (not yet done)" section's Squarespace-specific
items (Contact page hyperlink, home page image crop, etc.) as-is — they describe the retired
Squarespace site's state, kept for history per the `CLAUDE.md` note added in Step 1.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md website/website-work-log.md
git commit -m "$(cat <<'EOF'
Update docs for the React site replacing Squarespace

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Dqd2erxRD8qssoeAYP4qgc
EOF
)"
```
