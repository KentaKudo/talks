# Intro

For freestyle delivery, use [speaker-memo.md](speaker-memo.md). This full draft remains a rehearsal/reference script; the memo follows all 37 slides and includes demo actions and optional cuts.

<!-- Complete rehearsal draft, updated 2026-11-24. Bracketed lines are stage directions, not spoken text. Sources and measurement qualifications are in transcript-fact-check.md. -->

Hi everyone! How’s everyone doing?

Today’s talk is called “Meanwhile, in React / そのころ、Reactは。”
My agent came up with the title, and I liked it.

Since the new AI model came out earlier this year, the way we work has changed. We’re spending more and more time asking agents to write code, and less time writing it ourselves.

We’re busy keeping up with the latest prompting techniques and all the new terms that seem to appear every week: harness engineering, loop engineering, software factories…

And then there’s the work of creating new skills and updating existing ones, only for the next model release to make them obsolete a week later.

I’m a little embarrassed to admit this as someone who organises a React event, but I haven’t kept up with React for the past few months.

So today, I’d like to share what I found while catching up—for anyone who’s been busy keeping up with AI, just like me.

I’ll cover five topics:

- The React 19.3 release
- The Next.js 16.4 release
- TanStack Start reaching 1.0
- The announcement of TanStack Redact
- Recent developments in React Compiler

Let’s get started.

# React 19.3

React 19.3 was released in September.
Two APIs became stable in this release: View Transitions and Fragment refs.

## <ViewTransition>

View Transitions were first introduced as an experimental React feature in April last year, so you may already be familiar with them.

The `<ViewTransition>` component lets you animate UI changes in React using the browser’s View Transition API.

The idea behind the browser API is to make smooth, app-like transitions possible on the web.

Single-document transitions arrived in Chrome in 2023, followed by cross-document transitions in 2024.
Same-document transitions are now supported in current Chrome, Edge, Safari, and Firefox. Cross-document transitions are supported in Chrome and Safari, but aren’t yet available in stable Firefox.

React gives us APIs for using this browser feature. Here’s a quick demo.

[Demo: View Transition]

This card shows the name of a city. When I click the button, the city changes with a cross-fade animation.

Here’s what the code looks like.

We wrap the content we want to animate in `<ViewTransition>`. Then, in the button’s `onClick` handler, we update the state inside `startTransition()`.

Ordinary urgent state updates don’t trigger these animations.

You can also trigger an animation with `<Suspense>`. When the content finishes loading, React animates the change from the fallback to the actual content.

Another option is `useDeferredValue`, which lets you animate updates to things like search results.

You can customise the default cross-fade using View Transition classes in CSS, or use the animation event props to control it with the Web Animations API.

Check out the documentation for more examples and details.

## Fragment refs

You can now pass a `ref` to an explicit `<Fragment>`.

Before this release, you couldn’t attach a ref to a Fragment. You often had to add a wrapper `<div>` just to get a ref, and that extra element could interfere with your styling or layout.

With Fragment refs, you can work with a group of elements without adding a wrapper. For example, you can focus the first focusable element in the group, or observe the elements together.

Let me show you the demo.

[Demo: Fragment refs]

Right now, only the first of these three items is marked as seen. As I scroll down, the second one gets marked as seen, and then the third.

Previously, you had to register each item with an `IntersectionObserver` yourself. With a Fragment ref, you can register the elements in the group through a single ref.

This is especially useful when the card component doesn’t accept a ref—for example, because it comes from a library maintained by another team.

## Other features

React 19.3 also introduces the `browser()` function in React DOM.

If you’ve needed to keep a component that uses browser APIs from rendering on the server, you’ve probably written boilerplate like this:

[Show slide: browser-before]

One common approach is to set a flag in an Effect after mounting. Another is to check whether `window` exists. Both mean writing the same environment check again, and changing the initial markup based on that check can cause hydration mismatches.

With `browser()`, you can write it like this instead:

[Show slide: browser]

Here, `WindowSize` calls `use(browser())` before reading `window.innerWidth`. The surrounding Suspense boundary supplies the loading message on the server.

You still need to handle browser-only rendering, but now there’s an official API for it, and the code is a little cleaner.

The key is to call `use(browser())` in a Client Component inside a `<Suspense>` boundary. The server renders the fallback, and the component renders normally in the browser. Calling `browser()` on its own has no effect.

A couple of other updates worth mentioning:

- Integration with the Trusted Types API, so React preserves trusted values created by your policies when passing them to DOM APIs. You still need to configure those policies and the relevant Content Security Policy.
- Support for rendering a `<Context>` provider imported from a Client Component module directly in Server Components. Server Components still can’t create or read context themselves.

# Next.js 16.4

Next up is Next.js. Version 16.4 was released in October.

The main message of this release is that Cache Components are now recommended as “the best choice for every Next.js app”.

The caching model in Next.js has changed quite a bit over time.

When the App Router first arrived, a lot of caching happened implicitly. It wasn’t always easy to tell what was cached and what wasn’t.

The team later changed direction, moving away from those implicit defaults towards more explicit control.

Cache Components are the latest approach: you choose which parts can be cached and which need to run dynamically.

Starting with 16.4, Cache Components are enabled by default in new projects created with `create-next-app`. In the next major version, they’ll become the framework default as well.

Once you’ve enabled them, you can cache a component by adding the `'use cache'` directive, like this.

[Show slide: use-cache]

In this example, `TalkList` loads talks from a database. The directive lets Next.js reuse that work. The lifetime is set to hours, and the tag lets us target the related cache entries when the talks change.

You can also use `cacheLife()` and `cacheTag()` to control how long the cache lasts and how it’s revalidated.

## Cache Components

Next.js 16.4 adds a few APIs for more precise control over this behaviour.

The `ensureStatic` setting lets you enforce static rendering requirements at the page or layout level.

Set it to `'navigation'` on a page, and the build will fail if the page includes work that requires request-time rendering.

You can also set it on a layout to apply that requirement to all the pages underneath it.

Next.js 16.4 also introduces `navigation()` from `next/cache`. With Cache Components and Partial Prefetching, calling `await navigation()` keeps the runtime work below it out of the app shell and per-link prefetches until the user navigates. Static prerenders can still include that content, so it may appear in a static prefetch.

[Show slides: ensure-static and navigation]

These solve two different problems. With `ensureStatic`, I’m saying, “Fail the build if this route needs request-time rendering.” With `navigation()`, I’m saying, “This part can wait until someone actually visits.”

For example, I might want the main talk page ready ahead of time, but leave an expensive discussion query until navigation. These APIs make that choice visible in the code.

## Other updates

Beyond caching, there are also some updates for coding agents.

- The `--agent` flag was added to `next upgrade` to help agents handle upgrades from start to finish.
- There are also new experimental configuration options, including `experimental.agentUpgrade` and `experimental.agentFeedback`.

Check out the documentation for the details.

# TanStack Start 1.0

After a long beta and release-candidate period, the TanStack team announced Start’s stable 1.0 milestone on October 13 this year.

Has anyone here tried it yet? How has it been?

[Pause briefly for a show of hands.]

If you haven’t used it, Start is a full-stack framework built on TanStack Router. The router gives you type-safe routes and data loading; Start adds server rendering and server functions.

What interests me is how it builds on the application model many of us already know. You can keep client-side navigation and interactive components, and move work to the server through explicit APIs.

The stable milestone is a commitment to that foundation. It doesn’t mean every feature around it is stable—we’ll see an experimental one in a moment.

## This deck is a Start app

Rather than show another to-do app, let’s look at the app we’re already using. These slides run on TanStack Start.

[Show slide: start-stack]

The build uses Vite, and the route loads the slide definitions through a server function. For GitHub Pages, the app is prerendered into static files.

So using a full-stack framework doesn’t mean this presentation needs a running production server. In this build, the server work happens ahead of time.

[Show slide: start-server-function]

At the top, `getSlides` uses `createServerFn`. Its handler imports and returns the slide definitions.

The route’s loader calls that function, and the component reads the result with `Route.useLoaderData()`.

[Show slide: start-data-flow]

Follow that path: server function, loader, component. The return type carries through, so the component knows the shape of the slide data.

In an application with a live server, the same API lets a browser call server-only logic. Start handles the request and serialization across that boundary.

For this static deck, the initial result is embedded during prerendering. Once it loads, changing slides or switching languages uses the data already in the browser. Clicking “next” doesn’t call the server again.

That’s a small example, but I think it makes the model easier to understand: choose where the data comes from, then let the route deliver it to the component.

## What about Server Components?

One thing I wanted to check while catching up was whether Start supports React Server Components.

It does, through an experimental, opt-in integration. That’s separate from the stable core framework.

[Show slide: start-rsc-example]

This is an illustration of how we could change this app. Instead of returning slide data, the server function calls `renderServerComponent` and returns renderable slide content through the loader.

Imagine the slide body came from Markdown and needed a large parser or syntax highlighter. Rendering that body on the server could keep those dependencies out of the browser bundle, while navigation and language controls remain interactive.

That’s different from simply returning the slide definitions, as this deck currently does. We’re choosing where the content is rendered as well as where its data is loaded.

This example isn’t enabled in the presentation. But it shows a useful direction: you can start with loaders and server functions, then consider Server Components where they help.

# TanStack Redact

Now we’ve looked at the framework. What about the runtime that runs our components in the browser?

Last month, the TanStack team announced Redact, a smaller replacement for React and React DOM in the browser.

It implements React APIs so you can keep your existing components, hooks, and imports, but it uses synchronous rendering without React’s time slicing or interruptible rendering.

The broad idea is similar to Preact: a smaller runtime for React-style apps. Redact supports React 19 APIs, but API compatibility doesn’t mean identical behaviour. For example, its View Transition animations are experimental and opt-in.

## What are we trading away?

[Show slide: redact-tradeoffs]

[Show slide: redact-scheduling]

The important question is what happens when an update is expensive.

This is a tradeoff between bundle size and responsiveness. Redact gives us a smaller runtime; React's concurrent rendering can prioritize urgent input while a non-urgent update is still rendering. For example, typing can stay responsive while a heavy results view updates.

React’s concurrent renderer can interrupt rendering work. Redact’s default renderer completes a rendering pass synchronously. If a pass takes a long time, it can hold up the browser’s main thread.

That doesn’t mean transition hooks disappear. Redact can still retain previous results while new results suspend. Keeping old content visible while waiting for data and interrupting CPU work during rendering are different capabilities.

For a slide deck like this, the updates are fairly small: move to another slide, change language, open the overview. That makes it a useful place to explore the smaller runtime.

For an app with expensive interactive updates, I’d want to measure responsiveness as well as download size.

[Show slide: redact-compatibility]

Why consider Redact when Preact already exists? One reason is broader support for React 19 APIs.

As checked on November 25, Preact compat 11.1.0 doesn't provide useActionState, useOptimistic, or useFormStatus. Redact implements those APIs, including pending form state and optimistic updates. That doesn't mean Preact can't run any React 19 app; the distinction is which APIs and behaviors the app needs.

Redact still has limitations. Rendering is synchronous, and ViewTransition animations are off by default and require an experimental opt-in. Check your own app's dependencies and interactions before switching. This presentation's React demos use a separate native React bundle.

## What changed in this deck?

[Show slide: runtime-size]

This presentation also uses Redact. The configuration changes the runtime, while the component code still imports hooks from React.

The recorded build comparison uses the same deck with the Compiler enabled in both versions. These measurements were taken before the latest content additions.

With native React, the client JavaScript totals about 113.4 kibibytes gzipped. With Redact, it’s about 67.5 kibibytes. That’s a reduction of around 40.5 percent.

These are whole-deck JavaScript totals, not standalone runtime sizes. They exclude CSS, fonts, HTML, and the shared demo bundle.

And there’s a reason the demos have their own bundle: the View Transition and Fragment ref examples run inside iframes with native React. The surrounding presentation uses Redact, but those examples demonstrate React itself.

For me, that’s the interesting part of this announcement. We can keep familiar component APIs and explore a different balance between bundle size and rendering capabilities. The right balance depends on the application.

# React Compiler

The final topic is React Compiler.

It reached 1.0 on October 7 last year. For this catch-up, I’m going to focus on the tooling and ecosystem integrations that have followed.

## A quick recap

React Compiler adds memoization at build time. It analyses components and hooks to find calculations and JSX that can be reused when their inputs haven’t changed.

That can reduce the manual work we’ve done with `useMemo`, `useCallback`, and `React.memo`. We still need to follow the Rules of React, including keeping rendering pure.

The history goes back to the React Forget prototype shown in 2021. The compiler was open-sourced in 2024, reached release candidate in April 2025, and became stable that October.

[Show slide: compiler-two-clocks]

So automatic memoization itself isn’t this year’s announcement. This year’s story is how it fits into our build tools.

## A faster path through the toolchain

The original React Compiler was written in TypeScript and JavaScript and distributed as a Babel plugin.

This year, the React team ported the compiler to Rust, and other toolchains have been integrating and adapting that work.

Oxc, which is used in Vite’s toolchain, announced native React Compiler support in August. It’s available as an experimental, opt-in integration in `@vitejs/plugin-react` 6.1 and later for Vite 8.

[Show slide: oxc]

For this integration, we install `oxc-transform-react` and enable the compiler in the React plugin. That’s also the integration used by this deck.

In Oxc’s preliminary benchmark, the compiler transform ran roughly 12–15 times as fast as the Babel plugin on two TSX samples. That’s a measurement of the compiler transform, rather than the speed of an entire application build.

## What does that mean for this app?

[Show slide: compiler-build-time]

The deck includes a smaller, application-level comparison: nine builds per configuration on an Apple M2, alternating configurations and taking the median.

The Babel version took 756 milliseconds. The Rust version took 573 milliseconds—about 24 percent less time.

That measures the production client and server builds, excluding prerendering and rebuilding the demo bundle.

With the compiler disabled, the median was 591 milliseconds. That’s close to the Rust result, and the ranges overlap. I wouldn’t read that as “turning the compiler on makes builds faster.” The useful result here is the reduction compared with the Babel path in this particular setup.

The transform benchmark covers only part of a build; the application build includes other work too.

## What does the compiler actually generate?

[Show slide: compiler-output]

Let’s look at something more concrete than a timing number.

This is the emitted code for `SlideTitle`, the component that renders a heading from a `title` prop.

Without the compiler, the function creates the heading element each time it runs.

With the compiler, there’s a cache and a comparison. If `title` has changed, it creates a new heading and stores it. If the title is unchanged, it reuses the cached element.

We didn’t write that cache by hand. It came from the compiler analysing the original component.

This is a tiny example, so it’s not evidence of a noticeable speedup for this presentation. It does make the transformation visible: the extra code is there to avoid repeating work during updates.

[Show slide: compiler-devtools]

Another way to check your setup is React DevTools. The Memo badge on `SlideTitle` indicates that the compiler optimised it.

The screenshot here comes from the native React version of the deck. Between the emitted code and DevTools, we can verify that enabling the option actually changed the component.

## And in Next.js?

Next.js’s standard React Compiler integration still uses the Babel plugin, with an SWC optimisation that limits which files are passed to it. Since version 16.3, Next.js has also offered an experimental Rust implementation that runs inside Turbopack.

So there are two things to evaluate separately: how much the compiler costs during a build, and how much its memoization helps your app during updates.

The Rust work addresses the first. Profiling your application tells you about the second.

# Closing

[Show slide: takeaways]

Those are the five things I wanted to catch up on.

React gives us new ways to animate updates and work with groups of elements. Next.js is making caching choices more explicit. Start has reached its stable milestone. Redact gives us another runtime tradeoff to explore. And React Compiler is becoming easier to fit into modern toolchains.

What I enjoyed about preparing this talk was being able to try several of those ideas in the presentation itself. They became much easier to understand once I could follow the data, compare the builds, and inspect the output.

If you’ve also been busy keeping up with AI, I hope this gives you a useful place to pick React back up.

We’re caught up. For now.

Thank you!
