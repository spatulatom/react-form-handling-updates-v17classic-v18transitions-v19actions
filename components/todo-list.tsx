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
  const [todos, setTodos] = useState(initialTodos)

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-2">
        <p className="font-medium">Where the three groups live now</p>
        <ul className="text-muted-foreground space-y-1 text-xs">
          <li>
            • <strong>Group 1: Read</strong> - page.tsx fetches the initial list on the server before HTML is sent.
          </li>
          <li>
            • <strong>Group 2: Form State</strong> - TodoForm leaves the current input value in the browser's native form state.
          </li>
          <li>
            • <strong>Group 3: Submission State</strong> - TodoForm reads pending and returned errors from React's form hooks.
          </li>
          <li>
            • <strong>TodoList</strong> still keeps a small client list state so the enhanced experience can append immediately after a successful action.
          </li>
        </ul>
      </div>

      <TodoForm onSuccess={(todo) => setTodos((prev) => [...prev, todo])} />

      <ul className="space-y-2">
        {todos.map((todo, i) => (
          <li key={`${todo}-${i}`} className="p-3 rounded bg-muted">
            {todo}
          </li>
        ))}
      </ul>
    </div>
  )
}
