import type React from "react"
import Link from "next/link"

export default function NativeLayout({ children }: { children: React.ReactNode }) {
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Native HTML Forms — Before JavaScript</h1>
          <p className="text-muted-foreground mb-4">
            The web's original interactivity model: plain HTML forms, full-page server round-trips, zero JavaScript.
            Understanding this foundation makes everything that came after make sense.
          </p>
          <nav className="flex gap-4 flex-wrap">
            <Link
              href="/native"
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
            >
              📌 Overview
            </Link>
            <Link
              href="/native/get"
              className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
            >
              GET Form (query string)
            </Link>
            <Link
              href="/native/post"
              className="px-4 py-2 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors"
            >
              POST Form (PRG pattern)
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
