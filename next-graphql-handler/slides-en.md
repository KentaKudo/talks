---
marp: true
theme: default
class: invert
paginate: true
backgroundColor: #1a1a1a
color: #f2f2f2
---

# Revisiting GraphQL in the RSC Era, and a Fully Self-Contained Backend Inside Next.js

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

- I'm freelance software engineer
- Previously worked at companies such as Mercari UK
- Lived in the UK for 6 years
- Move to Kansai last year — Still very new!

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

I co-authored a book titled "世界で働くエンジニア"

It's an omnibus style autobiography made of 10 different Japanese software engineers working abroad.
The book is currently in beta release and will be officially released at the end of this month.
You can already purchase from here.
The book is available both as epub and pdf file and you can get free updates whenever new version is published.

(Sorry only Japanese version is available as of now...!)

Please have a look if you're interested or introduce to your friends who might be interested.
Any feedbacks are also very welcomed.

The project is span out from the community of London Tech Talk podcast hosted by Ken, who's my colleague at high school who lives in London now.
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

<!--

**[STAY ON THIS SLIDE - Let audiences scan the QR code]**

-->

---

# Today's Agenda

1. **Introduction**: Do we still need GraphQL?
2. **Rediscover GraphQL**: Straightforward queries and granular mutations
3. **Backend-less Architecture** with Route Handler
4. **Code-first Approach** with Pothos GraphQL
5. **Recap**: GraphQL can still be an option

<!--

The title of the talk today is: Revisiting GraphQL in the RSC Era, and a Fully Self-Contained Backend Inside Next.js

Here's today's agenda:

- Introduction: Do we still need GraphQL?
- Rediscover GraphQL: straightforward queries and granular mutations
- Backend-less Architecture with Route Handler
- Code-first Approach with Pothos GraphQL
- Recap: GraphQL can still be an option

Let's get started!

-->

---

# 1. Introduction

## Do we still need GraphQL?

### The React Server Component Era

- **RSC** enables server-side data fetching per component
- Prior to RSC: fetch all data in a single query
- Common argument: _"GraphQL is no longer needed"_

### 💡 My Realization

Recently wrote REST API for the first time in a while...

**GraphQL benefits go beyond fetching all data at once**

<!--

# 1. Introduction: Do we still need GraphQL?

Background:

- With the emergence of RSC, you can now fetch data on server side per component
    - Prior to RSC, the best practice is to fetch all the relevant data on the page in a single query to reduce the number of fetches
- Some say "GraphQL is no longer needed because Server Component can fetch only data they need by themselves without sacrificing performance"

I've been using GraphQL as BFF for a while now, and I recently had a chance to design and write REST API for the first time in a while and realised the benefit of GraphQL is not only that I can fetch all the data at once...

-->

---

# 2. Rediscover GraphQL

## Straightforward Queries

### Graph Structure

```graphql
user {
  name
  posts {
    title
    content
  }
}
```

Navigate nodes by tracing relations

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

## Comfortable Mutations

### REST API

```
PATCH /posts/:id
```

Complex arguments, requires scrutinizing API docs

### GraphQL

```graphql
mutation UpdatePostTitle($id: ID!, $title: String!) {
  updatePostTitle(id: $id, title: $title)
}
```

Clear, business logic at the interface level

<!--

# 2. Rediscover GraphQL: straightforward queries and granular mutations

Comfortableness of Mutations:

- Mutations are defined in RPC style
- In REST API, you'd define PATCH /posts/:id endpoint to update specific post
    - This makes the arguments of the endpoint complicated requiring client dev to scrutinise the api doc to understand and implement what they want to do.
- In GraphQL, you'd define UpdatePostTitle mutation making it more straightforward to understand what it does
    - surfacing business logic to interface and move business logic into backend rather than requiring frontend to "空気を読む"

This combination of interface: graph structure for query and RPC style for mutation, turns GraphQL very powerful tool and is IMO the most suitable option for frontend-backend communication.

-->

---

# 3. Backend-less Architecture

## with Route Handler

### Next.js Route Handlers

- Server-side code accessed like a backend API
- App Router: **Route Handlers**
- Pages Router: **API Routes**

### Growing Trend

Building Next.js apps without separate backend using Route Handlers

### 🚀 Template Available

GitHub repository template: GraphQL + Route Handlers

<!--

# 3. Backend-less Architecture with Route Handler

NextJS provides feature called Route Handlers (App Route) / API Routes (Pages Route).
It's server side code and can be accessed from frontend just like backend API.
I've seen more and more cases of people adapting the architecture to build NextJS application without server-side using Route Handlers.

So I wanted to explore the backend-less architecture that provides GraphQL backend inside the Route Handler.
I published the result as GitHub repository template here: <url>

Let me explain how it works.

-->

---

# 3. Backend-less Architecture

## Implementation with graphql-yoga

```ts
const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  schema,
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
```

**That's it!** ✨

<!--

# 3. Backend-less Architecture with Route Handler

the GraphQL process is provided using graphql-yoga package. i also use GraphQL pathos to implement resolvers. I'll cover this later but let me move on for now.

the magic happens here in route.ts

it creates yoga instance and then expose it's handler method as Route Handler routes like this:

```ts
const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  schema,
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
```

it's as simple as this.

-->

---

# 3. Backend-less Architecture

## Client Side

### Tech Stack

- **graphql-codegen**: Generate TypeScript from GraphQL queries
- **urql**: GraphQL client library
- Hit `/api/graphql` endpoint

### Bonus: Easy Migration

Want to spin up a separate server?

→ Just hook the Yoga instance into Express, Hono, etc.
→ Keep React/Next.js-specific code in the binding layer

<!--

# 3. Backend-less Architecture with Route Handler

for the client side, i use graphql-codegen to generate ts code from GraphQL query then use urql as client library.

by hitting `/api/graphql`, it can get the result via GraphQL interface.

and a great thing is that even when you want to actually spin up server process and have frontend talk to it, the only thing you need to do is take the yoga instance and hook into server process you like such as express or Hono.
Just be careful to contain all the react/nextjs support in this binding.

-->

---

# 4. Code-first vs Schema-first

### Code-first

Generate GraphQL schema from codebase
→ Code is the source of truth

### Schema-first

Write schema, generate resolver skeleton
→ Schema is the source of truth

### My Preference: Code-first with Pothos

Template uses **Pothos GraphQL** for code-first approach

_(But choose whatever works for you!)_

<!--

# 3. Backend-less Architecture with Route Handler

i close the section by touching what i skipped just before.

this is a backend side topic about how to implement GraphQL resolvers: code-first or schema-first

- code-first: is to generate GraphQL schema from codebase taking code as source of truth and
- schema-first: is the other way around i.e. write schema and generate resolver skeleton from it

I personally prefer code-first approach and GraphQL pathos package the template has in the resolver is for that purpose.
but of course you can choose whichever style you like.

-->

---

# Recap

## GraphQL is Still a Great Option

### Key Takeaways

✅ **RSC era**: GraphQL remains excellent for BFF interface

✅ **Powerful combination**:

- Flexible graph queries
- Easy-to-understand mutations (RPC-style)

✅ **Backend-less Architecture**: Next.js + GraphQL + Route Handlers

🔗 **Template**: `<url>`

<!--

# Recap: GraphQL can still be an option

Let me recap the talk.

- Even after RSC era, I believe GraphQL stays great option for BFF interface
- The powerfulness of GraphQL comes from the combination of its flexible query and easy to understand mutation interface
- Backend-less Architecture: NextJS + GraphQL powered by Route Handlers
    - Template: <url>

-->

---

# References

### Recommended Reading

📖 Recent GraphQL book (details TBD)

⚠️ **With great power comes great responsibility**

- Be careful when implementing GraphQL servers
- Highly recommended for server-side implementation

---

# Thank You! 🙏

**Questions?**

<!--

# References

- The talk mostly came out of my recent experience and realisation but i recently read this book about GraphQL:
- The power comes with responsibility: there are few things you need to be careful when implementing GraphQL server.
- Highly recommended if you have chance to implement GraphQL server side


Thank you for listening!

-->
