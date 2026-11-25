# Meanwhile, in React — speaker memo

Keep this on a **private second screen, tablet, or printout**. Extend the projector display; project only the deck window. This memo scrolls manually and is not synchronized with the deck. Match the number/title below to the slide counter; `O` opens the deck overview if you lose your place.

**Speak around the cues.** Bold text is the point to land; the remaining bullets are reminders, not sentences to recite. Japanese anchors let you switch spoken language without changing the route. Project Japanese by default for a Japanese-speaking audience, even when speaking English; readers can switch languages in their own copy.

**Working timing: 22–24 minutes, to verify in rehearsal.** Section checkpoints: React at ~1:30; Next.js ~7:30; Start ~11:00; Redact ~14:30; Compiler ~18:00; closing ~23:00. These are targets, not measured timings. For a 20-minute slot, take the marked **OPTIONAL** slides in one sentence or skip with `O`; shorten background, not demo explanations or measurement caveats. Reserve the final minute for the closing. Confirm whether Q&A is inside the slot.

## 01 · Meanwhile, in React / そのころ、React は。 `hello`

- **A catch-up for people busy keeping up with AI.** / AI を追う人の React キャッチアップ。
- Greet the room; title joke if it feels natural. No need to explain the whole premise yet.
- Next → why I needed this too.

## 02 · AI moved fast. React did too / React も進んでいた `why`

- **I organize a React event; I still fell behind.** / 主催者でも追いつけていなかった。
- Agents changed our work; prompts, harnesses, loops, skills keep changing. Pick one personal example, not the whole list.
- Next → five things I found while catching up.

## 03 · Five things to bring back / 5 つの話 `agenda`

- **React → Next.js → Start → Redact → Compiler.**
- React APIs; explicit caching; stable full-stack framework; runtime tradeoffs; compiler tooling.
- Next → React first, with two small demos.

## 04 · React 19.3 / React 19.3 `react`

- **View Transitions + Fragment refs became stable.** / 2 つの API が安定版に。
- September 9, 2026. Keep release context brief.
- Next → the browser feature behind React's animation API.

## 05 · App-like transitions on the web / Web の画面遷移 `transition-background` · SHORTEN IF LATE

- **React coordinates the browser's View Transition API.** / ブラウザの API を React から使う。
- Same-document: Chrome 2023; cross-document: 2024; React experimental API: April 2025 → stable 19.3.
- Browser support differs by feature; this demo changes content within one page. Don't dwell on the timeline.

## 06 · Same component. Next stop / 次の街へ `transition-demo` · DEMO

- **Wrap the content; update state inside `startTransition`.** / 囲んで、Transition の中で更新。
- **Do:** Demo → click Next stop once; pause for Tokyo → Kyoto cross-fade → Code tab → point to wrapper + handler.
- Ordinary urgent state updates do not trigger this animation. Browser support and reduced-motion preferences matter.
- **Fallback:** if motion fails, use Code and describe the cross-fade; no debugging on stage. Click outside the iframe before the next arrow key.

## 07 · Animate content as it becomes ready / 準備できたら動かす `transition-triggers`

- **Not only button clicks: Suspense reveals and deferred updates too.** / 読み込み完了・遅延更新でも。
- Top: fallback → loaded content. Bottom: type immediately; deferred results animate later.
- CSS transition classes or animation callbacks customize motion. Next → DOM access without a wrapper.

## 08 · A ref, without the extra div / ref 用の div は不要 `fragment-refs`

- **Explicit `<Fragment ref>` groups DOM access without adding DOM.** / DOM を増やさず、まとめて操作。
- Extra wrappers can break layout. Cards remain direct children of the feed; no ref API added to each card.
- Observer registration targets first-level DOM children, not a single combined Fragment rectangle. Focus methods are another use.

## 09 · Which updates appeared? / 表示された変更点 `fragment-demo` · DEMO

- **One Fragment ref registers the cards with one observer.** / 1 つの ref で各カードを登録。
- **Do:** show 1 / 3 → scroll **inside** the feed to card 2, then 3 → pause at all seen → Code tab.
- Each card counts once after 65% is visible. Point to `observeUsing`; cleanup uses `unobserveUsing` and disconnect.
- **Fallback:** explain 1 → 2 → 3 from code. Click outside the iframe before navigating.

## 10 · Before browser(): two checks / 従来の環境判定 `browser-before`

- **Repeated boilerplate for browser-only rendering.** / ブラウザ専用描画の定型コード。
- Effect/mounted flag → second render. `typeof window` → initial markup differences can cause hydration mismatch.
- These are separate patterns, not two parts of one component. Next → official API.

## 11 · Browser APIs? Say so / ブラウザ専用と宣言 `browser`

- **Client Component + `use(browser())` + Suspense.** / 3 つをセットで。
- Server → fallback; browser → content can read `window`. `browser()` alone does nothing.
- This controls rendering location; it does not subscribe to resize events.

## 12 · Two more updates / ほかの更新 `react-more` · SHORTEN IF LATE

- **Trusted Types integration; client-defined Context providers in RSC.**
- Trusted values still need policies + CSP. Rendering the provider doesn't let RSC create or read context.
- Next → Next.js and caching.

## 13 · Next.js 16.4 / キャッシュを意図して選ぶ `next`

- **Cache Components are the recommended approach.** / 推奨するキャッシュのモデルに。
- October 6, 2026. Recommendation, new-project default, framework default are different milestones.

## 14 · From implicit to composable / 明示して組み合わせる `cache-model`

- **Choose reusable work and request-time work explicitly.** / 再利用する処理を自分で指定。
- Earlier defaults were hard to track → `'use cache'` + streaming.
- 16.4 `create-next-app`: enabled for new projects; framework default planned for v17. Don't imply every existing app switched.

## 15 · Name what can be reused / 再利用する処理 `use-cache`

- **Cache the database work in `TalkList`.** / DB 問い合わせを再利用。
- Prerequisite: Cache Components enabled. Point to `'use cache'` → `cacheLife('hours')` → tag `'talks'`.
- Lifetime vs targeted revalidation; the tag labels entries, it doesn't invalidate them by itself. Next.js illustration, not code running in this Start deck.

## 16 · A build-time guardrail / 静的要件の保証 `ensure-static`

- **Fail the build when the static requirement is violated.** / 静的要件に違反したらビルド失敗。
- Requires Cache Components. Page or layout subtree; `navigation` includes earlier `shell` / `prefetch` requirements.
- Next → a different choice: defer work until navigation.

## 17 · Some work can wait for the click / クリックまで待つ処理 `navigation`

- **`await navigation()` defers subsequent runtime work.** / 以降の実行時処理を後回し。
- Discussion query is the example. With Partial Prefetching, keep that work out of shell and per-link prefetch.
- Static prerenders can still contain it. Contrast: `ensureStatic` = enforce; `navigation()` = defer.

## 18 · The framework meets your agent / エージェント対応 `next-agents` · OPTIONAL

- **Version-specific upgrade help and reviewed feedback.** / バージョンに合う移行支援。
- `--agent`; experimental upgrade/feedback options. Human reviews the report before sending.
- Next → another full-stack framework. No live upgrade command.

## 19 · TanStack Start 1.0 / 安定版の選択肢 `start`

- **TanStack Router + SSR + server functions; stable core.** / 型安全な Router をフルスタックへ。
- October 13 stable milestone; not a claim that the installed npm version is literally 1.0.0.
- **Room cue:** anyone tried Start? Brief hands or one response; move on if quiet. RSC is separately experimental.

## 20 · The talk runs on the topic / このデッキの構成 `start-stack`

- **This deck is the example: Start + Vite/Oxc + static output.** / このスライド自身が実例。
- Pages build prerenders to static files; no running production server needed for that output.
- Start also supports live SSR/server functions. Next → inspect how the data arrives.

## 21 · How this route loads the deck / データを取得するコード `start-server-function`

- **`getSlides` → route loader → `useLoaderData()` → Deck.**
- Point through the actual code in that order. Server-only import returns typed slide data.
- This returns data, not an RSC. Next slide follows the boundary explicitly.

## 22 · Follow the data / データの流れ `start-data-flow`

- **The return type carries through to the component.** / 戻り値の型がコンポーネントまでつながる。
- Live server: Start handles request/serialization. Pages: loader result embedded at build time.
- Slide/language changes reuse hydrated data; clicking next is not a server request.

## 23 · What if the content were an RSC? / 本文を RSC に？ `start-rsc-example`

- **Return renderable content instead of slide data.** / データではなく、描画可能な本文を返す。
- Hypothetical Markdown parser/highlighter stays server-side; interactive controls remain client-side.
- Experimental opt-in; **not enabled here**; no measured bundle saving claimed. Next → change runtime instead of framework.

## 24 · TanStack Redact / ランタイムを選ぶ `redact`

- **Smaller browser runtime, familiar React APIs, synchronous rendering.** / API はなじみのまま、同期描画へ。
- Announced October 26. Preact is a useful analogy, not an identical compatibility guarantee.

## 25 · Same components, different runtime / 同じコード、別の実行基盤 `redact-tradeoffs`

- **Plugin changes runtime; React imports stay.** / 設定で切り替え、import はそのまま。
- This deck uses Redact. The two demos use native React in separate iframes.
- API compatibility ≠ identical behavior; default Redact ViewTransition doesn't animate. Next → scheduling tradeoff.

## 26 · Waiting for data ≠ yielding CPU / データ待ちと描画中断 `redact-scheduling`

- **Keeping old results while suspended is different from interrupting render work.** / 待機中の表示維持と CPU 処理の中断は別。
- Redact retains previous results during data waits, but rendering passes are synchronous.
- This deck has small updates; expensive app updates need responsiveness profiling as well as size measurements.

## 27 · Compatibility needs a concrete setup / 構成ごとの互換性 `redact-compatibility`

- **Published fixtures are evidence for those tested setups.** / 結果は検証した構成に対するもの。
- TanStack's tested Start setups: Redact passed, standard Preact setup didn't.
- Not universal compatibility; check hydration, navigation, forms, APIs in your own app. Avoid a generic “Preact is broken” claim.

## 28 · Recorded deck: 40.5% less JS / 記録した JS サイズ `runtime-size`

- **113.4 → 67.5 KiB gzip; about 40.5% less.** / デッキ全体のクライアント JS。
- Same earlier deck, compiler on in both. **Recorded before content expansion**, not today's rebuilt totals.
- Excludes CSS, fonts, HTML, common native demo bundle. Not standalone runtime size or a responsiveness measurement.

## 29 · React Compiler / メモ化をコンパイラへ `compiler`

- **Build-time memoization reuses calculations and JSX.** / ビルド時に再利用の仕組みを生成。
- Less manual `useMemo` / `useCallback` / `React.memo`; still pure rendering and Rules of React.
- 1.0 shipped October 2025; this year's focus is toolchain integration.

## 30 · From React Forget to 1.0 / Compiler の歴史 `compiler-history` · OPTIONAL

- **2021 prototype → 2024 open source → April 2025 RC → October 2025 stable.**
- Automatic memoization isn't new this year. Keep to one sentence if short on time.

## 31 · Build time and update time / 2 つのコスト `compiler-two-clocks`

- **Build cost and user-facing update benefit are separate measurements.** / ビルドの負荷と更新の効果は別。
- Compiler analyzes/emits cache at build time; cache reuses work during updates.
- Rust changes compilation cost. Profiling interactions tells us about runtime benefit.

## 32 · A Rust path into Vite / Vite の Rust 連携 `oxc`

- **Install `oxc-transform-react`; opt in with `compiler: true`.**
- React team's Rust port adapted by Oxc; Vite 8 + plugin-react 6.1+, **experimental**. This deck uses it.
- **12–15× = preliminary transform benchmark, two samples vs Babel.** Not whole-app build speed. Next → app-level evidence.

## 33 · Recorded builds: 24% less time / 記録したビルド時間 `compiler-build-time`

- **Babel 756 ms → Rust 573 ms: ~24% less time.**
- Earlier deck, Apple M2, 9 alternating runs/config, medians. Client + server builds; exclude prerendering/demo rebuild.
- Compiler off: 591 ms; ranges overlap with Rust. Recorded results, not a fresh benchmark of today's deck.

## 34 · A transform is part of a build / 変換は全体の一部 `compiler-reading-results`

- **12–15× transform and 24% app-build reduction measure different scopes.** / 数字と測定対象をセットで。
- Other build work limits whole-build improvement.
- 573 vs 591 ms **doesn't show enabling Compiler makes builds faster**. Next → inspect what changed in output.

## 35 · What changed in our build? / 出力の比較 `compiler-output`

- **Same title → reuse; changed title → create and cache.** / 同じなら再利用、変われば更新。
- Off: heading created each call. On: compare input, store heading in `$[1]`.
- We didn't handwrite the cache. Visible transformation, not measured user-facing speedup.

## 36 · Spot the Memo badge / Memo バッジ `compiler-devtools`

- **DevTools confirms the component was compiled.** / コンパイルされたことを確認。
- Point to blue Memo badge beside `SlideTitle`; screenshot is from native React inspection build.
- Doesn't prove the app feels faster. Screenshot is enough; no live DevTools hunt.

## 37 · Two paths in Next.js / Next.js の Compiler `next-compiler` · OPTIONAL

- **Standard: Babel + SWC file filter. Experimental: Rust inside Turbopack.**
- Rust path available since 16.3; 16.4 conformance work continues.
- Build improvements and browser interaction performance still need separate evaluation.

## 38 · Caught up. For now / ひとまず追いついた `takeaways`

- **React APIs; Next.js caching; stable Start; Redact tradeoffs; Compiler tooling.**
- Invite one concrete next step: try an API, follow the data in this repo, or inspect a build.
- Personal close: trying these ideas in the deck made them easier to understand. Thank the room; questions if time allows.

---

**Recovery cues:** blank on a point → read the slide takeaway, then move on. Audience question → answer briefly if on-topic, otherwise park for Q&A. Demo failure → Code tab + expected result; stop troubleshooting. Running late → skip `next-agents`, `compiler-history`, `next-compiler`; compress background; keep benchmark caveats and the close.
