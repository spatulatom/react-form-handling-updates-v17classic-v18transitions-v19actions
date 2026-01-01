import Link from "next/link"
import { TodoList } from "@/components/todo-list"

// Server-side initial data (no useEffect needed!)
async function getTodos() {
  // Simulate DB fetch
  return ["Buy milk", "Walk dog"]
}

export default async function ActionsPattern() {
  const initialTodos = await getTodos()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Actions Pattern</h1>
          <p className="text-muted-foreground">useActionState + Server Actions (React 19)</p>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">The Complete Solution</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            React 19 introduces <strong>Actions</strong> - a unified model for handling async operations. An Action is
            any async function that can be used with forms or triggered programmatically. When marked with{" "}
            <code className="bg-muted px-1 rounded">"use server"</code>, it becomes a Server Action that runs on the
            server.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The mental model shift is significant: instead of <em>preventing</em> the browser's native form behavior and
            implementing your own, you <em>enhance</em> it. The form's{" "}
            <code className="bg-muted px-1 rounded">action</code> prop accepts your async function directly. React
            handles serializing the form data, calling your action, and updating the UI.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Progressive enhancement:</strong> Because we're using native form mechanics, the form actually works
            before JavaScript loads! The browser will POST to your action endpoint. Once JS hydrates, React intercepts
            and handles it client-side for a smoother experience.
          </p>
        </div>

        {/* All problems solved */}
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm space-y-3">
          <p className="font-semibold text-green-600">All previous problems solved:</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>✓ Progressive enhancement</strong> - Form works without JS. Try disabling JavaScript and
              submitting - it still works! The server action runs and the page reloads with new data.
            </li>
            <li>
              <strong>✓ No loading state management</strong> -{" "}
              <code className="bg-muted px-1 rounded">useFormStatus</code> hook provides{" "}
              <code className="bg-muted px-1 rounded">pending</code> automatically. Used in the SubmitButton component -
              it must be a child of the form.
            </li>
            <li>
              <strong>✓ No error state management</strong> - Errors are returned from the action as data, not thrown.
              The <code className="bg-muted px-1 rounded">useActionState</code> hook wraps your action and provides the
              result including any errors.
            </li>
            <li>
              <strong>✓ No preventDefault</strong> - We use{" "}
              <code className="bg-muted px-1 rounded">{"<form action={formAction}>"}</code>, not{" "}
              <code className="bg-muted px-1 rounded">onSubmit</code>. Native form behavior is preserved.
            </li>
            <li>
              <strong>✓ No useEffect for data</strong> - This is a Server Component! The{" "}
              <code className="bg-muted px-1 rounded">getTodos()</code>
              call happens on the server at request time. Data arrives with the HTML.
            </li>
            <li>
              <strong>✓ Type-safe end-to-end</strong> - Server Actions are regular TypeScript functions. The compiler
              checks your form data handling matches what the server expects.
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">Key React 19 APIs Used</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-foreground">useActionState</h3>
              <p className="text-muted-foreground mt-1">
                Wraps an action function and provides: (1) the current state (including errors), and (2) a wrapped
                action to pass to your form. It manages the async lifecycle and re-renders your component with the
                action's return value.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">useFormStatus</h3>
              <p className="text-muted-foreground mt-1">
                Must be called from a component <em>inside</em> a form. Returns{" "}
                <code className="bg-muted px-1 rounded">{"{ pending, data, method, action }"}</code>. The{" "}
                <code className="bg-muted px-1 rounded">pending</code> boolean is true while the form action is
                executing.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">"use server" directive</h3>
              <p className="text-muted-foreground mt-1">
                Marks a function as a Server Action. The function runs only on the server - it's not included in the
                client bundle. You can directly access databases, environment variables, and other server-only
                resources.
              </p>
            </div>
          </div>
        </div>

        <TodoList initialTodos={initialTodos} />

        <div className="p-5 rounded-lg border bg-card space-y-3">
          <h2 className="font-semibold">Architecture Note</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Notice this page is a <strong>Server Component</strong> (no "use client" directive). It fetches initial data
            on the server. The <code className="bg-muted px-1 rounded">TodoList</code> and
            <code className="bg-muted px-1 rounded mx-1">TodoForm</code> are Client Components because they need
            interactivity. This is the recommended pattern: Server Components for data fetching, Client Components for
            interactions.
          </p>
        </div>
      </div>
    </div>
  )
}
