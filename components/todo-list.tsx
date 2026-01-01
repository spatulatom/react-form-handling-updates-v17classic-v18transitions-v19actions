"use client"

import { useState } from "react"
import { TodoForm } from "./todo-form"

type Props = {
  initialTodos: string[]
}

export function TodoList({ initialTodos }: Props) {
  const [todos, setTodos] = useState(initialTodos)

  return (
    <div className="space-y-4">
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
