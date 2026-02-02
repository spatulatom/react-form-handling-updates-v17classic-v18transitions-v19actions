"use client"

import { useState, useTransition, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Fake API with random delay (200-800ms)
async function fakeIncrement(currentValue: number): Promise<number> {
  const delay = Math.random() * 600 + 200 // 200-800ms
  await new Promise((resolve) => setTimeout(resolve, 500))
  return currentValue + 1
}

export default function RaceTransitionPage() {
  const [useManualFix, setUseManualFix] = useState(true)

  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [clickCount, setClickCount] = useState(0)
  const [requestLog, setRequestLog] = useState<string[]>([])

  // Manual fix refs - only used when useManualFix is true
  const latestCountRef = useRef(0)
  const requestIdRef = useRef(0)

  const handleIncrement = () => {
    const thisClick = clickCount + 1
    setClickCount(thisClick)

    const thisRequestId = ++requestIdRef.current
    const startTime = Date.now()

    startTransition(async () => {
      if (useManualFix) {
        // WITH manual fix: use ref for latest value
        const newValue = await fakeIncrement(latestCountRef.current)
        const elapsed = Date.now() - startTime

        // Only update if this is still the latest request
        if (thisRequestId === requestIdRef.current) {
          latestCountRef.current = newValue
          setCount(newValue)
          setRequestLog((prev) => [...prev, `Click #${thisClick}: ${elapsed}ms → count=${newValue} ✓`])
        } else {
          setRequestLog((prev) => [...prev, `Click #${thisClick}: ${elapsed}ms → IGNORED (stale)`])
        }
      } else {
        // WITHOUT manual fix: same race condition as classic!
        // Uses stale closure value of count
        const newValue = await fakeIncrement(count)
        const elapsed = Date.now() - startTime
        setCount(newValue)
        setRequestLog((prev) => [...prev, `Click #${thisClick}: ${elapsed}ms → count=${newValue} (may be wrong!)`])
      }
    })
  }

  const reset = () => {
    setCount(0)
    setClickCount(0)
    setRequestLog([])
    latestCountRef.current = 0
    requestIdRef.current = 0
  }

  const hasRaceCondition = !useManualFix && clickCount > 0 && count !== clickCount

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-yellow-500/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Transition Pattern</CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20">
              {useManualFix ? "With Manual Fix" : "Without Fix - BROKEN"}
            </Badge>
          </div>
          <CardDescription>Toggle to see useTransition WITH and WITHOUT manual race condition handling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-lg">
            <span className={!useManualFix ? "font-bold text-destructive" : "text-muted-foreground"}>
              Without Fix (Broken)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUseManualFix(!useManualFix)
                reset()
              }}
            >
              Toggle
            </Button>
            <span className={useManualFix ? "font-bold text-green-600" : "text-muted-foreground"}>With Manual Fix</span>
          </div>

          {/* Counter Display */}
          <div className="flex items-center justify-center gap-8 p-6 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Clicks</p>
              <p className="text-4xl font-bold text-muted-foreground">{clickCount}</p>
            </div>
            <div className="text-4xl text-muted-foreground">→</div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Count</p>
              <p className={`text-4xl font-bold ${hasRaceCondition ? "text-destructive" : "text-yellow-500"}`}>
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

          {/* Loading indicator */}
          {isPending && (
            <div className="text-center text-sm text-muted-foreground">Processing... (button still clickable!)</div>
          )}

          {useManualFix ? (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-600 text-sm">
              <strong>With manual fix:</strong> Count may be less than clicks because stale requests are ignored. This
              is correct behavior - we only accept the latest result.
            </div>
          ) : (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              <strong>Without fix:</strong> Click rapidly! You'll see the same race condition as classic pattern.
              useTransition does NOT prevent this - it only gives you isPending.
            </div>
          )}

          {/* Race condition indicator */}
          {hasRaceCondition && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm font-bold">
              RACE CONDITION DETECTED! Clicks ({clickCount}) ≠ Count ({count})
            </div>
          )}

          {/* Request Log */}
          {requestLog.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Request Log:</p>
              <div className="bg-muted p-3 rounded-lg text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                {requestLog.map((log, i) => (
                  <p
                    key={i}
                    className={
                      log.includes("IGNORED")
                        ? "text-muted-foreground/50"
                        : log.includes("wrong")
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }
                  >
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">The Honest Truth About useTransition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="font-medium text-yellow-600 mb-2">
              "Couldn't I just disable the button in the classic pattern? What's the difference?"
            </p>
            <p className="text-yellow-700">
              You're right to ask this! If we need manual refs and request tracking anyway, useTransition's main benefit
              is just the free <code className="bg-background px-1 rounded">isPending</code> state.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>What useTransition actually gives you:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Free <code className="bg-muted px-1 rounded">isPending</code> boolean (no manual loading state)
              </li>
              <li>Low-priority rendering (UI stays responsive during updates)</li>
              <li>React can interrupt renders for urgent updates</li>
            </ul>
          </div>

          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            <p className="font-medium mb-2">What you STILL need to handle yourself:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Race conditions → refs + request IDs</li>
              <li>Stale closures → refs for latest values</li>
              <li>Request cancellation → AbortController or ignore logic</li>
            </ul>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium mb-2">So is useTransition worth it?</p>
            <p>
              For race condition prevention alone? <strong>No</strong> - you still need manual code. But it shines when
              combined with Suspense boundaries and concurrent features where React can intelligently manage render
              priority.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Common Misconception */}
      <Card className="border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-lg">Common Misconception: Does useTransition Queue Requests?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="font-medium text-yellow-600 mb-2">
              "I thought useTransition batches requests and resolves them in order?"
            </p>
          </div>

          <div className="space-y-3">
            <p>
              <strong>This is a common misunderstanding.</strong> useTransition manages{" "}
              <strong>React's rendering</strong>, not your async operations:
            </p>

            <div className="grid gap-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">useTransition manages:</p>
                <p>Render priority, interruption, pending state</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">useTransition does NOT manage:</p>
                <p>Your fetch calls, setTimeout, any async operation timing</p>
              </div>
            </div>

            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600">
              <p className="font-medium mb-2">React 19 Actions ARE different:</p>
              <p>
                <code className="bg-background px-1 rounded">useActionState</code> actually queues actions sequentially,
                passing each result to the next. That's why{" "}
                <code className="bg-background px-1 rounded">/race/actions</code> works without any manual handling -
                it's fundamentally different architecture.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
