# Meanwhile, in React.

A bilingual, 24-slide React catch-up for a 20-minute talk. Japanese is the default projected language; English is available from the toolbar. The original `transcript.md` is preserved.

## Run locally

Requires Node.js 24 and npm.

```sh
cd react-catchup-nov26
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). `dev` first bundles the native React demos; restart it after editing `demo/`.

For presenting, use the production build:

```sh
npm run build
npm run preview
```

Open [localhost:4173](http://localhost:4173). Fonts, scripts, and demos are local: internet access is unnecessary after installation/build. Keep the local server running; restart the preview after rebuilding. Source links open external documentation when a connection is available.

| Control | Action |
| --- | --- |
| → / Space / Page Down | Next slide |
| ← / Page Up | Previous slide |
| Home / End | First / last slide |
| O | Slide overview |
| Esc | Close overview |
| F | Fullscreen; browser fullscreen also works |
| 日本語 / English | Switch language, preserving the slide |

The URL hash stores the slide ID and language, so reloads and browser back/forward work on static hosts. Keyboard events inside a demo iframe stay in that demo; use the outer navigation buttons to continue.

## Edit or trim the talk

Edit `src/deck/slides.ts`. Each record contains an ID, paired English/Japanese text, optional code, layout, and source link. Delete or reorder records to shorten the talk; navigation and the overview follow automatically. Keep IDs unique and stable to preserve shared links. Code samples are shared between languages.

Suggested rehearsal budget: opening 1½ minutes, React 6, Next.js 5, Start 2, Redact 2, Compiler 2½, closing 1. Trim `react-more`, `next-agents`, or `next-compiler` first if needed.

`src/styles.css` adapts Postdue Pop’s Riso palette, typography, sticker rims, outlines, and hard ink shadows for projection. Fonts are self-hosted with Fontsource (SIL Open Font License in the installed font packages).

## Runtime and demos

The deck runs on TanStack Start + TanStack Redact + Vite, with the experimental Oxc React Compiler integration enabled. Start prerenders the single route. `dist/client/` contains the entire static site; `dist/server/` is only a build/preview artifact and is unnecessary on GitHub Pages. No server functions or runtime API endpoints are used.

`demo/` has a separate Vite build **without Redact**. Its bundled React 19.3 runs inside local iframes to demonstrate genuine `<ViewTransition>` and Fragment refs. Redact’s default ViewTransition does not animate. Native transitions respect reduced-motion settings and gracefully switch without animation in unsupported browsers. Next.js snippets are illustrations, not Next.js executed inside Start.

Claims link to official sources directly from their slides. Content was checked on 2026-11-23. The deck distinguishes the Start 1.0 stability announcement from its rolling `1.x` npm version and qualifies the Oxc transform benchmark.

## GitHub Pages

The repository workflow `.github/workflows/react-catchup.yml` runs tests, builds under `/talks/react-catchup-nov26/`, and uploads a static artifact. PRs validate only. Pushes to `main` (and manual runs on `main`) deploy it.

One-time repository setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then merge the PR or run “React catch-up slides” from Actions. Deployment should publish [kentakudo.github.io/talks/react-catchup-nov26/](https://kentakudo.github.io/talks/react-catchup-nov26/). This app does not enable Pages or deploy from your feature branch automatically.

To build for another prefix:

```sh
VITE_BASE_PATH=/talks/react-catchup-nov26/ npm run build
VITE_BASE_PATH=/talks/react-catchup-nov26/ npm run preview
```

Always rebuild without `VITE_BASE_PATH` before presenting at localhost’s root. Upload the contents of `dist/client/` at the matching prefix. The demo uses relative asset paths, and slide navigation uses hashes, so refreshes do not require SPA rewrite rules.

## Verify

```sh
npm run test:coverage
npm run build
npm run check
npm run preview
# In another terminal, with Chrome installed:
npm run test:browser
```

For a prefixed preview, set `SLIDES_URL=http://127.0.0.1:4173/talks/react-catchup-nov26/` on `npm run test:browser`. The Playwright CLI opens its own isolated Chrome session, blocks external requests, checks all 48 slide/language combinations for clipping, exercises navigation and native demos, and captures representative screenshots under ignored `output/playwright/`. Coverage thresholds apply to executable presentation controls and demos; slide copy/layout data are checked visually in the browser.
