---
marp: true
theme: default
class: invert
paginate: true
backgroundColor: #1a1a1a
color: #ffffff
---

# React Server Components & Auth

**Kenta Kudo** - Freelance Software Engineer
React Osaka - June 2025

---

## About Me 👋

- Freelance software engineer (backend → frontend)
- Spent 6 years working in London
- Moved back to Japan / Tokyo → Kansai
- First time speaking at this meetup!

---

## Today's Agenda

1. **Why** do we need to rethink auth for RSC?
2. **When & Where** should auth happen?
3. **How** to implement it in practice?

Let's jump in! 🚀

---

# Why Rethink Auth with RSC?

---

## Auth Basics (Quick Refresher)

**Authentication (authN)** = Who is the user?
**Authorisation (authZ)** = What can they do?
**Access Control** = authN + authZ

We all know this... but RSC changes the game.

---

## The RSC Twist

> React Server Components **blur the boundary** between client and server.

— "How to Think About Security in Next.js" / Next.js team

What used to be clearly "backend" is now happening inside your frontend repo.

⚠️ **We need to update our mental model** of where auth should live—and how to keep it secure.

---

# When & Where Should Auth Happen?

---

## When to Authorise?

**Simple answer:** Any time a user accesses protected data

In the RSC world:

- **Read access** → Inside server components
- **Write access** → Inside server actions

Both cases need authorization! 🔒

---

## Where Should Auth Happen?

### 1. Server Components & Server Actions ⭐

**Main place** - authorize before reading/writing protected data

### 2. Middleware (Optional)

Route-level access checks, but keep it lightweight!

### 3. Route Handlers

Treat them like mini-APIs - auth required here too

---

## Middleware: Be Careful! ⚠️

- Runs on **every request** → needs to be fast
- Edge runtime on Vercel → no full Node.js, no DB access
- **Use only for fast, optimistic checks**

```ts
// ✅ Good: Check if session cookie exists
// ❌ Bad: Query database for user permissions
```

---

# How: Practical Implementation

---

## Three Parts of Auth

1. **Authentication** - Confirm user identity
2. **Session Management** - Track logged-in users
3. **Authorisation** - Check resource access

Let's focus on the RSC-specific parts! 📋

---

## Session Management

**Session stores:**

- User ID, roles/permissions, expiration
- Maybe other metadata

**Two approaches:**

- **Cookie-based** - All data in secure HTTP-only cookie
- **DB-based** - Session in DB, client gets session ID

Use trusted libraries: **auth.js**, **Auth0** 🛡️

---

## The DAL Pattern ⭐

**Data Access Layer** - Next.js team recommendation

```ts
// ❌ Don't do this in server components
const user = await db.user.findUnique({ where: { id } });

// ✅ Do this instead
const user = await getUser();
```

---

## Why Use a DAL?

✅ Isolate auth checks and data access
✅ Easier to audit and reuse
✅ Keep server components clean
✅ Consistent security patterns

---

## DAL Example

```ts
// dal.ts
export const getUser = async () => {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  });

  // Return safe DTO
  return {
    id: user.publicId,
    name: user.name,
    email: user.email,
  };
};
```

---

## The Magic of cache() 🎩

```ts
import { cache } from "react";

export const verifySession = cache(async () => {
  // verify session...
  return { isAdmin: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  // fetch data...
});

export const getDocuments = cache(async () => {
  const session = await verifySession(); // Only runs once per request!
  // fetch data...
});
```

- Caches result during single render cycle
- Per-request only → safe from data leaks
- No extra session checks

---

## Keep It Server-Only

```ts
// Add this to every DAL file
import "server-only";
```

**Throws build error** if imported in client component
Nice safeguard! 🛡️

---

## DTO Pattern for Safety

```ts
// ❌ Don't return raw DB data
return user; // includes password hash, internal IDs

// ✅ Return safe DTO
return {
  id: user.publicId,
  name: user.name,
  email: user.email,
};
```

Just like you would from an API! 📡

---

## What Happens When Auth Fails?

RSC security risks are different:

- Traditional SPA: Unauthorized API calls fail
- **RSC**: Mistakes can leak data during server-side rendering

**If you forget auth in server component** → sensitive data sent to client bundle! 💥

---

# Key Takeaways

---

## Main Points to Remember

1. **RSC changes where auth happens, not why it matters**

   - Boundary blurred, but data still needs protection

2. **Always authorize at point of data access**
   - Server components reading data ✓
   - Server actions updating data ✓

---

## Main Points (continued)

3. **Use a Data Access Layer**

   - Centralized auth logic
   - Clean components
   - Easy to audit
   - React's `cache()` prevents redundant checks

4. **Don't roll your own auth**
   - Use Auth.js or Auth0
   - They've solved the hard problems

---

# What's Next?

---

## Getting Started with RSC

**Recommendations**:

- Start with **simple DAL pattern** in your next project
- Read **Next.js auth documentation** (really comprehensive!)
- Experiment with **middleware** for route-level protection

**The mental shift takes time**, but once it clicks, it makes sense.
You're putting security checks exactly where your data lives.

---

# Outro

---

## Wrapping Up

That's all from me today!

I hope this helps you think about auth in RSC projects—and maybe saves you from some of the confusion I had when I first started.

**Heavily inspired by Next.js documentation on authentication** - highly recommend diving deeper there.

---

## Questions?

Thanks for listening!

I'd love to take any questions you might have.

---

## Thank You! 🙏
