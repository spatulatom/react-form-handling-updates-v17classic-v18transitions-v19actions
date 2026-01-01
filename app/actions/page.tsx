"use client"

import Link from "next/link"
import { TodoList } from "@/components/todo-list"

// Server-side initial data (no useEffect needed!)
async function getTodos() {
  // Simulate DB fetch
  return ["Buy milk", "Walk dog"]
}

export default async function ActionsPattern() {
  const initialTodos = await getTodos()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Actions Pattern</h1>
          <p className="text-muted-foreground">useActionState + Server Actions (React 19)</p>
        </div>

        {/* All problems solved */}
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm space-y-2">
          <p className="font-semibold text-green-600">All problems solved:</p>
          <ul className="text-muted-foreground space-y-1">
            <li>
              ✓ <strong>Progressive enhancement</strong> - Works without JS!
            </li>
            <li>
              ✓ <strong>No loading state</strong> - useFormStatus handles it
            </li>
            <li>
              ✓ <strong>No error state</strong> - Returned from action
            </li>
            <li>
              ✓ <strong>No preventDefault</strong> - Native form behavior
            </li>
            <li>
              ✓ <strong>No useEffect</strong> - Server fetches initial data
            </li>
            <li>
              ✓ <strong>Type-safe</strong> - End-to-end with Server Actions
            </li>
          </ul>
        </div>

        <TodoList initialTodos={initialTodos} />
      </div>
    </div>
  )
}
