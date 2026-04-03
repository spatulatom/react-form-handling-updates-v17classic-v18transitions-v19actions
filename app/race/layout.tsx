import type React from "react"
import Link from "next/link"

export default function RaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-block mb-4 px-3 py-2 text-sm rounded-lg bg-muted text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Race Condition Demonstrations</h1>
          <p className="text-muted-foreground mb-4">
            Click the increment button rapidly multiple times to see how each pattern handles race conditions. Each "API
            call" has a random delay (200-500ms), so requests can return out of order.
          </p>
          <nav className="flex gap-4">
            <Link
              href="/race"
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
            >
              📌 Overview
            </Link>
            <Link
              href="/race/classic"
              className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              Classic (Broken)
            </Link>
            <Link
              href="/race/transition"
              className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors"
            >
              Transition (Better)
            </Link>
            <Link
              href="/race/actions"
              className="px-4 py-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
            >
              Actions (Solved)
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
