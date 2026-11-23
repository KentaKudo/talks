# Intro

Hi everyone, how are you guys doing.

Since the new model of AI is released early this year, our life has changed; we spend more and more time telling agents to code instead of us writing code by ourselves.

We are busy catching up with the latest prompting technics, new topics popping out every week like harness engineering, loop engineering, and software factory, and maintaining harness by creating new skills, retiring old ones etc.

It’s a shame of me as an organiser of the react event but I haven’t caught up with the latest React topic for months.

Today let me share the recent react news that I looked up with you who are busy catching up AI like me.

I’ll cover these five topics today:
- React 19.3 is released
- Next.js 16.4 is released 
- TanStack Start reached 1.0
- TanStack Redact is announced
- Recent React Compiler topics

Let’s get started with React 19.3

# React 19.3

React 19.3 was released in September.
Two main topics: View Transitions and Fragment Refs.

## <ViewTransition>

View Transition was already introduced April last year as an experimental feature so you may be already familiar with it.

It let you animate transitions using browser’s View Transition API in React. 

The motivation behind View Transition API was to enable browsers to animate transitions like mobile apps.
Chrome introduced the API as Shared Element Transitions later renamed to View Transitions.
The first version of the API, single-document transition, was introduced in 2023 followed by cross-document transition in 2024.
Now we can say single-document transition is safely available across major browsers accounting for 93% of the share whereas cross-document transition needs to wait a bit more for Firefox support.

And now you can access this API via React. Let me show you some examples:
<demo with code snippets>

This transition can be triggered with other React APIs such as state updates inside of startTransition(), sync resolution with <Suspense>, and the `useDeferredValue` hook.
You can also customise the default cross-fade effect using View Transition Class in CSS or Web Animation via event props.

There are more things you can do with <ViewTransition> component. Check out the documentation for details.

## Fragment Refs

Now you can give a ref prop to the <Fragment> component without adding extra <div> wrapper.

Up until this release you cannot give a ref prop to <Fragment> component, and you had to wrap the component with <div> just to give ref. Sometimes it’s not even possible for styling or layout reasons.

But now you can write like this:<snippet>

By using this, you can wire IntersectionObserver or ResizeObserver without changing the DOM structure even if the inner component doesn’t expose ref as a prop like this:<snippet>

## Other features

React 19.3 is shipped with the browser() function too.
Previously to prevent server from rendering component that accesses browser APIs, you need this boilerplate you may have come across:

<snippet>

Using browser(), you can now write like this:

<snippet>

You still need this, but it’s React official API and it’s a tiny bit cleaner.

Other features like:
- Integration with Trusted Types API for DOM-based XSS attacks, and
- Ergonomics improvement by rendering <Context> in Server Components

# Next.js 16.4

Next topic is Next.js. Version 16.4 was released in October.

The biggest message was that now they recommend Cache Components as “the best choice for every Next.js app”.

<brief history of caches in Next.js and Cache Components>

When you run `create-next-app`, Cache Components are enabled by default.
Once the option is enabled, you can turn a component into a Cache Component using ‘use cache’ directive like this:<snippet>

Besides ‘use cache’ directive, you can use cacheLife() and cacheTag() functions to control cache behaviour.

## Cache Components

Next.js 16.4 introduced APIs to give finer control to the cache behaviour.

ensureStatic constant is to control page or layout level cache behaviour.

By setting this constant ‘navigation’ you can make sure the page is statically built raising error on build time when dynamic element is in the component tree.

You can also define ensureStatic to be ‘navigation’ to make sure all the pages that use the layout to be static.

Next.js 16.4 also introduced navigation() function from ‘next/cache’ package to defer the prefetch until an actual navigation takes place:<snippets>

## Other updates

Besides Cache Components, another topic was around support for agents.

- The `—agent` flag was added to the `next upgrade` command to help agents to upgrade the from start to finish.
- They added other agent related config options such as `agentUpgrade` and `agentFeedback`
Check out their document for details.

# TanStack Start 1.0

Since the announcement of the TanStack Start framework June 2024, they reached 1.0 this October.

# TanStack Redact

Last month they also announced TanStack Redact which is a smaller replacement for React and React DOM packages in the browser.

It has the same API as React but reduces the size by dropping concurrent rendering at all. It’s the same idea as preact but compatible with React 19.

# React Compiler

The last topic is React Compiler.

It reached v1.0 October last year, and since then the focus was more on its tooling and ecosystem rather than new features.

<quick recap of React Compiler>

The original React Compiler was written in TS/JS and provided as a babel plugin.
Across this year other tooling systems build their own Compiler as their own plugin.

oxc, used behind Vite, announced native React Compiler support in August and is now available in Vite.
It’s written in Rust and they claim it’s 12-15x faster than the original Babel plugin.

Next.js’s standard React Compiler integration uses the Babel plugin, with an SWC optimization to limit which files are sent to it. Since v16.3, Next.js has also offered an experimental Rust implementation that runs inside Turbopack.

