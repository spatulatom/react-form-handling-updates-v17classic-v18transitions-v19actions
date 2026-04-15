
import Link from "next/link"
import { TodoList } from "@/app/actions/todo-list"
import { getActionTodos } from "@/app/actions/native-store"

async function ActionsContent() {
  const initialTodos = getActionTodos()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Back
          </Link>
          <Link href="/actions/progressive" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
            JS boundary →
          </Link>
        </div>

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
          <h2 className="font-semibold">Analyzing Actions: Where Are the Three Groups Now?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The three groups did not disappear in Actions. They are just distributed across the server, the browser, and React's form hooks. To understand how, apply the same analytical method from Classic:
          </p>

          <div className="rounded-lg bg-muted/40 border p-4 text-sm space-y-4">
            <p className="font-medium text-foreground mb-2">Step 1: Separate the Buckets (Even If Blurred)</p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-500/20 border border-purple-500/30 px-3 py-2 min-w-fit font-mono font-semibold text-xs">Group 1</div>
                <div className="flex-1 text-muted-foreground text-xs">
                  <p className="font-medium text-foreground mb-1">Read State (On the Server Now)</p>
                  <p>This page is a Server Component, so the initial todos list is fetched on the server during render and passed down as props.</p>
                  <p className="mt-2 italic">Where:</p>
                  <p>In the server code: `const initialTodos = getActionTodos()`</p>
                  <p className="mt-2 italic">Why it matters:</p>
                  <p>No useEffect needed. The browser gets HTML with the list already in it. No loading state to manage on the client.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-3 py-2 min-w-fit font-mono font-semibold text-xs">Group 2</div>
                <div className="flex-1 text-muted-foreground text-xs">
                  <p className="font-medium text-foreground mb-1">Form State (Native Form Now)</p>
                  <p>The input value is no longer a controlled React input. It is native form state owned by the browser.</p>
                  <p className="mt-2 italic">Where:</p>
                  <p>In the HTML form: `&lt;input name="todo" /&gt;` - the browser tracks this</p>
                  <p className="mt-2 italic">Why it matters:</p>
                  <p>No useState, no onChange, no preventDefault. The form works with or without JavaScript.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-500/20 border border-green-500/30 px-3 py-2 min-w-fit font-mono font-semibold text-xs">Group 3</div>
                <div className="flex-1 text-muted-foreground text-xs">
                  <p className="font-medium text-foreground mb-1">Submission State (useActionState + Server Action)</p>
                  <p>Pending and errors are now managed by React form hooks, not separate useState calls.</p>
                  <p className="mt-2 italic">Where:</p>
                  <p>In the component: `const [state, formAction, isPending] = useActionState(serverAction, initialState)`</p>
                  <p className="mt-2 italic">Why it matters:</p>
                  <p>React automatically tracks when the action is running. Returned errors become available data in `state`.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 border p-4 text-sm space-y-4">
            <p className="font-medium text-foreground mb-2">Step 2: Trace the Orchestration (Group 3's Job)</p>
            
            <p className="text-muted-foreground text-xs leading-relaxed mb-3">
              Group 3 is still the orchestrator, but its plumbing has shifted. Instead of reading from client state and manually updating client state, it delegates to the server action and the form lifecycle.
            </p>

            <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-foreground leading-relaxed">
{`// Client Form Component
const [state, formAction, isPending] = useActionState(addTodoAction, null)

async function addTodoAction(prevState, formData) {
  // SERVER SIDE - Group 3 orchestration now runs here
  
  // Read from Group 2: grab the input value from FormData
  const todoText = formData.get("todo")
  
  // Validation (client-side style, pre-flight check)
  if (!todoText.trim()) {
    return { error: "Cannot be empty" }  // Return error
  }
  
  // Send to database (the actual mutation)
  const newTodo = await db.addTodo(todoText)
  
  // Update Group 1: the server-side list
  // (Behind the scenes, this might revalidate a cache tag)
  
  // Return success
  return { success: true, todo: newTodo }
}

// Meanwhile, in the form:
// Group 2 (form state) is native: <input name="todo" />
// Group 3 (submission) is managed: isPending, state.error
// Group 1 (read state) comes from server component props`}
            </pre>

            <div className="mt-3 rounded-lg border bg-background p-3 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Key shift in orchestration:</p>
              <ul className="space-y-1 ml-3">
                <li>• Group 3 does NOT read from `inputValue` useState (no such thing)</li>
                <li>• Group 3 reads from FormData, which is browser-native form state</li>
                <li>• Group 3 does NOT call `setTodos([...prev, newTodo])` directly</li>
                <li>• Instead, Group 3 (the action) runs on the server, updates the server data, and returns what changed</li>
                <li>• React then re-renders with the new data automatically</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 text-sm space-y-3">
            <p className="font-medium text-foreground">The blurring you mentioned: when UI looks simple but buckets are complex</p>
            <p className="text-muted-foreground text-xs leading-relaxed mb-2">
              A "+" button that adds an item is Group 2 (form state) at first glance, but alongside it sits a counter "5 items added" which is subtle Group 1 (read state derived from the mutation history). To analyze this:
            </p>
            <ul className="text-muted-foreground space-y-2 text-xs ml-3">
              <li><strong>Separate first:</strong> "+" is form submission trigger, counter is read state</li>
              <li><strong>Then trace:</strong> Does the button click orchestrate both updates? Yes → Group 3 coordinates them</li>
              <li><strong>Then decide:</strong> Can I move this to Actions? Yes — the counter becomes a server-derived value on each response</li>
            </ul>
          </div>
        </div>

        <div className="p-5 rounded-lg border bg-card space-y-4">
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
          <Link href="/actions/progressive" className="inline-block text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors">
            How this action behaves across the JS boundary →
          </Link>
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
      
        <ActionsContent />
      
    </div>
  )
}
