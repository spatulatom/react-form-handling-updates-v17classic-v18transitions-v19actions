# React Form Handling: Next.js Patterns

An interactive learning guide exploring three fundamental patterns for handling asynchronous operations and form submissions in Next.js applications. Compare the strengths, weaknesses, and trade-offs of each pattern through side-by-side examples.

## Overview

This project demonstrates how to handle async work in forms using three distinct patterns:

- **Classic Pattern**: Manual state management with `useState` and `useEffect`
- **Transition Pattern**: React 18's `useTransition` hook for cleaner state transitions
- **Actions Pattern**: Next.js Server Actions for progressive enhancement and server-side logic

Each pattern solves the same problem—managing a todo form—but with different trade-offs and architectural approaches.

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

Leverages React 18's `useTransition` hook for automatic pending state management without extra state variables.

**Strengths:**

- Cleaner code than Classic
- Automatic pending state tracking
- Interruption-aware (handles rapid clicks)

**Weaknesses:**

- Still client-only (no progressive enhancement)
- Still needs `preventDefault` on forms
- Must call server functions directly

### 3. Actions Pattern

**Location:** [app/actions/page.tsx](app/actions/page.tsx)

Uses Next.js Server Actions for server-side execution with built-in loading and error states.

**Strengths:**

- Server-side execution by default
- Enables progressive enhancement
- Automatic error and pending state handling
- Type-safe between client and server

**Weaknesses:**

- Requires actual server persistence for full PWE (see note below)
- Learning curve for developers new to Server Actions

**Note on Progressive Enhancement:** The current implementation uses simulated async work. For true progressive enhancement in production, connect Server Actions to a real database for data persistence.

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

| Feature                     | Classic | Transition | Actions         |
| --------------------------- | ------- | ---------- | --------------- |
| **Requires JavaScript**     | ✓       | ✓          | ✗ (PWE capable) |
| **State Management**        | Manual  | Auto       | Auto            |
| **Code Complexity**         | High    | Medium     | Low             |
| **Server Execution**        | ✗       | ✗          | ✓               |
| **Race Condition Handling** | Manual  | Automatic  | Automatic       |

## Technologies

- **Next.js 14+** - React framework for production
- **React 18+** - UI library with hooks support
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components
