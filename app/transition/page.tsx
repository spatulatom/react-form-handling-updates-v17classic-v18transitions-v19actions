"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const fakeApi = {
  addTodo: (text: string) =>
    new Promise<string>((resolve, reject) =>
      setTimeout(() => {
        if (text.toLowerCase().includes("error")) {
          reject(new Error("Server rejected this todo"))
        }
        resolve(text)
      }, 1000),
    ),
}

export default function TransitionPattern() {
  const [todos, setTodos] = useState<string[]>(["Buy milk", "Walk dog"])
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")

  // IMPROVEMENT: useTransition gives us pending state automatically
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Still need this - still client-only

    if (!inputValue.trim()) return

    // IMPROVEMENT: Wrap async work in startTransition
    // React automatically tracks pending state
    startTransition(async () => {
      try {
        setError(null)
        const newTodo = await fakeApi.addTodo(inputValue)
        setTodos((prev) => [...prev, newTodo])
        setInputValue("")
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add")
      }
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Transition Pattern</h1>
          <p className="text-muted-foreground">useTransition (React 18+)</p>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">What useTransition Changes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            React 18 introduced <code className="bg-muted px-1 rounded">useTransition</code> as a stepping stone toward
            the full Actions model. The key insight: <strong>React should track pending states, not you</strong>.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you wrap state updates in <code className="bg-muted px-1 rounded">startTransition()</code>, React
            automatically sets <code className="bg-muted px-1 rounded">isPending = true</code> until all updates
            complete. No more <code className="bg-muted px-1 rounded">setIsLoading(true)</code>/{" "}
            <code className="bg-muted px-1 rounded">setIsLoading(false)</code> pairs to maintain.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Bonus:</strong> Transitions are "interruptible" - if you start a new transition before the old one
            finishes, React abandons the stale update. This helps prevent race conditions naturally.
          </p>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm space-y-3">
          <p className="font-semibold text-green-600">What's improved:</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>✓ No manual loading state</strong> - <code className="bg-muted px-1 rounded">isPending</code> is
              provided by the hook. We deleted <code className="bg-muted px-1 rounded">isSubmitting</code> and
              <code className="bg-muted px-1 rounded mx-1">setIsSubmitting</code> entirely.
            </li>
            <li>
              <strong>✓ Non-blocking updates</strong> - Transitions are low-priority. The UI stays responsive during the
              async work. Typing in other inputs won't feel sluggish.
            </li>
            <li>
              <strong>✓ Automatic race condition handling</strong> - If you submit twice quickly, React knows to use
              only the latest result. The stale transition is interrupted.
            </li>
          </ul>
        </div>

        {/* Remaining problems */}
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm space-y-3">
          <p className="font-semibold text-destructive">What's still not solved:</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>• Still client-only</strong> - This code runs entirely in the browser. If JavaScript fails to
              load, the form does nothing. No progressive enhancement.
            </li>
            <li>
              <strong>• Still need manual error state</strong> - We still have{" "}
              <code className="bg-muted px-1 rounded">useState</code>
              for errors. React 18 doesn't help with error handling.
            </li>
            <li>
              <strong>• Still need preventDefault</strong> - We're still hijacking the native form behavior with{" "}
              <code className="bg-muted px-1 rounded">e.preventDefault()</code>.
            </li>
            <li>
              <strong>• Still fetching in useEffect</strong> - Initial data loading still uses the old pattern (that's
              why we hardcode initial todos here for simplicity).
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-3">
          <h2 className="font-semibold">Compare to Classic Pattern</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We went from 6 useState calls to 4. The <code className="bg-muted px-1 rounded">isSubmitting</code> /
            <code className="bg-muted px-1 rounded mx-1">setIsSubmitting</code> pair is gone, replaced by
            <code className="bg-muted px-1 rounded mx-1">isPending</code> from the hook. That's one less thing to get
            wrong.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is the key React 18 insight: <strong>let React manage async state when possible</strong>. React 19
            takes this further by also handling errors and enabling server execution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add todo (type 'error' to simulate failure)"
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <ul className="space-y-2">
          {todos.map((todo, i) => (
            <li key={i} className="p-3 rounded bg-muted">
              {todo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
