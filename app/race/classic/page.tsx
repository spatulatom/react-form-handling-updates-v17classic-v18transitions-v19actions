"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Fake API with random delay (200-800ms)
async function fakeIncrement(currentValue: number): Promise<number> {
  const delay = Math.random() * 600 + 200 // 200-800ms
  await new Promise((resolve) => setTimeout(resolve, delay))
  return currentValue + 1
}

export default function RaceClassicPage() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clickCount, setClickCount] = useState(0) // Track how many times we clicked
  const [requestLog, setRequestLog] = useState<string[]>([])

  const handleIncrement = async () => {
    // Track that we clicked
    const thisClick = clickCount + 1
    setClickCount(thisClick)

    setIsLoading(true)
    setError(null)

    const startTime = Date.now()

    try {
      // BUG: We capture `count` at the time of click, not when response arrives
      // If we click 5 times quickly, all 5 calls use count=0 and all return 1
      const newValue = await fakeIncrement(count)
      const elapsed = Date.now() - startTime

      // BUG: This overwrites whatever the current state is
      // A slow request (clicked first) can overwrite a fast request (clicked second)
      setCount(newValue)
      setRequestLog((prev) => [...prev, `Click #${thisClick}: took ${elapsed}ms, set count to ${newValue}`])
    } catch {
      setError("Failed to increment")
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setCount(0)
    setClickCount(0)
    setRequestLog([])
    setError(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Classic Pattern</CardTitle>
            <Badge variant="destructive">Race Condition Bug</Badge>
          </div>
          <CardDescription>useState + async handler - the pre-React 18 way</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Counter Display */}
          <div className="flex items-center justify-center gap-8 p-6 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Expected</p>
              <p className="text-4xl font-bold text-green-500">{clickCount}</p>
            </div>
            <div className="text-4xl text-muted-foreground">=?</div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Actual</p>
              <p className={`text-4xl font-bold ${count !== clickCount ? "text-destructive" : "text-green-500"}`}>
                {count}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleIncrement} className="flex-1">
              Increment
            </Button>
            <Button onClick={reset} variant="outline">
              Reset
            </Button>
          </div>

          {isLoading && (
            <div className="text-center text-sm text-muted-foreground">Loading... (button still clickable!)</div>
          )}

          {/* Reserve space for messages with min-height */}
          <div className="min-h-[48px]">
            {count !== clickCount && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                Race condition detected! Expected {clickCount} but got {count}.
              </div>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          {/* Request Log */}
          {requestLog.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Request Log:</p>
              <div className="bg-muted p-3 rounded-lg text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                {requestLog.map((log, i) => (
                  <p key={i} className="text-muted-foreground">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why This Breaks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>
              <strong>Problem 1: Stale Closure</strong>
            </p>
            <p>
              When you click, <code className="bg-muted px-1 rounded">handleIncrement</code> captures the current
              <code className="bg-muted px-1 rounded">count</code> value. If count is 0 and you click 5 times quickly,
              ALL 5 requests use count=0 and all return 1.
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Problem 2: Last Write Wins</strong>
            </p>
            <p>
              Each <code className="bg-muted px-1 rounded">setCount(newValue)</code> overwrites the state. If click #1
              takes 500ms and click #2 takes 200ms, click #2 finishes first (sets count=1), then click #1 finishes and
              overwrites it (sets count=1 again).
            </p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium mb-2">The Classic "Solutions" (all have issues):</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Disable button while loading - bad UX, blocks user</li>
              <li>AbortController - complex, easy to get wrong</li>
              <li>Request ID tracking - more state to manage</li>
              <li>useRef for latest value - still doesn't prevent overwrites</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
