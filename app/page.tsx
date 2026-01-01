"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-foreground">React Form Handling Evolution</h1>
        <p className="text-muted-foreground">See how form handling evolved from React 17 → 18 → 19</p>

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
      </div>
    </main>
  )
}
