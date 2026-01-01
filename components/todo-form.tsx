"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTodoAction } from "@/app/actions/actions"

// Extracted submit button - useFormStatus must be in child of form
function SubmitButton() {
  const { pending } = useFormStatus() // Auto-tracks form submission!

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add"}
    </Button>
  )
}

type Props = {
  onSuccess: (todo: string) => void
}

export function TodoForm({ onSuccess }: Props) {
  // useActionState: wraps action with state (replaces useState for error/result)
  // - Automatically handles pending state
  // - Returns previous state on error
  // - Works with progressive enhancement
  const [state, formAction] = useActionState(
    async (prevState: { error: string | null }, formData: FormData) => {
      const result = await addTodoAction(formData)

      if (result.error) {
        return { error: result.error }
      }

      // Notify parent of success
      if (result.todo) {
        onSuccess(result.todo)
      }

      return { error: null }
    },
    { error: null },
  )

  return (
    // action={formAction} - No onSubmit, no preventDefault!
    // This form WORKS even if JavaScript fails to load
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <Input name="todo" placeholder="Add todo (type 'error' to simulate failure)" />
        <SubmitButton />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  )
}
