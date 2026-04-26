import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About — React Form Handling Evolution",
  description:
    "What this project is, how it is structured, and how every page relates to the others.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Back link */}
        <Link
          href="/"
          className="inline-block px-3 py-2 text-sm rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">About This Project</h1>
          <p className="text-muted-foreground text-lg">
            An interactive learning guide to React form-handling patterns — from plain HTML to React&nbsp;19
            Server&nbsp;Actions.
          </p>
        </div>

        {/* ── What the project is ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">What This Project Is</h2>
          <div className="p-6 rounded-lg border bg-card space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Every web application that writes data to a server has the same three groups of state to manage:
            </p>
            <ul className="text-muted-foreground space-y-2 list-disc list-inside">
              <li><strong>Group 1 — Read state</strong>: existing data, loading flags, fetch errors</li>
              <li><strong>Group 2 — Form state</strong>: current input values and client-side validation</li>
              <li><strong>Group 3 — Submission state</strong>: pending UI, server errors, success handling</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              This project shows <em>how the owner of those three groups has shifted</em> across five years of React and
              browser API evolution. The main lesson is not that the groups disappear — it is that newer patterns let
              you move them to better owners, reducing boilerplate and improving reliability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A single concrete example — a <strong>todo list with a create form</strong> — is used on every page so
              you can focus on pattern differences rather than on understanding a new problem domain.
            </p>
          </div>
        </section>

        {/* ── Technology stack ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Technology Stack</h2>
          <div className="p-6 rounded-lg border bg-card">
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-foreground">Next.js 16 (App Router)</span> — routing, Server
                  Components, Server Actions, Cache Components,{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">revalidatePath</code>,{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">redirect</code>
                </p>
              </div>
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-foreground">React 19</span> —{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">useActionState</code>,{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">useFormStatus</code>,{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">useTransition</code>
                </p>
              </div>
              <div className="space-y-1">
                <p><span className="font-medium text-foreground">TypeScript</span> — strict types throughout</p>
              </div>
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-foreground">Tailwind CSS v4 + shadcn/ui</span> — utility-first
                  styling with accessible primitives
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Site map ── */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Site Map &amp; Page Relationships</h2>
          <p className="text-muted-foreground">
            Every route exists to demonstrate one concept. The diagram below shows the hierarchy; the sections that
            follow describe each route in detail.
          </p>

          {/* ASCII tree */}
          <div className="p-6 rounded-lg border bg-card overflow-x-auto">
            <pre className="text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre">{`/                              ← Landing page (pattern overview)
/about                         ← This page
│
├── /native                    ← Chapter 0: the web before JavaScript
│   ├── /native/get            ← HTML GET form → URL query string
│   ├── /native/post           ← HTML POST form → PRG pattern
│   └── /native/redirect       ← Redirect mechanics (browser history + Next.js)
│
├── /classic                   ← Chapter 1: useState + useEffect (React 17/18)
├── /transition                ← Chapter 2: useTransition (React 18)
├── /actions                   ← Chapter 3: Server Actions (React 19 / Next.js)
│   └── /actions/progressive   ← Deep-dive: JS enhancement & $ACTION_ID mechanism
│
├── /race                      ← Race conditions overview
│   ├── /race/classic          ← Race condition demo — Classic (broken)
│   ├── /race/transition       ← Race condition demo — Transition (better)
│   └── /race/actions          ← Race condition demo — Actions (solved)
│
└── /api/native-post           ← Route Handler backing the native POST demo`}</pre>
          </div>
        </section>

        {/* ── Per-route explanations ── */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Pages in Detail</h2>

          {/* Landing */}
          <RouteCard
            href="/"
            label="/"
            title="Landing page — Pattern overview"
            badge="Server Component"
            badgeColor="green"
          >
            The entry point. Introduces the three-group mental model, explains why the evolution matters, and links to
            every chapter. Also shows the boundary between what this app covers (mutations) and what a future project
            would cover (URL as state, optimistic UI, real-time, etc.).
          </RouteCard>

          {/* About */}
          <RouteCard
            href="/about"
            label="/about"
            title="About — Structure &amp; sitemap"
            badge="Server Component · static"
            badgeColor="green"
          >
            This page. Explains the project purpose, technology stack, and how all routes relate to each other.
            Statically generated — no data fetching required.
          </RouteCard>

          {/* Native section */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Chapter 0 — Native HTML Forms
            </p>

            <RouteCard
              href="/native"
              label="/native"
              title="Native HTML Forms — overview"
              badge="Server Component"
              badgeColor="stone"
            >
              Introduces the pre-JavaScript web model. Explains how the browser itself serializes form fields,
              constructs the request, and navigates to the server response — no JavaScript involved. Navigation links
              lead to the three sub-routes below.
            </RouteCard>

            <RouteCard
              href="/native/get"
              label="/native/get"
              title="GET form — URL as query string"
              badge="Server Component"
              badgeColor="blue"
            >
              A plain{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">{"<form method=\"get\">"}</code>{" "}
              that encodes its fields as URL search parameters. A Server Component reads{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">searchParams</code> to filter the list — zero
              JavaScript, zero API call.
            </RouteCard>

            <RouteCard
              href="/native/post"
              label="/native/post"
              title="POST form — PRG pattern"
              badge="Server Component + Route Handler"
              badgeColor="orange"
            >
              A plain{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">{"<form method=\"post\">"}</code>{" "}
              that submits to <code className="bg-muted px-1 py-0.5 rounded text-xs">/api/native-post</code>. The Route
              Handler processes the request and issues a{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">303 See Other</code> redirect back to{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">/native/post</code> — the classic{" "}
              <strong>Post / Redirect / Get (PRG)</strong> pattern that prevents double-submits on browser refresh.
            </RouteCard>

            <RouteCard
              href="/native/redirect"
              label="/native/redirect"
              title="Redirect mechanics"
              badge="Server Component"
              badgeColor="purple"
            >
              Explains the difference between{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">301</code>,{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">302</code>, and{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">303</code> and how the browser history stack is
              affected. Also covers Next.js{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">redirect()</code> and{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">permanentRedirect()</code>.
            </RouteCard>
          </div>

          {/* React pattern demos */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">React Pattern Demos</p>

            <RouteCard
              href="/classic"
              label="/classic"
              title="Classic Pattern — useState + useEffect"
              badge="Client Component"
              badgeColor="red"
            >
              The React 17 / early React 18 approach. All three groups are owned manually by the client:{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">useEffect</code> fetches the initial list (Group
              1), <code className="bg-muted px-1 py-0.5 rounded text-xs">useState</code> tracks the input (Group 2),
              and a manual{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">isSubmitting</code> flag plus{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">submitError</code> state handle submission (Group
              3). Verbose but familiar and easy to debug.
            </RouteCard>

            <RouteCard
              href="/transition"
              label="/transition"
              title="Transition Pattern — useTransition"
              badge="Client Component"
              badgeColor="yellow"
            >
              React 18 improvement.{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">useTransition</code> takes over the pending flag
              and makes the async transition non-blocking. Groups 1 and 2 are still manual; Group 3 is simplified to
              wrapping the action call in{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">startTransition</code>.
            </RouteCard>

            <RouteCard
              href="/actions"
              label="/actions"
              title="Actions Pattern — Server Actions"
              badge="Server Component + Client Island"
              badgeColor="green"
            >
              The React 19 / Next.js canonical implementation. Group 1 is read on the server at render time. Group 2
              stays in native browser form state. Group 3 flows through{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">useActionState</code> and{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">useFormStatus</code>. On success the action calls{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">revalidatePath</code> then{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">redirect("/actions")</code> — giving a 303 PRG for
              no-JS submits and a soft navigation for JS-enhanced submits from the same line of code.
            </RouteCard>

            <RouteCard
              href="/actions/progressive"
              label="/actions/progressive"
              title="Progressive Enhancement deep-dive"
              badge="Server Component"
              badgeColor="green"
            >
              Explains the 2×2 mental model: <em>no-JS vs JS</em> × <em>same-page vs different-page</em> action.
              Covers the{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">$ACTION_ID</code> mechanism (how Next.js encodes
              the server function reference into a hidden form field), why the error path needs no redirect while the
              success path does, and how Cache Components interact with the progressive-enhancement baseline.
            </RouteCard>
          </div>

          {/* Race conditions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Race Condition Demos</p>

            <RouteCard
              href="/race"
              label="/race"
              title="Race Conditions — overview"
              badge="Client Component"
              badgeColor="red"
            >
              Defines what a race condition is in the context of React: multiple async operations in flight
              simultaneously, responses arriving out of order, and the UI updating with stale data. Links to the three
              pattern-specific demos.
            </RouteCard>

            <RouteCard
              href="/race/classic"
              label="/race/classic"
              title="Classic — broken race condition"
              badge="Client Component"
              badgeColor="red"
            >
              Each click fires an independent{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">fetch</code> with a random delay, so an earlier
              request can resolve after a later one and overwrite the correct value. The displayed count is
              non-deterministic.
            </RouteCard>

            <RouteCard
              href="/race/transition"
              label="/race/transition"
              title="Transition — improved but not immune"
              badge="Client Component"
              badgeColor="yellow"
            >
              <code className="bg-muted px-1 py-0.5 rounded text-xs">useTransition</code> serializes the transition,
              so rapid clicks are queued rather than fired in parallel. This mitigates but does not fully eliminate the
              race condition.
            </RouteCard>

            <RouteCard
              href="/race/actions"
              label="/race/actions"
              title="Actions — race condition solved"
              badge="Server Component + Client Island"
              badgeColor="green"
            >
              Server Actions are queued by the React actions model. Concurrent submissions are processed sequentially
              server-side, so the count is always consistent regardless of click speed.
            </RouteCard>
          </div>

          {/* API route */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">API Routes</p>

            <RouteCard
              href="/api/native-post"
              label="/api/native-post"
              title="Route Handler — native POST endpoint"
              badge="Route Handler"
              badgeColor="stone"
            >
              Backs the <code className="bg-muted px-1 py-0.5 rounded text-xs">/native/post</code> demo. Receives a
              POST, reads <code className="bg-muted px-1 py-0.5 rounded text-xs">FormData</code>, stores the item in an
              in-memory list, and replies with a{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">303 See Other</code> redirect to complete the PRG
              cycle — all without client JavaScript.
            </RouteCard>
          </div>
        </section>

        {/* ── Key concepts glossary ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Key Concepts Glossary</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                term: "Post / Redirect / Get (PRG)",
                def: "A server response to a POST that issues a 303 redirect so the browser GETs a fresh page. Prevents double-submits when the user hits refresh.",
              },
              {
                term: "Cache Components",
                def: "Next.js feature (enabled in next.config.mjs) that pre-renders Server Components into a reusable cache. The /actions page uses this, which affects the no-JS progressive-enhancement baseline.",
              },
              {
                term: "Progressive Enhancement",
                def: "Building an experience that works with zero JavaScript first, then layering on JS enhancements. Server Actions and native HTML forms are the two layers shown here.",
              },
              {
                term: "$ACTION_ID",
                def: "The hidden form field Next.js injects that encodes the server function reference. It allows a plain HTML form submit to invoke a Server Action on the server without any client JavaScript.",
              },
              {
                term: "revalidatePath",
                def: "Next.js function called inside a Server Action to invalidate the cache for a route, causing the next render to re-fetch fresh data — eliminating the need for client-side list state.",
              },
              {
                term: "useActionState",
                def: "React 19 hook. Wraps a Server Action and returns [state, dispatch, isPending]. The state is the value last returned by the action, e.g. a validation error object.",
              },
              {
                term: "useFormStatus",
                def: "React 19 hook used inside a form's subtree. Returns { pending } — true while the parent form action is in-flight. Used to disable the submit button without lifting state.",
              },
              {
                term: "useTransition",
                def: "React 18 hook that marks an update as non-urgent. Wrapping an async call in startTransition gives an isPending boolean and keeps the UI responsive while work is in progress.",
              },
              {
                term: "In-memory store (globalThis)",
                def: "The /actions and /native/post demos use a module-level array on globalThis. It persists across requests in the same Node.js process but resets on server restart — sufficient for a demo.",
              },
              {
                term: "Client Island",
                def: "A small 'use client' component embedded inside an otherwise Server-Component tree. In /actions the TodoForm is the client island; the page and list rendering are server-side.",
              },
            ].map(({ term, def }) => (
              <div key={term} className="p-4 rounded-lg border bg-card space-y-1">
                <p className="font-medium text-foreground text-sm">{term}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What is not covered ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">What This App Does Not Cover (Yet)</h2>
          <div className="p-6 rounded-lg border bg-card">
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Update and Delete operations (only Create is shown)</li>
              <li>
                Optimistic UI with{" "}
                <code className="bg-muted px-1 py-0.5 rounded">useOptimistic</code> (React 19)
              </li>
              <li>
                URL as state — search params, pagination, filters (
                <strong>nuqs</strong>, Next.js App Router{" "}
                <code className="bg-muted px-1 py-0.5 rounded">useSearchParams</code>)
              </li>
              <li>Client-only UI state — modals, accordions, multi-step wizards, drag-and-drop</li>
              <li>Real-time / push — WebSockets, Server-Sent Events, long polling</li>
              <li>Authentication and session flows</li>
              <li>Pagination and infinite scroll</li>
            </ul>
          </div>
        </section>

        {/* ── Navigation ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Explore the Demos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/native"
              className="block p-5 rounded-lg border bg-card hover:border-stone-500 transition-colors"
            >
              <p className="font-semibold">🌐 Native HTML Forms</p>
              <p className="text-sm text-muted-foreground mt-1">The web before JavaScript</p>
            </Link>
            <Link
              href="/classic"
              className="block p-5 rounded-lg border bg-card hover:border-primary transition-colors"
            >
              <p className="font-semibold">📝 Classic Pattern</p>
              <p className="text-sm text-muted-foreground mt-1">useState + useEffect (React 17/18)</p>
            </Link>
            <Link
              href="/transition"
              className="block p-5 rounded-lg border bg-card hover:border-primary transition-colors"
            >
              <p className="font-semibold">⚡ Transition Pattern</p>
              <p className="text-sm text-muted-foreground mt-1">useTransition (React 18)</p>
            </Link>
            <Link
              href="/actions"
              className="block p-5 rounded-lg border bg-card hover:border-primary transition-colors"
            >
              <p className="font-semibold">🚀 Actions Pattern</p>
              <p className="text-sm text-muted-foreground mt-1">Server Actions (React 19 / Next.js)</p>
            </Link>
            <Link
              href="/race"
              className="block p-5 rounded-lg border bg-card hover:border-destructive transition-colors md:col-span-2"
            >
              <p className="font-semibold">🏎️ Race Condition Demos</p>
              <p className="text-sm text-muted-foreground mt-1">Click rapidly to see the bugs — and the fixes</p>
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}

/* ── Helper component ────────────────────────────────────────────── */

type BadgeColor = "green" | "red" | "yellow" | "blue" | "orange" | "purple" | "stone"

const badgeClasses: Record<BadgeColor, string> = {
  green:  "bg-green-500/10 text-green-700 dark:text-green-400",
  red:    "bg-destructive/10 text-destructive",
  yellow: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  blue:   "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  stone:  "bg-stone-500/10 text-stone-600 dark:text-stone-400",
}

function RouteCard({
  href,
  label,
  title,
  badge,
  badgeColor,
  children,
}: {
  href: string
  label: string
  title: string
  badge: string
  badgeColor: BadgeColor
  children: React.ReactNode
}) {
  return (
    <div className="p-5 rounded-lg border bg-card space-y-2">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <Link href={href} className="font-mono text-sm text-primary hover:underline">
            {label}
          </Link>
          <p className="font-semibold text-foreground">{title}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${badgeClasses[badgeColor]}`}
        >
          {badge}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  )
}
