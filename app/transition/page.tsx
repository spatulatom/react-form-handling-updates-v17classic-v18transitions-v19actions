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
  // GROUP 1: Read state
  const [todos, setTodos] = useState<string[]>(["Buy milk", "Walk dog"])

  // GROUP 2: Form state
  const [inputValue, setInputValue] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  // GROUP 3: Submission state — isPending replaces manual isSubmitting; submitError is still manual
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!inputValue.trim()) {
      setValidationError("Todo cannot be empty")
      return
    }

    if (inputValue.length > 100) {
      setValidationError("Todo must be 100 characters or less")
      return
    }

    const nextTodo = inputValue.trim()
    setValidationError(null)
    setSubmitError(null)

    startTransition(async () => {
      try {
        const newTodo = await fakeApi.addTodo(nextTodo)
        setTodos((prev) => [...prev, newTodo])
        setInputValue("")
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : "Failed to add")
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
          <h2 className="font-semibold">Same Three Groups, Smaller Submission Bucket</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This page keeps the Classic mental model on purpose: Group 1 is still the read bucket, Group 2 is still the
            form bucket, and Group 3 is still the submission bucket. The change is that React 18 can take one painful
            part of Group 3 off your hands: the pending flag.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you wrap the submit work in <code className="bg-muted px-1 rounded">startTransition()</code>, React
            exposes <code className="bg-muted px-1 rounded">isPending</code> automatically. That removes the manual
            isSubmitting bookkeeping, but it does <strong>not</strong> remove the other two groups.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is why the Transition pattern is a stepping stone, not the endpoint. It improves submission-state
            ergonomics, but the page is still client-controlled.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="font-medium text-foreground">Group 1: Read</p>
            <p>Conceptually still the same read bucket as Classic: existing todos live separately from the form and mutation.</p>
            <p>This demo seeds that list up front so the page can isolate the submit story instead of repeating useEffect.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="font-medium text-foreground">Group 2: Form State</p>
            <p><code className="bg-background px-1 rounded">inputValue</code> and <code className="bg-background px-1 rounded">validationError</code> are still local useState values.</p>
            <p>Typing and client-side validation remain fully manual.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="font-medium text-foreground">Group 3: Submission State</p>
            <p>This is the only group React meaningfully simplifies here.</p>
            <p><code className="bg-background px-1 rounded">isPending</code> replaces a manual isSubmitting pair, while submit errors still stay in local state.</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm space-y-3">
          <p className="font-semibold text-green-600">What useTransition really improves</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>✓ Group 3 pending becomes automatic</strong> - <code className="bg-muted px-1 rounded">isPending</code>
              is derived by React, so there is no manual setIsSubmitting true/false choreography.
            </li>
            <li>
              <strong>✓ Rendering stays responsive</strong> - transition updates are lower priority, so the rest of the UI
              does not feel as blocked while the mutation finishes.
            </li>
            <li>
              <strong>✓ The code gets slightly smaller</strong> - the submission bucket loses one state pair, even though
              Group 2 and Group 3 error handling are still your responsibility.
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm space-y-3">
          <p className="font-semibold text-destructive">What Transition does not solve</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>• Group 2 is still manual</strong> - controlled inputs and client validation are still written by
              hand.
            </li>
            <li>
              <strong>• Group 3 errors are still manual</strong> - submit failures still go through your own catch block
              and local state.
            </li>
            <li>
              <strong>• No progressive enhancement</strong> - the form still depends on <code className="bg-muted px-1 rounded">e.preventDefault()</code>
              and JavaScript-controlled submission.
            </li>
            <li>
              <strong>• Transitions do not queue async work</strong> - they manage render priority and pending UI, not the
              order your network requests resolve in. The race demo calls this out explicitly.
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-3">
          <h2 className="font-semibold">Compare to Classic Pattern</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The important comparison is not the raw number of hooks. It is the ownership of the three groups. Classic
            makes you own all three manually. Transition says: keep your read and form buckets, but let React own the
            pending flag inside the submission bucket.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            That is useful, but it is still incremental. Actions go further by moving Group 1 to the server, letting the
            browser own Group 2, and giving Group 3 a native form-based lifecycle.
          </p>
        </div>

        <section className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h2 className="font-semibold">What Changes: Group 3 Orchestration with useTransition</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In Classic, Group 3 had to manually manage the pending flag. In Transition, React handles it. But there's also a more subtle improvement: low-priority rendering.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 border p-4">
                <p className="font-medium text-foreground text-sm mb-3">Classic: Manual Pending Flag</p>
                <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground leading-relaxed">
{`// GROUP 3: Submission state — YOU manage pending
const [isSubmitting, setIsSubmitting] = useState(false)
const [submitError, setSubmitError] = useState<string | null>(null)

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  
  // ... validation ...

  setIsSubmitting(true)          // ← Manual: true
  setSubmitError(null)
  
  try {
    const newTodo = await fakeApi.addTodo(inputValue)
    setTodos((prev) => [...prev, newTodo])  // Sync Group 1
    setInputValue("")
  } catch (e) {
    setSubmitError(e instanceof Error ? e.message : "Failed")
  } finally {
    setIsSubmitting(false)       // ← Manual: false
  }
}`}
                </pre>
              </div>

              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                <p className="font-medium text-foreground text-sm mb-3">Transition: React Manages Pending</p>
                <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground leading-relaxed">
{`// GROUP 3: Submission state — React manages pending
const [submitError, setSubmitError] = useState<string | null>(null)
const [isPending, startTransition] = useTransition()  // ← React tracks this

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  
  // ... validation ...

  setSubmitError(null)
  
  startTransition(async () => {   // ← Wrap async work here
    try {
      const newTodo = await fakeApi.addTodo(inputValue)
      setTodos((prev) => [...prev, newTodo])  // Sync Group 1
      setInputValue("")
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed")
    }
    // ← No finally block needed; isPending is automatic
  })
}`}
                </pre>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
                  <p className="font-medium text-foreground">Classic Choreography</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    You call `setIsSubmitting(true)`, then `setIsSubmitting(false)`. React treats these as two separate state updates, potentially triggering two renders.
                  </p>
                  <pre className="overflow-x-auto text-xs text-foreground font-mono bg-background rounded p-2">
{`setIsSubmitting(true)   // Render 1
await api.call()
setIsSubmitting(false)  // Render 2`}
                  </pre>
                </div>
                <div className="rounded-lg border bg-green-50/50 dark:bg-green-950/20 p-4 space-y-2">
                  <p className="font-medium text-foreground">Transition Choreography</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    React automatically derives `isPending` from the async work inside `startTransition()`. It knows when to be true and when to be false.
                  </p>
                  <pre className="overflow-x-auto text-xs text-foreground font-mono bg-background rounded p-2">
{`startTransition(async () => {
  await api.call()
})  // isPending auto-managed`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h2 className="font-semibold">The Hidden Improvement: Low-Priority Rendering</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              `useTransition` does more than just derive the pending flag. It also marks updates inside `startTransition()` as low-priority. This means if the user types, clicks, or interacts with other parts of the UI, those actions get processed first, and the async mutation update gets deprioritized.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 border p-4">
                <p className="font-medium text-foreground text-sm mb-3">Classic: All Updates Have Same Priority</p>
                <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground leading-relaxed">
{`// Classic doesn't distinguish priority
await fakeApi.addTodo(inputValue)
setTodos((prev) => [...prev, newTodo])  // ← High priority (like all state updates)

// If user clicks button Y at the same moment, React might
// process the todo update first, making button Y feel sluggish`}
                </pre>
              </div>

              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                <p className="font-medium text-foreground text-sm mb-3">Transition: Mutations Are Low-Priority</p>
                <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground leading-relaxed">
{`// Transition marks this whole block as low-priority
startTransition(async () => {
  await fakeApi.addTodo(inputValue)
  setTodos((prev) => [...prev, newTodo])  // ← Low priority
})

// If user clicks button Y while this is running,
// React processes button Y first, then continues with the todo update
// Result: UI feels more responsive`}
                </pre>
              </div>

              <div className="rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-4 text-sm space-y-3">
                <p className="font-medium text-foreground">When you notice this</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  In a simple form like this demo, it is subtle. But on a page with rapid user interactions (typing, clicking, scrolling), transitions make the whole page feel snappier. The slow-running mutation does not block user input.
                </p>
              </div>

              <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground space-y-3">
                <p className="font-medium text-foreground">Important note: Transitions do not prevent race conditions</p>
                <p className="text-xs leading-relaxed">
                  Low-priority rendering is about UI responsiveness, not about ordering network requests. If two mutations start at nearly the same time, `useTransition` will not queue them or guarantee an order. That is why this page focuses on single mutations. The race condition demo handles this explicitly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h2 className="font-semibold">The Three Groups: What Stays the Same</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Group 3 got simpler (React handles pending), but Groups 1 and 2 are still your responsibility.
            </p>

            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="font-medium text-foreground text-sm mb-2">Group 1: Read State (Still Manual)</p>
                <p className="text-muted-foreground text-xs mb-2 leading-relaxed">
                  After the mutation succeeds, you still manually sync Group 1:
                </p>
                <pre className="overflow-x-auto text-xs text-foreground font-mono bg-background rounded p-2">
{`setTodos((prev) => [...prev, newTodo])  // Manual sync`}
                </pre>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="font-medium text-foreground text-sm mb-2">Group 2: Form State (Still Manual)</p>
                <p className="text-muted-foreground text-xs mb-2 leading-relaxed">
                  Typing and client-side validation remain fully manual:
                </p>
                <pre className="overflow-x-auto text-xs text-foreground font-mono bg-background rounded p-2">
{`const [inputValue, setInputValue] = useState("")
const [validationError, setValidationError] = useState(null)`}
                </pre>
              </div>

              <div className="rounded-lg border bg-green-50/50 dark:bg-green-950/20 p-4">
                <p className="font-medium text-foreground text-sm mb-2">Group 3: Submission State (Partially Automated)</p>
                <p className="text-muted-foreground text-xs mb-2 leading-relaxed">
                  Only the pending flag is automated. Error handling is still manual:
                </p>
                <pre className="overflow-x-auto text-xs text-foreground font-mono bg-background rounded p-2">
{`const [isPending, startTransition] = useTransition()  // Automated ✓
const [submitError, setSubmitError] = useState(null)   // Manual ✗`}
                </pre>
              </div>
            </div>
          </div>
        </section>

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

        {validationError && <p className="text-sm text-amber-600">{validationError}</p>}

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <ul className="space-y-2">
          {todos.map((todo, i) => (
            <li key={`${todo}-${i}`} className="p-3 rounded bg-muted">
              {todo}
            </li>
          ))}
        </ul>
        {/* Navigation between patterns */}
        <div className="flex gap-3 pt-8 border-t justify-between">
          <Link href="/classic" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            ← Classic Pattern
          </Link>
          <Link href="/actions" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Actions Pattern →
          </Link>
        </div>      </div>
    </div>
  )
}
