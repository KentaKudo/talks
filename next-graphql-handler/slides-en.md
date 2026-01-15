---
marp: true
theme: default
class: invert
paginate: true
backgroundColor: #1a1a1a
color: #f2f2f2
---

# Revisiting GraphQL in the RSC Era, and Co-Located GraphQL Backend Inside Next.js

**Kenta Kudo** - Freelance Software Engineer
React Osaka - Jan 2026

---

# About Me

- 💼 Freelance Software Engineer
- 🏢 Previously at Mercari UK
- 🌍 Lived in the UK for 6 years
- 🏯 Moved to Kansai last year

<!--

Hi everyone, I'm Kenta.

Let me quickly introduce myself again to fill in the background:

- I'm a freelance software engineer
- Previously worked at companies such as Mercari UK
- Lived in the UK for 6 years
- I moved to Kansai last year — Still very new!

Let me use this opportunity to announce something......

-->

---

# 📚 Book Announcement

<style scoped>
.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}
</style>

<div class="columns">
<div>

## "世界で働くエンジニア"

- 10 Japanese software engineers working abroad
- Beta release now, official release end of month
- Available as epub and pdf (free updates)
- Spin-off from **London Tech Talk** podcast

_(Japanese only for now!)_

</div>
<div>

<img src="LondonTechTalk_10co-authors.webp" width="300" />

</div>
</div>

<!--

Quick announcement, then we'll get technical.

I co-authored a book titled "世界で働くエンジニア"

It's an omnibus style autobiography made of 10 different Japanese software engineers working abroad.
The book is currently in beta release and will be officially released at the end of this month.
You can already purchase from here.
The book is available both as epub and pdf file and you can get free updates whenever new version is published.

(Sorry only Japanese version is available as of now...!)

Please have a look if you're interested or introduce to your friends who might be interested.
Feedback is very welcome.

The project spun out from the community of London Tech Talk podcast hosted by Ken, who's my colleague at high school who lives in London now.
The podcast is also highly recommended if you're interested in working abroad as a software engineer.

If you have any questions, please let me know!

-->

---

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

# Purchase the Book

<img src="adobe-express-qr-code.png" width="400" />

**Scan to get your copy!**

https://store.london-tech-talk.com/products/book_engineers_working_abroad

<!--

**[STAY ON THIS SLIDE - Let audiences scan the QR code]**

-->

---

# Today's Agenda

1. **Introduction**: Do we still need GraphQL?
2. **Rediscover GraphQL**: Straightforward queries and granular mutations
3. **Co-Located Backend Architecture** with Route Handler
4. **Code-first Approach** with Pothos GraphQL
5. **Production Considerations**: Using GraphQL safely
6. **Recap**: GraphQL can still be an option

<!--

The title of the talk today is: Revisiting GraphQL in the RSC Era, and Co-Located GraphQL Backend Inside Next.js

Here's today's agenda:

- Introduction: Do we still need GraphQL?
- Rediscover GraphQL: straightforward queries and granular mutations
- Co-Located Backend Architecture with Route Handler
- Code-first Approach with Pothos GraphQL
- Production Considerations: Using GraphQL safely
- Recap: GraphQL can still be an option

Let's get started!

-->

---

# 1. Introduction

## Do we still need GraphQL?

### The React Server Component Era

- **RSC** enables server-side data fetching per component
- Prior to RSC: fetch all data in a single query
- Common argument: _"GraphQL is less necessary for overfetch/underfetch"_

### 💡 My Realization

Recently wrote REST API for the first time in a while...
(PATCH endpoint became a mini-RPC with 8 optional fields + doc spelunking)

**GraphQL benefits go beyond fetching all data at once**
Still useful for **contract + ergonomics**

<!--

# 1. Introduction: Do we still need GraphQL?

Background:

- With the emergence of RSC, you can now fetch data on server side per component
    - Prior to RSC, the best practice is to fetch all the relevant data on the page in a single query to reduce the number of fetches
- Some say "GraphQL is less necessary for overfetch/underfetch because Server Component can fetch only data they need by themselves without sacrificing performance"

I've been using GraphQL as BFF for a while now, and I recently had a chance to design and write REST API for the first time in a while and realised the benefit of GraphQL is not only that I can fetch all the data at once...

For example, I hit a PATCH endpoint that became a mini-RPC with 8 optional fields and had to do serious doc spelunking to understand it.

GraphQL still provides value through its typed, discoverable contract and excellent ergonomics.

-->

---

# 2. Rediscover GraphQL

## Straightforward Queries

### Graph Structure

```graphql
query GetUserWithPosts($id: ID!) {
  user(id: $id) {
    name
    posts {
      title
      content
    }
  }
}
```

Navigate nodes by tracing relations
_(Schema design still matters: connections, pagination, etc.)_

<!--

# 2. Rediscover GraphQL: straightforward queries and granular mutations

Straightforwardness of Queries:

- GraphQL queries all the resources as graph structure as the name suggests
    - Meaning you can navigate one node after another but tracing the relation it has
    - In this query example, a user has posts node which returns the posts the user has
    - The mental model is so straightforward that I don't even need to read through API documentation
        - You still probably need to read documentation but the main question is "Does node X have node Y?" instead of "Which endpoint return what I need?"
- And yes the most famous benefit of GraphQL i.e. you can fetch as much as data you want without needing to ask backend dev to update the API
    - As long as the resolver to resolve the node is implemented, how you access the data is left to client dev

-->

---

# 2. Rediscover GraphQL

## Ergonomic Mutations

### REST API

```
PATCH /posts/:id
```

Complex arguments, requires scrutinizing API docs

### GraphQL

```graphql
mutation UpdatePostTitle($id: ID!, $title: String!) {
  updatePostTitle(id: $id, title: $title) {
    post {
      id
      title
    }
  }
}
```

**Advantages**: First-class typed arguments + discoverability + consistent client ergonomics
Business logic surfaces at the interface level

<!--

# 2. Rediscover GraphQL: straightforward queries and granular mutations

Ergonomics of Mutations:

- Mutations are defined in RPC style
- In REST API, you'd define PATCH /posts/:id endpoint to update specific post
    - This makes the arguments of the endpoint complicated requiring client dev to scrutinise the api doc to understand and implement what they want to do.
- In GraphQL, you'd define UpdatePostTitle mutation making it more straightforward to understand what it does
    - Surfacing business logic to interface and move business logic into backend rather than requiring frontend to "空気を読む"
    - REST can also model business intent with custom endpoints, but GraphQL provides first-class typed arguments, discoverability, and consistent client ergonomics

This combination of interface: graph structure for query and RPC style for mutation, turns GraphQL very powerful tool and is IMO the most suitable option for frontend-backend communication.

-->

---

# 3. Co-Located Backend Architecture

## with Route Handler

### Next.js Route Handlers

- Server-side code accessed like a backend API
- App Router: **Route Handlers**
- Pages Router: **API Routes**

### Growing Trend

Building Next.js apps **without a separate backend service** using Route Handlers
_(Still runs server-side inside Next.js)_

### 🚀 Template Available

GitHub repository template: GraphQL + Route Handlers

https://github.com/KentaKudo/next-graphql-handler

<!--

# 3. Co-Located Backend Architecture with Route Handler

Next.js provides feature called Route Handlers (App Router) / API Routes (Pages Router).
It's server side code and can be accessed from frontend just like backend API.
I've seen more and more cases of people adapting the architecture to build Next.js application without a separate backend service using Route Handlers.

Note: This still runs server-side inside Next.js - you're just avoiding a separate backend service.

So I wanted to explore the co-located backend architecture that provides GraphQL backend inside the Route Handler.
I published the result as GitHub repository template here: https://github.com/KentaKudo/next-graphql-handler

Let me explain how it works.

-->

---

# 3. Co-Located Backend Architecture

## Implementation with graphql-yoga

```ts
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";

const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  schema,
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS, // For CORS preflight
};
```

**That's it for a demo!** ✨
_(Production needs: auth/session, error masking, rate limits, query cost—covered later)_

<!--

# 3. Co-Located Backend Architecture with Route Handler

The GraphQL process is provided using graphql-yoga package. I also use GraphQL Pothos to implement resolvers. I'll cover this later but let me move on for now.

The magic happens here in route.ts

It creates yoga instance and then expose its handler method as Route Handler routes like this:

```ts
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";

const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  schema,
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS, // For browsers / CORS preflight
};
```

It's as simple as this for a demo.

For production, you'll need to add auth/session handling, error masking, rate limiting, query cost limits, and logging/tracing. We'll cover these considerations in a later slide.

-->

---

# 3. Co-Located Backend Architecture

## Client Side

### Tech Stack

- **graphql-codegen**: Generate TypeScript from GraphQL queries
- **urql**: GraphQL client library for client components
- Hit `/api/graphql` endpoint

### RSC + Client Components

Server Components can query directly; `urql` lives in client components

### Bonus: Easy Migration

Want to spin up a separate server?

→ Yoga is framework-agnostic; only the adapter changes
→ Just hook the Yoga instance into Express, Hono, etc.
→ Keep React/Next.js-specific code in the binding layer

<!--

# 3. Co-Located Backend Architecture with Route Handler

For the client side, I use graphql-codegen to generate TypeScript code from GraphQL query then use urql as client library.

By hitting `/api/graphql`, it can get the result via GraphQL interface.

Note on RSC: If the app uses RSC heavily, urql lives in client components, while server components can query the GraphQL endpoint directly using the urql server-side client.

And a great thing is that even when you want to actually spin up server process and have frontend talk to it, the only thing you need to do is take the yoga instance and hook into server process you like such as Express or Hono.
Yoga is framework-agnostic; only the adapter changes.
Just be careful to contain all the React/Next.js support in this binding.

-->

---

# 3. Co-Located Backend Architecture

## Example: Server Component

```tsx
import { graphql } from "@/graphql";
import { getClient } from "@/lib/urql";

const helloQuery = graphql(`
  query Hello {
    hello(name: "from server component")
  }
`);

export default async function Home() {
  const result = await getClient().query(helloQuery, {});
  if (result.error) {
    return <div>Error: {result.error.message}</div>;
  }
  return <div>Hello: {result.data?.hello}</div>;
}
```

<!--

# 3. Co-Located Backend Architecture with Route Handler

Here's an example of a Server Component querying the GraphQL endpoint.

We use graphql-codegen to generate TypeScript types from the query.
The server component can directly await the query using the urql client.

This gives you full type safety from schema to component.

-->

---

# 3. Co-Located Backend Architecture

## Example: Client Component

```tsx
"use client";

import { graphql } from "@/graphql";
import { useQuery } from "@urql/next";

const helloQuery = graphql(`
  query HelloFromClientComponent {
    hello(name: "from client component")
  }
`);

export const ClientComponent = () => {
  const [result] = useQuery({ query: helloQuery });
  if (result.error) {
    return <div>Error: {result.error.message}</div>;
  }
  return <div>ClientComponent: {result.data?.hello}</div>;
};
```

<!--

# 3. Co-Located Backend Architecture with Route Handler

And here's an example of a Client Component using urql hooks.

The client component uses the standard urql hooks pattern.
Both server and client components hit the same /api/graphql endpoint.

This gives you flexibility to choose where to fetch based on your needs.

-->

---

# 4. Code-first vs Schema-first

### Code-first

Generate GraphQL schema from codebase
→ Code is the source of truth
**When to choose**: Great DX in TypeScript mono-repo

### Schema-first

Write schema, generate resolver skeleton
→ Schema is the source of truth
**When to choose**: Language-agnostic teams / schema governance

### My Preference: Code-first with Pothos

Template uses **Pothos GraphQL** for code-first approach

_(But choose whatever works for you!)_

<!--

# 4. Code-first vs Schema-first

I close this section by touching what I skipped just before.

This is a backend side topic about how to implement GraphQL resolvers: code-first or schema-first

- Code-first: is to generate GraphQL schema from codebase taking code as source of truth
  - Great for TypeScript mono-repos with excellent DX
- Schema-first: is the other way around i.e. write schema and generate resolver skeleton from it
  - Great for language-agnostic teams or when you need schema governance

I personally prefer code-first approach and GraphQL Pothos package the template has in the resolver is for that purpose.
But of course you can choose whichever style you like.

-->

---

# 4. Code-first Example with Pothos

```ts
import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

export const schema = builder.toSchema();
```

Type-safe, concise, and TypeScript-native

<!--

# 4. Code-first Example with Pothos

Here's what a Pothos schema definition looks like.

You define your types and resolvers in TypeScript code.
Pothos provides a type-safe builder API that generates the GraphQL schema.

The big advantage is that everything is type-checked at compile time.
If you refactor your TypeScript types, the schema automatically updates.

-->

---

# 5. Production Considerations

## GraphQL is Powerful: Protect It

### Security & Performance

⚠️ **Authorization**: Field-level auth (not only route level)
⚠️ **N+1 Prevention**: Batching / DataLoader patterns
⚠️ **Query Complexity**: Depth & cost limits
⚠️ **Introspection**: Disable in production (or gate it)
⚠️ **Error Masking**: Don't leak internal errors
⚠️ **Rate Limiting**: Protect against abuse

### Recommended: Persisted Queries

Pre-register queries for security & performance

### Caching Strategy

CDN / Route segment caching vs GraphQL response caching

<!--

# 5. Production Considerations: GraphQL is Powerful, Protect It

While the demo shows how simple it is to set up GraphQL with Yoga, production deployments need careful attention to security and performance.

Key considerations:

- Authorization: Implement field-level authorization, not just at the route level
- N+1 queries: Use batching and DataLoader patterns to avoid performance issues
- Query complexity: Set depth and cost limits to prevent expensive queries
- Introspection: Disable in production or gate it behind authentication
- Error masking: Don't leak internal error details to clients
- Rate limiting: Protect your API against abuse

Persisted queries are a great optional feature where you pre-register allowed queries.

Think about your caching strategy: CDN caching, Next.js route segment caching, and GraphQL response caching all play different roles.

-->

---

# 5. Production Considerations

## When GraphQL Still Shines

### RSC + BFF Pattern

RSC enables colocated fetching, but you can still benefit from:

✅ **Typed, discoverable, stable contract** (GraphQL schema)
✅ **Multiple clients**: Web, mobile, different teams
✅ **Multiple UI surfaces**: Different pages, widgets, micro-frontends

### Bottom Line

RSC changes **where** you fetch, not **what** your interface contract should be

<!--

# 5. Production Considerations: When GraphQL Still Shines

Even with RSC, GraphQL provides value:

RSC enables colocated fetching at the component level, but you can still benefit from a typed, discoverable, stable contract when you have:
- Multiple clients (web, mobile)
- Multiple teams consuming the same API
- Multiple UI surfaces (different pages, widgets, micro-frontends)

The key insight: RSC changes WHERE you fetch data (component-level vs page-level), but it doesn't change WHAT your interface contract should be.

GraphQL still excels at providing a well-defined, typed, discoverable contract between frontend and backend.

-->

---

# 6. Recap

## GraphQL is Still a Great Option

### Key Takeaways

✅ **RSC era**: GraphQL remains excellent for BFF interface

- RSC changes _where_ you fetch, not _what_ your contract should be

✅ **Powerful combination**:

- Flexible graph queries
- Ergonomic mutations (RPC-style)

✅ **Co-Located Architecture**: Next.js + GraphQL + Route Handlers

⚠️ **Use with care**: Auth, N+1, limits, caching—production matters!

<!--

# Recap: GraphQL can still be an option

Let me recap the talk.

- Even after RSC era, I believe GraphQL stays great option for BFF interface
  - RSC changes WHERE you fetch, not WHAT your interface contract should be
- The power of GraphQL comes from the combination of its flexible query and easy to understand and evolve mutation interface
- Co-Located Backend Architecture: Next.js + GraphQL powered by Route Handlers
- But remember: with great power comes great responsibility
  - Don't forget about authorization, N+1 prevention, query limits, and caching in production

-->

---

# References

### 📚 Book: 世界で働くエンジニア

https://store.london-tech-talk.com/products/book_engineers_working_abroad

### 🚀 Template Repository

https://github.com/KentaKudo/next-graphql-handler

### 📖 Recommended Reading: Black Hat GraphQL

https://nostarch.com/black-hat-graphql

⚠️ **With great power comes great responsibility**

Examples of GraphQL risks:

- **DoS via expensive queries** (deeply nested queries)
- **Authorization pitfalls** (forgetting field-level checks)
- **Information disclosure** (introspection in production)

Highly recommended if you implement GraphQL server-side

---

# Thank You! 🙏

**Questions?**

<!--

# References

The talk mostly came out of my recent experience and realization, but I recently read this book about GraphQL: "Black Hat GraphQL"

The power comes with responsibility: there are several things you need to be careful about when implementing GraphQL server.

For example:
- DoS attacks via expensive, deeply nested queries
- Authorization pitfalls when you forget field-level checks
- Information disclosure through introspection in production

Highly recommended if you have chance to implement GraphQL server side.

Thank you for listening!

-->
