# Feedback: `next-graphql-handler/slides-en.md`

## Overall

- **Core story works**: “RSC changes _where_ you fetch, not _what_ your interface contract should be” is a strong frame.
- **What’s missing**: a short “GraphQL responsibilities / sharp edges” section (authz, N+1, caching, cost limits) to balance the “That’s it!” simplicity.
- **Terminology**: “backend-less” reads a bit misleading. Consider “single-repo / co-located backend” or “no separate backend service”.

## Things that are wrong / potentially misleading

- **GraphQL query example isn’t valid as-is** (slide “Straightforward Queries”):
  - You typically need an operation wrapper like `query { user { ... } }`.
  - If `user` needs arguments (e.g. `user(id: ID!)`) the example may imply “you can always just ask for `user`”.
- **“Backend-less” / “without server-side” phrasing** (transcript around the route handler slide):
  - You still have server-side execution; you’re just avoiding a _separate_ backend service.
  - Suggested wording: “without a separate backend (still runs server-side inside Next.js).”
- **Typos / naming**:
  - “GraphQL pathos” in transcript should be **Pothos**.
  - “Comfortableness” → more natural: **“Ergonomic mutations”** / “Comfortable mutations”.
- **“That’s it!” for Yoga in a route handler** is true for a demo, but incomplete for production:
  - Missing callouts: auth/session, CORS, error masking, introspection toggles, rate limiting, query cost limits, logging/tracing.

## What I’d add (content)

- **One slide: “GraphQL is powerful; protect it”**
  - Authorization at field level (not only at route level)
  - N+1 avoidance (batching / DataLoader patterns)
  - Query complexity / depth limits
  - Disable introspection in production (or gate it)
  - Persisted queries (optional, but good to mention)
  - Cache strategy (CDN / route segment caching vs GraphQL response caching)
- **One sentence to connect RSC and BFF**
  - RSC enables colocated fetching, but you can still benefit from a **typed, discoverable, stable contract** (GraphQL schema) when multiple clients, teams, or UI surfaces exist.

## Slide-by-slide notes

### Title / About / Book

- **Title slide**: “Fully Self-Contained Backend” is strong, but consider “co-located GraphQL backend inside Next.js” to reduce “is it really fully backend?” skepticism.
- **Book slide**: You might add a short “why it’s relevant” transition line (e.g. “Quick announcement, then we’ll get technical.”) to keep pacing.

### “1. Introduction”

- **Claim tuning**: “GraphQL is no longer needed” → consider reframing as “GraphQL is less necessary _for overfetch/underfetch_, but still useful for _contract + ergonomics_.”
- **Add one concrete pain from REST** you hit recently (e.g. “PATCH endpoint became a mini-RPC with 8 optional fields + doc spelunking”).

### “2. Rediscover GraphQL — Straightforward Queries”

- **Make the example syntactically complete**:
  - Consider showing:
    - `query UserWithPosts($id: ID!) { user(id: $id) { ... } }`
  - Or if you want it minimal, at least wrap with `query { ... }`.
- **One small caveat**: “Graph structure is intuitive” but mention “schema design matters (connections, pagination)”.

### “2. Comfortable Mutations”

- **Great point**: surfacing business intent at the API boundary.
- **Balance**: REST can also model “business intent” (custom endpoints), so clarify the advantage is **first-class typed arguments + discoverability + consistent client ergonomics**.
- **Return shape**: Your mutation example returns a scalar. Many GraphQL APIs return updated object + error union. Consider:
  - `updatePostTitle(...) { post { id title } }` or a payload type.

### “3. Backend-less Architecture with Route Handler”

- **Terminology suggestion**:
  - “Backend-less” → “No separate backend service (GraphQL runs in Next.js route handlers)”.
- **Runtime note (optional but helpful)**:
  - If this relies on Node.js runtime (vs Edge), say so briefly (people will ask).

### “3. Implementation with graphql-yoga”

- **Add one line acknowledging production concerns** right under “That’s it!”:
  - “(Plus auth, limits, logging—more on that later / see reference slide)”
- **CORS / OPTIONS**: nice touch exporting `OPTIONS`; you might mention “for browsers / preflight”.

### “3. Client Side”

- **RSC alignment**: If the app uses RSC heavily, note where `urql` lives (client components) vs server components.
- **Migration claim** is good—maybe add a concrete sentence:
  - “Yoga is framework-agnostic; only the adapter changes.”

### “4. Code-first vs Schema-first”

- **Fix transcript**: “Pothos” not “pathos”.
- **Add when to choose which** (1 line each):
  - Code-first: great DX in TS mono-repo
  - Schema-first: great for language-agnostic teams / schema governance

### Recap / References

- **Add explicit “use with care” bullets** (even 2–3) on the recap or references slide so the audience doesn’t leave with “GraphQL is easy, just ship it.”
- **Black Hat GraphQL** ref is excellent—maybe add 1–2 examples of risks (DOS via expensive queries, authz pitfalls).

## Transcript copy edits (quick wins)

- “I’m freelance software engineer” → “I’m **a** freelance software engineer”
- “Move to Kansai last year” → “I **moved** to Kansai last year”
- “The project is span out” → “The project **spun** out”
- “Any feedbacks are also very welcomed” → “Feedback is very welcome”
- “without server-side” (route handler transcript) → “without a separate backend service”
- “powerfulness” → “power”
- “easy to understand” → “easy to understand **and** evolve”

## Optional: questions to prepare for (audience Q&A)

- “How do you handle authn/authz with Yoga in route handlers?”
- “How do you avoid N+1 in resolvers?”
- “What’s your approach to caching with RSC + GraphQL?”
- “Edge runtime compatibility?”
- “Why `urql` vs Apollo / gql.tada / graphql-request?”
