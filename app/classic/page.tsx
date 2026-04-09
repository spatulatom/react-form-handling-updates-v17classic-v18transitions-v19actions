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
  const [inputValue, setInputValue] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  // CRUD GROUP 3: Submission state for request status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

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

    // CLIENT-SIDE VALIDATION (Bucket 2)
    if (!inputValue.trim()) {
      setValidationError("Todo cannot be empty")
      return
    }
    if (inputValue.length > 100) {
      setValidationError("Todo must be 100 characters or less")
      return
    }
    
    // Validation passed, clear error and proceed to submission
    setValidationError(null)

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(null)
      const newTodo = await fakeApi.addTodo(inputValue)
      setTodos((prev) => [...prev, newTodo])
      setInputValue("")
      
      // CHOICE 1 (implicit): Just clearing the form is the success signal (common in CRUD)
      // The user sees the new item appear in the list → success
      
      // CHOICE 2 (explicit): Show a success message then clear it (common in simple forms)
      // Uncomment below to see:
      // setSubmitSuccess("Todo added!")
      // setTimeout(() => setSubmitSuccess(null), 2000)
    } catch (e) {
      // SERVER-SIDE ERROR (Bucket 3)
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
        <nav className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="font-semibold">Table of Contents</h2>
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap">
            <a href="#groups" className="text-primary hover:underline">
              1. Define the Groups
            </a>
            <a href="#form-type" className="text-primary hover:underline">
              2. Form Type: Two Groups
            </a>
            <a href="#full-crud" className="text-primary hover:underline">
              3. Full CRUD: Three Groups
            </a>
            <a href="#analysis" className="text-primary hover:underline">
              4. Analysis and Problems
            </a>
          </div>
        </nav>

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

        <section className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h2 className="font-semibold">How the Groups Work Together: Group 3 as Orchestrator</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The three buckets are separate for analytical clarity, but in practice, Group 3 (submission state) is the orchestrator that brings the other two together. It reads from Group 2, coordinates the mutation, updates Group 1, and resets Group 2.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 border p-4 text-sm space-y-3">
                <p className="font-medium text-foreground">The Submission Choreography</p>
                
                <div className="space-y-3 text-muted-foreground text-xs">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-3 py-2 min-w-fit font-mono font-semibold">Group 2</div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">Group 3 reads from here</p>
                      <p>The user's input value lives in Group 2. When submit happens, Group 3 grabs `inputValue` and sends it to the server.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-500/20 border border-green-500/30 px-3 py-2 min-w-fit font-mono font-semibold">Group 3</div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">Does its own work</p>
                      <p>`setIsSubmitting(true)` → make request → await response → `setIsSubmitting(false)`. This lifecycle is Group 3's responsibility.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-purple-500/20 border border-purple-500/30 px-3 py-2 min-w-fit font-mono font-semibold">Group 1</div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">Group 3 updates this on success</p>
                      <p>After the request succeeds, Group 3 writes the new item back to Group 1: `setTodos([...todos, newTodo])`. That triggers the re-render and the user sees the list update.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-3 py-2 min-w-fit font-mono font-semibold">Group 2</div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">Group 3 resets this on success</p>
                      <p>Side effect after the mutation: `setInputValue("")` clears the form. This is Group 3 coordinating a cleanup of Group 2.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/40 border p-4">
                <p className="font-medium text-foreground text-sm mb-3">Visual: Data Flow During Submit</p>
                <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground leading-relaxed">
{`User types in form input
         ↓
    Group 2: inputValue = "Buy milk"
         ↓
    User clicks submit
         ↓
    Group 3 orchestrates:
      ├─ Read from Group 2: grab inputValue
      ├─ setIsSubmitting(true)
      ├─ Send to server: await api.addTodo("Buy milk")
      ├─ setIsSubmitting(false)
      ├─ Update Group 1: setTodos([...todos, "Buy milk"])  ← list re-renders
      └─ Reset Group 2: setInputValue("")  ← input clears
         ↓
    UI updates with new todo in list`}
                </pre>
              </div>

              <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground space-y-3">
                <p className="font-medium text-foreground">Why this framing matters</p>
                <ul className="space-y-2 ml-3">
                  <li>• Group 2 and Group 1 are passive—they hold state and re-render when it changes.</li>
                  <li>• Group 3 is active—it's the only one that reads from other groups and coordinates multiple state updates.</li>
                  <li>• Group 3 is where the submission logic lives: pending flag, error handling, the try/catch block.</li>
                  <li>• Understanding Group 3 as the orchestrator explains why it's the hardest bucket to manage manually, and why newer React patterns focus on simplifying it.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-4">
            <h2 className="font-semibold">The Synchronization Problem: Group 3's Hidden Job</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              There is an important architectural moment hidden in how Group 3 updates Group 1. It is worth surfacing now because it becomes the core problem that newer patterns solve.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 border p-4">
                <p className="font-medium text-foreground text-sm mb-3">What Group 3 is really doing</p>
                <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground leading-relaxed">
{`// Group 3's orchestration includes this:
try {
  const newTodo = await fakeApi.addTodo(inputValue)
  setTodos((prev) => [...prev, newTodo])  // ← What is this really doing?
  setInputValue("")
} catch (e) {
  setSubmitError("Failed to add")
}`}
                </pre>
              </div>

              <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 text-sm space-y-3">
                <p className="font-medium text-foreground">The synchronization choreography</p>
                <div className="space-y-2 text-muted-foreground text-xs">
                  <div className="flex gap-2">
                    <span className="font-mono font-bold min-w-fit">1.</span>
                    <p><strong>Client sends data to server:</strong> `await fakeApi.addTodo(inputValue)` - the server processes it and saves to the database.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono font-bold min-w-fit">2.</span>
                    <p><strong>Server returns the result:</strong> the API responds with the created todo (or the full object with auto-generated fields like IDs, timestamps, etc.)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono font-bold min-w-fit">3.</span>
                    <p><strong>Client manually syncs Group 1:</strong> `setTodos([...prev, newTodo])` - you are telling React to update the local list to match what is now on the server.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono font-bold min-w-fit">4.</span>
                    <p><strong>UI reflects server state:</strong> the user sees the new item in the list immediately, without a full page reload.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-background border p-4 text-sm text-muted-foreground space-y-3">
                <p className="font-medium text-foreground">The key insight: You are coordinating client and server state manually</p>
                <p>
                  The server is the source of truth (the database is real; the client is temporary). When you do `setTodos([...prev, newTodo])`, you are saying: "I trust that what the server gave me matches what it actually stored. Update my local list to stay in sync with the server."
                </p>
                <p>
                  If you did a full page refresh right after submission, Group 1 would fetch the list fresh from the server via a new API call. The list would be the same because the data is the same on the server — but you have manually kept the client in sync to avoid the reload.
                </p>
              </div>

              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm space-y-3">
                <p className="font-semibold text-destructive">Why this matters as complexity grows</p>
                <ul className="text-muted-foreground space-y-2 text-xs">
                  <li>
                    <strong>Simple case (what you see here):</strong> one mutation, one update to Group 1. Easy to reason about.
                  </li>
                  <li>
                    <strong>Real app case:</strong> mutations that affect multiple lists, computed fields, permissions, related data. Each one needs manual sync logic in Group 3.
                  </li>
                  <li>
                    <strong>The consistency problem:</strong> if Group 3 forgets to update a piece of Group 1, or updates it with stale data, the client and server silently drift out of sync. The user sees outdated information.
                  </li>
                  <li>
                    <strong>The race condition problem:</strong> what if the server state changed between when you read it and when you write the update? (Two users editing the same list, for example.)
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-4 text-sm space-y-3">
                <p className="font-medium text-foreground">What this has to do with the patterns</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  In the <strong>Classic pattern</strong>, you coordinate this manually. Group 3 reads Group 2, sends to the server, gets a response, and manually updates Group 1.
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  In the <strong>Transition pattern</strong>, React simplifies Group 3's pending flag, but you still manually coordinate the sync with the server.
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  In the <strong>Actions pattern</strong> (coming next), this synchronization moves to the server. The server handles updating Group 1's data automatically, and the browser just needs to know "refresh this part of the UI." No more manual `setTodos([...prev, newItem])` — the server tells you what changed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="form-type" className="space-y-4 scroll-mt-24">
          <div className="rounded-lg border bg-card p-5 space-y-3">
            <h2 className="font-semibold">2. Form Type: Contact Form</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If the page is only a contact form, you usually do not need the read bucket. The structure is simpler:
              group 2 for form state and group 3 for submission state.
            </p>
            <div className="rounded-lg bg-muted/40 border p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">A typical contact form shape</p>
              <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground">
{`// GROUP 2: form state
const [form, setForm] = useState({ name: "", email: "", message: "" })
const [validationError, setValidationError] = useState(null) // usually included

// GROUP 3: submission state
const [isSubmitting, setIsSubmitting] = useState(false)      // always included
const [submitError, setSubmitError] = useState(null)         // always included
const [submitSuccess, setSubmitSuccess] = useState(null)     // usually included (simple forms need explicit confirmation)

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  // client-side validation (Bucket 2) — usually included
  if (!form.email.includes("@")) {
    setValidationError("Invalid email")
    return
  }
  setValidationError(null)

  setIsSubmitting(true)
  setSubmitError(null)
  setSubmitSuccess(null)
  try {
    const response = await sendMessage(form)
    if (response.ok) {
      setForm({ name: "", email: "", message: "" })
      setSubmitSuccess("Message sent!")              // explicit success — user needs confirmation
      setTimeout(() => setSubmitSuccess(null), 3000)
    }
  } catch (err) {
    setSubmitError("Message failed to send")         // server-side error (Bucket 3)
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
                <li>• Group 2: form state like name, email, message — errors here are <strong>client-side</strong> (empty field, bad format) caught before sending</li>
                <li>• Group 3: submission state like pending and error — errors here are <strong>server-side</strong> (rejected by API, business logic failure) caught in the catch block</li>
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
            <h2 className="font-semibold">3. Full CRUD: Three Groups</h2>
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
                  <strong>1. Read</strong> - list data, loading, and fetch errors <span className="text-xs">(server-side — the initial load failed)</span>.
                </li>
                <li>
                  <strong>2. Form State</strong> - what the user is typing, plus validation errors <span className="text-xs">(client-side — caught before the request is sent: empty, bad format, too long)</span>.
                </li>
                <li>
                  <strong>3. Submission State</strong> - pending, server-side errors <span className="text-xs">(caught in catch: rejected by API, conflict, business logic failure)</span>, and explicit success message <span className="text-xs">(simple forms only — CRUD relies on Bucket 1 updating instead)</span>.
                </li>
              </ul>
            </div>

            <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">How the classic version usually looks</p>
              <pre className="overflow-x-auto rounded bg-muted p-3 text-xs text-foreground">
{`// GROUP 1: read state
const [todos, setTodos] = useState<string[]>([])     // always included
const [isLoading, setIsLoading] = useState(true)     // always included
const [fetchError, setFetchError] = useState(null)   // always included

// GROUP 2: form state
const [inputValue, setInputValue] = useState("")     // always included
const [validationError, setValidationError] = useState(null) // usually included

// GROUP 3: submission state
const [isSubmitting, setIsSubmitting] = useState(false)  // always included
const [submitError, setSubmitError] = useState(null)     // always included
// no submitSuccess here — list updating (Bucket 1) is the implicit success signal

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  // client-side validation — usually included
  if (!inputValue.trim()) {
    setValidationError("Cannot be empty")
    return
  }
  setValidationError(null)

  setIsSubmitting(true)
  setSubmitError(null)
  try {
    const newTodo = await api.addTodo(inputValue)
    setTodos((prev) => [...prev, newTodo])  // Bucket 1 update = implicit success signal
    setInputValue("")                       // Bucket 2 reset — side effect, not success signal
  } catch (err) {
    setSubmitError("Failed to add")         // server-side error (Bucket 3)
  } finally {
    setIsSubmitting(false)
  }
}`}
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

            {validationError && <p className="text-sm text-amber-600">⚠️ {validationError}</p>}

            {submitSuccess && <p className="text-sm text-green-600">✓ {submitSuccess}</p>}

            {submitError && <p className="text-sm text-destructive">❌ {submitError}</p>}

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
            <h2 className="font-semibold">4. Analysis and Problems</h2>
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
            <h3 className="font-semibold">Client-side vs Server-side Validation (Bucket 2 vs 3)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An important distinction: validation errors can come from two places, and they belong in different buckets.
            </p>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
                <p className="font-medium">Bucket 2: Client-side Validation</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Errors you catch before sending to the server. Examples: empty field, invalid email format, text too long, required field missing.
                </p>
                <pre className="overflow-x-auto rounded bg-background p-2 text-xs text-foreground">
{`if (!inputValue.trim()) {
  setValidationError("Empty")
  return
}`}
                </pre>
              </div>
              <div className="rounded-lg border bg-destructive/10 p-4 space-y-2">
                <p className="font-medium text-destructive">Bucket 3: Server-side Validation</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Errors the server sends back. Examples: email already exists, insufficient permissions, business logic rejected it.
                </p>
                <pre className="overflow-x-auto rounded bg-background p-2 text-xs text-foreground">
{`} catch (e) {
  setSubmitError("Server rejected")
}`}
                </pre>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you submit, client-side validation runs first and short-circuits if it fails. Only if it passes do you send to the server. Server errors come back in the submit phase and should be shown separately.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-5 space-y-3">
            <h3 className="font-semibold">Implicit vs Explicit Success (Bucket 3)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bucket 3 also handles success differently depending on the form type.
            </p>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-2">
                <p className="font-medium">Simple Form: Explicit Success</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Waits for the API response and checks if it succeeded before showing the success message.
                </p>
                <pre className="overflow-x-auto rounded bg-background p-2 text-xs text-foreground">
{`try {
  const response = await sendMessage(form)
  if (response.ok) {  // wait for ok response
    setSubmitSuccess("Sent!")
    setTimeout(() => 
      setSubmitSuccess(null), 2000)
  }
} catch (err) {
  setSubmitError("Failed")
}`}
                </pre>
              </div>
              <div className="rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2">
                <p className="font-medium text-emerald-700 dark:text-emerald-400">CRUD: Implicit Success</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  The list updates with the new item (Bucket 1). That UI change is the success signal—no message needed.
                </p>
                <pre className="overflow-x-auto rounded bg-background p-2 text-xs text-foreground">
{`try {
  const newTodo = await api.add(input)
  setTodos([...todos, newTodo])  // ← Bucket 1 updates
  setInputValue("")  // form reset side effect
}`}
                </pre>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CRUD pages rely on Bucket 1 changes (updated list) to signal success. The new item appearing is the success signal. Simple forms often show an explicit message. Both are valid; it depends on user feedback needs.
            </p>
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
