# Meanwhile, in React.

A bilingual, 32-slide React catch-up for a 20-minute talk. Japanese is the default projected language; English is available from the toolbar. The original `transcript.md` is preserved.

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

The deck runs on TanStack Start, Vite, and Redact. The index route loader calls the `getSlides` server function, which reads the bilingual slide definitions. The regular build serves the route with SSR. The Pages build runs that same loader at build time and embeds its result in the generated HTML. Slide navigation uses the hydrated data.

The Rust React Compiler integration in `@vitejs/plugin-react` uses Oxc and is marked experimental. See [Oxc’s Vite instructions](https://oxc.rs/blog/2026-08-18-react-compiler-support#vite) and the [Vite React plugin README](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler).

To inspect the deck with native React DevTools in development or as readable production output:

```sh
npm run dev:react
# Or build and preview native React with readable bundles and source maps:
npm run build:inspect
npm run preview
```

With `npm run dev:react`, look for the Memo badge on `SlideTitle` in the React DevTools Components panel. See the [React Compiler verification guide](https://react.dev/learn/react-compiler/installation#verify-your-setup).

The inspection build uses SSR on request. In browser Sources, find `SlideTitle` in the emitted route chunk to see its compiler cache. For the same setup with the compiler disabled, run `SLIDES_COMPILER=off npm run build:inspect` and restart preview.

Run `npm run compare:builds` to regenerate the two evidence slides. The script builds the same deck with React and Redact and sums raw and individually gzipped bytes across its minified client JS chunks. The common iframe bundle, CSS, fonts, HTML, and server output are outside that count. It also compares readable native React builds with the compiler on and off and extracts the actual emitted `SlideTitle` function. Both full builds are under `output/build-comparison/` and the slide data are in `src/deck/build-comparison.json`.

`demo/` has a separate Vite build **without Redact**. Its bundled React 19.3 runs inside local iframes to demonstrate genuine `<ViewTransition>` and Fragment refs. Redact’s default ViewTransition does not animate. Native transitions respect reduced-motion settings and gracefully switch without animation in unsupported browsers. Next.js snippets are illustrations, not Next.js executed inside Start.

Claims link to official sources directly from their slides. Content was checked on 2026-11-23. The deck distinguishes the Start 1.0 stability announcement from its rolling `1.x` npm version and qualifies the Oxc transform benchmark.

## GitHub Pages

The repository workflow `.github/workflows/react-catchup.yml` runs tests, builds under `/talks/react-catchup-nov26/`, and uploads a static artifact. PRs validate only. Pushes to `main` (and manual runs on `main`) deploy it.

One-time repository setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then merge the PR or run “React catch-up slides” from Actions. Deployment should publish [kentakudo.github.io/talks/react-catchup-nov26/](https://kentakudo.github.io/talks/react-catchup-nov26/). This app does not enable Pages or deploy from your feature branch automatically.

To build for another prefix:

```sh
VITE_BASE_PATH=/talks/react-catchup-nov26/ npm run build:pages
VITE_BASE_PATH=/talks/react-catchup-nov26/ npm run preview
```

Build without `VITE_BASE_PATH` for the localhost root. Upload the contents of `dist/client/` at the matching prefix. The demo uses relative asset paths, and slide navigation uses hashes, so refreshes do not require SPA rewrite rules.

## Verify

```sh
npm run test:coverage
npm run build
npm run check
npm run preview
# In another terminal, with Chrome installed:
npm run test:browser
```

For a prefixed preview, set `SLIDES_URL=http://127.0.0.1:4173/talks/react-catchup-nov26/` on `npm run test:browser`. The Playwright CLI opens its own isolated Chrome session, blocks external requests, checks every slide in both languages for clipping, exercises navigation and native demos, and captures representative screenshots under ignored `output/playwright/`. Coverage thresholds apply to executable presentation controls and demos; slide copy/layout data are checked visually in the browser.
