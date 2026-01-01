"use server"

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

export async function addTodoAction(formData: FormData) {
  // Simulate network delay (like a real database call)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // FormData.get() returns the value of the input with name="todo"
  const todo = formData.get("todo") as string

  // Validation - in a real app you'd use zod or similar
  if (!todo?.trim()) {
    // Return error as data, don't throw
    // This pattern allows the client to handle errors gracefully
    return { error: "Todo cannot be empty", todo: null }
  }

  // Simulate server error for demo purposes
  if (todo.toLowerCase().includes("error")) {
    return { error: "Server rejected this todo", todo: null }
  }

  // In a real app, you'd save to a database here:
  // await db.todos.create({ data: { text: todo, userId: session.userId } })
  //
  // You might also revalidate cached data:
  // revalidatePath('/todos')
  // revalidateTag('todos')

  // Return success - the client receives this and updates UI
  return { error: null, todo }
}
