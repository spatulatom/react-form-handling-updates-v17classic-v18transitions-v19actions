"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Type for our state
type State = {
  count: number
  clickCount: number
  log: string[]
}

// Action function - receives PREVIOUS state, returns NEXT state
// This is the key insight: each action sees the result of the previous one
async function incrementAction(prevState: State): Promise<State> {
  const startTime = Date.now()
  const thisClick = prevState.clickCount + 1

  // Fake API with random delay (200-800ms)
  const delay = Math.random() * 600 + 200 // 200-800ms
  await new Promise((resolve) => setTimeout(resolve, delay))

  const elapsed = Date.now() - startTime
  const newCount = prevState.count + 1

  return {
    count: newCount,
    clickCount: thisClick,
    log: [...prevState.log, `Click #${thisClick}: took ${elapsed}ms, count is now ${newCount}`],
  }
}

export default function RaceActionsPage() {
  const [state, formAction, isPending] = useActionState(incrementAction, {
    count: 0,
    clickCount: 0,
    log: [],
  })

  // Reset action
  const resetAction = async (): Promise<State> => {
    return { count: 0, clickCount: 0, log: [] }
  }

  const [, resetFormAction] = useActionState(resetAction, state)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-green-500/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Actions Pattern</CardTitle>
            <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/20">Race-Free</Badge>
          </div>
          <CardDescription>useActionState - React 19's solution to async state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Counter Display */}
          <div className="flex items-center justify-center gap-8 p-6 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Clicks</p>
              <p className="text-4xl font-bold text-green-500">{state.clickCount}</p>
            </div>
            <div className="text-4xl text-green-500">=</div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Count</p>
              <p className="text-4xl font-bold text-green-500">{state.count}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <form action={formAction} className="flex-1">
              <Button type="submit" className="w-full">
                Increment
              </Button>
            </form>
            <form action={resetFormAction}>
              <Button type="submit" variant="outline">
                Reset
              </Button>
            </form>
          </div>

          {/* Loading indicator */}
          {isPending && (
            <div className="text-center text-sm text-muted-foreground">
              Processing queue... (button still clickable!)
            </div>
          )}

          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm">
            Clicks always equals count! Actions are queued and processed in order. Each action receives the result of
            the previous one.
          </div>

          {/* Request Log */}
          {state.log.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Request Log (in order!):</p>
              <div className="bg-muted p-3 rounded-lg text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                {state.log.map((log, i) => (
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
          <CardTitle className="text-lg">Why Actions Are Race-Free</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>
              <strong>The Key Insight: Sequential Processing</strong>
            </p>
            <p>
              With <code className="bg-muted px-1 rounded">useActionState</code>, actions are queued and processed one
              at a time. Each action receives the <em>result</em> of the previous action as its input.
            </p>
          </div>

          <div className="p-3 bg-muted rounded-lg font-mono text-xs">
            <p className="text-muted-foreground mb-2">// How it works:</p>
            <p>Click 1: prevState.count = 0 → returns count = 1</p>
            <p>Click 2: prevState.count = 1 → returns count = 2</p>
            <p>Click 3: prevState.count = 2 → returns count = 3</p>
            <p className="text-green-500 mt-2">// Even if Click 1 is slow, Click 2 waits for it!</p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>What React 19 Actions give you for free:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>No race conditions - actions are queued automatically</li>
              <li>No stale closures - action receives fresh state as parameter</li>
              <li>
                No manual pending state - <code className="bg-muted px-1 rounded">isPending</code> is automatic
              </li>
              <li>No refs or request IDs needed</li>
              <li>Works with forms natively (progressive enhancement)</li>
              <li>Error boundaries catch action errors</li>
            </ul>
          </div>

          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="font-medium text-green-600 mb-2">The Mental Model Shift:</p>
            <p>
              Instead of "I trigger async, manage loading, handle result, update state", it's "I describe a state
              transition, React handles the rest".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
