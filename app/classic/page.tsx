"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Simulated API
const fakeApi = {
  getTodos: () => new Promise<string[]>((resolve) => setTimeout(() => resolve(["Buy milk", "Walk dog"]), 1000)),
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

export default function ClassicPattern() {
  // PROBLEM 1: Three separate states for one concern
  const [todos, setTodos] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // PROBLEM 2: Submission needs its own loading/error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [inputValue, setInputValue] = useState("")

  // PROBLEM 3: useEffect for data fetching - race conditions possible
  useEffect(() => {
    let cancelled = false // Manual cleanup to prevent race conditions

    async function fetchTodos() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fakeApi.getTodos()
        if (!cancelled) {
          setTodos(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to fetch")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchTodos()
    return () => {
      cancelled = true
    }
  }, [])

  // PROBLEM 4: Manual state orchestration for submissions
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // PROBLEM 5: Must prevent default, breaks without JS

    if (!inputValue.trim()) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const newTodo = await fakeApi.addTodo(inputValue)
      setTodos((prev) => [...prev, newTodo])
      setInputValue("")
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to add")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Classic Pattern</h1>
          <p className="text-muted-foreground">useState + useEffect (React 17/18)</p>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">How This Pattern Works</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is the pattern most React developers learned first. You create separate
            <code className="bg-muted px-1 rounded mx-1">useState</code> calls for your data, loading state, and error
            state. Then you use <code className="bg-muted px-1 rounded mx-1">useEffect</code> to fetch data on mount,
            and <code className="bg-muted px-1 rounded mx-1">onSubmit</code> handlers for form submissions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>The core issue:</strong> You're manually orchestrating the entire async lifecycle. Every async
            operation needs its own loading/error tracking. You must remember to reset states at the right times, handle
            cleanup for race conditions, and call <code className="bg-muted px-1 rounded mx-1">e.preventDefault()</code>
            to stop the browser's native form behavior (which means the form breaks entirely without JavaScript).
          </p>
        </div>

        {/* Problems highlighted */}
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm space-y-3">
          <p className="font-semibold text-destructive">Problems with this pattern:</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>1. Boilerplate explosion</strong> - Look at the code: 6 useState calls for one feature. Each async
              operation (fetching, submitting) needs loading + error + data states. This multiplies quickly.
            </li>
            <li>
              <strong>2. Race conditions</strong> - If the component unmounts while fetching, you'll try to setState on
              an unmounted component. That's why we need the <code className="bg-muted px-1 rounded">cancelled</code>{" "}
              flag and cleanup function. Easy to forget!
            </li>
            <li>
              <strong>3. No progressive enhancement</strong> - The form uses{" "}
              <code className="bg-muted px-1 rounded">e.preventDefault()</code>, so it does nothing if JS fails to load.
              Users on slow connections or with JS disabled see a broken form.
            </li>
            <li>
              <strong>4. State synchronization bugs</strong> - Did you remember to reset{" "}
              <code className="bg-muted px-1 rounded">submitError</code>
              before starting a new submission? These subtle bugs are common when you manage everything manually.
            </li>
            <li>
              <strong>5. Loading state per action</strong> - <code className="bg-muted px-1 rounded">isLoading</code>{" "}
              for fetch,
              <code className="bg-muted px-1 rounded">isSubmitting</code> for submit. What if you add delete? Another
              state. Edit? Another state.
            </li>
          </ul>
        </div>

        {/* The actual form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add todo (type 'error' to simulate failure)"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </form>

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        {/* List display */}
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo, i) => (
                <li key={i} className="p-3 rounded bg-muted">
                  {todo}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-3">
          <h2 className="font-semibold">Code Analysis</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Count the state variables: <code className="bg-muted px-1 rounded">todos</code>,
            <code className="bg-muted px-1 rounded mx-1">isLoading</code>,
            <code className="bg-muted px-1 rounded mx-1">error</code>,
            <code className="bg-muted px-1 rounded mx-1">isSubmitting</code>,
            <code className="bg-muted px-1 rounded mx-1">submitError</code>,
            <code className="bg-muted px-1 rounded mx-1">inputValue</code>. That's 6 pieces of state for a simple todo
            list.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Now imagine this pattern across 20 components in a real app. Each component with its own loading/error
            states, each with potential race conditions, each with manual state resets. This is why the React team
            introduced better primitives.
          </p>
        </div>
      </div>
    </div>
  )
}
