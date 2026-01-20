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
  - translate the slides in japanese
  - Japanese announcement
-->

`#LT` `#GraphQL` `#Next.js` `#Route Handler` `#RSC`

# Revisiting GraphQL in the RSC Era, and Co-Located GraphQL Backend Inside Next.js

**Kenta Kudo** - Freelance Software Engineer
_React Osaka - Jan 2026_

<!--

Hi everyone, I'm Kenta.

Today I'm going to give a Lightning Talk based on my recent thoughts around GraphQL and RSC.

-->

---

# About Me

- 💼 Freelance Software Engineer
- 🏢 Previously at Mercari UK
- 🌍 Lived in the UK for 6 years
- 🏯 Moved to Kansai last year — Still very new!

<!--

Let me quickly introduce myself again to fill in the background:

- I'm currently working as a freelance software engineer
- Previously worked at companies such as Mercari UK
- Lived in the UK for 6 years and came back to Japan 3 years ago, and
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
- Beta release now, official release end of month
- Available as epub and pdf (free updates)
- Spin-off from **London Tech Talk** podcast

</div>
<div>

<img src="LondonTechTalk_10co-authors.webp" width="300" />

</div>
</div>

<!--

I co-authored a book titled "世界で働くエンジニア"

- It's an omnibus style autobiography made of 10 different Japanese software engineers working abroad.
- The book is currently in beta release and will be officially released at the end of this month.
- But you can already purchase it, and I'll show you the link to the detail page in the next slide.
- The book is available both as epub and pdf file, and you can get free updates whenever new version is published.

Please have a look if you're interested or please introduce to your friends who might be interested. Feedback is also very welcome.

The project spun out from the community of London Tech Talk podcast hosted by Ken, who lives in London now.
The podcast is also highly recommended. So please check it out.

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

- I read through the book, and very honestly it's really fun reading and inspiring book I'd say.
- You can enjoy ten different life stories about how they ended up working abroad.
- I'd get motivated if I read the book before I moved abroad.

Does anyone need more time?

The link is included in the slides I'm going to share after the talk, and also I'm reacheable on the Discord channel.

If you have any questions about the book, please let me know!

Ok let's move on to my talk.

-->

---

# Today's Agenda

1. **Introduction**: Do we still need GraphQL?
2. **Rediscover GraphQL**: Straightforward queries and granular mutations
3. **Co-Located Backend Architecture** with Route Handler
4. **Recap**: GraphQL can still be an option

<!--

The title of the talk today is: Revisiting GraphQL in the RSC Era, and Co-Located GraphQL Backend Inside Next.js

Here's today's agenda:

- In the first section I'll introduce the background of the topic.
- Then I'll talk about what makes GraphQL powerful and why it's still the case after the RSC era.
- Then I'll demonstrate having GraphQL process using Route Handler allowing us to co-locate backend inside the Next.js project.
- I'll close the talk with recap.

Let's get started!

-->

---

# 1. Introduction — "Do we still need GraphQL?"

## The React Server Component Era

- **RSC** enables server-side data fetching **_per component_**
- Prior to RSC: fetch all data in a single query
- Recent argument: _"GraphQL is less necessary for RSC"_

## 💡 My Realization

- **GraphQL benefits go beyond fetching all data at once**
- Still useful for **contract + ergonomics**

<!--
React Server Component is gradually recognised and used real life system even though they've been experiencing some issues.

- With the emergence of RSC, you can now fetch data on server side *PER COMPONENT*
  - Prior to RSC, the best practice is to fetch all the relevant data on the page in a single query and pass it down to where it needs
  - This is because at that time only page route could fetch data on server side
  - GraphQL fit very well for this usecase turning it one of the best options for frontend-backend communication
- However, RSC enabled each component to fetch only data they need by themselves without sacrificing performance
  - Some say "GraphQL is less necessary for RSC"

- I've some experience using GraphQL as BFF, Backend for Frontend, for sometime now
- So I'm kind of used to its interface
- But then I recently had a chance to design REST API for RSC enabled Next.js application, and realised the benefit of GraphQL is not only that I can fetch all the data at once but it still provides value through its typed, discoverable contract and excellent ergonomics.

-->

---

# 2. Rediscover GraphQL — Straightforward Queries

## Graph Structure

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

💡 Navigate nodes by tracing relations
_(Schema design still matters: connections, pagination, etc.)_

<!--

The first point is straightforwardness of queries

- GraphQL queries all the resources as graph structure as the name suggests
  - Meaning you can navigate one node after another tracing the relation it has
  - In this query example, a user has posts node which returns the posts the user has
  - The mental model is so straightforward that I don't even need to read through API documentation
    - ...You might still need to read documentation but it's very likely provided as introspection with handy built-in web UI
    - more importantly because of its graph structure the question is "I assume node X have node Y, does it?" instead of "Which endpoint return what I need?"
- Also one of the best selling points of GraphQL has been that you can fetch as much data as you want without needing to ask backend dev to update the API
  - As long as the resolver for the node is implemented, how you access the data is left to client dev
  - You may get user node from different query / mutation but as long as it's the same user node there always is posts node under it

Straightforwardness of the graph structure still provides great DX even for more granular data fetch.

-->

---

# 2. Rediscover GraphQL — Ergonomic Mutations

## REST API

```
PATCH /posts/:id
```

- Complex arguments
- Requires scrutinizing API docs

<!--

The second point is Ergonomics of Mutations.

- In REST API, you'd define PATCH endpoint to update specific post like this
- this gives the endpoint responsibility to update any properties of the post making the input of the endpoint complicated
- this requires client dev to spelunking the api doc to understand and call the endpoint in the way backend expects it to do
- the mental model of REST is resource oriented
  - the representation is the combination of resource and action, i.e. HTTP method, on it
- as a result verbs you can choose are quite limited forcing endpoint to take more responsibility
- this leads more business logic to reside in client side

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
- First-class typed arguments + discoverability + consistent client ergonomics
- Business logic surfaces at the interface level

<!--

- On the other hand, GraphQL mutations are defined in RPC style
- You'd define UpdatePostTitle mutation making it more straightforward to understand what it does rather than single interface that updates any fields of post at once
- this surfaces business logic to interface moving business logic into backend instead of frontend
- Even though it's technically possible to define custom endpoints with REST, but GraphQL provides operation-centric interface providing consistent client ergonomics

The combination of interface, graph structure for query and RPC style for mutation, is very unique to GraphQL, and IMO still is a very suitable option for frontend-backend communication providing great DX for both frontend and backend dev even with RSC where more granular data fetch is preferred.

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

Next.js provides feature called Route Handlers (App Router) / API Routes (Pages Router).
It's executed on server side and can be accessed from frontend just like backend API.

And I've seen more and more dev adapt the architecture to build Next.js application without a separate backend service using this Route Handlers.

-->

---

# 3. Co-Located Backend Architecture — with Route Handler

## 🚀 Template Available

GitHub repository template: GraphQL + Route Handlers

https://github.com/KentaKudo/next-graphql-handler

_Note: This template demonstrates the core concepts and is intended to be used in production environment._

<!--

So I wanted to explore the co-located backend architecture that provides GraphQL backend inside the Route Handler with RSC enabled Next.js app.

I published the result as GitHub repository template here: https://github.com/KentaKudo/next-graphql-handler

Keep in mind: This template is built to demonstrate the idea and architectural pattern.
It's not intended to solve real-life production problems yet - you'll need to add proper authentication, error handling, and other production concerns.

Let me walk though the gist of it with code from the repo.

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
- And then expose its handler methods as Route Handler routes GET and POST like this.

For real life usecase you might want to add authentication, logging etc. but the bare minimum working example is as simple as this.

I didn't try but for Apollo Server the @as-integration/next package exists for this binding.

-->

---

# 3. Co-Located Backend Architecture — Client Side

## Tech Stack

- **graphql-codegen**: Generate TypeScript from GraphQL queries
- **urql**: GraphQL client library for client components
- Hit `/api/graphql` endpoint

## Bonus: Easy Migration

Want to spin up a separate server?

→ Yoga is framework-agnostic; only the adapter changes
→ Just hook the Yoga instance into Express, Hono, etc.
→ Keep React/Next.js-specific code in the binding layer

<!--

Moving on to the client side, I used the graphql-codegen package to generate TypeScript code from GraphQL query then use urql as client library.

By hitting `/api/graphql`, it can get the result via GraphQL Route Handler.

TODO: move bonus at the end of the section and add code example to build urql clients

And a great thing is that even when you want to actually spin up dedicated server process, the only thing you need to do is take the yoga instance and hook into server process such as Express or Hono.
Yoga is framework-agnostic; only the adapter changes.

Just be careful to contain all the React/Next.js support in the route.ts.

Let's the check the client code.

-->

---

# 3. Co-Located Backend Architecture 

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

Here's an example of a Server Component querying the GraphQL endpoint.

The query is defined and graphql-codegen generates TypeScript codes from it.
The server component can directly await the query using the urql client accessed with getClient().

This gives you full type safety from schema to component.

-->

---

# 3. Co-Located Backend Architecture 

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
And here's the Client Component.

Similarly to Server Component it defines the query it uses.
And it uses the standard urql hooks pattern.

Both server and client components hit the same /api/graphql endpoint.

This gives you flexibility to choose where to fetch based on your needs.
And also you can mix it with Server Action to provide the best user experience.

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
- The power of GraphQL comes from the combination of its flexible query and easy to understand mutation interface
- Demonstrated Co-Located Backend Architecture with Next.js + GraphQL powered by Route Handlers

The key insight: RSC changes WHERE you fetch data (component-level vs page-level), but it doesn't change WHAT your interface contract should look like.

GraphQL still excels at providing a developer friendly contract, which remains very important between frontend and backend communication.

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

The talk mostly came out of my recent experience and realisation, but I recently read this book about GraphQL: "Black Hat GraphQL"

The book is about implementing GraphQL server so more about server side topic.
But it gives you great sense about how powerful GraphQL is and at the same time how dangerous it can be if implemented wrongly.

For example:
- DoS attacks via expensive, deeply nested queries
- Authorization pitfalls when you forget field-level checks
- Information disclosure through introspection

Highly recommended if you have chance to implement GraphQL server.

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

I personally prefer code-first approach and GraphQL Pothos package the template has in the resolver is for that purpose.
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