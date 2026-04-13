"use server"

import { revalidatePath } from "next/cache"
import type { TodoActionState } from "./action-state"
import { addActionTodo } from "@/app/actions/native-store"

export async function addTodoAction(prevState: TodoActionState, formData: FormData): Promise<TodoActionState> {
  // Simulate network delay (like a real database call)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const todo = formData.get("todo") as string

  if (!todo?.trim()) {
    return { error: "Todo cannot be empty" }
  }

  // Simulate server error for demo purposes
  if (todo.toLowerCase().includes("error")) {
    return { error: "Server rejected this todo" }
  }

  addActionTodo(todo)
  // Invalidate this route so the Server Component re-renders with the updated list
  revalidatePath("/actions")

  return { error: null }
}
