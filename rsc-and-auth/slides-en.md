---
marp: true
theme: default
class: invert
paginate: true
backgroundColor: #1a1a1a
color: #f2f2f2
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

---

# Why Rethink Auth with RSC?

---

## Auth Basics (Quick Refresher)

**Authentication (authN)** = Who is the user?
**Authorisation (authZ)** = What can they do?
**Access Control** = authN + authZ

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

## Exception: different memory model (⇄ same memory model)

```ts
export default async function UserDashboard() {
  const session = await getSession();
  const response = await fetch('https://api.yourbackend.com/user/profile', {
    headers: {
      'Authorization': `Bearer ${session.idToken}`, // Call external API with ID token
      'Content-Type': 'application/json',
    },
  });

  ...
}
```

- ✅: Keep things separated, clean
- ❌: Too rigid, complex

---

## Where Should Auth Happen?

### 1. Server Components & Server Actions ⭐

**Main place** - authorize before reading/writing protected data

### 2. Route Handlers (Next.js)

Treat them like mini-APIs - auth required here too

### 3. Optional: Middleware (Next.js)

Route-level access checks

---

## Middleware: Be Careful! ⚠️

- Runs on **every request** → needs to be fast
- Edge runtime on Vercel → no full Node.js, no DB access
- **Use only for fast, optimistic checks**

---

## Middleware: Be Careful! ⚠️

```ts
// middleware.ts
import { NextResponse } from "next/server";

// ✅ Good: Check if session cookie exists
export function middleware(request) {
  const hasSession = request.cookies.has("session");
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

---

## Middleware: Be Careful! ⚠️

```ts
// middleware.ts
import { NextResponse } from "next/server";

// ❌ Bad: Query database for user permissions
export async function middleware(request) {
  const token = request.cookies.get("session")?.value;
  const user = await db.user.findUnique({
    where: { sessionToken: token },
  });
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

---

# How: Practical Implementation

---

## Three Parts of Auth

1. **Authentication** - Confirm user identity
2. **Session Management** - Track logged-in users
3. **Authorisation** - Check resource access

---

## Session Management

**Session stores:**

- User ID, roles/permissions, expiration
- Maybe other metadata

**Two approaches:**

- **Cookie-based** - All data in secure HTTP-only cookie
- **DB-based** - Session in DB, client gets session ID

**Security**

- Add `secure`, `HttpOnly`, and `SameSite=Strict` (or `Lax`) attributes
- → Mitigate CSRF and XSS attacks

→ Use trusted libraries: **auth.js** (formerly next-auth), **Auth0** 🛡️

---

## Authorisation — How to structure your code

```ts
const SomeServerComponent = () => {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { id } });
  ...
}
```

❌ **Security risk** - Easy to forget auth checks
❌ **Inconsistent patterns** - Auth logic scattered everywhere
❌ **Hard to maintain** - Security mixed with UI code

---

## The DAL Pattern ⭐

**Data Access Layer** - Next.js team recommendation

![laying](./layering.png)

---

## Why Use a DAL?

✅ Isolate auth checks and data access
✅ Easier to audit and reuse
✅ Keep server components clean
✅ Consistent security patterns

→ Make it possible for different teams to work independently

---

## DAL Example

```ts
// some-server-component.tsx
import { getUser } from "dal.ts";
const SomeServerComponent = () => {
  const user = await getUser();
  ...
}
```

```ts
// dal.ts
export const getUser = async () => {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: { id: session.userId },
  });
  return { id: user.publicId };
};
```

---

## Tips 1. The Magic of cache() 🎩

```ts
export const verifySession = async () => {
  // verify session...
  return { isAdmin: true, userId: session.userId };
};

export const getUser = async () => {
  const session = await verifySession();
  // fetch data...
};
export const getDocuments = async () => {
  const session = await verifySession(); // ❌ Verifying session again
  // fetch data...
};
```

---

## Tips 1. The Magic of cache() 🎩

```ts
import { cache } from "react";

export const verifySession = cache(async () => {
  // verify session...
  return { isAdmin: true, userId: session.userId };
});

export const getUser = async () => {
  const session = await verifySession();
  // fetch data...
};
export const getDocuments = async () => {
  const session = await verifySession(); // Only runs once per request!
  // fetch data...
};
```

- Caches result during single render cycle → No extra session checks
- Per-request only → safe from data leaks

---

## Tips 2. Keep It Server-Only

```ts
// Add this to every DAL file
import "server-only";
```

**Throws build error** if imported in client component

---

## Tips 3. DTO Pattern for Safety

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

→ Just like you would from an API 📡

---

# Wrap-up

---

## Main Points to Remember

- RSC changes the structure—not the need—for auth
- Authorize in server components, actions, route handlers
- Middleware is optional, use carefully
- DAL helps manage complexity
- Use trusted libraries for session handling

---

## Thanks for listening!

### References:

- **[Next.js documentation on authentication](https://nextjs.org/docs/app/guides/authentication)**
  - highly recommend diving deeper there
- **[How to Think About Security in Next.js](https://nextjs.org/blog/security-nextjs-server-components-actions)**
