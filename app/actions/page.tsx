import { Suspense } from "react"
import Link from "next/link"
import { TodoList } from "@/components/todo-list"
import { getActionTodos } from "@/lib/native-store"

async function ActionsContent() {
  const initialTodos = getActionTodos()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Actions Pattern</h1>
          <p className="text-muted-foreground">useActionState + Server Actions (React 19)</p>
        </div>

        <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 text-sm space-y-2">
          <p className="font-semibold text-sky-700 dark:text-sky-300">Cache Components Note</p>
          <p className="text-muted-foreground leading-relaxed">
            This page is meant to show the hydrated React 19 Actions flow. Because the project uses Cache Components,
            production can stream this route through Suspense first. If you want to compare against the plain browser-only
            no-JavaScript baseline, use <Link href="/native/post" className="underline underline-offset-4">/native/post</Link>.
          </p>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">Same Three Groups, Different Owners</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Classic page introduced three groups: <strong>Group 1 for read state</strong>, <strong>Group 2 for
            form state</strong>, and <strong>Group 3 for submission state</strong>. The Actions model does not make
            those concerns disappear. It moves them to better owners.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Instead of manually coordinating each group in client code, React and the browser take over more of the
            plumbing. The form keeps native submit behavior, the server handles the mutation, and React wires the
            response back into the UI.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Important caveat:</strong> this project uses Cache Components, so this route is streamed behind a
            Suspense boundary in production. That makes <em>the hydrated React experience</em> the main thing this page
            demonstrates. The true native no-JavaScript baseline is still best seen on <code className="bg-muted px-1 rounded">/native/post</code>.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="font-medium text-foreground">Group 1: Read</p>
            <p>The page itself is a Server Component, so the initial list is fetched on the server instead of with useEffect.</p>
            <p>No loading flag or fetch error state is needed just to paint the first screen.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="font-medium text-foreground">Group 2: Form State</p>
            <p>The browser owns the input value as native form state until submit.</p>
            <p>That means no controlled input, no onChange handler, and no manual FormData construction.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="font-medium text-foreground">Group 3: Submission State</p>
            <p>Pending and returned errors are managed by React's form hooks instead of separate useState pairs.</p>
            <p>The mutation still exists. It is just delegated to useActionState, useFormStatus, and the server action.</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm space-y-3">
          <p className="font-semibold text-green-600">What gets simpler in practice</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>✓ Group 1 moves server-side</strong> - Initial data comes from the server during render, so there
              is no client fetch effect to coordinate for this page.
            </li>
            <li>
              <strong>✓ Group 2 becomes native form state</strong> - The browser serializes the inputs into FormData, so
              this demo does not need input useState or e.preventDefault.
            </li>
            <li>
              <strong>✓ Group 3 becomes declarative</strong> - <code className="bg-muted px-1 rounded">useFormStatus</code>
              exposes pending and <code className="bg-muted px-1 rounded">useActionState</code> returns server-side
              validation errors as data.
            </li>
            <li>
              <strong>✓ The server write path is still real</strong> - the action runs on the server and updates shared
              state, which the hydrated page then reflects immediately.
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-sm space-y-3">
          <p className="font-semibold text-amber-700 dark:text-amber-300">What did not disappear</p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>• The three groups still exist</strong> - they are just distributed across the server, the browser,
              and React's form hooks instead of living in one client component.
            </li>
            <li>
              <strong>• Cache Components changes the delivery model</strong> - this route streams through Suspense in
              production, so the fully no-JS baseline is easier to demonstrate on the native POST page than on this
              React Actions page.
            </li>
            <li>
              <strong>• Server validation still matters</strong> - this demo validates inside the server action and returns
              an error for useActionState to render.
            </li>
            <li>
              <strong>• Some client state can still be useful</strong> - TodoList keeps a small local list state so the
              JavaScript-enhanced path can append immediately after success.
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">Key React 19 APIs Used</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-foreground">useActionState</h3>
              <p className="text-muted-foreground mt-1">
                Wraps an action function and gives the form a stateful result channel. In this page, that means Group 3
                errors come back as returned data instead of a manual catch + setState sequence.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">useFormStatus</h3>
              <p className="text-muted-foreground mt-1">
                Must be called from inside the form tree. It exposes Group 3 pending state without needing a separate
                isSubmitting variable.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">"use server" directive</h3>
              <p className="text-muted-foreground mt-1">
                Marks the mutation so it runs on the server. That is what lets the browser submit the form natively when
                JavaScript is unavailable, and what lets the server own the write path for the demo data.
              </p>
            </div>
          </div>
        </div>

        <TodoList initialTodos={initialTodos} />

        <div className="p-5 rounded-lg border bg-card space-y-3">
          <h2 className="font-semibold">With JS vs Without JS</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            With JavaScript enabled, React intercepts the form submission, sends the FormData in the background, and the
            client list updates immediately. With Cache Components enabled, the production route itself is streamed
            through Suspense, so the plain no-JS baseline is better represented by <code className="bg-muted px-1 rounded">/native/post</code>
            than by this hydrated Actions demo.
          </p>
        </div>

        {/* Navigation between patterns */}
        <div className="flex gap-3 pt-8 border-t justify-between">
          <Link href="/transition" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            ← Transition Pattern
          </Link>
          <Link href="/" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            Home
          </Link>
        </div>
    </div>
  )
}

export default function ActionsPattern() {
  return (
    <div className="min-h-screen bg-background p-8">
      <Suspense fallback={<div className="mx-auto max-w-2xl text-sm text-muted-foreground">Loading...</div>}>
        <ActionsContent />
      </Suspense>
    </div>
  )
}
