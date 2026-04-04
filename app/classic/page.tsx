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
  // CRUD GROUP 1: Read state for the list
  const [todos, setTodos] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // CRUD GROUP 2: Form state for what the user is typing
  // CRUD GROUP 3: Submission state for request status
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
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Classic Pattern</h1>
          <p className="text-muted-foreground">useState + useEffect (React 17/18)</p>
        </header>

        <div className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="font-semibold">What to look for</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The key idea in the classic model is that form state tends to fall into a few predictable buckets. Once
            you can name those buckets, it becomes much easier to reason about whether a page is a simple contact
            form or a full CRUD screen.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This page starts with the simpler form case, then expands to CRUD, and then calls out the problems that
            appear when you manage everything by hand.
          </p>
        </div>

        <section id="groups" className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h2 className="font-semibold">Define the Groups First</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Before looking at examples, it helps to define the three groups clearly. These are not React-specific
              rules. They are just a useful way to organize the state that usually appears on forms and CRUD pages.
            </p>
            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <p className="font-medium text-foreground">Group 1: Read</p>
                <p>State for data that comes from the server or some async source.</p>
                <p>Examples: list data, loading flags, fetch errors.</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <p className="font-medium text-foreground">Group 2: Form State</p>
                <p>State for what the user is currently typing or editing.</p>
                <p>Examples: input values, field errors, client-side validation messages.</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <p className="font-medium text-foreground">Group 3: Submission State</p>
                <p>State for the mutation itself while the request is running.</p>
                <p>Examples: pending flags, submit errors, success messages.</p>
              </div>
            </div>
            <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">Mental shortcut</p>
              <p>
                If the page only lets the user type and send, you usually need group 2 and group 3. If the page also
                loads existing data first, add group 1.
              </p>
            </div>
          </div>
        </section>

        <nav className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="font-semibold">Table of Contents</h2>
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap">
            <a href="#groups" className="text-primary hover:underline">
              0. Define the Groups
            </a>
            <a href="#form-type" className="text-primary hover:underline">
              1. Form Type: Two Groups
            </a>
            <a href="#full-crud" className="text-primary hover:underline">
              2. Full CRUD: Three Groups
            </a>
            <a href="#analysis" className="text-primary hover:underline">
              3. Analysis and Problems
            </a>
          </div>
        </nav>

        <section id="form-type" className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-3">
            <h2 className="font-semibold">1. Form Type: Contact Form</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If the page is only a contact form, you usually do not need the read bucket. The structure is simpler:
              group 2 for form state and group 3 for submission state.
            </p>
            <div className="rounded-lg bg-muted/40 border p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">A typical contact form shape</p>
              <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground">
{`const [form, setForm] = useState({ name: "", email: "", message: "" })
// GROUP 2: form state for what the user is typing

const [isSubmitting, setIsSubmitting] = useState(false)
const [error, setError] = useState<string | null>(null)
// GROUP 3: submission state for the send request

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setIsSubmitting(true)
  setError(null)
  try {
    await sendMessage(form)
    setForm({ name: "", email: "", message: "" })
  } catch (err) {
    setError("Message failed to send")
  } finally {
    setIsSubmitting(false)
  }
}`}
              </pre>
              <p>
                <strong>What `e.preventDefault()` is actually stopping:</strong> the browser's normal form submit. Without
                it, the browser would send the form, navigate or reload the page, and hand control to the server or the
                URL in the form action. Calling `preventDefault()` cancels that native submit so your JavaScript handler
                can take over completely.
              </p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Typical state groups</p>
              <ul className="space-y-1 ml-4">
                <li>• Group 2: form state like name, email, message</li>
                <li>• Group 3: submission state like pending and error</li>
                <li>• No group 1 unless the form preloads existing data</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              That is why a simple new-message form is mostly about typing and sending. You keep the user input local,
              and only track whether the send action is running or failed.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you wanted to add a real-world improvement, the next step would be field-level validation or saved form
              values. That is still mostly group 2, unless you are loading those values from the server, which would pull
              group 1 back in.
            </p>
          </div>
        </section>

        <section id="full-crud" className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h2 className="font-semibold">2. Full CRUD: Three Groups</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A full CRUD page adds the read bucket back in. Now the state naturally splits into three groups: read the
              existing data, manage the form state, and submit the mutation.
            </p>

            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Example flow</p>
              <ul className="space-y-1 ml-4">
                <li>• Fetch records on mount</li>
                <li>• Let the user type in a form field</li>
                <li>• Submit the new item and update the list</li>
              </ul>
            </div>

            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm space-y-2">
              <p className="font-semibold text-destructive">The three buckets</p>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <strong>1. Read</strong> - list data, loading, and fetch errors.
                </li>
                <li>
                  <strong>2. Form State</strong> - what the user is typing.
                </li>
                <li>
                  <strong>3. Submission State</strong> - pending and error for the create action.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">How the classic version usually looks</p>
              <pre className="overflow-x-auto rounded bg-muted p-3 text-xs text-foreground">
{`// GROUP 1: read state
const [todos, setTodos] = useState<string[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

// GROUP 2: form state
const [inputValue, setInputValue] = useState("")

// GROUP 3: submission state
const [isSubmitting, setIsSubmitting] = useState(false)
const [submitError, setSubmitError] = useState<string | null>(null)

useEffect(() => {
  loadTodos()
}, [])`}
              </pre>
              <p>
                This is the point where the shape starts to matter more than the exact hooks. The page is really just
                tracking three categories of state, but each category has its own lifecycle and its own failure mode.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="font-medium text-foreground mb-1">Read</p>
                <p>Fetching initial todos with `useEffect` and showing loading or error state.</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="font-medium text-foreground mb-1">Form State</p>
                <p>Tracking the input value separately so typing does not touch server data.</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="font-medium text-foreground mb-1">Submission State</p>
                <p>Showing pending and error state while the create request is in flight.</p>
              </div>
            </div>

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

            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Why submit state feels separate</p>
              <p>
                The list can be perfectly loaded while the submit action is still pending. That is why the pending and
                error flags do not belong to the list itself. They belong to the mutation.
              </p>
            </div>

            <div className="space-y-2">
              {isLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : (
                <ul className="space-y-2">
                  {todos.map((todo, i) => (
                    <li key={i} className="rounded bg-muted p-3">
                      {todo}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section id="analysis" className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-3">
            <h2 className="font-semibold">3. Analysis and Problems</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The classic model works, but the cost is that you own all the orchestration. That is where the problems
              start to show up.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Boilerplate</strong> - each bucket needs its own state variables, and CRUD pages multiply that
                quickly.
              </li>
              <li>
                <strong>Race conditions</strong> - fetches need cleanup so you do not update state after unmount.
              </li>
              <li>
                <strong>Manual resets</strong> - you must remember to clear errors and pending state at the right time.
              </li>
              <li>
                <strong>No progressive enhancement</strong> - `e.preventDefault()` cancels the browser's native submit,
                so the form depends on JavaScript instead of still working as a normal HTML form.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-5 space-y-3">
            <h3 className="font-semibold">More concrete problem examples</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="font-medium text-foreground mb-2">Race condition example</p>
                <pre className="overflow-x-auto text-xs text-foreground">
{`// GROUP 1: read state needs cleanup
useEffect(() => {
  let cancelled = false

  async function fetchTodos() {
    const data = await fakeApi.getTodos()
    if (!cancelled) {
      setTodos(data)
    }
  }

  fetchTodos()
  return () => {
    cancelled = true
  }
}, [])`}
                </pre>
              </div>

              <div className="rounded-lg bg-muted/40 p-4">
                <p className="font-medium text-foreground mb-2">Submission example</p>
                <pre className="overflow-x-auto text-xs text-foreground">
{`// GROUP 2 + GROUP 3 working together
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setIsSubmitting(true)
  setSubmitError(null)

  try {
    const newTodo = await fakeApi.addTodo(inputValue)
    setTodos((prev) => [...prev, newTodo])
    setInputValue("")
  } catch (err) {
    setSubmitError("Failed to add")
  } finally {
    setIsSubmitting(false)
  }
}`}
                </pre>
                <p className="mt-2">
                  Here `preventDefault()` is what stops the browser from doing a real HTML form submission. That is why
                  this pattern is called client-controlled: React code is replacing the browser's built-in form flow.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5 space-y-3">
            <h3 className="font-semibold">Why this matters</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The important mental model is not the exact number of hooks. It is the grouping: fetched data, form state,
              and submission state. Once you see those buckets, you can tell whether a page is a simple form or a full
              CRUD screen.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              That is also why React kept evolving the form story. The newer APIs reduce the amount of manual state you
              have to coordinate yourself.
            </p>
          </div>
        </section>

        <div className="flex justify-between gap-3 border-t pt-8">
          <Link href="/" className="rounded-lg bg-muted px-4 py-2 text-muted-foreground transition-colors hover:bg-muted/80">
            ← Home
          </Link>
          <Link href="/transition" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90">
            Transition Pattern →
          </Link>
        </div>
      </div>
    </div>
  )
}
