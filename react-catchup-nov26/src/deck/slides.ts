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
// Copy is intentionally concise: Japanese is projected while the talk is spoken in English.
export const slides: Slide[] = [
  {
    id: 'hello', section: 'REACT CATCH-UP / NOV 2026', layout: 'cover',
    title: copy('Meanwhile,\nin React.', 'そのころ、\nReact は。'),
    subtitle: copy('A catch-up for people busy catching up with AI.', 'AI 時代の、React キャッチアップ。'),
    takeaway: copy('Five topics. Twenty minutes. Let’s catch up.', '5 つのトピックを、20 分で。'),
  },
  {
    id: 'why', section: 'BEFORE WE START', layout: 'flow',
    title: copy('AI moved fast. React did too.', 'AI を追う間も、React は進んでいた。'),
    items: [
      { title: copy('Try new prompts', 'プロンプトを試す'), text: copy('Keep up with the latest prompting techniques.', '新しいプロンプトの書き方を試す。') },
      { title: copy('Learn new terms', '新しい用語を追う'), text: copy('Harness engineering, loop engineering, software factory…', 'ハーネスエンジニアリング、ループエンジニアリング、ソフトウェアファクトリー……。') },
      { title: copy('Maintain skills', 'スキルを整備する'), text: copy('Build and update skills. Next week’s model might make them obsolete.', 'スキルを作って更新する。でも翌週の新モデルで、もういらなくなることも。') },
    ],
    takeaway: copy('I organize a React meetup and still fell months behind. If AI kept you busy too, let’s catch up together.', 'React イベントを主催しているのに、何か月も React を追えていませんでした。AI を追うのに忙しかったみなさんと、今日は一緒にキャッチアップします。'),
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
    id: 'transition-demo', section: '01 / REACT · LIVE DEMO', layout: 'demo', demo: 'transition',
    filename: 'Demos.tsx · excerpt', code: `const [stop, setStop] = useState(0)\n\n<ViewTransition>\n  <strong>{cities[stop]}</strong>\n</ViewTransition>\n\n<button onClick={() => startTransition(() => {\n  setStop(value => (value + 1) % cities.length)\n})}>Next stop</button>`,
    title: copy('Same component. Next stop.', '同じコンポーネント、次の街へ。'),
    subtitle: copy('Tap Next stop to see the card animate to the next city.', '「次の街へ」を押して、カードが切り替わるアニメーションを見てみよう。'),
    takeaway: copy('Native React 19.3 demo · animation depends on browser support and motion preferences.', 'React 19.3 のデモ · アニメーションはブラウザ対応と動きの設定に依存。'), source: transitions,
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
      { title: copy('Observe the group', 'グループをまとめて監視'), text: copy('One Fragment ref registers the cards with a browser observer. The card APIs stay unchanged.', '1 つの Fragment ref から各カードを Observer に登録。カード側に ref 用の props は不要。') },
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
    takeaway: copy('The browser reports each card’s visibility through one observer on the group.', '1 つの Observer が、グループ内の各カードが見えたことを知らせる。'), source: fragments,
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
    subtitle: copy('use(browser()) leaves the Suspense fallback on the server.', 'use(browser()) で、サーバーでは Suspense の fallback を表示。'),
    takeaway: copy('It controls rendering location, not viewport subscriptions.', '描画場所を制御する API。リサイズの購読は別途必要。'),
    source: { label: 'React DOM · browser', url: 'https://react.dev/reference/react-dom/browser' },
  },
  {
    id: 'react-more', section: '01 / REACT · ALSO IN 19.3',
    title: copy('Two more small doors opened.', 'ほかにも、小さな前進。'),
    items: [
      { title: copy('Trusted Types', 'Trusted Types'), text: copy('React integrates with browser Trusted Types policies for HTML sinks.', 'HTML を扱う箇所で、ブラウザの Trusted Types ポリシーと連携。') },
      { title: copy('Context in RSC', 'RSC での Context'), text: copy('Render a Context provider directly in a Server Component. This does not add context reads to RSC.', 'Server Component で Context Provider を直接描画できる。RSC での Context 読み取りとは別。') },
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
      { title: copy('Lifetime', '有効期間'), text: copy('cacheLife sets the cache lifetime profile.', 'cacheLife でキャッシュの期間を設定。') },
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
    ], source: { label: 'Next.js · ensureStatic', url: 'https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/ensureStatic' },
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
    takeaway: copy('Type-safe routing grows into a full-stack framework.', '型安全なルーターから、フルスタックフレームワークへ。'), source: startRelease,
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
    takeaway: copy('The loader returns rendered slide content. Navigation and language controls still run in the browser.', 'loader が描画済みのスライド本文を返す。ページ送りや言語切り替えは引き続きブラウザで動く。'),
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
    title: copy('Same imports ≠ identical behavior.', '同じ import でも、挙動は同一ではない。'),
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
      { title: copy('Synchronous rendering', '描画は同期処理'), text: copy('Redact drops React’s concurrent scheduler. Renders cannot yield or be interrupted based on priority.', 'React の並行レンダリングを省き、描画の中断や優先度に応じた切り替えを行わない。') },
      { title: copy('Transition APIs still work', 'Transition API は使える'), text: copy('While new results suspend, useDeferredValue can keep the previous results visible.', '新しい検索結果を待つ間、useDeferredValue で直前の結果を表示し続けられる。') },
      { title: copy('Closer to React in tested setups', 'テストでは Preact より React に近い'), text: copy('In TanStack’s tests, Redact passed Start hydration and implemented React 19’s useActionState. Preact compat fell short on both.', 'TanStack のテストでは、Redact は Start のハイドレーションに成功し、useActionState も動作。Preact compat はどちらも通らなかった。') },
    ],
    source: { label: 'Redact · Framework comparison', url: 'https://tanstack.com/redact/latest/docs/framework-comparison' },
  },
  {
    id: 'runtime-size', section: '04 / TANSTACK REDACT · THIS DECK',
    title: copy(`Redact ships ${gzipSavings}% less JS.`, `Redact で JS が ${gzipSavings}% 減少。`),
    subtitle: copy('Same deck, compiler on, minified production JavaScript.', '同じデッキを Compiler 有効で本番ビルド。圧縮後の JS を比較。'),
    items: [
      { title: copy('React 19.3.1', 'React 19.3.1'), text: copy(bundleSize(comparison.react), bundleSize(comparison.react)) },
      { title: copy('Redact 0.3.1', 'Redact 0.3.1'), text: copy(bundleSize(comparison.redact), bundleSize(comparison.redact)) },
    ],
    takeaway: copy('Savings use gzip. Counts cover deck JS and exclude the shared native demo iframe.', '削減率は gzip 比。両ビルド共通のネイティブデモ iframe は集計対象外。'),
  },
  {
    id: 'compiler', section: '05 / REACT COMPILER', layout: 'statement',
    title: copy('You write intent.\nThe compiler memoizes.', '意図を書く。\nメモ化はコンパイラへ。'),
    subtitle: copy('Build-time analysis can handle memoization you’d otherwise write with useMemo, useCallback, or React.memo.', 'useMemo・useCallback・React.memo で手動指定してきたメモ化を、ビルド時の解析で自動化。'),
    takeaway: copy('React’s rendering model stays the same.', 'React のレンダリングモデルは同じ。'),
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
    title: copy('Rust cut build time by 24%.', 'Rust 版でビルド時間が 24% 短縮。'),
    subtitle: copy('Median wall time across 9 runs per configuration on an Apple M2.', 'Apple M2 で各構成を 9 回ずつ交互にビルドしたときの中央値。'),
    items: [
      { title: copy('Babel · 756 ms', 'Babel · 756 ms'), text: copy('721–887 ms across runs', '実測範囲 721〜887 ms') },
      { title: copy('Rust (Oxc) · 573 ms', 'Rust (Oxc) · 573 ms'), text: copy('548–811 ms across runs', '実測範囲 548〜811 ms') },
      { title: copy('Compiler off · 591 ms', 'Compiler 無効 · 591 ms'), text: copy('554–939 ms across runs', '実測範囲 554〜939 ms') },
    ],
    takeaway: copy('Vite 8.3.8 + Redact. Production client and server builds. Prerendering and demo rebuild excluded.', 'Vite 8.3.8 + Redact。本番用の client・server ビルド。プリレンダリングとデモの再ビルドを除く。'),
  },
  {
    id: 'compiler-output', section: '05 / REACT COMPILER · BUILD OUTPUT',
    title: copy('What changed in our build?', 'ビルド出力はどう変わる？'),
    codeComparison: comparison.compiler,
    takeaway: copy('When title stays the same, the compiler reuses the heading from cache slot $[1].', 'title が同じなら、キャッシュの $[1] から見出しを再利用。'),
  },
  {
    id: 'compiler-devtools', section: '05 / REACT COMPILER · DEVTOOLS', layout: 'compiler-devtools',
    title: copy('Spot the Memo badge.', 'Memo バッジを確認。'),
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
      { title: copy('Frameworks', 'フレームワーク'), text: copy('Make caching explicit. Revisit the options.', 'キャッシュを明示する。選択肢を見直す。') },
      { title: copy('Tooling', 'ツール'), text: copy('Choose runtime tradeoffs. Try the compiler.', 'ランタイムの特性を選ぶ。コンパイラを試す。') },
    ], takeaway: copy('Questions? Let’s talk React again.', '質問はありますか？ また React の話をしましょう。'),
  },
]
