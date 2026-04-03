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

        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">State Management Deep Dive</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground text-sm mb-2">The Three State Groups</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Notice how states naturally divide into three categories:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mt-2 ml-4">
                <li><strong>Fetching data:</strong> <code className="bg-muted px-1 rounded">todos</code>, <code className="bg-muted px-1 rounded">isLoading</code>, <code className="bg-muted px-1 rounded">error</code></li>
                <li><strong>User input:</strong> <code className="bg-muted px-1 rounded">inputValue</code> (what user is typing)</li>
                <li><strong>Submitting:</strong> <code className="bg-muted px-1 rounded">isSubmitting</code>, <code className="bg-muted px-1 rounded">submitError</code> (send to server)</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Each async operation (fetch, submit, delete, edit) needs its own loading/error pair. This is why a real app with 5 async operations ends up with 10+ state variables just for status tracking.
              </p>
              <div className="mt-3 p-3 bg-muted rounded text-xs font-mono text-foreground space-y-1">
                <div><span className="text-blue-600">// GROUP 1: Fetching initial todos</span></div>
                <div><span className="text-purple-600">const</span> [todos, setTodos] = <span className="text-orange-600">useState</span>([])        <span className="text-gray-500">// What comes back</span></div>
                <div><span className="text-purple-600">const</span> [isLoading, setIsLoading] = <span className="text-orange-600">useState</span>(<span className="text-green-600">true</span>)</div>
                <div><span className="text-purple-600">const</span> [error, setError] = <span className="text-orange-600">useState</span>(<span className="text-green-600">null</span>)</div>
                <div className="mt-2"><span className="text-blue-600">// GROUP 2: User typing</span></div>
                <div><span className="text-purple-600">const</span> [inputValue, setInputValue] = <span className="text-orange-600">useState</span>(<span className="text-green-600">""</span>)  <span className="text-gray-500">// What we're typing</span></div>
                <div className="mt-2"><span className="text-blue-600">// GROUP 3: Submitting form</span></div>
                <div><span className="text-purple-600">const</span> [isSubmitting, setIsSubmitting] = <span className="text-orange-600">useState</span>(<span className="text-green-600">false</span>)</div>
                <div><span className="text-purple-600">const</span> [submitError, setSubmitError] = <span className="text-orange-600">useState</span>(<span className="text-green-600">null</span>)  <span className="text-gray-500">// Errors only</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground text-sm mb-2">Success Messages: Implicit vs Explicit</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This pattern shows <strong>implicit success</strong>: when you submit, the todo appears in the list and the input clears. The user sees success through data changes, not a message.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                In real production apps, teams use different approaches:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mt-2 ml-4">
                <li><strong>Error-only:</strong> No success notification, just show errors. Common for less critical actions.</li>
                <li><strong>Toast notification:</strong> Brief "Success!" message (1-2 sec, auto-dismiss). Used on Twitter/YouTube.</li>
                <li><strong>Explicit state:</strong> If you want a success message, add a separate state (<code className="bg-muted px-1 rounded">successMessage</code>) because controlling when to show and dismiss requires explicit tracking, not inference from HTTP status codes.</li>
              </ul>
              <div className="mt-3 p-3 bg-muted rounded text-xs font-mono text-foreground space-y-1">
                <div className="text-red-600">❌ Implicit (current approach)</div>
                <div className="text-gray-500">// Success shown through data, not state</div>
                <div><span className="text-purple-600">const</span> newTodo = <span className="text-orange-600">await</span> api.addTodo(input)</div>
                <div><span className="text-orange-600">setTodos</span>(prev =&gt; [...prev, newTodo])  <span className="text-gray-500">// User sees it appear</span></div>
                <div><span className="text-orange-600">setInputValue</span>(<span className="text-green-600">""</span>)  <span className="text-gray-500">// Empty field = success</span></div>
                <div className="mt-2 text-green-600">✓ Explicit (if you want toast)</div>
                <div className="text-gray-500">// Success tracked in state with auto-dismiss</div>
                <div><span className="text-purple-600">const</span> [successMsg, setSuccessMsg] = <span className="text-orange-600">useState</span>(<span className="text-green-600">null</span>)</div>
                <div><span className="text-orange-600">setSuccessMsg</span>(<span className="text-green-600">"Todo added!"</span>)</div>
                <div><span className="text-orange-600">setTimeout</span>(() =&gt; <span className="text-orange-600">setSuccessMsg</span>(<span className="text-green-600">null</span>), <span className="text-purple-600">2000</span>)</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-foreground text-sm mb-2">Why Error States Exist (But Not Success States)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Error messages need persistence because the user must acknowledge them or fix the problem. Success messages are ephemeral—they flash and disappear. That's why you see:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mt-2 ml-4">
                <li>✓ <code className="bg-muted px-1 rounded">submitError</code> state variable → stays visible until user acts</li>
                <li>✗ No <code className="bg-muted px-1 rounded">submitSuccess</code> state → success is shown through data changes (todo appears)</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                If you want explicit success feedback, you'd add state and a timer to auto-dismiss it—but the cleaner approach is letting the UI changes (data appearing, input clearing) speak for themselves.
              </p>
              <div className="mt-3 p-3 bg-muted rounded text-xs font-mono text-foreground space-y-1">
                <div className="text-green-600">✓ Error stays visible (needs state)</div>
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`const [submitError, setSubmitError] = useState(null)
{submitError && <div>{submitError}</div>}`}
                </pre>
                <div className="text-gray-500 mt-1">// Persists until user fixes and resubmits</div>
                <div className="mt-2 text-orange-600">✗ Success disappears (no state needed)</div>
                <div className="text-gray-500">// Just update the data, input clears, done!</div>
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`setTodos(prev => [...prev, newTodo])
setInputValue("")`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation between patterns */}
        <div className="flex gap-3 pt-8 border-t justify-between">
          <Link href="/" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            ← Home
          </Link>
          <Link href="/transition" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Transition Pattern →
          </Link>
        </div>
      </div>
    </div>
  )
}
