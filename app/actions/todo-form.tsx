
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
  // Third arg "/actions" is the permalink — bakes the action URL into the HTML
  // for the no-JS path. Without it, submitting with JS disabled has no target.
  const [state, formAction] = useActionState(addTodoAction, initialTodoActionState, "/actions")

  return (
    <div className="space-y-3">
      <form action={formAction} className="space-y-2">
        <div className="flex gap-2">
          <Input name="todo" placeholder="Add todo (type 'error' to simulate failure)" required />
          <SubmitButton />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      </form>

      <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">How the groups map in this form</p>
        <ul className="space-y-1">
          <li>• Group 2: the browser owns the input value until submit, so there is no local input useState here.</li>
          <li>• Group 3: useActionState talks directly to the server action, and useFormStatus exposes pending inside the button.</li>
          <li>• No e.preventDefault(): the form keeps native submit behavior, while the hydrated route enhances it with React-managed pending and returned state.</li>
        </ul>
      </div>
    </div>
  )
}
