# React Form Handling: Next.js Patterns

An interactive learning guide exploring the evolution of form-handling patterns in Next.js — from plain HTML forms through React 17 classic state management, React 18 transitions, and React 19 Server Actions. Compare the strengths, weaknesses, and trade-offs of each approach through side-by-side, runnable examples.

> **New:** visit [`/about`](http://localhost:3000/about) in the running app for an in-app guide covering the project purpose, full site map, page relationships, and key concept glossary.

## Overview

This project demonstrates how to handle async work in forms using four chapters of increasing abstraction:

- **Chapter 0 — Native HTML**: Plain `<form>` elements, full-page round-trips, the PRG pattern, zero JavaScript
- **Chapter 1 — Classic Pattern**: Manual state management with `useState` and `useEffect`
- **Chapter 2 — Transition Pattern**: React 18's `useTransition` hook for shrinking the manual submission bucket
- **Chapter 3 — Actions Pattern**: Next.js Server Actions for server-side ownership and hydrated form actions

Each React pattern solves the same problem — managing a todo create form — but with different trade-offs and architectural approaches.

Across all three pages, the app uses the same mental model:

- **Group 1: Read State** — existing data, loading, fetch errors
- **Group 2: Form State** — current input values and client-side validation
- **Group 3: Submission State** — pending UI, returned errors, success handling

The main lesson is not that those groups disappear. It is that newer React and Next.js patterns let you move them to better owners.

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the patterns.

## Project Structure

```
app/
├── page.tsx                          # Landing page — pattern overview
├── about/page.tsx                    # About page — project structure & sitemap
├── native/                           # Chapter 0 — Native HTML Forms (zero JS)
│   ├── layout.tsx                    # Shared nav for all /native routes
│   ├── page.tsx                      # Overview
│   ├── get/page.tsx                  # GET form → URL query string demo
│   ├── post/page.tsx                 # POST form → PRG pattern demo
│   └── redirect/page.tsx             # Redirect mechanics (301/302/303 + Next.js)
├── classic/page.tsx                  # Chapter 1 — Classic pattern (useState + useEffect)
├── transition/page.tsx               # Chapter 2 — Transition pattern (useTransition)
├── actions/                          # Chapter 3 — Actions pattern (Server Actions)
│   ├── page.tsx                      # Server Component page (reads list server-side)
│   ├── actions.ts                    # "use server" action file
│   ├── todo-form.tsx                 # Client island (useActionState + useFormStatus)
│   ├── action-state.ts               # Shared ActionState type
│   ├── native-store.ts               # In-memory store (globalThis)
│   └── progressive/page.tsx          # JS enhancement & $ACTION_ID deep-dive
├── race/                             # Race condition examples
│   ├── layout.tsx                    # Shared nav for all /race routes
│   ├── page.tsx                      # Race condition overview
│   ├── classic/page.tsx              # Classic — broken (responses arrive out of order)
│   ├── transition/page.tsx           # Transition — better (serialized but not immune)
│   └── actions/page.tsx              # Actions — solved (queued by the actions model)
└── api/
    └── native-post/route.ts          # Route Handler backing the /native/post demo
components/
└── ui/                               # shadcn/ui components (button, input, card, badge …)
```

## Patterns Explained

### 0. Native HTML Forms (Chapter 0)

**Locations:** [app/native/](app/native/)

Before JavaScript, the only way to send data from a web page to a server was through a native HTML `<form>` element. The browser serialized the fields, constructed the request, navigated to the new URL, and rendered whatever the server sent back — all as full-page server round-trips.

Three sub-pages cover the two native form archetypes and the redirect mechanics that underpin the POST pattern:

| Route | Purpose |
| --- | --- |
| `/native/get` | `<form method="get">` — fields encoded into the URL as query params; the Server Component reads `searchParams` to filter the list. No JS, no API call. |
| `/native/post` | `<form method="post">` → `/api/native-post` Route Handler → **303 See Other** back to the page. Demonstrates the **Post / Redirect / Get (PRG)** pattern that prevents double-submits. |
| `/native/redirect` | Explains 301 vs 302 vs 303, browser history stack effects, and Next.js `redirect()` / `permanentRedirect()`. |

**Why it matters:** React 19 Server Actions are progressively enhanced forms — understanding native POST/GET makes the `$ACTION_ID` mechanism and the no-JS baseline immediately intuitive.

### 1. Classic Pattern

**Location:** [app/classic/page.tsx](app/classic/page.tsx)

Uses `useState` for loading and pending states, with manual error handling and cleanup. Shows best practices for managing async operations in client-side React.

**Strengths:**

- Full control over state transitions
- Familiar to most React developers
- Easy to debug

**Weaknesses:**

- Verbose boilerplate code
- No progressive enhancement (requires JavaScript)
- Manual race condition handling needed

### 2. Transition Pattern

**Location:** [app/transition/page.tsx](app/transition/page.tsx)

Leverages React 18's `useTransition` hook to simplify the pending part of Group 3 while leaving Group 1 and Group 2 mostly unchanged.

**Strengths:**

- Cleaner submission-state code than Classic
- Automatic pending state tracking
- Better rendering responsiveness during async updates

**Weaknesses:**

- Still owns Group 2 manually
- Still client-only (no progressive enhancement)
- Still needs `preventDefault` on forms
- Still needs manual submit error handling

### 3. Actions Pattern

**Location:** [app/actions/page.tsx](app/actions/page.tsx)

Uses Next.js Server Actions so Group 1 can be read on the server, Group 2 can stay in native form state, and Group 3 can flow through React's form hooks.

The `/actions` folder is the canonical reference implementation: a `"use server"` action file, a minimal client island (`TodoForm`), and a Server Component page that fetches the list at render time. The list stays fresh via `revalidatePath` — no client `useState` list needed. On success the action calls `redirect("/actions")`, which gives no-JS submits a proper PRG 303 and gives JS-enhanced submits a soft `router.push()` — same line of code, two behaviours.

See [app/actions/progressive/page.tsx](app/actions/progressive/page.tsx) for a full explanation of how the same action behaves with and without JavaScript, including the 2×2 mental model (no-JS/JS × same-page/different-page), the `$ACTION_ID` mechanism, and why the error path needs no redirect while the success path does.

**Strengths:**

- Server-side execution by default
- Built-in pending and returned-error flow via `useActionState` + `useFormStatus`
- No client list state — `revalidatePath` keeps the list fresh
- Progressive enhancement: works without JavaScript via the permalink + `$ACTION_ID` mechanism

**Weaknesses:**

- More distributed architecture across server, browser, and client components
- Learning curve for developers new to Server Actions

**Note on Cache Components:** This repo keeps Cache Components enabled (`cacheComponents: true` in `next.config.mjs`). The true native no-JavaScript baseline is demonstrated on the HTML form pages under `/native`, while `/actions` shows the React 19 Actions model inside a partially prerendered route.

### 4. Race Condition Handling

**Location:** [app/race/](app/race/)

Side-by-side examples showing how each pattern handles rapid concurrent submissions:

| Route | Outcome |
| --- | --- |
| `/race/classic` | **Broken** — independent fetches with random delays can resolve out of order, corrupting the displayed value |
| `/race/transition` | **Better** — `useTransition` serializes the transition, queuing rapid clicks, but does not provide a full guarantee |
| `/race/actions` | **Solved** — the React actions model queues Server Action calls sequentially; the result is always consistent |

### 5. About Page

**Location:** [app/about/page.tsx](app/about/page.tsx)

A statically generated Server Component at `/about` that documents the project from within the app itself. It covers:

- What the project is and the three-group mental model
- Full annotated site map (all routes and their relationships)
- Per-page descriptions including rendering strategy and key APIs used
- Key concepts glossary (PRG, Cache Components, `$ACTION_ID`, `useActionState`, etc.)
- What the app does _not_ cover (Update/Delete, optimistic UI, URL-as-state, real-time)

## Running the Project

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Run with Turbopack (faster builds)
pnpm dev --turbo
```

## Learning Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-mutation/server-actions)
- [React useTransition Hook](https://react.dev/reference/react/useTransition)
- [Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_enhancement)

## Key Takeaways

| Feature | Native HTML | Classic | Transition | Actions |
| --- | --- | --- | --- | --- |
| **Requires JavaScript** | ✗ | ✓ | ✓ | ◐ Hydrated demo under Cache Components |
| **State Ownership** | Browser / Server | Client | Mostly client | Split: server, browser, React |
| **Code Complexity** | Minimal | High | Medium | Low |
| **Server Execution** | ✓ (Route Handler) | ✗ | ✗ | ✓ |
| **Race Condition Handling** | N/A (full-page) | Manual | Better (serialized) | Queued by the action model |
| **Progressive Enhancement** | ✓ by definition | ✗ | ✗ | ✓ via `$ACTION_ID` |

## Technologies

- **Next.js 16 (App Router)** — Server Components, Server Actions, Cache Components, Route Handlers
- **React 19** — `useActionState`, `useFormStatus`, `useTransition`
- **TypeScript** — type safety throughout
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible, composable UI components
- **Turbopack** — fast development builds (`pnpm dev --turbo`)