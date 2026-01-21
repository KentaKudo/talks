---
marp: true
theme: default
class: invert
paginate: true
backgroundColor: #1a1a1a
color: #f2f2f2
---

<!--
TODO:
  - translate the slides into Japanese
  - add Japanese announcement
-->

`#LT` `#GraphQL` `#Next.js` `#Route Handler` `#RSC`

# Revisiting GraphQL in the RSC Era, and Co-Located GraphQL Backend Inside Next.js

**Kenta Kudo** - Freelance Software Engineer
_React Osaka - Jan 2026_

<!--

Hi everyone, I'm Kenta.

Today I'm going to give a Lightning Talk based on my recent thoughts on GraphQL and RSC.

-->

---

# About Me

- 💼 Freelance software engineer
- 🏢 Previously at Mercari UK
- 🌍 Lived in the UK for 6 years; returned to Japan 3 years ago
- 🏯 Moved to Kansai last year — still very new to the area!

<!--

Let me quickly introduce myself:

- I'm currently working as a freelance software engineer
- I previously worked at companies such as Mercari UK
- Lived in the UK for 6 years and came back to Japan 3 years ago
- I moved to Kansai last year — so I'm still very new to this area!

Before we get technical, let me use this opportunity to announce something...

-->

---

# 📚 Book Announcement

<style scoped>
.columns {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}
</style>

<div class="columns">
<div>

## _世界で働くエンジニア_

- 10 Japanese software engineers working abroad
- Beta release now, official release at the end of this month
- Available as epub and pdf files (free updates)
- Spin-off from the **London Tech Talk** podcast community

</div>
<div>

<img src="LondonTechTalk_10co-authors.webp" width="300" />

</div>
</div>

<!--

I co-authored a book titled "世界で働くエンジニア"

- It's an omnibus-style autobiography by 10 different Japanese software engineers working abroad.
- The book is currently in beta release and will be officially released at the end of this month.
- But you can already purchase it, and I'll show you the link to the detail page in the next slide.
- The book is available as epub and pdf files, and you can get free updates whenever a new version is published.

Please have a look if you're interested, or please introduce it to your friends who might be interested. Feedback is also very welcome.

By the way, one of my hobbies is film photography, and this is a picture I took in Amsterdam.

The project spun out of the community around the London Tech Talk podcast, hosted by my friend Ken, who lives in London now.
The podcast is also highly recommended. Please check it out too.

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

And here's the link to the book detail page.

- I read through the book, and honestly it's a really fun and inspiring read.
- You can enjoy ten different life stories about how they ended up working abroad.
- I would have been motivated if I had read the book before I moved abroad.

The link is included in the slides I'm going to share after the talk, and I'm also reachable on the Discord channel.

If you have any questions about the book, please let me know!

Does anyone need more time?
Okay, let's move on to the talk.

-->

---

# Today's Agenda

1. **Introduction**: Do we still need GraphQL?
2. **Rediscover GraphQL**: Straightforward queries and granular mutations
3. **Co-Located Backend Architecture** with Route Handler
4. **Recap**: GraphQL can still be an option

<!--

I'd like to revisit GraphQL and explore the architecture of having a GraphQL backend inside a Next.js app today.

Here's the agenda:

- In the first section I'll introduce the background of the topic.
- Then I'll talk about what makes GraphQL powerful and why that's still true in the RSC era.
- Then I'll demonstrate running a GraphQL process using Route Handlers, allowing us to co-locate the backend inside the Next.js application.
- I'll close the talk with a recap.

Let's get started!

-->

---

# 1. Introduction — "Do we still need GraphQL?"

## The React Server Component Era

- **RSC** enables server-side data fetching **_per component_**
- Prior to RSC...
  - only page routes fetched on the server
  - fetch all data in a single query
- Recent argument: _"GraphQL is less necessary for RSC"_

## 💡 My Realization

- **GraphQL benefits go beyond fetching all data at once**
- Still useful for **contract + ergonomics**

<!--
React Server Components are gradually being adopted and used in real-world systems, even though they've been experiencing some issues.

- With the emergence of RSC, you can now fetch data on the server side *PER COMPONENT*
  - Prior to RSC, the best practice was to fetch all the relevant data on the page in a single query and pass it down to where it needs to go
  - This is because at that time only page routes could fetch data on the server side
  - GraphQL fit very well for this use case, turning it into one of the best options for frontend-backend communication
- However, RSC enabled each component to fetch only the data they need by themselves without sacrificing performance
  - Some say "GraphQL is less necessary for RSC"

- I've had some experience using GraphQL as a BFF, Backend for Frontend, for some time now
- Then I recently had a chance to design a REST API for an RSC-enabled Next.js application, and realized the benefit of GraphQL is not only that you can fetch all the data at once; it still provides value through its typed, discoverable contract and excellent ergonomics.

Let me elaborate on this.
-->

---

# 2. Rediscover GraphQL — Straightforward Queries

**Graph Structure**

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

💡 Query resources as a graph and traverse relations
💡 Discoverability via introspection and GraphiQL
💡 Flexible selection without new endpoints
💡 Ask about node relationships, not endpoints

<!--

The first point is the straightforwardness of queries

- GraphQL queries resources as a graph structure, as the name suggests
  - Meaning you can navigate one node after another, tracing the relationships it has
  - In this query example, a user has a posts node that returns the posts the user has
  - The mental model is so straightforward that I don't even need to read through API documentation
    - ...You might still need to read documentation but it's very likely provided as introspection with handy built-in web UI such as GraphiQL.
    - more importantly, because of its graph structure, the question becomes "I assume node X has node Y—does it?" instead of "Which endpoint returns what I need?"
- Also one of the best-selling points of GraphQL has been that you can fetch as much data as you want without needing to ask backend devs to update the API
  - This is because as long as the resolver for the node is implemented, how you access the data is left to client developers
  - You may get a user node from different queries or mutations, but as long as it's the same user node there is always a posts node under it

The straightforwardness of the graph structure still provides great DX even for more granular data fetching.

-->

---

# 2. Rediscover GraphQL — Ergonomic Mutations

## REST API

```
PATCH /posts/:id
```

- PATCH updates any fields → complex inputs
- Resource-oriented endpoints carry big responsibility
- More business logic on the client
- URI + HTTP method limits actions, so each endpoint grows heavy

<!--

The second point is the ergonomics of mutations.

- In REST API, you'd define a PATCH endpoint to update a specific post like this
- This gives the endpoint responsibility to update any properties of the post, making the input of the endpoint complicated
- This requires client devs to spelunk the API docs to understand and call the endpoint in the way the backend expects it to be consumed
- REST API is resource-oriented and the endpoints are designed as a combination of a URI as a resource identifier and an HTTP method as an action
- Because there are not many actions you can perform on a resource, each endpoint tends to take big responsibility
  - for example PATCH endpoint to update any fields of a specific post
- This ends up having more business logic on the client side

-->

---

# 2. Rediscover GraphQL — Ergonomic Mutations

## GraphQL

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

**Advantages**:
- RPC-style mutations make intent explicit
- First-class typed arguments, discoverability, consistent ergonomics
- Business logic surfaces at the interface level

<!--

- On the other hand, GraphQL mutations are defined in RPC-style
- You'd define an UpdatePostTitle mutation, making it more straightforward to understand what it does rather than a single interface that updates any fields of a post at once
- This moves business logic from frontend to backend, making it explicit at the interface level
- GraphQL offers an operation-centric interface that ensures consistent client ergonomics

The combination of the interface, graph structure for queries, and RPC-style mutations is very unique to GraphQL, and IMO still is a very suitable option for frontend-backend communication, providing great DX for both frontend and backend devs even with RSC, where more granular data fetching is preferred.

Now, let's step away from GraphQL for a moment and talk about Route Handlers.

-->

---

# 3. Co-Located Backend Architecture — with Route Handler

## Next.js Route Handlers

- Server-side execution accessed like a backend API
  - App Router → **Route Handlers**
  - Pages Router → **API Routes**

## Growing Trend

- Building Next.js apps **without a separate backend service** using Route Handlers

<!--

Next.js provides a feature called Route Handlers (App Router) / API Routes (Pages Router).
It runs on the server side and can be accessed from the frontend just like a backend API.

And I've seen more and more devs adopt the architecture to build Next.js applications without a separate backend service using these Route Handlers.

-->

---

# 3. Co-Located Backend Architecture — with Route Handler

## 🚀 Template Available

GitHub repository template: GraphQL + Route Handlers

https://github.com/KentaKudo/next-graphql-handler

_Note: This template demonstrates the core concepts and is not intended for production; add auth, error handling, etc._

<!--

So I wanted to explore the co-located backend architecture that provides a GraphQL backend inside Route Handlers with an RSC-enabled Next.js app.

I published the result as a GitHub repository template at this URL.

Keep in mind: This template is built to demonstrate the idea and architectural pattern.
It's not intended to solve real-life production problems - you'll need to add proper authentication, error handling, and other production concerns.

Let me walk through the gist of it with code snippets from the repo.

-->

---

# 3. Co-Located Backend Architecture — Route Handler

`/api/graphql/route.ts`

```ts
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";

const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  schema,
});

export { handleRequest as GET, handleRequest as POST };
```

For Apollo Server → [@as-integrations/next](https://github.com/apollo-server-integrations/apollo-server-integration-next)

<!--

The magic happens here in route.ts

The GraphQL request handler is implemented using graphql-yoga package.

- It creates yoga instance based on schema defined in a separate file
- And then exposes its handler methods as GET and POST methods like this.

For a real-life use case you might want to add authentication, logging, etc., but the bare minimum working example is as simple as this.

I didn't try it, but if you prefer Apollo Server, the @as-integrations/next package exists for this binding.

-->

---

# 3. Co-Located Backend Architecture — Client Side

## Tech Stack

- **graphql-codegen**: Generate TypeScript from GraphQL queries
- **urql**: GraphQL client library for client components
- Hit `/api/graphql` endpoint

<!--

Moving on to the client side, I used the graphql-codegen package to generate TypeScript code from GraphQL queries and then use urql as a client library.

By hitting `/api/graphql`, it can get the result via GraphQL Route Handler.

Let's check the example of calling this Route Handler from both a Server Component and a Client Component.

-->

---

# 3. Co-Located Backend Architecture — Client Side

## urql Client Setup (Server Components)

```ts
// lib/urql.ts
import { cacheExchange, fetchExchange } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";

export const { getClient } = registerUrql(() => ({
  url: "/api/graphql",
  exchanges: [cacheExchange, fetchExchange],
}));
```

<!--

For Server Components, I use registerUrql from @urql/next/rsc.
It gives me a getClient() helper that I can call inside Server Component.

The client targets the same /api/graphql route handler.

-->

---

# 3. Co-Located Backend Architecture — Client Side

**Example: Server Component**

```tsx
import { graphql } from "@/graphql";
import { getClient } from "@/lib/urql";

const helloQuery = graphql(`
  query Hello {
    hello(name: "from server component")
  }
`);

export default async function Home() {
  const result = await getClient().query(helloQuery, {}).toPromise();
  if (result.error) {
    return <div>Error: {result.error.message}</div>;
  }
  return <div>Hello: {result.data?.hello}</div>;
}
```

<!--

And this is the Server Component that consumes the client.

The query is defined and graphql-codegen generates TypeScript code from it.
It then directly awaits the query using the urql client.

This gives you full type safety from schema to component.

-->

---

# 3. Co-Located Backend Architecture — Client Side

## urql Client Setup (Client Components)

```tsx
// app/providers.tsx
"use client";
import type { ReactNode } from "react";
import { createClient, Provider } from "@urql/next";
import { cacheExchange, fetchExchange } from "@urql/core";

const client = createClient({
  url: "/api/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

export const Providers = ({ children }: { children: ReactNode }) => (
  <Provider value={client}>{children}</Provider>
);
```

<!--

For Client Components, I wrap the app with Provider from @urql/next.
Then you can access the client through the standard useQuery hook.

-->

---

# 3. Co-Located Backend Architecture — Client Side

**Example: Client Component**

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

This is the Client Component.

Similarly to the Server Component, it defines the query it uses.
And it executes the query using the useQuery hook which then uses the client set up in the previous slide.

This gives you flexibility to choose where to fetch based on your needs.
And also you can mix it with Server Actions to provide the best user experience.

-->

---

# 4. Recap — When GraphQL Still Shines

## RSC + BFF Pattern

RSC enables colocated fetching, but you can still benefit from:

✅ **Typed, discoverable, stable contract** (GraphQL schema)
✅ **Powerful combination**: Flexible graph queries & ergonomic mutations (RPC-style)
✅ **Co-Located Architecture**: Next.js + GraphQL + Route Handlers

## Bottom Line

RSC changes **where** you fetch, not **what** your interface contract should be

<!--

Let me recap the talk.

Even with RSC, GraphQL provides value:

- RSC enables colocated fetching at the component level, but you can still benefit from a typed, discoverable, and stable contract
- The power of GraphQL comes from the combination of its flexible query and easy-to-understand mutation interface
- Demonstrated Co-Located Backend Architecture with Next.js + GraphQL powered by Route Handlers

The key insight: RSC changes WHERE you fetch data (component-level vs page-level), but it doesn't change WHAT your interface contract should look like.

GraphQL should still remain as a great option for frontend and backend communication.

-->

---

# References


- 📖 Recommended Reading: Black Hat GraphQL
  - https://nostarch.com/black-hat-graphql
  - **DoS via expensive queries** (deeply nested queries)
  - **Authorization pitfalls** (forgetting field-level checks)
  - **Information disclosure** (introspection in production)
- 🚀 Template Repository
  - https://github.com/KentaKudo/next-graphql-handler
- 📚 _世界で働くエンジニア_
  - Book: https://store.london-tech-talk.com/products/book_engineers_working_abroad
  - London Tech Talk Podcast: https://london-tech-talk.com/

<!--

The talk mostly came out of my recent experience and realization, but I recently read this book about GraphQL: "Black Hat GraphQL"

The book is about implementing GraphQL server securely.
GraphQL is very powerful but can be very dangerous if implemented wrongly.

For example:
- DoS attacks via expensive, deeply nested queries
- Authorization pitfalls when you forget field-level checks
- Information disclosure through introspection

Highly recommended if you have a chance to implement a GraphQL server.

-->

---

# Thank You! 🙏

**Questions?**

<!--

Thank you for listening!

-->

<!--

- “How do you handle authn/authz with Yoga in route handlers?”
- “How do you avoid N+1 in resolvers?”
- “What’s your approach to caching with RSC + GraphQL?”
- “Edge runtime compatibility?”
- “Why urql vs Apollo / gql.tada / graphql-request?”

-->

---

## APPX. Easy Migration

Want to spin up a separate server?

→ Yoga is framework-agnostic; only the adapter changes
→ Just hook the Yoga instance into Express, Hono, etc.
→ Keep React/Next.js-specific code in the binding layer

<!--

And a great thing is that even when you want to spin up a dedicated server process, the only thing you need to do is take the Yoga instance and hook it into a server process such as Express or Hono.
Yoga is framework-agnostic; only the adapter changes.

Just be careful to contain all the React/Next.js support in the route.ts.

-->

---

# APPX. Code-first vs Schema-first

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

This is a backend side topic about how to implement GraphQL resolvers: code-first or schema-first

- Code-first: is to generate GraphQL schema from codebase taking code as source of truth
  - Great for TypeScript mono-repos with excellent DX
- Schema-first: is the other way around i.e. write schema and generate resolver skeleton from it
  - Great for language-agnostic teams or when you need schema governance

I personally prefer a code-first approach, and the GraphQL Pothos package the template has in the resolvers is for that purpose.
But of course you can choose whichever style you like.

-->

---

# APPX. Code-first Example with Pothos

```ts
import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: { name: t.arg.string() },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

export const schema = builder.toSchema();
```

Type-safe, concise, and TypeScript-native

<!--

Here's what a Pothos schema definition looks like.

You define your types and resolvers in TypeScript code.
Pothos provides a type-safe builder API that generates the GraphQL schema.

The big advantage is that everything is type-checked at compile time.
If you refactor your TypeScript types, the schema automatically updates.

-->

---

# APPX. Production Considerations — GraphQL is Powerful: Protect It

## Security & Performance

⚠️ **Authorization**: Field-level auth (not only route level)
⚠️ **N+1 Prevention**: Batching / DataLoader patterns
⚠️ **Query Complexity**: Depth & cost limits
⚠️ **Introspection**: Disable in production (or gate it)
⚠️ **Error Masking**: Don't leak internal errors
⚠️ **Rate Limiting**: Protect against abuse

<!--

While the demo shows how simple it is to set up GraphQL with Yoga, production deployments need careful attention to security and performance.

Key considerations:

- Authorization: Implement field-level authorization, not just at the route level
- N+1 queries: Use batching and DataLoader patterns to avoid performance issues
- Query complexity: Set depth and cost limits to prevent expensive queries
- Introspection: Disable in production or gate it behind authentication
- Error masking: Don't leak internal error details to clients
- Rate limiting: Protect your API against abuse

-->
