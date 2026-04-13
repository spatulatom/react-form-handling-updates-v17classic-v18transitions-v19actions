
import Link from "next/link"
import { TodoForm } from "@/app/actions/todo-form"
import { getActionTodos } from "@/app/actions/native-store"

export default async function ActionsPage() {
  // Group 1 — Read State: fetched on the server, no useEffect, no loading flag
  const todos = getActionTodos()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">

        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">React 19 Actions Pattern</h1>
          <p className="text-muted-foreground">Server Action · useActionState · useFormStatus</p>
        </div>

        {/* Three groups summary */}
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
            <p className="font-semibold">Group 1 · Read State</p>
            <p className="text-muted-foreground text-xs">
              Page is a Server Component. The list is fetched during render and arrives as HTML — no{" "}
              <code className="bg-muted px-1 rounded">useEffect</code>, no loading flag.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
            <p className="font-semibold">Group 2 · Form State</p>
            <p className="text-muted-foreground text-xs">
              No controlled input. The browser owns the field value until submit and serialises it into{" "}
              <code className="bg-muted px-1 rounded">FormData</code> automatically.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
            <p className="font-semibold">Group 3 · Submission State</p>
            <p className="text-muted-foreground text-xs">
              <code className="bg-muted px-1 rounded">useActionState</code> owns pending and server-returned
              errors. No manual <code className="bg-muted px-1 rounded">isSubmitting</code> flag needed.
            </p>
          </div>
        </div>

        {/* Code snippets — the full three-file pattern */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">The Three-File Pattern</h2>

          {/* 1. Server Action */}
          <div className="rounded-lg border bg-card">
            <div className="px-4 py-2 border-b bg-muted/40 flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground">actions.ts</span>
              <span className="text-xs text-muted-foreground">— server action (runs on the server)</span>
            </div>
            <pre className="p-4 text-xs leading-relaxed overflow-x-auto text-foreground">{`"use server"
import { revalidatePath } from "next/cache"

export async function addTodoAction(prevState, formData) {
  const todo = formData.get("todo")        // reads Group 2 (native FormData)

  if (!todo.trim()) {
    return { error: "Cannot be empty" }    // returned as Group 3 state
  }

  await db.addTodo(todo)                   // the actual mutation
  revalidatePath("/actions")              // invalidate → Server Component re-renders

  return { error: null }                   // clears the error
}`}</pre>
          </div>

          {/* 2. Client Form */}
          <div className="rounded-lg border bg-card">
            <div className="px-4 py-2 border-b bg-muted/40 flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground">todo-form.tsx</span>
              <span className="text-xs text-muted-foreground">— client component (handles Group 2 + 3)</span>
            </div>
            <pre className="p-4 text-xs leading-relaxed overflow-x-auto text-foreground">{`"use client"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()      // reads Group 3 pending from parent form
  return <button disabled={pending}>{pending ? "Adding..." : "Add"}</button>
}

export function TodoForm() {
  // useActionState wires the server action to the form
  // state  → the last value returned by the action (Group 3 errors)
  // formAction → passed to <form action={...}>
  const [state, formAction] = useActionState(addTodoAction, { error: null })

  return (
    <form action={formAction}>
      <input name="todo" required />       {/* Group 2: browser-native field */}
      <SubmitButton />
      {state.error && <p>{state.error}</p>}
    </form>
  )
}`}</pre>
          </div>

          {/* 3. Server Component page */}
          <div className="rounded-lg border bg-card">
            <div className="px-4 py-2 border-b bg-muted/40 flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground">page.tsx</span>
              <span className="text-xs text-muted-foreground">— server component (owns Group 1)</span>
            </div>
            <pre className="p-4 text-xs leading-relaxed overflow-x-auto text-foreground">{`// No "use client" — this is a Server Component
export default async function ActionsPage() {
  const todos = await db.getTodos()        // Group 1: fetched during render

  return (
    <div>
      <TodoForm />                         {/* client island for Groups 2+3 */}

      <ul>
        {todos.map(todo => (               // list rendered from server data
          <li key={todo}>{todo}</li>       // re-renders after revalidatePath()
        ))}
      </ul>
    </div>
  )
}`}</pre>
          </div>
        </div>

        {/* Key points */}
        <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20 text-sm space-y-2">
          <p className="font-semibold text-green-700 dark:text-green-300">What disappeared vs the Classic pattern</p>
          <ul className="text-muted-foreground space-y-1 text-xs">
            <li>✓ No <code className="bg-muted px-1 rounded">useEffect</code> to fetch the initial list</li>
            <li>✓ No <code className="bg-muted px-1 rounded">useState</code> for <code className="bg-muted px-1 rounded">inputValue</code> or <code className="bg-muted px-1 rounded">isSubmitting</code></li>
            <li>✓ No <code className="bg-muted px-1 rounded">e.preventDefault()</code> — the form keeps native submit behaviour</li>
            <li>✓ No callback props threading state setters from parent to child</li>
            <li>✓ The list stays fresh because <code className="bg-muted px-1 rounded">revalidatePath</code> triggers a server re-render</li>
          </ul>
        </div>

        {/* Live demo */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Live Demo</h2>

          <TodoForm />

          <ul className="space-y-2" aria-label="Todo list">
            {todos.map((todo, i) => (
              <li key={`${todo}-${i}`} className="p-3 rounded bg-muted text-sm">
                {todo}
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t justify-between">
          <Link href="/transition" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm">
            ← Transition Pattern
          </Link>
          <Link href="/" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm">
            Home
          </Link>
        </div>

      </div>
    </div>
  )
}
