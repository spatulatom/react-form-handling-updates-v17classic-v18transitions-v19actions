"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTodoAction } from "@/app/actions/actions"

// Extracted submit button - useFormStatus must be in child of form
function SubmitButton() {
  // This hook only works inside a <form> - it reads the form's pending state
  const { pending } = useFormStatus()

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
  // useActionState wraps our action and gives us:
  // - state: the return value of the last action call (or initial state)
  // - formAction: a wrapped version of our action to use in the form
  //
  // The first argument is our action function that receives:
  // - prevState: the previous state (useful for optimistic updates)
  // - formData: the native FormData from the form submission
  const [state, formAction] = useActionState(
    async (prevState: { error: string | null }, formData: FormData) => {
      const result = await addTodoAction(formData)

      if (result.error) {
        // Return error state - component re-renders with this
        return { error: result.error }
      }

      // Notify parent of success
      if (result.todo) {
        onSuccess(result.todo)
      }

      // Return success state - error is cleared
      return { error: null }
    },
    { error: null }, // Initial state
  )

  return (
    <div className="space-y-3">
      {/* 
        action={formAction} replaces onSubmit + e.preventDefault()
        The form works with native browser mechanics - enhanced by React
      */}
      <form action={formAction} className="space-y-2">
        <div className="flex gap-2">
          {/* 
            name="todo" is important - FormData uses this to get the value
            No need for value + onChange controlled input pattern
          */}
          <Input name="todo" placeholder="Add todo (type 'error' to simulate failure)" />
          <SubmitButton />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      </form>

      <p className="text-xs text-muted-foreground">
        Notice: No <code className="bg-muted px-0.5 rounded">useState</code> for input value, no{" "}
        <code className="bg-muted px-0.5 rounded">onChange</code> handler, no{" "}
        <code className="bg-muted px-0.5 rounded">e.preventDefault()</code>. The form is simpler and works before JS
        loads.
      </p>
    </div>
  )
}
