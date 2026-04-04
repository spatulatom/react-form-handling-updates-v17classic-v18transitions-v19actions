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
      </div>
    </main>
  )
}
