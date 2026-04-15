"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { TodoActionState } from "./action-state"
import { addActionTodo } from "@/app/actions/native-store"

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
    return { error: "Todo cannot be empty" }
  }

  // Simulate server error for demo purposes
  if (todo.toLowerCase().includes("error")) {
    return { error: "Server rejected this todo" }
  }

  addActionTodo(todo)
  revalidatePath("/actions")
  // redirect() throws internally — Next.js converts it to a 303 for no-JS
  // and a soft router.push() for JS-enhanced. PRG prevents refresh-resubmit.
  redirect("/actions")
}
