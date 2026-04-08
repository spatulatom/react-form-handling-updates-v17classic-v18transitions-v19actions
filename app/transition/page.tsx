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
  const [inputValue, setInputValue] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
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
