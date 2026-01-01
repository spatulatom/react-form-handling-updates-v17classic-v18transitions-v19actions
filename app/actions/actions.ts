"use server"

// This runs on the SERVER - not shipped to client bundle
// Can directly access DB, env vars, etc.

export async function addTodoAction(formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const todo = formData.get("todo") as string

  // Validation
  if (!todo?.trim()) {
    return { error: "Todo cannot be empty", todo: null }
  }

  // Simulate server error
  if (todo.toLowerCase().includes("error")) {
    return { error: "Server rejected this todo", todo: null }
  }

  // In real app: save to database here
  // await db.todos.create({ data: { text: todo } })

  return { error: null, todo }
}
