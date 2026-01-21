---
marp: true
theme: default
class: invert
paginate: true
backgroundColor: #1a1a1a
color: #f2f2f2
---

`#LT` `#GraphQL` `#Next.js` `#RouteHandlers` `#RSC`

# Revisiting GraphQL in the RSC Era, and Co-Located GraphQL Backend Inside Next.js

**Kenta Kudo** - Freelance Software Engineer
_React Osaka - Jan 2026_

<!--

Hi everyone, I'm Kenta.

Today I'm going to give a Lightning Talk based on my recent thoughts on GraphQL and RSC.

-->

---

# 自己紹介

- 💼 フリーランスのソフトウェアエンジニア
- 🏢 以前はMercari UKに在籍
- 🌍 イギリスに6年住み、3年前に帰国
- 🏯 昨年関西に移住 — まだ新参者です！

<!--

Let me quickly introduce myself:

- I'm currently working as a freelance software engineer
- I previously worked at companies such as Mercari UK
- Lived in the UK for 6 years and came back to Japan 3 years ago
- I moved to Kansai last year — so I'm still very new to this area!

Before we get technical, let me use this opportunity to announce something...

-->

---

# 📚 書籍のお知らせ

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

- 海外で働く日本人ソフトウェアエンジニア10名の共著
- 現在ベータ版公開中、今月末に正式リリース
- epub/pdfで提供（アップデートは無料）
- **London Tech Talk**ポッドキャストコミュニティ発のスピンオフ

</div>
<div>

<img src="LondonTechTalk_10co-authors.webp" width="300" />

</div>
</div>

<!--

I co-authored a book titled "世界で働くエンジニア"

- It's an omnibus-style autobiography by 10 different Japanese software engineers working abroad.
- The book is currently in beta release and will be officially released at the end of this month.
- But you can already read it, and I'll show you the link to the detail page in the next slide.
- The book is available as epub and pdf files, and you can get free updates whenever a new version is published.

Please have a look if you're interested in the topic, or please introduce it to your friends who might be interested. Feedback is also very welcome.

The project spun out of the community around the London Tech Talk podcast, hosted by my friend Ken, who lives in London now.
The podcast is also highly recommended. Please check it out too.

By the way, one of my hobbies is film photography, and this is a picture I took.

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

# 書籍の購入

<img src="adobe-express-qr-code.png" width="400" />

**スキャンして購入！**

https://store.london-tech-talk.com/products/book_engineers_working_abroad

<!--

**[STAY ON THIS SLIDE - Let audiences scan the QR code]**

And here's the link to the book checkout page.

- I read it all the way through, and it was really enjoyable (biased, but true).
- It has ten different migration stories, each with its own flavor.
- If I had read this before moving abroad, I would have been strongly influenced by it, so I hope you pick it up.
- The URL is on this slide, and I'm also on the React Osaka Discord, so feel free to reach out if you have questions.

If you have any questions about the book, please let me know!

Does anyone need more time?
Okay, let's move on to the talk.

-->

---

# 本日のアジェンダ

1. **導入**: GraphQLはまだ必要？
2. **GraphQLの再発見**: 素直なクエリと粒度の細かいミューテーション
3. **同居型バックエンド構成**: Route HandlersでGraphQLを内包
4. **まとめ**: GraphQLはまだ有力な選択肢

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

# 1. 導入 — 「GraphQLはまだ必要？」

## React Server Componentの時代

- **RSC**は**コンポーネント単位**でのサーバー側データ取得を可能にする
- RSC以前は...
  - Next.jsのPages Routerはページ単位のデータ取得
  - 1回のクエリでデータをまとめて取得
- 最近の主張: _「RSCではGraphQLは不要になりつつある」_

## 💡 気づき

- **GraphQLの価値は「一括取得」だけではない**
- **型安全性 + DX**の点で依然有用

<!--

React Server Components are gradually being adopted and used in real-world systems, even though they've been experiencing some issues.

- With the emergence of RSC, you can now fetch data on the server side *per component*
  - Prior to RSC, the best practice was to fetch all the relevant data on the page in a single query and pass it down to where it needs to go
  - This is because at that time data fetching in the Next.js pages router was page-level
  - GraphQL fit very well for this use case, turning it into one of the best options for frontend-backend communication
- However, RSC enabled each component to fetch only the data they need by themselves
  - Some say "GraphQL is less necessary for RSC"

- I've had some experience using GraphQL as a BFF, Backend for Frontend, for some time now
- Then I recently had a chance to design a REST API for an RSC-enabled Next.js application, and realized the benefit of GraphQL is not only that you can fetch all the data at once; it still provides value through its typed, discoverable contract and excellent ergonomics.

Let me elaborate on this.

-->

---

# 2. GraphQLの再発見 — 素直なクエリ

**グラフ構造**

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

💡 グラフとしてリソースを問い合わせ、関係を辿れる
💡 スキーマ/イントロスペクション（有効時）+ GraphiQLなどのツールによる発見性
💡 新しいエンドポイントなしで柔軟に選択
💡 エンドポイントではなくノードの関係を辿る

<!--

The first point is the straightforwardness of queries

- GraphQL queries resources as a graph structure, as the name suggests
  - Meaning you can navigate one node after another, tracing the relationships it has
  - In this query example, a user has a posts node that returns the posts the user has
  - The mental model is so straightforward that I don't even need to read through API documentation
    - ...You might still need to read documentation but it's very likely provided as introspection (when enabled) with handy built-in web UI such as GraphiQL.
    - more importantly, because of its graph structure, the question becomes "I assume node X has node Y—does it?" instead of "Which endpoint returns what I need?"
- Also one of the best-selling points of GraphQL has been that you can fetch as much data as you want without needing to ask backend devs to update the API (as long as fields exist)
  - This is because as long as the resolver for the node is implemented, how you access the data is left to client developers
  - You may get a user node from different queries or mutations, but as long as it's the same user node there is always a posts node under it

The straightforwardness of the graph structure still provides great DX even for more granular data fetching.

-->

---

# 2. GraphQLの再発見 — 使いやすいmutation

**REST API**

```
PATCH /posts/:id
```

- PATCHはリクエストボディが大きくなりがち
- リソース指向のエンドポイントは責務が重い
  - 更新が広いエンドポイントに集約されがち
- クライアント側のビジネスロジックが増える

<!--

The second point is the ergonomics of mutations.

- In REST API, you'd define a PATCH endpoint to update a specific post like this
- This gives the endpoint responsibility to update many properties of the post, making the input of the endpoint complicated
- This requires client devs to spelunk the API docs to understand and call the endpoint in the way the backend expects it to be consumed
- REST API is resource-oriented and the endpoints are designed as a combination of a URI as a resource identifier and an HTTP method as an action
- Resource-oriented APIs often consolidate updates into broader endpoints, so each endpoint tends to take big responsibility
  - for example PATCH endpoint to update any fields of a specific post
- This can push more business logic to the client side

-->

---

# 2. GraphQLの再発見 — 使いやすいmutation

**GraphQL**

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

**利点**:
- RPC風のミューテーションで意図が明確
- ビジネスロジックがインターフェース上に現れる
- 型付き引数、発見性、一貫したエルゴノミクス

<!--

- On the other hand, GraphQL mutations are defined in RPC-style
- You'd define an UpdatePostTitle mutation, making it more straightforward to understand what it does rather than a single interface that updates any fields of a post at once
- This moves business logic from frontend to backend, making it explicit at the interface level
- GraphQL offers an operation-centric interface that ensures consistent client ergonomics

The combination of the interface, graph structure for queries, and RPC-style mutations is very unique to GraphQL, and IMO still is a very suitable option for frontend-backend communication, providing great DX for both frontend and backend devs even with RSC, where more granular data fetching is preferred.

Now, let's step away from GraphQL for a moment and talk about Route Handlers.

Any questions so far?

-->

---

# 3. 同居型バックエンド構成 — Route Handlers

## Next.jsのRoute Handlers

- サーバー側で実行され、バックエンドAPIのようにアクセス可能
  - App Router → **Route Handlers**
  - Pages Router → **API Routes**

## 増えている潮流

- Route Handlersを使い**別バックエンドなし**でNext.jsアプリを構築

<!--

Next.js provides a feature called Route Handlers (App Router) / API Routes (Pages Router).
It runs on the server side and can be accessed from the frontend just like a backend API.

And I've seen more and more devs adopt the architecture to build Next.js applications without a separate backend service using these Route Handlers.

-->

---

# 3. 同居型バックエンド構成 — Route Handlers

## 🚀 テンプレート

GitHubリポジトリテンプレート: GraphQL + Route Handlers

https://github.com/KentaKudo/next-graphql-handler

_注: このテンプレートは概念のデモ用です。本番向けには認証やエラーハンドリング等が必要です。_

<!--

So I wanted to explore the co-located backend architecture that provides a GraphQL backend inside Route Handlers with an RSC-enabled Next.js app.

I published the result as a GitHub repository template at this URL.

Keep in mind: This template is built to demonstrate the idea and architectural pattern.
It's not intended to solve real-life production problems - you'll need to add proper authentication, error handling, and other production concerns.

Let me walk through the gist of it with code snippets from the repo.

-->

---

# 3. 同居型バックエンド構成 — Route Handlers

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

Apollo Serverなら → [@as-integrations/next](https://github.com/apollo-server-integrations/apollo-server-integration-next)

<!--

The magic happens here in route.ts

The GraphQL request handler is implemented using graphql-yoga package.

- It creates yoga instance based on schema defined in a separate file
- And then exposes its handler methods as GET and POST methods like this.

For a real-life use case you might want to add authentication, logging, etc., but the bare minimum working example is as simple as this.

I didn't try it, but if you prefer Apollo Server, the @as-integrations/next package exists for this binding.

-->

---

# 3. 同居型バックエンド構成 — クライアント側

## 技術スタック

- **graphql-codegen**: GraphQLクエリからTypeScriptを生成
- **urql**: GraphQLクライアントライブラリ
- `/api/graphql`エンドポイントを叩く

<!--

Moving on to the client side, I used the graphql-codegen package to generate TypeScript code from GraphQL queries and then use urql as a client library.

By hitting `/api/graphql`, it can get the result via the GraphQL route handler.

Let's check the example of calling this route handler from both Server and Client Components.

-->

---

# 3. 同居型バックエンド構成 — クライアント側

## urqlクライアント設定（Server Components）

```ts
// lib/urql.ts
import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";

const makeClient = () =>
  createClient({
    url: "http://localhost:3000/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

export const { getClient } = registerUrql(makeClient);
```

<!--

This is a urql client setup for Server Components.

For Server Components, I use registerUrql from @urql/next/rsc package.
It gives me a getClient() helper that I can call inside Server Component.

The client targets the same /api/graphql route handler.

-->

---

# 3. 同居型バックエンド構成 — クライアント側

**例: Server Component**

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

This gives you compile-time type safety from schema to component (via codegen).

-->

---

# 3. 同居型バックエンド構成 — クライアント側

## urqlクライアント設定（Client Components）

```tsx
// app/providers/urql.tsx
"use client";
import type { ReactNode } from "react";
import { createClient, UrqlProvider as NextUrqlProvider } from "@urql/next";
import { cacheExchange, fetchExchange } from "@urql/core";

const client = createClient({
  url: "/api/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

export const UrqlProvider = ({ children }: { children: ReactNode }) => (
  <NextUrqlProvider value={client}>{children}</NextUrqlProvider>
);
```

<!--

For Client Components,

I setup the client using createClient() method, pass it to the Provider from @urql/next, and wrap the app with it.
You can access the client through the standard useQuery hook.

-->

---

# 3. 同居型バックエンド構成 — クライアント側

**例: Client Component**

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

Like this.

Similarly to the Server Component, it defines the query it uses.
And it executes the query using the useQuery hook which then uses the client set up in the previous slide.

This gives you flexibility to choose where to fetch based on your needs.
And also you can mix it with Server Actions to provide the best user experience.

-->

---

# 4. まとめ — GraphQLがまだ輝く時

## RSC + BFFパターン

RSCで同居型取得が可能になっても、次の価値は残る:

✅ **型付きで見通しの良いスキーマ**（GraphQL）
✅ **強力な組み合わせ**: 柔軟なグラフクエリ & 使いやすいミューテーション（RPC風）
✅ **同居型アーキテクチャ**: Next.js + GraphQL + Route Handlers

## 結論

RSCは **_どこで_** 取得するかを変えるだけで、そのインターフェイスが **_どうあるべきか_** は変えない

<!--

Let me recap the talk.

Even with RSC, GraphQL provides value:

- RSC enables co-located fetching at the component level, but you can still benefit from a typed, discoverable, and stable contract
- The power of GraphQL comes from the combination of its flexible query and easy-to-understand mutation interface
- Demonstrated Co-Located Backend Architecture with Next.js + GraphQL powered by Route Handlers

The key insight: RSC changes WHERE you fetch data (component-level vs page-level), but it doesn't change WHAT your interface contract should look like.

GraphQL should still remain as a great option for frontend and backend communication.

-->

---

# 参考資料


- 📖 おすすめ: Black Hat GraphQL
  - https://nostarch.com/black-hat-graphql
  - **高コストなクエリによるDoS**（深いネスト）
  - **認可の落とし穴**（フィールド単位のチェック漏れ）
  - **情報漏洩**（本番でのイントロスペクション）
- 🚀 テンプレートリポジトリ
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

# ご清聴ありがとうございました！ 🙏

**質問はありますか？**

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

## 付録: 簡単な移行

別サーバーを立てたい？

→ Yogaはフレームワーク非依存で、変わるのはアダプタだけ
→ ExpressやHonoなどにYogaを組み込むだけ
→ React/Next.js特有のコードはバインディング層に閉じ込める

<!--

And a great thing is that even when you want to spin up a dedicated server process, the only thing you need to do is take the Yoga instance and hook it into a server process such as Express or Hono.
Yoga is framework-agnostic; only the adapter changes.

Just be careful to contain all the React/Next.js support in the route.ts.

-->

---

# 付録: Code-first vs Schema-first

### コードファースト

コードベースからGraphQLスキーマを生成
→ コードが真実のソース
**選ぶとき**: TypeScriptモノレポでDXが良い

### スキーマファースト

スキーマを書いて、リゾルバの骨組みを生成
→ スキーマが真実のソース
**選ぶとき**: 言語横断チーム / スキーマガバナンス

### 私の好み: Pothosのコードファースト

テンプレートは**Pothos GraphQL**でコードファーストを採用

_(でも、状況に合わせて選べばOKです！)_

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

# 付録: Pothosでのコードファースト例

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

型安全で簡潔、TypeScriptネイティブ

<!--

Here's what a Pothos schema definition looks like.

You define your types and resolvers in TypeScript code.
Pothos provides a type-safe builder API that generates the GraphQL schema.

The big advantage is that everything is type-checked at compile time.
If you refactor your TypeScript types, the schema automatically updates.

-->

---

# 付録: 本番運用の注意点 — GraphQLは強力、守るべき

## セキュリティと性能

⚠️ **認可**: フィールド単位の認可（ルート単位だけでなく）
⚠️ **N+1対策**: バッチング / DataLoaderパターン
⚠️ **クエリ複雑度**: 深さ・コスト制限
⚠️ **イントロスペクション**: 本番では無効化（または制限）
⚠️ **エラーマスキング**: 内部エラーを漏らさない
⚠️ **レート制限**: 乱用対策

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
