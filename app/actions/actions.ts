"use server"

import { revalidatePath } from "next/cache"
import type { TodoActionState } from "./action-state"
import { addActionTodo } from "@/lib/native-store"

// The "use server" directive marks this entire file as server-only.
// None of this code is included in the client JavaScript bundle.
//
// You can safely:
// - Access databases directly
// - Use environment variables (process.env.DATABASE_URL)
// - Call internal APIs
// - Access the file system
//
// The client just gets a reference to call this function - the
// implementation stays on the server.

export async function addTodoAction(prevState: TodoActionState, formData: FormData): Promise<TodoActionState> {
  // Simulate network delay (like a real database call)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // FormData.get() returns the value of the input with name="todo"
  const todo = formData.get("todo") as string

  // Validation - in a real app you'd use zod or similar
  if (!todo?.trim()) {
    return { error: "Todo cannot be empty", todo: null, requestId: prevState.requestId + 1 }
  }

  // Simulate server error for demo purposes
  if (todo.toLowerCase().includes("error")) {
    return { error: "Server rejected this todo", todo: null, requestId: prevState.requestId + 1 }
  }

  const savedTodo = addActionTodo(todo)
  revalidatePath("/actions")

  return { error: null, todo: savedTodo, requestId: prevState.requestId + 1 }
}
