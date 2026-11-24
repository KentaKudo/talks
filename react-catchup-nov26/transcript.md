# Intro

<!-- Working draft. Technical claims checked on 2026-11-23; sources and qualifications are in transcript-fact-check.md. Placeholders remain unfinished. -->

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

[Code snippet: before browser()]

With `browser()`, you can write it like this instead:

[Code snippet: with browser()]

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

[Code snippet: use cache]

You can also use `cacheLife()` and `cacheTag()` to control how long the cache lasts and how it’s revalidated.

## Cache Components

Next.js 16.4 adds a few APIs for more precise control over this behaviour.

The `ensureStatic` setting lets you enforce static rendering requirements at the page or layout level.

Set it to `'navigation'` on a page, and the build will fail if the page includes work that requires request-time rendering.

You can also set it on a layout to apply that requirement to all the pages underneath it.

Next.js 16.4 also introduces `navigation()` from `next/cache`. With Cache Components and Partial Prefetching, calling `await navigation()` keeps the runtime work below it out of the app shell and per-link prefetches until the user navigates. Static prerenders can still include that content, so it may appear in a static prefetch.

[Code snippets: ensureStatic and navigation()]

## Other updates

Beyond caching, there are also some updates for coding agents.

- The `--agent` flag was added to `next upgrade` to help agents handle upgrades from start to finish.
- There are also new experimental configuration options, including `experimental.agentUpgrade` and `experimental.agentFeedback`.

Check out the documentation for the details.

# TanStack Start 1.0

After a long beta and release-candidate period, the TanStack team announced Start’s stable 1.0 milestone on October 13 this year.

Has anyone here tried it yet? How has it been?

# TanStack Redact

Last month, the TanStack team also announced Redact, a smaller replacement for React and React DOM in the browser.

It implements React APIs so you can keep your existing components, hooks, and imports, but it uses synchronous rendering without React’s time slicing or interruptible rendering.

The broad idea is similar to Preact: a smaller runtime for React-style apps. Redact supports React 19 APIs, but API compatibility doesn’t mean identical behaviour. For example, its View Transition animations are experimental and opt-in.

# React Compiler

The final topic is React Compiler.

It reached 1.0 on October 7 last year. For this catch-up, I’m going to focus on the tooling and ecosystem integrations that have followed.

[Quick recap of React Compiler — to be written]

The original React Compiler was written in TypeScript and JavaScript and distributed as a Babel plugin.

This year, the React team ported the compiler to Rust, and other toolchains have been integrating and adapting that work.

Oxc, which is used in Vite’s toolchain, announced native React Compiler support in August. It’s available as an experimental, opt-in integration in `@vitejs/plugin-react` 6.1 and later for Vite 8.

It’s written in Rust. In Oxc’s preliminary benchmark, the compiler transform ran roughly 12–15 times as fast as the Babel plugin on two TSX samples. That’s a measurement of the compiler transform, rather than the speed of an entire application build.

Next.js’s standard React Compiler integration still uses the Babel plugin, with an SWC optimisation that limits which files are passed to it. Since version 16.3, Next.js has also offered an experimental Rust implementation that runs inside Turbopack.
