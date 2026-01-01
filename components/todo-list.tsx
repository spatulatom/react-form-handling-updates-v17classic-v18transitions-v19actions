"use client"

import { useState } from "react"
import { TodoForm } from "./todo-form"

type Props = {
  initialTodos: string[]
}

// This is a Client Component because it needs useState for the todo list.
// It receives initial data from the Server Component parent (app/actions/page.tsx)
// and handles client-side updates when new todos are added.

export function TodoList({ initialTodos }: Props) {
  // We still use useState here for the client-side list
  // But the INITIAL data came from the server - no useEffect needed
  const [todos, setTodos] = useState(initialTodos)

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-2">
        <p className="font-medium">Component Architecture:</p>
        <ul className="text-muted-foreground space-y-1 text-xs">
          <li>
            • <strong>page.tsx</strong> - Server Component, fetches initial todos
          </li>
          <li>
            • <strong>TodoList</strong> - Client Component, manages local state
          </li>
          <li>
            • <strong>TodoForm</strong> - Client Component, handles form submission
          </li>
          <li>
            • <strong>actions.ts</strong> - Server Action, runs on server
          </li>
        </ul>
      </div>

      <TodoForm onSuccess={(todo) => setTodos((prev) => [...prev, todo])} />

      <ul className="space-y-2">
        {todos.map((todo, i) => (
          <li key={i} className="p-3 rounded bg-muted">
            {todo}
          </li>
        ))}
      </ul>
    </div>
  )
}
