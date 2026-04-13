

"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { initialTodoActionState } from "@/app/actions/action-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTodoAction } from "@/app/actions/actions"

// useFormStatus must be called from inside the <form> tree
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add"}
    </Button>
  )
}

export function TodoForm() {
  const [state, formAction] = useActionState(addTodoAction, initialTodoActionState)

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <Input name="todo" placeholder="New todo (type 'error' to test failure)" required />
        <SubmitButton />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  )
}
