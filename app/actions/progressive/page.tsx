import Link from "next/link"

export default function ProgressiveEnhancementPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        <Link href="/actions" className="text-sm text-muted-foreground hover:underline">
          ← Back to Actions Pattern
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Actions Across the JS Boundary</h1>
          <p className="text-muted-foreground">How the same server action behaves with and without JavaScript</p>
        </div>

        {/* 2x2 model */}
        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">The 2×2 Mental Model</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When a form POSTs data, two independent questions determine which pattern applies:
            does it require JavaScript to work, and does it land on the same page or navigate elsewhere?
            Those two axes produce four cells.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border bg-muted/50 font-medium"></th>
                  <th className="text-left p-3 border bg-muted/50 font-medium">Same page after submit</th>
                  <th className="text-left p-3 border bg-muted/50 font-medium">Different page after submit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border font-medium bg-muted/20">A. No JS</td>
                  <td className="p-3 border text-muted-foreground">
                    <span className="font-mono text-xs font-semibold text-foreground">A1</span><br />
                    POST → server validates → re-render same page with error (200),
                    or on success → 303 redirect back to same URL (PRG)
                  </td>
                  <td className="p-3 border text-muted-foreground">
                    <span className="font-mono text-xs font-semibold text-foreground">A2</span><br />
                    POST → server validates → 303 redirect to a different URL.
                    Classic login: <code className="bg-muted px-1 rounded text-xs">POST /login → 303 → GET /dashboard</code>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border font-medium bg-muted/20">B. JS-enhanced</td>
                  <td className="p-3 border text-muted-foreground">
                    <span className="font-mono text-xs font-semibold text-foreground">B1</span><br />
                    React intercepts the submit. Action returns new state.
                    Component re-renders in place. No navigation. This is what
                    <code className="bg-muted px-1 rounded text-xs mx-1">useActionState</code> does.
                  </td>
                  <td className="p-3 border text-muted-foreground">
                    <span className="font-mono text-xs font-semibold text-foreground">B2</span><br />
                    Action calls <code className="bg-muted px-1 rounded text-xs">redirect()</code>.
                    React/Next.js converts this into a soft client-side navigation —
                    no full page reload, but you end up on a different route.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            Note: GET requests with search params are a separate axis entirely — they almost always
            stay on the same page and are about reading, not mutating. This model covers POST only.
          </p>
        </div>

        {/* How no-JS mechanically works */}
        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">How the No-JS Path Works Mechanically</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When Next.js renders a page containing <code className="bg-muted px-1 rounded">useActionState</code>,
            it bakes two things into the HTML output even before any JavaScript runs:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 ml-4">
            <li>• The <code className="bg-muted px-1 rounded">{"<form action=\"/actions\">"}</code> attribute — the permalink passed as the third argument to <code className="bg-muted px-1 rounded">useActionState</code></li>
            <li>• A hidden input: <code className="bg-muted px-1 rounded">{"<input type=\"hidden\" name=\"$ACTION_ID_abc123\" />"}</code> — encodes which server action this form is bound to</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When the browser submits without JS, the POST body contains the form fields <em>plus</em> that
            hidden <code className="bg-muted px-1 rounded">$ACTION_ID</code> field. Next.js reads it on the server,
            looks up the corresponding action function, and runs it.
          </p>

          <div className="rounded-lg bg-muted/40 border p-4 text-xs space-y-2 font-mono text-foreground leading-relaxed">
            <p className="font-sans font-medium text-sm text-foreground mb-3">The no-JS submit cycle, step by step:</p>
            <p>1. Browser POSTs to /actions</p>
            <p>2. Next.js reads $ACTION_ID → identifies addTodoAction</p>
            <p>3. Runs addTodoAction(initialState, formData)</p>
            <p>4. Action returns {"{ error: \"Server rejected this todo\" }"}</p>
            <p className="text-muted-foreground">   ↑ plain JS object, still on the server</p>
            <p>5. Next.js re-renders the component tree server-side,</p>
            <p>   injecting that object as the current useActionState value</p>
            <p>6. TodoForm renders: state.error → {"<p>Server rejected this todo</p>"}</p>
            <p>7. Next.js sends the finished HTML as the POST response body (200)</p>
            <p>8. Browser paints it — error is already in the HTML</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            The error never travelled through a URL or cookie. It moved from the action's return value
            directly into the render as a plain in-memory JavaScript object passed between two function
            calls on the server — in the same request handling cycle. This is the same thing PHP did in 1998,
            just through a modern component-based mechanism.
          </p>
        </div>

        {/* PRG rules */}
        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">When PRG Is Needed (and When It Isn't)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Post/Redirect/Get exists to solve one specific problem: if the browser's last request was a POST,
            refreshing replays that POST byte-for-byte — including the FormData. The browser warns the user
            first ("Resubmit?"), but many users click through. PRG replaces the POST in browser history
            with a GET, making refresh safe.
          </p>

          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 space-y-2">
              <p className="font-medium text-foreground">Success path — PRG needed</p>
              <p className="text-muted-foreground text-xs">
                A successful POST mutated real data. If the browser replays it on refresh, the mutation
                happens twice. The fix: call <code className="bg-muted px-1 rounded">redirect("/actions")</code>
                on success. Next.js sends a 303. Browser's last request becomes a GET. Refresh is safe.
              </p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 space-y-2">
              <p className="font-medium text-foreground">Error path — PRG not needed</p>
              <p className="text-muted-foreground text-xs">
                A failed validation POST wrote nothing. If the browser replays it on refresh, the user
                just gets the same error again. Harmless. And a redirect on error would destroy the error
                message — you'd need URL params or a flash cookie to carry it across, for zero benefit.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 border p-4 text-xs space-y-1 font-mono text-foreground">
            <p className="font-sans font-medium text-sm text-foreground mb-3">The rule in code:</p>
            <p>{"if (!todo?.trim()) {"}</p>
            <p>{"  return { error: \"Cannot be empty\" }  // no redirect"}</p>
            <p>{"}"}</p>
            <p className="mt-2">{"addActionTodo(todo)        // mutation happened"}</p>
            <p>{"revalidatePath(\"/actions\")"}</p>
            <p>{"redirect(\"/actions\")       // PRG: 303 clears POST from history"}</p>
          </div>
        </div>

        {/* One redirect, two behaviours */}
        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">One <code className="bg-muted px-1 rounded text-base">redirect()</code>, Two Behaviours</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The same <code className="bg-muted px-1 rounded">redirect("/actions")</code> call in the server action
            does different things depending on whether JavaScript is active — and you write no conditional code
            to make that happen.
          </p>

          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium text-foreground">Without JS (A path)</p>
              <p className="text-muted-foreground text-xs">
                Next.js sends a real <strong>303 See Other</strong> HTTP response to the browser.
                The browser follows it as a full hard navigation — a brand new GET request.
                PRG is complete. Refresh is safe.
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium text-foreground">With JS (B path)</p>
              <p className="text-muted-foreground text-xs">
                React intercepted the form submit as a fetch. When the server calls
                <code className="bg-muted px-1 rounded mx-1">redirect()</code>, Next.js sends a
                special JSON signal instead of a real 303. The React/Next.js client receives it
                and calls <code className="bg-muted px-1 rounded">router.push()</code> — a soft
                client-side navigation with no full page reload.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            This is what progressive enhancement means in the Actions model: one server action, one
            <code className="bg-muted px-1 rounded mx-1">redirect()</code> call, and the framework
            adapts the delivery to whatever the browser supports.
          </p>
        </div>

        {/* Current state of this project */}
        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-sm space-y-2">
          <p className="font-semibold text-amber-700 dark:text-amber-300">Current state of this demo</p>
          <p className="text-muted-foreground leading-relaxed">
            The <Link href="/actions" className="underline underline-offset-4">/actions</Link> page
            does not currently call <code className="bg-muted px-1 rounded">redirect()</code> on a
            successful add. That means the no-JS success path (A1) has the double-submit risk described
            above. The error path works correctly — validation failure returns an error object, Next.js
            re-renders inline, browser gets a 200 with the error in the HTML. The JS-enhanced path (B1)
            is unaffected since React never leaves a POST in browser history.
          </p>
        </div>

        <div className="flex gap-3 pt-8 border-t justify-between">
          <Link href="/actions" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            ← Actions Pattern
          </Link>
          <Link href="/" className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            Home
          </Link>
        </div>

      </div>
    </div>
  )
}
