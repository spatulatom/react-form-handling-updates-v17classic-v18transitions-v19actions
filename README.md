# React Form Handling: Next.js Patterns

An interactive learning guide exploring three fundamental patterns for handling asynchronous operations and form submissions in Next.js applications. Compare the strengths, weaknesses, and trade-offs of each pattern through side-by-side examples.

## Overview

This project demonstrates how to handle async work in forms using three distinct patterns:

- **Classic Pattern**: Manual state management with `useState` and `useEffect`
- **Transition Pattern**: React 18's `useTransition` hook for shrinking the manual submission bucket
- **Actions Pattern**: Next.js Server Actions for server-side ownership and hydrated form actions

Each pattern solves the same problem—managing a todo form—but with different trade-offs and architectural approaches.

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
├── page.tsx                    # Main landing page
├── classic/page.tsx            # Classic pattern demo
├── transition/page.tsx         # Transition pattern demo
├── actions/page.tsx            # Actions pattern demo
├── race/                        # Race condition examples
│   ├── classic/page.tsx
│   ├── transition/page.tsx
│   └── actions/page.tsx
components/
├── todo-form.tsx               # Reusable form component
├── todo-list.tsx               # Todo list display
└── ui/                         # UI components (button, input, card, badge)
```

## Patterns Explained

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

**Strengths:**

- Server-side execution by default
- Built-in pending and returned-error flow
- Less manual coordination inside Group 3

**Weaknesses:**

- More distributed architecture across server, browser, and client components
- Under Cache Components, the `/actions` route is partially prerendered and mainly demonstrates the hydrated flow
- Learning curve for developers new to Server Actions

**Note on Cache Components:** This repo keeps Cache Components enabled. The true native no-JavaScript baseline is demonstrated on the HTML form pages under `/native`, while `/actions` shows the React 19 Actions model inside a partially prerendered route.

### 4. Race Condition Handling

**Location:** [app/race/](app/race/)

Side-by-side examples showing how each pattern handles rapid submissions and race conditions.

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

| Feature                     | Classic | Transition                         | Actions                                 |
| --------------------------- | ------- | ---------------------------------- | --------------------------------------- |
| **Requires JavaScript**     | ✓       | ✓                                  | ◐ Hydrated demo under Cache Components  |
| **State Ownership**         | Client  | Mostly client                      | Split across server, browser, and React |
| **Code Complexity**         | High    | Medium                             | Low                                     |
| **Server Execution**        | ✗       | ✗                                  | ✓                                       |
| **Race Condition Handling** | Manual  | Manual unless you add your own fix | Queued by the action model              |

## Technologies

- **Next.js 14+** - React framework for production
- **React 18+** - UI library with hooks support
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components
