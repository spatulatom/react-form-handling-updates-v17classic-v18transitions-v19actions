import { Suspense } from "react"
import { getItems } from "@/lib/native-store"

async function PostContent({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  const { added } = await searchParams
  const items = getItems()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Explanation */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">POST Form — PRG Pattern in Action</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This form has <code className="bg-muted px-1.5 py-0.5 rounded">method="POST"</code> and{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded">action="/api/native-post"</code>. When you submit it, the
          browser sends the data in the <strong>request body</strong> — not the URL. The server adds the item, then
          responds with a <code className="bg-muted px-1.5 py-0.5 rounded">303 redirect</code> back to this page. The
          browser follows with a GET, so pressing Refresh will never re-submit the form.
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Submit an item — watch it appear in the list below</li>
          <li>• Press Refresh after submitting — the item is NOT re-added (PRG working)</li>
          <li>• Look at the URL — the submitted value never appears there</li>
          <li>• Disable JavaScript in DevTools → everything still works</li>
        </ul>
      </div>

      {/* Hard nav callout */}
      <div className="px-4 py-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
        <p className="font-semibold">Hard navigation — even inside App Router</p>
        <p className="leading-relaxed">
          App Router normally converts redirects into{" "}
          <strong>soft navigations</strong> — but only when a{" "}
          <strong>Server Action</strong> calls{" "}
          <code className="bg-amber-500/10 px-1 py-0.5 rounded">redirect()</code>. Here there is no Server
          Action. The form posts directly to a Route Handler which returns an HTTP{" "}
          <code className="bg-amber-500/10 px-1 py-0.5 rounded">303</code>. The browser follows that
          at the HTTP level — the Next.js client router never gets involved. Result: two genuine full-page
          reloads, identical to what a PHP server would have produced in 1999.
        </p>
      </div>

      {/* Success banner — set by the redirect's ?added=1 */}
      {added === "1" && (
        <div className="px-4 py-3 rounded-lg border border-green-500/40 bg-green-500/10 text-sm text-green-700">
          ✓ Item added successfully. (This banner is rendered server-side from <code>?added=1</code> in the redirect
          URL — no client state involved.)
        </div>
      )}

      {/* The form */}
      <div className="p-6 rounded-lg border bg-card space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-orange-500/10 text-orange-600 px-2 py-1 rounded">method="POST"</span>
          <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
            action="/api/native-post"
          </span>
        </div>
        <form method="POST" action="/api/native-post" className="flex gap-2">
          <input
            type="text"
            name="item"
            placeholder="New item…"
            required
            className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      {/* Item list */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""} in the list</p>
        <ul className="divide-y divide-border rounded-lg border overflow-hidden">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3 bg-card text-sm text-foreground flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono w-6 shrink-0">#{item.id}</span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Code callout */}
      <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What the server does</p>
        <pre className="text-xs text-foreground overflow-x-auto">
          {`// Route Handler — POST /api/native-post
const data = await request.formData()
const text = data.get("item")
addItem(text)
// 303 forces browser to GET on redirect (not re-POST)
return NextResponse.redirect(new URL("/native/post?added=1", request.url), { status: 303 })`}
        </pre>
        <p className="text-xs text-muted-foreground">
          The <strong>303</strong> status is the key. A 307 would preserve the POST method on redirect — exactly what
          the PRG pattern is designed to prevent.
        </p>
      </div>
    </div>
  )
}

export default function NativePostPage({ searchParams }: { searchParams: Promise<{ added?: string }> }) {
  return (
    <Suspense fallback={<div className="text-muted-foreground text-sm">Loading…</div>}>
      <PostContent searchParams={searchParams} />
    </Suspense>
  )
}
