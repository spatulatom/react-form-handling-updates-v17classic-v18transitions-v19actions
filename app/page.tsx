"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-foreground">React Form Handling Evolution</h1>
        <p className="text-muted-foreground">See how form handling evolved from React 17 → 18 → 19</p>

        {/* Chapter 0 — Before React */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chapter 0 — Before React</p>
          <Link
            href="/native"
            className="block p-6 rounded-lg border-2 border-stone-500/30 bg-card hover:border-stone-500 transition-colors"
          >
            <h2 className="font-semibold text-lg">🌐 Native HTML Forms</h2>
            <p className="text-sm text-muted-foreground mt-2">
              How the web handled interactivity before JavaScript — pure HTML forms, full-page round-trips, zero JS
            </p>
            <p className="text-xs text-muted-foreground mt-2">GET (query string) · POST (PRG pattern)</p>
          </Link>
        </div>

        {/* React patterns */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">React Patterns</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/classic"
              className="block p-6 rounded-lg border-2 border-primary/50 bg-card hover:border-primary transition-colors"
            >
              <h2 className="font-semibold text-lg">📝 Form Demos</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Todo list examples showing the evolution of form handling patterns
              </p>
              <p className="text-xs text-muted-foreground mt-2">Classic → Transition → Actions</p>
            </Link>

            <Link
              href="/race"
              className="block p-6 rounded-lg border-2 border-destructive/50 bg-card hover:border-destructive transition-colors"
            >
              <h2 className="font-semibold text-lg">🏎️ Race Condition Demos</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Click rapidly to see how each pattern handles concurrent requests
              </p>
              <p className="text-xs text-destructive mt-2">See the bugs in action!</p>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-lg border bg-card space-y-4">
          <h2 className="text-xl font-semibold">Why This Evolution Matters</h2>
          <p className="text-muted-foreground leading-relaxed">
            For years, React developers followed a mental model where <strong>you</strong> orchestrate everything: you
            track loading states, you catch errors, you manage data flow. This worked, but led to boilerplate, bugs
            (like race conditions), and forms that broke without JavaScript.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            React 18 introduced <code className="bg-muted px-1.5 py-0.5 rounded text-sm">useTransition</code> as a
            stepping stone - letting React manage pending states. React 19 completes the shift with{" "}
            <strong>Actions</strong>: you describe <em>what should happen</em>, and React handles <em>how</em> (loading,
            errors, revalidation).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This is an <strong>inversion of control</strong>. Instead of imperative state management, you declaratively
            define actions and let React optimize the experience - including progressive enhancement where forms work
            before JavaScript even loads.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/classic" className="block p-6 rounded-lg border bg-card hover:border-primary transition-colors">
            <h2 className="font-semibold text-lg">1. Classic Pattern</h2>
            <p className="text-sm text-muted-foreground mt-2">useState + useEffect (React 17/18)</p>
            <ul className="text-xs text-destructive mt-3 space-y-1">
              <li>• Manual loading/error states</li>
              <li>• Race conditions</li>
              <li>• No progressive enhancement</li>
            </ul>
          </Link>

          <Link
            href="/transition"
            className="block p-6 rounded-lg border bg-card hover:border-primary transition-colors"
          >
            <h2 className="font-semibold text-lg">2. Transition Pattern</h2>
            <p className="text-sm text-muted-foreground mt-2">useTransition (React 18+)</p>
            <ul className="text-xs text-green-600 mt-3 space-y-1">
              <li>✓ Auto pending state</li>
              <li>✓ Non-blocking updates</li>
              <li className="text-destructive">• Still client-only</li>
            </ul>
          </Link>

          <Link href="/actions" className="block p-6 rounded-lg border bg-card hover:border-primary transition-colors">
            <h2 className="font-semibold text-lg">3. Actions Pattern</h2>
            <p className="text-sm text-muted-foreground mt-2">useActionState + formAction (React 19)</p>
            <ul className="text-xs text-green-600 mt-3 space-y-1">
              <li>✓ Progressive enhancement</li>
              <li>✓ Built-in error handling</li>
              <li>✓ Works without JS</li>
            </ul>
          </Link>
        </div>

        <div className="p-6 rounded-lg border bg-card space-y-4">
          <h2 className="text-xl font-semibold">The Mental Model Shift</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-destructive">Old Model (Imperative)</h3>
              <p className="text-sm text-muted-foreground">"I control everything"</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. User clicks submit</li>
                <li>2. I prevent default behavior</li>
                <li>3. I set loading = true</li>
                <li>4. I call the API</li>
                <li>5. I catch errors, set error state</li>
                <li>6. I update data, set loading = false</li>
                <li>7. I reset the form</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-green-600">New Model (Declarative)</h3>
              <p className="text-sm text-muted-foreground">"React handles the how"</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Define an action function</li>
                <li>2. Connect it to form via action prop</li>
                <li>3. React tracks pending automatically</li>
                <li>4. Errors returned from action, not thrown</li>
                <li>5. Form resets automatically on success</li>
                <li>6. Works without JS (progressive enhancement)</li>
              </ul>
            </div>
          </div>
        </div>
      {/* Big Picture */}
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">The Big Picture</p>
          <h2 className="text-xl font-semibold text-foreground">What This App Is — and What It Isn't</h2>
        </div>

        {/* What this app covers */}
        <div className="p-6 rounded-lg border bg-card space-y-4">
          <h3 className="font-semibold text-foreground">Part 1 (this app): Form Mutations + Native Foundations</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This app covers one specific thread: <strong>how submitting data to a server has evolved</strong> — from
            plain HTML forms in the pre-JavaScript web, through React 17's manual state management, React 18's
            concurrent primitives, and React 19's Server Actions. The through-line is always the same operation:{" "}
            <em>user wants to change data on the server; what does the code look like, and what can go wrong?</em>
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The native GET demo (search params) was included because it's part of the same pre-JavaScript foundation —
            it's the browser's other native form behavior alongside POST. It touches a different concept (URL as state
            rather than mutation), but it was too historically important to skip when showing where everything started.
            Consider it an honest preview of a second thread rather than a full treatment of it.
          </p>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">✓ Covered here</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Native HTML POST → full-page mutation (PRG pattern)</li>
                <li>• Native HTML GET → filtered read via query string</li>
                <li>• React 17/18 classic: useState + useEffect mutations</li>
                <li>• React 18: useTransition for non-blocking submissions</li>
                <li>• React 19: Server Actions, useActionState, useFormStatus</li>
                <li>• Race conditions in all three React patterns</li>
                <li>• Progressive enhancement (works without JS)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-destructive uppercase tracking-wide">✗ Not covered (yet)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Update and Delete operations (only Create is shown)</li>
                <li>• Optimistic UI with useOptimistic (React 19)</li>
                <li>• URL as state continued in React and Next.js</li>
                <li>• Client-only UI state (modals, accordions, wizards)</li>
                <li>• Real-time / push (WebSockets, Server-Sent Events)</li>
                <li>• Authentication and session flows</li>
                <li>• Pagination and infinite scroll</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Future: URL as state */}
        <div className="p-6 rounded-lg border border-blue-500/20 bg-blue-500/5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-lg mt-0.5">→</span>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Future Part 2: URL as State — the Search Params Thread
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The native GET demo opened a door that this app doesn't walk through. URL as state is a first-class
                pattern in modern web development: search/filter criteria, sort order, pagination, selected tab, open
                modal — any UI state that should survive a refresh or be shareable in a link belongs in the URL.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This thread has its own evolution. In plain React it means using{" "}
                <code className="bg-muted px-1 py-0.5 rounded">useSearchParams</code> (React Router / TanStack Router)
                and carefully syncing URL ↔ component state without infinite loops. In Next.js App Router it means
                understanding that <code className="bg-muted px-1 py-0.5 rounded">searchParams</code> is a server-side
                prop, reading it in Server Components, and using{" "}
                <code className="bg-muted px-1 py-0.5 rounded">useSearchParams</code> on the client to avoid full-page
                navigations. Libraries like <strong>nuqs</strong> emerged specifically to manage this complexity — type-safe
                URL state with the same API as{" "}
                <code className="bg-muted px-1 py-0.5 rounded">useState</code>. A future section could trace exactly
                this: native GET → React Router search params → Next.js App Router server searchParams → nuqs.
              </p>
            </div>
          </div>
        </div>

        {/* Future: other threads */}
        <div className="p-6 rounded-lg border border-muted bg-card space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-muted-foreground text-lg mt-0.5">→</span>
            <div className="space-y-3 w-full">
              <h3 className="font-semibold text-foreground">Future Parts 3+: The Rest of Dynamic Web Interactivity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                CRUD mutations and URL state together cover only the <em>data layer</em> of a dynamic app — roughly
                half the story. Two other large territories remain:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Client UI State</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ephemeral state that never touches a server: open/closed panels, multi-step forms,
                    drag-and-drop, theme. Its own evolution: local state → Context → Zustand/Redux → signals.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Real-time / Push</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Everything covered here is pull (user initiates). Push inverts that: the server notifies
                    the client. WebSockets, Server-Sent Events, long polling, React's upcoming Activity API.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Optimistic UI</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Update the UI before the server confirms, then reconcile. React 19's{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">useOptimistic</code> is purpose-built for
                    this — most meaningful for Update and Delete, which this app doesn't yet show.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}
