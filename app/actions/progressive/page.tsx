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

        {/* Foundation insight */}
        <div className="p-5 rounded-lg border border-sky-500/30 bg-sky-500/5 space-y-4">
          <h2 className="font-semibold text-sky-700 dark:text-sky-300">The insight that makes everything else click</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In a classic Express/REST setup, a form POST hits an <strong>API endpoint</strong> — a separate handler
            that returns data. A different request then loads the page UI. The action and the page are two distinct things.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Next.js Server Actions work differently. There is <strong>no API endpoint</strong>. The server action
            function has no URL of its own — it cannot be curled or hit directly. Instead, the POST goes to the
            <strong> page route</strong> (e.g. <code className="bg-sky-500/10 px-1 rounded">/actions</code>), and
            Next.js decides what to do based on a hidden <code className="bg-sky-500/10 px-1 rounded">$ACTION_ID</code> field
            baked into the form HTML:
          </p>
          <div className="rounded-lg bg-muted/40 border p-4 text-xs font-mono text-foreground space-y-1">
            <p>GET  /actions          → render the page normally</p>
            <p>POST /actions          → read $ACTION_ID from body:</p>
            <p className="pl-4">→ run the mapped action function</p>
            <p className="pl-4">→ then render the page with the result injected</p>
            <p className="pl-4 text-muted-foreground">   (or redirect, if the action calls redirect())</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The route is both the <strong>action handler</strong> and the <strong>renderer</strong> — one pipeline,
            not two. This is what makes the no-JS error path possible in a single round trip: the POST arrives,
            the action runs, the page renders with the error baked in, and the full HTML goes back as the response
            to that same POST. From the browser's perspective it just got a page back from a POST — which looks
            strange through an Express lens, but is exactly how this model is designed to work.
          </p>
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
            looks up the corresponding action function, and runs it. What happens next depends entirely on
            whether validation passes or fails — and the two paths are mechanically opposite.
          </p>

          {/* Error path */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Error path — one round trip</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The response the browser receives is the reply to the original POST itself — not a redirect to
              the page route. Next.js runs the action, gets the error object back, immediately re-renders the
              component tree on the server with that error injected, and sends the resulting HTML as the POST
              response body. The browser never makes a second request. There is no gap between the action
              returning and the render seeing the value — they happen in the same request handler, the error
              object just passes from one function call to the next in memory.
            </p>
            <div className="rounded-lg bg-muted/40 border p-4 text-xs font-mono text-foreground leading-relaxed space-y-1">
              <p>Browser: POST /actions (todo=error)</p>
              <p className="pl-4 text-muted-foreground">↓ Next.js handles POST</p>
              <p className="pl-4">addTodoAction() → returns {"{ error: \"Server rejected\" }"}</p>
              <p className="pl-4 text-muted-foreground">↓ same request, no gap</p>
              <p className="pl-4">Next.js re-renders page with error injected into useActionState</p>
              <p className="pl-4 text-muted-foreground">↓</p>
              <p>Browser: receives 200 HTML — error is already baked in</p>
            </div>
          </div>

          {/* Success path */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Success path — two round trips</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The action mutates the store, calls <code className="bg-muted px-1 rounded">revalidatePath</code>,
              then <code className="bg-muted px-1 rounded">redirect()</code> throws — ending the action without
              returning a value. Next.js sends a 303 to the browser. The browser follows it with a brand new
              GET request to <code className="bg-muted px-1 rounded">/actions</code>. That GET renders the page
              fresh from the server — the updated list comes from the store, not from any carried-over state.
              The POST response and the page HTML come from two completely separate requests.
            </p>
            <div className="rounded-lg bg-muted/40 border p-4 text-xs font-mono text-foreground leading-relaxed space-y-1">
              <p>Browser: POST /actions (todo=Buy milk)</p>
              <p className="pl-4 text-muted-foreground">↓ Next.js handles POST</p>
              <p className="pl-4">addTodoAction() → mutates store → revalidatePath → redirect throws</p>
              <p className="pl-4 text-muted-foreground">↓</p>
              <p>Browser: receives 303 → initiates GET /actions</p>
              <p className="pl-4 text-muted-foreground">↓ Next.js handles GET — fresh render, no action state</p>
              <p>Browser: receives 200 HTML — list includes new item from store</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            This is why the error path does not need PRG — there was only one request, nothing to protect
            against replaying. And it is why the error message needs no URL param or cookie — it never left
            the server. The same mechanism is what PHP did in 1998: validate, and if invalid, echo the form
            back with the error inline. Next.js just wires it through a component tree instead of a flat script.
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

        {/* redirect vs success state */}
        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">The Redirect–Success State Trade-off</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Once you know that <code className="bg-muted px-1 rounded">redirect()</code> throws rather than returns,
            a natural question follows: can the action still signal explicit success back to the form? The short answer is no — and the reason is mechanical, not a framework limitation.
          </p>

          <div className="rounded-lg bg-muted/40 border p-4 text-xs font-mono text-foreground space-y-1">
            <p className="font-sans text-sm font-medium text-foreground mb-2">Why redirect() blocks success state:</p>
            <p>{`addTodoAction() calls redirect("/actions")`}</p>
            <p className="text-muted-foreground pl-4">↓ redirect() throws internally</p>
            <p className="text-muted-foreground pl-4">↓ action never reaches a return statement</p>
            <p className="text-muted-foreground pl-4">↓ useActionState receives no new value</p>
            <p className="text-muted-foreground pl-4">↓ state stays unchanged — not reset, just never updated</p>
            <p>{`// state.success can never be set`}</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            This holds in <strong>both</strong> the A (no-JS) and B (JS-enhanced) paths. In the JS path, soft navigation
            means the component is not remounted — React reconciles the tree. But that does not help: the
            component survived the navigation with its old state intact, because <code className="bg-muted px-1 rounded">useActionState</code> never
            received a return value to update from. Surviving a navigation is not the same as receiving new state.
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            The full hook landscape confirms this is not a gap in one hook:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• <code className="bg-muted px-1 rounded">useActionState</code> — <code className="bg-muted px-1 rounded">state</code> is the action's return value. No return = no update.</li>
            <li>• <code className="bg-muted px-1 rounded">useFormStatus</code> — surfaces <code className="bg-muted px-1 rounded">pending</code> and submitted <code className="bg-muted px-1 rounded">data</code> while the action is in flight. Cleared on navigation.</li>
            <li>• <code className="bg-muted px-1 rounded">useOptimistic</code> — optimistic UI during the action. Also tied to the action lifecycle, reset when it ends.</li>
          </ul>
          <p className="text-sm text-muted-foreground">None of these hooks have a post-redirect channel. The binary is genuine:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border bg-muted/50 font-medium">Approach</th>
                  <th className="text-left p-3 border bg-muted/50 font-medium">Explicit success message</th>
                  <th className="text-left p-3 border bg-muted/50 font-medium">PRG (no double-submit)</th>
                  <th className="text-left p-3 border bg-muted/50 font-medium">No-JS safe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border font-mono">redirect() on success</td>
                  <td className="p-3 border text-red-500">✗</td>
                  <td className="p-3 border text-green-600">✓</td>
                  <td className="p-3 border text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="p-3 border font-mono">{`return { success: true }`}</td>
                  <td className="p-3 border text-green-600">✓</td>
                  <td className="p-3 border text-red-500">✗</td>
                  <td className="p-3 border text-amber-600">⚠ refresh resubmits</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Workarounds exist (flash cookie, <code className="bg-muted px-1 rounded">?added=1</code> URL param) but they are not hook-native — they require reading
            server-set state on the subsequent GET. The current <Link href="/actions" className="underline underline-offset-4">/actions</Link> demo
            uses <code className="bg-muted px-1 rounded">redirect()</code>, so success is inferred from the list updating rather than shown explicitly.
            For a JS-only audience the <code className="bg-muted px-1 rounded">return {`{ success: true }`}</code> approach is the cleaner teaching choice.
          </p>
        </div>

        {/* useActionState without a server action */}
        <div className="p-5 rounded-lg border bg-card space-y-4">
          <h2 className="font-semibold">useActionState Without a Server Action</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <code className="bg-muted px-1 rounded">useActionState</code> accepts <strong>any async function</strong> —
            the function does not need <code className="bg-muted px-1 rounded">{"\"use server\""}</code>. You can wire it to
            a plain client-side async function and still get most of the ergonomics.
          </p>

          <div className="rounded-lg bg-muted/40 border p-4 text-xs font-mono text-foreground space-y-1">
            <p className="font-sans text-sm font-medium text-foreground mb-2">Client-only action — no "use server":</p>
            <p>{`const clientAction = async (prev, formData) => {`}</p>
            <p className="pl-4">{`const todo = formData.get("todo")`}</p>
            <p className="pl-4">{`if (!todo?.trim()) return { error: "Cannot be empty" }`}</p>
            <p className="pl-4">{`await fetch("/api/todos", { method: "POST", body: formData })`}</p>
            <p className="pl-4">{`return { error: null }`}</p>
            <p>{`}`}</p>
            <p className="mt-2 text-muted-foreground">{`// No permalink — third arg omitted`}</p>
            <p>{`const [state, formAction] = useActionState(clientAction, { error: null })`}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 space-y-2">
              <p className="font-medium text-foreground">Still preserved</p>
              <ul className="text-muted-foreground text-xs space-y-1">
                <li>• <strong>No race conditions</strong> — React serializes concurrent submits regardless of whether the action hits a server. This is a React scheduler guarantee, not a server feature.</li>
                <li>• <strong>Declarative pending state</strong> — <code className="bg-muted px-1 rounded">useFormStatus</code> still works inside the form tree.</li>
                <li>• <strong>State-as-return-value</strong> — error rendering and state threading work identically.</li>
                <li>• No manual <code className="bg-muted px-1 rounded">e.preventDefault()</code> needed.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 space-y-2">
              <p className="font-medium text-foreground">Lost entirely</p>
              <ul className="text-muted-foreground text-xs space-y-1">
                <li>• <strong>Progressive enhancement</strong> — no permalink, no server handler at the POST URL. The form is dead without JS. No A-path exists.</li>
                <li>• <strong>revalidatePath / cache invalidation</strong> — client actions cannot call these. You need a manual <code className="bg-muted px-1 rounded">router.refresh()</code> or equivalent.</li>
                <li>• <strong>Server-side validation</strong> — validation logic ships to the client and is visible to anyone.</li>
                <li>• <strong>Direct server mutation</strong> — you need to go through a fetch to an API route instead of calling the function directly.</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            This pattern makes sense for forms where the data never leaves the client — search filters, multi-step
            wizards, local state machines. You get the <code className="bg-muted px-1 rounded">useActionState</code> ergonomics
            (queuing, pending, state-as-return-value) without the server overhead, and you are not pretending the form
            works without JS because it was never designed to.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The progressive enhancement story in the cells above is specifically the
            <code className="bg-muted px-1 rounded mx-1">{"\"use server\""}</code> + permalink combination.
            Lose the server action, lose that story — but the concurrency model stays intact.
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
