export type TodoActionState = {
  error: string | null
  todo: string | null
  requestId: number
}

export const initialTodoActionState: TodoActionState = {
  error: null,
  todo: null,
  requestId: 0,
}