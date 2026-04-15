"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RacePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold text-foreground">What is a Race Condition?</h2>
        <p className="text-muted-foreground">
          A race condition occurs when the outcome of an operation depends on the timing of uncontrollable events. In
          React, this commonly happens when:
        </p>
        <ul className="text-muted-foreground space-y-2 list-disc list-inside">
          <li>Multiple async operations are triggered in quick succession</li>
          <li>Responses return in a different order than requests were sent</li>
          <li>The UI updates with stale data because an older request finished last</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/race/classic">
          <Card className="h-full hover:border-destructive/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-destructive">Classic Pattern</CardTitle>
              <CardDescription>React 17 style - useState + async handler</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>The Problem:</strong>
              </p>
              <p>
                Click 5 times quickly. You expect count to be 5, but it might be 2, 3, or any number because slower
                requests overwrite faster ones.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/race/transition">
          <Card className="h-full hover:border-yellow-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-yellow-600">Transition Pattern</CardTitle>
              <CardDescription>React 18 style - useTransition</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Partial Fix:</strong>
              </p>
              <p>
                useTransition helps with UI responsiveness but doesn't inherently solve race conditions. We need to add
                our own cancellation logic.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/race/actions">
          <Card className="h-full hover:border-green-500/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-green-600">Actions Pattern</CardTitle>
              <CardDescription>React 19 style - useActionState</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>The Solution:</strong>
              </p>
              <p>
                Actions are queued and processed sequentially. Each action sees the result of the previous one. No race
                conditions possible.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Go to any of the three examples above</li>
            <li>Click the "Increment" button 5-10 times as fast as you can</li>
            <li>Watch the "Expected" vs "Actual" count</li>
            <li>In the Classic example, these numbers will often differ (race condition!)</li>
            <li>In the Actions example, they will always match</li>
          </ol>
          <p className="text-muted-foreground">
            <strong>Why random delays?</strong> Real network requests don't take consistent time. A request sent first
            might return last. Our fake API simulates this with 200-500ms random delays.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Patterns vs Race Conditions</CardTitle>
          <CardDescription>
            Not every pattern in this project is vulnerable. The full picture depends on whether the browser,
            React, or your own code is doing the serializing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border bg-muted/50 font-medium">Pattern / scenario</th>
                  <th className="text-left p-3 border bg-muted/50 font-medium">Race immune?</th>
                  <th className="text-left p-3 border bg-muted/50 font-medium">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border font-medium">Native GET (single fetch on mount)</td>
                  <td className="p-3 border text-green-600 font-medium">✓ Yes</td>
                  <td className="p-3 border text-muted-foreground">One request fires once. Nothing to race against.</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-3 border font-medium">Native POST — no JS (browser form submit)</td>
                  <td className="p-3 border text-green-600 font-medium">✓ Yes</td>
                  <td className="p-3 border text-muted-foreground">
                    The browser replaces the page on submit. While navigating, the form is gone — you cannot fire a
                    second POST. One request at a time by the browser's navigation lifecycle.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border font-medium">Server action — no JS (A1 / A2)</td>
                  <td className="p-3 border text-green-600 font-medium">✓ Yes</td>
                  <td className="p-3 border text-muted-foreground">
                    Same mechanism as native POST. The POST goes to the page route, browser navigates away, form is
                    unreachable until the response arrives. Browser navigation is the serializer.
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-3 border font-medium">
                    Server action — with JS (<code className="bg-muted px-1 rounded">useActionState</code>)
                  </td>
                  <td className="p-3 border text-green-600 font-medium">✓ Yes</td>
                  <td className="p-3 border text-muted-foreground">
                    React maintains an internal action queue. While <code className="bg-muted px-1 rounded">isPending</code> is
                    true, new submissions are enqueued — not fired concurrently. Each action runs after the previous
                    one resolves and receives <code className="bg-muted px-1 rounded">prevState</code> from it.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border font-medium">
                    Classic <code className="bg-muted px-1 rounded">useState</code> + async handler
                  </td>
                  <td className="p-3 border text-red-500 font-medium">✗ No</td>
                  <td className="p-3 border text-muted-foreground">
                    Multiple <code className="bg-muted px-1 rounded">fetch()</code> calls fire concurrently.
                    Responses arrive in unpredictable order. Whichever resolves last overwrites the UI —
                    even if it was sent first.
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-3 border font-medium">
                    <code className="bg-muted px-1 rounded">useTransition</code> alone
                  </td>
                  <td className="p-3 border text-red-500 font-medium">✗ No</td>
                  <td className="p-3 border text-muted-foreground">
                    <code className="bg-muted px-1 rounded">isPending</code> is a <em>rendering</em> primitive — it
                    tells React to deprioritise the UI update, not to block the network request.
                    Five rapid clicks still fire five concurrent fetches. The race is the same as Classic,
                    and arguably harder to spot because <code className="bg-muted px-1 rounded">isPending</code> looks like a guard.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border font-medium">
                    <code className="bg-muted px-1 rounded">useTransition</code> + <code className="bg-muted px-1 rounded">AbortController</code>
                  </td>
                  <td className="p-3 border text-green-600 font-medium">✓ Yes</td>
                  <td className="p-3 border text-muted-foreground">
                    Explicitly cancel the previous in-flight request before starting the next one.
                    This has to be wired manually — it is not built into <code className="bg-muted px-1 rounded">useTransition</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 space-y-2">
            <p className="font-medium text-sky-700 dark:text-sky-300">The key insight</p>
            <p className="text-muted-foreground leading-relaxed">
              Race immunity always comes from a <strong>serializer</strong> — something that guarantees only one
              request is in flight at a time. The serializer is either the browser's navigation lifecycle (native
              forms), React's action queue (<code className="bg-muted px-1 rounded">useActionState</code>), or
              explicit manual cancellation (<code className="bg-muted px-1 rounded">AbortController</code>).
              If none of those are present, concurrent fetches are possible and the race condition is real.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
