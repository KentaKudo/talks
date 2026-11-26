import comparison from './build-comparison.json' with { type: 'json' }

export type Language = 'ja' | 'en'
export type Copy = Record<Language, string>
const copy = (en: string, ja: string): Copy => ({ en, ja })
export interface Slide {
  id: string
  section: string
  title: Copy
  subtitle?: Copy
  layout?: 'cover' | 'statement' | 'chapter' | 'agenda' | 'flow' | 'demo' | 'closing' | 'compiler-devtools'
  number?: string
  items?: { title: Copy; text: Copy }[]
  code?: string
  filename?: string
  codeComparison?: { off: string; on: string }
  demo?: 'transition' | 'fragment'
  takeaway?: Copy
  source?: { label: string; url: string }
}

const kib = (bytes: number) => (bytes / 1024).toFixed(1)
const gzipSavings = ((1 - comparison.redact.gzip / comparison.react.gzip) * 100).toFixed(1)
const bundleSize = ({ raw, gzip }: typeof comparison.react) => `${kib(raw)} KiB raw · ${kib(gzip)} KiB gzip`

const reactRelease = { label: 'React 19.3 · 2026.09.09', url: 'https://react.dev/blog/2026/09/09/react-19-3' }
const transitions = { label: 'React · ViewTransition', url: 'https://react.dev/reference/react/ViewTransition' }
const fragments = { label: 'React · Fragment', url: 'https://react.dev/reference/react/Fragment' }
const nextRelease = { label: 'Next.js 16.4 · 2026.10.06', url: 'https://nextjs.org/blog/next-16-4' }
const startRelease = { label: 'TanStack Start · 2026.10.13', url: 'https://tanstack.com/blog/tanstack-start-1-0' }
const redactRelease = { label: 'Introducing Redact · 2026.10.26', url: 'https://tanstack.com/blog/introducing-tanstack-redact' }
const oxc = { label: 'Oxc · 2026.08.18', url: 'https://oxc.rs/blog/2026-08-18-react-compiler-support#vite' }

// One record per slide. Delete/reorder records to trim the talk; links use stable IDs.
// Both languages carry the key explanation so the slides also work without narration.
export const slides: Slide[] = [
  {
    id: 'hello', section: 'REACT CATCH-UP / NOV 2026', layout: 'cover',
    title: copy('Meanwhile,\nin React.', 'そのころ、\nReact は。'),
    subtitle: copy('A catch-up for people busy catching up with AI.', 'AI 時代の、React キャッチアップ。'),
    takeaway: copy('Five topics. Let’s catch up.', '5 つのトピックを、キャッチアップ。'),
  },
  {
    id: 'why', section: 'BEFORE WE START', layout: 'statement',
    title: copy('AI moved fast. React did too.', 'AI を追う間も、\nReact は進んでいた。'),
    subtitle: copy('Prompts, harnesses, skills, loops… keeping up became a full-time job.', 'プロンプト、ハーネス、スキル、ループ……。追いかけるだけで忙しい。'),
    takeaway: copy('I organize a React event. I still needed this catch-up.', 'React イベントの主催者だって、キャッチアップが必要でした。'),
  },
  {
    id: 'agenda', section: 'TODAY’S ROUTE', layout: 'agenda',
    title: copy('Five things to bring back.', '持ち帰りたい、5 つの話。'),
    items: [
      { title: copy('React 19.3', 'React 19.3'), text: copy('Transitions + DOM access', '画面遷移と DOM 操作') },
      { title: copy('Next.js 16.4', 'Next.js 16.4'), text: copy('Explicit caching', '明示的なキャッシュ') },
      { title: copy('TanStack Start 1.0', 'TanStack Start 1.0'), text: copy('A stable full-stack option', 'フルスタックの新しい選択肢') },
      { title: copy('TanStack Redact', 'TanStack Redact'), text: copy('A different runtime tradeoff', 'ランタイムの別解') },
      { title: copy('React Compiler', 'React Compiler'), text: copy('The tooling catches up', 'ツールチェーンが追いつく') },
    ],
  },
  {
    id: 'react', section: '01 / REACT', layout: 'chapter', number: '19.3',
    title: copy('Less ceremony.\nMore possibility.', 'もっと自然に、\nできることが増えた。'),
    subtitle: copy('September 9, 2026', '2026 年 9 月 9 日リリース'),
    takeaway: copy('View Transitions and Fragment refs are stable.', 'View Transitions と Fragment refs が stable に。'), source: reactRelease,
  },
  {
    id: 'transition-background', section: '01 / REACT · VIEW TRANSITIONS', layout: 'flow',
    title: copy('App-like transitions on the web.', 'Web でも、アプリのような画面遷移。'),
    subtitle: copy('React’s <ViewTransition> uses the browser’s View Transition API to animate UI changes.', 'React の <ViewTransition> は、ブラウザの View Transition API で UI の変化をアニメーションにする。'),
    items: [
      { title: copy('2023 · Chrome 111', '2023 · Chrome 111'), text: copy('Same-document transitions. Now supported by all major browsers.', '同じページ内での遷移。現在は主要ブラウザで利用できる。') },
      { title: copy('2024 · Chrome 126', '2024 · Chrome 126'), text: copy('Transitions between same-origin pages. Still off by default in Firefox stable.', '同一オリジンのページ間でも遷移。Firefox 安定版ではまだデフォルト無効。') },
      { title: copy('April 2025 · React', '2025 年 4 月 · React'), text: copy('Experimental <ViewTransition>, then stable in React 19.3.', '実験版の <ViewTransition> を公開。React 19.3 で安定版に。') },
    ],
    takeaway: copy('Up next: animate a card change within the same page.', '次は、同じページ内でカードを切り替えるデモ。'),
    source: { label: 'React Labs · View Transitions', url: 'https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more#view-transitions' },
  },
  {
    id: 'transition-demo', section: '01 / REACT · LIVE DEMO', layout: 'demo', demo: 'transition',
    filename: 'Demos.tsx · excerpt', code: `const [stop, setStop] = useState(0)\n\n<ViewTransition>\n  <strong>{cities[stop]}</strong>\n</ViewTransition>\n\n<button onClick={() => startTransition(() => {\n  setStop(value => (value + 1) % cities.length)\n})}>Next stop</button>`,
    title: copy('Same component. Next stop.', '同じコンポーネント、次の街へ。'),
    subtitle: copy('Tap Next stop to see the card animate to the next city.', '「次の街へ」を押して、カードが切り替わるアニメーションを見てみよう。'),
    takeaway: copy('startTransition triggers the animation; urgent updates do not. Browser support and motion preferences apply.', 'startTransition でアニメーション。通常の即時更新は対象外。ブラウザ対応と動きの設定に依存。'), source: transitions,
  },
  {
    id: 'transition-triggers', section: '01 / REACT · VIEW TRANSITIONS · CONTENT UPDATES',
    title: copy('Animate content as it becomes ready.', 'コンテンツの準備ができたら、アニメーション。'),
    filename: 'ViewTransition · TSX excerpts',
    code: `// Suspense reveal
<ViewTransition>
  <Suspense fallback={<Skeleton />}>
    <LazyDetails />
  </Suspense>
</ViewTransition>

// Inside Search({ query })
const deferred = useDeferredValue(query)
return <ViewTransition>
  <Results query={deferred} />
</ViewTransition>`,
    items: [
      { title: copy('Suspense', 'Suspense'), text: copy('Cross-fade from the fallback when the lazy content is ready.', '読み込みが完了したら、fallback からコンテンツへクロスフェード。') },
      { title: copy('useDeferredValue', 'useDeferredValue'), text: copy('Typing stays responsive. The results animate when the deferred query updates.', '入力はすぐに反映。遅延させた検索語の更新に合わせて、結果をアニメーション。') },
      { title: copy('Style the motion', '動きをカスタマイズ'), text: copy('CSS transition classes or animation callbacks.', 'CSS の transition class やイベント props で調整。') },
    ],
    source: transitions,
  },
  {
    id: 'fragment-refs', section: '01 / REACT · FRAGMENT REFS',
    title: copy('A ref, without the extra div.', 'ref のための div、もう不要。'),
    code: `const cards = useRef<FragmentInstance>(null)

<div ref={feed} className="update-feed">
  <Fragment ref={cards}>
    <SearchUpdate />
    <ExportUpdate />
    <ThemeUpdate />
  </Fragment>
</div>`, filename: 'Release notes · excerpt',
    items: [
      { title: copy('Keep each card separate', 'カードは独立したまま'), text: copy('Each card stays a direct child of the scroll container.', '各カードはスクロール領域の直接の子要素のまま。') },
      { title: copy('Observe the group', 'グループをまとめて監視'), text: copy('One explicit <Fragment ref> registers first-level DOM children. No ref prop needed on each card.', '明示的な <Fragment ref> で直下の DOM 要素を登録。カードごとの ref 用 props は不要。') },
    ], source: fragments,
  },
  {
    id: 'fragment-demo', section: '01 / REACT · LIVE DEMO', layout: 'demo', demo: 'fragment',
    filename: 'Demos.tsx · excerpt', code: `const observer = new IntersectionObserver(
  recordSeenCards,
  { root: feed.current, threshold: 0.65 },
)

fragment.observeUsing(observer)
return () => {
  fragment.unobserveUsing(observer)
  observer.disconnect()
}`,
    title: copy('Which updates have appeared on screen?', 'どの変更点が画面に表示された？'),
    subtitle: copy('Scroll inside the release notes. Each card advances the counter once it comes into view.', '一覧の中を下へスクロール。カードが見えるたびに表示済み件数が増える。'),
    takeaway: copy('1 → 2 → 3 seen: each card is counted at 65% visibility. The Fragment adds no DOM wrapper.', '表示済みが 1 → 2 → 3。各カードが 65% 見えたら加算。Fragment は DOM のラッパーを追加しない。'), source: fragments,
  },
  {
    id: 'browser-before', section: '01 / REACT · BROWSER-ONLY RENDERING',
    title: copy('Before browser(): two common checks.', 'browser() 以前の 2 つの書き方。'),
    filename: 'React 19.3 announcement · separate examples',
    code: `function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  // ...
}

function Component() {
  const isBrowser = typeof window !== 'undefined';

  // ...
}`,
    items: [
      { title: copy('Wait for mount', 'マウントを待つ'), text: copy('An effect flips the flag after mount and triggers a second render.', 'マウント後に Effect でフラグを切り替え、再レンダーする。') },
      { title: copy('Check for window', 'window の有無を調べる'), text: copy('If the check changes the initial markup, hydration can mismatch.', '判定によって初回のマークアップが変わると、ハイドレーションが不一致になることがある。') },
    ],
    source: { label: 'React 19.3 · browser', url: 'https://react.dev/blog/2026/09/09/react-19-3#browser' },
  },
  {
    id: 'browser', section: '01 / REACT · BROWSER-ONLY RENDERING',
    title: copy('Browser APIs? Say so.', 'ブラウザ専用、と宣言する。'),
    code: `import { Suspense, use } from 'react'\nimport { browser } from 'react-dom'\n\nfunction WindowSize() {\n  use(browser('Reads the viewport'))\n  return <p>{window.innerWidth}px</p>\n}\n\n<Suspense fallback={<p>Loading…</p>}>\n  <WindowSize />\n</Suspense>`, filename: 'WindowSize.tsx',
    subtitle: copy('Client Component + use(browser()) + Suspense: fallback on the server, content in the browser.', 'Client Component + use(browser()) + Suspense。サーバーは fallback、ブラウザは本文を描画。'),
    takeaway: copy('It controls rendering location, not viewport subscriptions.', '描画場所を制御する API。リサイズの購読は別途必要。'),
    source: { label: 'React DOM · browser', url: 'https://react.dev/reference/react-dom/browser' },
  },
  {
    id: 'react-more', section: '01 / REACT · ALSO IN 19.3',
    title: copy('Two more small doors opened.', 'ほかにも、小さな前進。'),
    items: [
      { title: copy('Trusted Types', 'Trusted Types'), text: copy('Preserves policy-created trusted values at DOM sinks. You still configure policies and CSP.', 'ポリシーが生成した信頼済みの値を DOM API に渡す。ポリシーと CSP の設定は引き続き必要。') },
      { title: copy('Context in RSC', 'RSC での Context'), text: copy('Render a client-defined provider in a Server Component. RSC still cannot create or read context.', 'クライアント側で定義した Provider を Server Component で描画。RSC 自身は Context の作成・読み取り不可。') },
    ], takeaway: copy('Small APIs can remove surprisingly awkward workarounds.', '小さな API が、不自然な回避策を減らしてくれる。'), source: reactRelease,
  },
  {
    id: 'next', section: '02 / NEXT.JS', layout: 'chapter', number: '16.4',
    title: copy('Make caching\na deliberate choice.', 'キャッシュを、\n意図して選ぶ。'),
    subtitle: copy('October 6, 2026', '2026 年 10 月 6 日リリース'),
    takeaway: copy('Cache Components are now recommended for every Next.js app.', 'Cache Components を、すべての Next.js アプリに推奨。'), source: nextRelease,
  },
  {
    id: 'cache-model', section: '02 / NEXT.JS · THE MENTAL MODEL', layout: 'flow',
    title: copy('From implicit to composable.', '暗黙的な挙動から、組み合わせへ。'),
    items: [
      { title: copy('Earlier App Router', '以前の App Router'), text: copy('Several defaults and route-level switches to understand.', '複数のデフォルトと、ルート単位の設定を理解する必要。') },
      { title: copy('Cache Components', 'Cache Components'), text: copy('Mark reusable work with “use cache”; stream request-time work.', '再利用する処理を “use cache” で指定。リクエスト時の処理はストリーミング。') },
      { title: copy('New projects', '新規プロジェクト'), text: copy('Enabled by create-next-app. The framework default changes in v17.', 'create-next-app では有効に。フレームワークのデフォルト化は v17。') },
    ], source: nextRelease,
  },
  {
    id: 'use-cache', section: '02 / NEXT.JS · CACHE COMPONENTS',
    title: copy('Name what can be reused.', '再利用できる処理を明示する。'),
    code: `import { cacheLife, cacheTag } from 'next/cache'\n\nasync function TalkList() {\n  'use cache'\n  cacheLife('hours')\n  cacheTag('talks')\n\n  const talks = await db.talks.findMany()\n  return <ul>{talks.map(talk =>\n    <li key={talk.id}>{talk.title}</li>\n  )}</ul>\n}`, filename: 'TalkList.tsx · illustrative Next.js code',
    items: [
      { title: copy('Reuse database work', 'DB への問い合わせを再利用'), text: copy('Enable Cache Components. “use cache” reuses TalkList; cacheLife sets its lifetime profile.', 'Cache Components を有効に。“use cache” で TalkList を再利用し、cacheLife で期間を設定。') },
      { title: copy('Invalidation', '無効化'), text: copy('cacheTag groups entries for targeted revalidation.', 'cacheTag で関連するキャッシュをまとめて再検証。') },
    ], source: { label: 'Next.js · Cache Components', url: 'https://nextjs.org/docs/app/getting-started/cache-components' },
  },
  {
    id: 'ensure-static', section: '02 / NEXT.JS · STATIC GUARANTEES',
    title: copy('A build-time guardrail.', '静的であることを、ビルドで保証。'),
    code: `// app/talks/layout.tsx\nexport const ensureStatic = 'navigation'\n\nexport default function TalksLayout({ children }) {\n  return <main>{children}</main>\n}\n\n// Requires cacheComponents.\n// Request-time work in this route? Build fails.`, filename: 'app/talks/layout.tsx · illustrative',
    items: [
      { title: copy('shell → prefetch → navigation', 'shell → prefetch → navigation'), text: copy('Each level includes the static requirements of earlier stages.', '後の段階ほど、それ以前の段階の静的要件も含む。') },
      { title: copy('Pages or layouts', 'Page / Layout に設定'), text: copy('Enforce a static requirement across a route or layout subtree.', 'ルート、または Layout 配下に静的要件を適用。') },
    ], takeaway: copy('ensureStatic enforces a build requirement; navigation() defers runtime work.', 'ensureStatic はビルド時の要件。navigation() は実行時の処理を後に回す。'),
    source: { label: 'Next.js · ensureStatic', url: 'https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/ensureStatic' },
  },
  {
    id: 'navigation', section: '02 / NEXT.JS · PREFETCH BOUNDARIES',
    title: copy('Some work can wait for the click.', 'クリックまで、待てる処理もある。'),
    code: `import { navigation } from 'next/cache'\n\nasync function Discussion({ talkId }) {\n  await navigation()\n  const posts = await loadDiscussion(talkId)\n  return <Thread posts={posts} />\n}\n\n<Suspense fallback={<DiscussionSkeleton />}>\n  <Discussion talkId={id} />\n</Suspense>`, filename: 'Discussion.tsx · illustrative Next.js code',
    subtitle: copy('Keep expensive runtime work out of the shell and per-link prefetch.', '負荷の高い実行時処理を、shell やリンクの prefetch から外す。'),
    takeaway: copy('With Partial Prefetching; static prerenders can still include the content.', 'Partial Prefetching と組み合わせる。静的プリレンダーには含まれる場合がある。'),
    source: { label: 'Next.js · navigation', url: 'https://nextjs.org/docs/app/api-reference/functions/navigation' },
  },
  {
    id: 'next-agents', section: '02 / NEXT.JS · AGENT TOOLING',
    title: copy('The framework meets your agent.', 'フレームワークも、エージェント対応へ。'),
    code: `npx next@canary upgrade --agent=latest\n\n// next.config.ts\nexperimental: {\n  agentUpgrade: 'security',\n  agentFeedback: true,\n}`, filename: 'terminal / configuration excerpt',
    items: [
      { title: copy('Guided upgrades', 'アップグレードを支援'), text: copy('Version-specific migration instructions and verification.', 'バージョンに合った移行手順と検証を提供。') },
      { title: copy('Review before sending', '送信前に確認'), text: copy('Feedback prepares reports for human review.', 'フィードバックはレポート案を作成。送信は人が確認。') },
    ], source: nextRelease,
  },
  {
    id: 'start', section: '03 / TANSTACK START', layout: 'chapter', number: '1.0',
    title: copy('The full-stack option\nis stable.', 'フルスタックの選択肢が、\nstable に。'),
    subtitle: copy('October 13, 2026', '2026 年 10 月 13 日、安定版を発表'),
    takeaway: copy('TanStack Router + SSR + server functions. Stable core; RSC is a separate experimental opt-in.', 'TanStack Router + SSR + Server Functions。コアは安定版、RSC は別途オプトインする実験機能。'), source: startRelease,
  },
  {
    id: 'start-stack', section: '03 / TANSTACK START · THIS DECK', layout: 'flow',
    title: copy('The talk runs on the topic.', 'このスライドも、このスタックで。'),
    items: [
      { title: copy('TanStack Start', 'TanStack Start'), text: copy('A route loader calls a server function to fetch this deck.', 'ルートの loader が Server Function からスライドを取得。') },
      { title: copy('Vite + Oxc', 'Vite + Oxc'), text: copy('Build pipeline + opt-in React Compiler.', 'ビルドパイプラインと React Compiler。') },
      { title: copy('Static files', '静的ファイル'), text: copy('GitHub Pages or a local static server. No production server needed.', 'GitHub Pages でもローカルでも。本番サーバーは不要。') },
    ], takeaway: copy('Start also supports server functions and SSR; this deck deliberately prerenders.', 'Start は Server Functions や SSR にも対応。このデッキでは静的出力を選択。'),
    source: { label: 'TanStack Start · Static prerendering', url: 'https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering' },
  },
  {
    id: 'start-server-function', section: '03 / TANSTACK START · SERVER FUNCTIONS',
    title: copy('How this route loads the deck.', 'このルートがスライドを取得する仕組み。'),
    filename: 'get-slides.ts / routes/index.tsx · excerpt',
    code: `// src/deck/get-slides.ts
export const getSlides = createServerFn({ method: 'GET' })
  .handler(async () => (await import('./slides')).slides)

// src/routes/index.tsx
export const Route = createFileRoute('/')({
  loader: () => getSlides(),
  staleTime: Infinity,
  component: function SlidesPage() {
    return <Deck slides={Route.useLoaderData()} />
  },
})`,
    takeaway: copy('The loader fetches the slides. The component reads them with Route.useLoaderData().', 'loader がスライドを取得し、コンポーネントは Route.useLoaderData() で読み取る。'),
  },
  {
    id: 'start-data-flow', section: '03 / TANSTACK START · FOLLOW THE DATA', layout: 'flow',
    title: copy('Server function → loader → component.', 'Server Function → loader → コンポーネント。'),
    items: [
      { title: copy('getSlides()', 'getSlides()'), text: copy('The server-only handler returns typed slide definitions.', 'サーバー専用の handler が、型付きのスライド定義を返す。') },
      { title: copy('Route loader', 'Route loader'), text: copy('Calls getSlides(). Its return type carries through to the route.', 'getSlides() を呼ぶ。戻り値の型がルートまでつながる。') },
      { title: copy('Deck', 'Deck'), text: copy('Reads useLoaderData(). Navigation reuses the hydrated data.', 'useLoaderData() で取得。ページ送りでは読み込み済みのデータを再利用。') },
    ],
    takeaway: copy('Pages build: load once during prerendering. Slide changes stay in the browser.', 'Pages ビルドではプリレンダー時に取得。スライド切り替えはブラウザ内で完結。'),
    source: { label: 'TanStack Start · Server Functions', url: 'https://tanstack.com/start/latest/docs/framework/react/guide/server-functions' },
  },
  {
    id: 'start-rsc-example', section: '03 / TANSTACK START · REACT SERVER COMPONENTS',
    title: copy('What if the slide content were an RSC?', 'スライド本文を RSC にすると？'),
    filename: 'routes/index.tsx · illustrative · experimental RSC opt-in',
    code: `const getSlide = createServerFn().handler(async () => ({
  slide: await renderServerComponent(
    <SlideContent slide={slides[0]} />,
  ),
}))

export const Route = createFileRoute('/')({
  loader: () => getSlide(),
  component: function SlidesPage() {
    return <>{Route.useLoaderData().slide}</>
  },
})`,
    takeaway: copy('Today: return slide data. RSC: return renderable content; keep a Markdown parser server-side. Experimental.', '現在はデータを返す。RSC なら描画可能な本文を返し、Markdown パーサーをサーバーへ。実験機能。'),
    source: { label: 'TanStack Start · Server Components', url: 'https://tanstack.com/start/latest/docs/framework/react/guide/server-components#quick-start' },
  },
  {
    id: 'redact', section: '04 / TANSTACK REDACT', layout: 'chapter', number: 'RE:\nACT',
    title: copy('Keep the components.\nChange the runtime.', 'コンポーネントはそのまま。\nランタイムを選ぶ。'),
    subtitle: copy('Announced October 26, 2026', '2026 年 10 月 26 日発表'),
    takeaway: copy('A smaller runtime built around React APIs, with synchronous rendering.', 'React API をベースにした、同期レンダリングの小さなランタイム。'), source: redactRelease,
  },
  {
    id: 'redact-tradeoffs', section: '04 / TANSTACK REDACT · TRADEOFFS',
    title: copy('Same components. A different runtime.', '同じコンポーネント、別のランタイム。'),
    filename: 'Vite + React · excerpts',
    code: `// vite.config.ts
plugins: [
  tanstackStart(),
  react({ compiler: true }),
  redact(),
]

// Deck.tsx
import { useState } from 'react'`,
    items: [
      { title: copy('Build configuration', 'ビルド設定で切り替える'), text: copy('The Redact plugin replaces the browser runtime.', 'Redact プラグインがブラウザのランタイムを置き換える。') },
      { title: copy('Component code', 'コンポーネントのコード'), text: copy('Keep React imports. Check the behavior your app depends on.', 'React の import はそのまま。アプリが依存する挙動を確認する。') },
    ],
    takeaway: copy('This deck uses Redact. Its native React demos run in separate iframes.', 'このデッキは Redact。React 本来の API を見せるデモは別の iframe で実行。'),
    source: { label: 'Redact · Compatibility', url: 'https://tanstack.com/redact/latest/docs/compatibility' },
  },
  {
    id: 'redact-compatibility', section: '04 / TANSTACK REDACT · WHY NOT PREACT?',
    title: copy('React 19: Preact vs Redact.', 'React 19 対応：Preact と Redact。'),
    subtitle: copy('Checked November 25, 2026 · Preact compat 11.1.0', '2026 年 11 月 25 日確認 · Preact compat 11.1.0'),
    items: [
      { title: copy('Preact compat · API gaps', 'Preact compat · 未対応の API'), text: copy('Missing useActionState, useOptimistic, and useFormStatus.', 'useActionState・useOptimistic・useFormStatus は未対応。') },
      { title: copy('Redact · broader React 19 support', 'Redact · より広い React 19 対応'), text: copy('Implements those APIs, including pending form state and optimistic updates.', 'これらの API を実装。フォームの pending 状態や楽観的更新にも対応。') },
      { title: copy('Still not identical to React', 'ただし React と同じ挙動ではない'), text: copy('Synchronous rendering; ViewTransition animation is experimental and opt-in.', '同期レンダリング。ViewTransition のアニメーションは実験的なオプトイン機能。') },
    ],
    takeaway: copy('Redact covers React 19 APIs that Preact compat lacks. Check the remaining limits for your app.', 'Preact compat にない React 19 API も Redact はカバー。残る制約は自分のアプリで確認しよう。'),
    source: { label: 'TanStack · React / Redact / Preact', url: 'https://tanstack.com/redact/latest/docs/comparison' },
  },
  {
    id: 'redact-scheduling', section: '04 / TANSTACK REDACT · RENDERING TRADEOFFS',
    title: copy('Bundle size vs responsiveness.', 'バンドルサイズと、操作への応答性。'),
    items: [
      { title: copy('Redact · smaller bundle', 'Redact · 小さなバンドル'), text: copy('Synchronous rendering reduces runtime machinery, but a long render can delay input.', '同期レンダリングで実行基盤を小さく。その分、長い描画処理は入力への応答を遅らせうる。') },
      { title: copy('React · concurrent rendering', 'React · 並行レンダリング'), text: copy('Can pause non-urgent rendering to handle urgent input, such as typing during a heavy update.', '緊急でない描画を中断し、重い更新中でも文字入力などの応答を優先できる。') },
      { title: copy('Measure both in your app', '自分のアプリで両方を測る'), text: copy('Compare downloaded JS and input responsiveness during expensive updates.', '配信する JS のサイズと、重い更新中の入力への応答性を比較する。') },
    ],
    takeaway: copy('Smaller downloads trade off against concurrent scheduling. The impact depends on your workload.', '小さなダウンロードと、並行処理による応答性のトレードオフ。影響はアプリの処理次第。'),
    source: { label: 'Redact · Compatibility', url: 'https://tanstack.com/redact/latest/docs/compatibility' },
  },
  {
    id: 'runtime-size', section: '04 / TANSTACK REDACT · THIS DECK',
    title: copy(`Recorded deck: ${gzipSavings}% less JS.`, `記録したデッキで JS が ${gzipSavings}% 減。`),
    subtitle: copy('Before content expansion: React vs Redact, compiler on, minified client JavaScript.', '内容拡充前の React と Redact の比較。Compiler 有効・本番用クライアント JS。'),
    items: [
      { title: copy('React 19.3.1', 'React 19.3.1'), text: copy(bundleSize(comparison.react), bundleSize(comparison.react)) },
      { title: copy('Redact 0.3.1', 'Redact 0.3.1'), text: copy(bundleSize(comparison.redact), bundleSize(comparison.redact)) },
    ],
    takeaway: copy('Whole-deck JS, gzip. Excludes CSS, fonts, HTML, and the common native demo bundle.', 'デッキ全体の JS を gzip 比較。CSS・フォント・HTML・共通の React デモバンドルを除く。'),
  },
  {
    id: 'compiler', section: '05 / REACT COMPILER', layout: 'statement',
    title: copy('You write intent.\nThe compiler memoizes.', '意図を書く。\nメモ化はコンパイラへ。'),
    subtitle: copy('Build-time analysis can handle memoization you’d otherwise write with useMemo, useCallback, or React.memo.', 'useMemo・useCallback・React.memo で手動指定してきたメモ化を、ビルド時の解析で自動化。'),
    takeaway: copy('Reuse calculations and JSX when inputs are unchanged. Pure rendering and the Rules of React still apply.', '入力が同じなら計算や JSX を再利用。純粋なレンダーと Rules of React は引き続き必要。'),
    source: { label: 'React · Compiler 1.0', url: 'https://react.dev/blog/2025/10/07/react-compiler-1' },
  },
  {
    id: 'compiler-history', section: '05 / REACT COMPILER · HISTORY', layout: 'flow',
    title: copy('From React Forget to 1.0.', 'React Forget から安定版 1.0 へ。'),
    items: [
      { title: copy('2021', '2021'), text: copy('React Forget prototype debuts at React Conf.', 'React Conf で React Forget の試作版を披露。') },
      { title: copy('May 2024', '2024 年 5 月'), text: copy('Experimental version goes open source.', '実験版をオープンソースで公開。') },
      { title: copy('April 2025', '2025 年 4 月'), text: copy('Release Candidate for wider testing.', '安定版に向けて RC を公開。') },
      { title: copy('October 2025', '2025 年 10 月'), text: copy('Stable 1.0 ships for production use.', '本番利用に向けた安定版 1.0 をリリース。') },
    ],
    takeaway: copy('Optional build-time memoization for React 17+. The Rules of React still apply.', 'React 17 以降で選べるビルド時の自動メモ化。Rules of React は引き続き適用。'),
    source: { label: 'React · Compiler v1.0', url: 'https://react.dev/blog/2025/10/07/react-compiler-1' },
  },
  {
    id: 'compiler-two-clocks', section: '05 / REACT COMPILER · SINCE 1.0',
    title: copy('Since 1.0: the tooling catches up.', '1.0 のその後、ツール連携が進む。'),
    items: [
      { title: copy('A Rust implementation', 'Rust への移植'), text: copy('The React team ported the compiler from TypeScript to Rust.', 'React チームがコンパイラを TypeScript から Rust へ移植。') },
      { title: copy('Native toolchain integrations', 'ツールチェーンへのネイティブ連携'), text: copy('Oxc and Turbopack integrate the Rust compiler; these paths remain experimental.', 'Oxc や Turbopack が Rust 版を統合。これらの経路は experimental。') },
      { title: copy('Compiler-powered lint checks', 'コンパイラを使った lint'), text: copy('Oxlint uses compiler validation to catch Rules of React violations.', 'Oxlint もコンパイラの検証処理で Rules of React 違反を検出。') },
    ],
    takeaway: copy('Automatic memoization now reaches more of the toolchain. Next: the Vite integration used by this deck.', '自動メモ化がツールチェーンに広がる。次は、このデッキで使う Vite 連携。'),
    source: oxc,
  },
  {
    id: 'oxc', section: '05 / REACT COMPILER · VITE',
    title: copy('A Rust path into Vite.', 'Vite にも、Rust のコンパイラ。'),
    code: `// npm i -D oxc-transform-react\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [\n    react({ compiler: true }),\n  ],\n})`, filename: 'vite.config.ts · plugin-react ≥ 6.1',
    items: [
      { title: copy('Opt-in integration', 'オプトインで利用'), text: copy('Vite’s native React Compiler integration uses Oxc and is marked experimental.', 'Oxc を使う Vite のネイティブ連携は experimental。') },
      { title: copy('12–15× in two samples', '2 つのサンプルで 12〜15 倍'), text: copy('Preliminary transform benchmarks against Babel—not whole-app build speed.', 'Babel 比の予備的な変換ベンチマーク。アプリ全体のビルド速度ではない。') },
    ], source: oxc,
  },
  {
    id: 'compiler-build-time', section: '05 / REACT COMPILER · THIS DECK',
    title: copy('Recorded builds: 24% less time.', '記録したビルドでは、24% 短縮。'),
    subtitle: copy('Before content expansion: 9 alternating runs per configuration, Apple M2, median wall time.', '内容拡充前の記録。Apple M2 で各構成を 9 回ずつ交互にビルドした中央値。'),
    items: [
      { title: copy('Babel · 756 ms', 'Babel · 756 ms'), text: copy('721–887 ms across runs', '実測範囲 721〜887 ms') },
      { title: copy('Rust (Oxc) · 573 ms', 'Rust (Oxc) · 573 ms'), text: copy('548–811 ms across runs', '実測範囲 548〜811 ms') },
      { title: copy('Compiler off · 591 ms', 'Compiler 無効 · 591 ms'), text: copy('554–939 ms; overlaps Rust. No evidence that enabling the compiler speeds builds.', '554〜939 ms。Rust 版と範囲が重なる。有効にすると速くなる、とは言えない。') },
    ],
    takeaway: copy('Vite 8.3.8 + Redact. Production client and server builds. Prerendering and demo rebuild excluded.', 'Vite 8.3.8 + Redact。本番用の client・server ビルド。プリレンダリングとデモの再ビルドを除く。'),
  },
  {
    id: 'compiler-output', section: '05 / REACT COMPILER · BUILD OUTPUT',
    title: copy('What changed in our build?', 'ビルド出力はどう変わる？'),
    subtitle: copy('SlideTitle: off creates a heading each time; on compares title and caches the element.', 'SlideTitle：無効なら毎回見出しを生成。有効なら title を比較し、要素をキャッシュ。'),
    codeComparison: comparison.compiler,
    takeaway: copy('Same title → reuse $[1]. Changed title → create and cache. A visible transform, not a measured speedup.', 'title が同じなら $[1] を再利用。変われば再作成して保存。変換の確認であり、速度向上の実測ではない。'),
  },
  {
    id: 'compiler-devtools', section: '05 / REACT COMPILER · DEVTOOLS', layout: 'compiler-devtools',
    title: copy('Spot the Memo badge.', 'Memo バッジを確認。'),
    subtitle: copy('Native React inspection build · confirms compilation, not a measured runtime speedup.', 'ネイティブ React の確認用ビルド。コンパイルの確認であり、実行速度の実測ではない。'),
    takeaway: copy('The blue Memo ✨ badge on SlideTitle shows React Compiler optimized this component.', 'SlideTitle の青い Memo ✨ バッジが、React Compiler による最適化の目印。'),
  },
  {
    id: 'next-compiler', section: '05 / REACT COMPILER · NEXT.JS',
    title: copy('Two paths in Next.js.', 'Next.js には、2 つの経路。'),
    items: [
      { title: copy('Standard integration', '標準の連携'), text: copy('Babel React Compiler, with SWC filtering the files that need compilation.', 'Babel 版 React Compiler。SWC が対象ファイルを絞り込む。') },
      { title: copy('Experimental Rust', '実験的な Rust 版'), text: copy('Available since 16.3 inside Turbopack; further conformance work in 16.4.', '16.3 から Turbopack 内で利用可能。16.4 でも互換性の改善が進む。') },
    ], takeaway: copy('Faster transforms help developers. Measure user-facing performance separately.', '変換の高速化は開発者に効く。ユーザーの体感速度は別に測ろう。'),
    source: { label: 'Next.js · React Compiler', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler' },
  },
  {
    id: 'takeaways', section: 'THANK YOU / ありがとうございました', layout: 'closing',
    title: copy('Caught up.\nFor now.', 'ひとまず、\n追いついた。'),
    items: [
      { title: copy('React', 'React'), text: copy('Try a transition. Remove a wrapper.', '遷移を試す。ラッパーを減らす。') },
      { title: copy('Next.js / Start', 'Next.js / Start'), text: copy('Explicit caching. A stable full-stack option.', '明示的なキャッシュ。安定版のフルスタック。') },
      { title: copy('Redact / Compiler', 'Redact / Compiler'), text: copy('Measure runtime tradeoffs and compiler benefits.', 'ランタイムの特性と Compiler の効果を測る。') },
    ], takeaway: copy('Questions? Let’s talk React again.', '質問はありますか？ また React の話をしましょう。'),
  },
]
