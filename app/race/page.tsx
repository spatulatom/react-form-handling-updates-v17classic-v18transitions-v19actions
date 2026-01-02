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
    </div>
  )
}
