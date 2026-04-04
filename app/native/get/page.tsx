import { Suspense } from "react"

const ALL_ITEMS = [
  "Buy groceries",
  "Read a book",
  "Go for a walk",
  "Write in journal",
  "Call a friend",
  "Clean the desk",
  "Water the plants",
  "Plan next week",
]

async function GetContent({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""

  const filtered = query
    ? ALL_ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    : ALL_ITEMS

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Explanation */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">GET Form — Query String in Action</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This form has <code className="bg-muted px-1.5 py-0.5 rounded">method="GET"</code> and{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded">action="/native/get"</code>. When you submit it, the browser
          appends <code className="bg-muted px-1.5 py-0.5 rounded">?q=your+search</code> to the URL and navigates
          there — no JavaScript involved. This page is a Server Component that reads{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded">searchParams.q</code> on every request and filters the list.
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Try submitting — watch the URL bar change</li>
          <li>• Bookmark the result URL and reopen it — your filter is preserved</li>
          <li>• Press Refresh — the filter stays (query is in the URL, not POST body)</li>
          <li>• Disable JavaScript in DevTools → everything still works</li>
        </ul>
      </div>

      {/* The form — no JS at all */}
      <div className="p-6 rounded-lg border bg-card space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-blue-500/10 text-blue-600 px-2 py-1 rounded">method="GET"</span>
          <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
            action="/native/get"
          </span>
        </div>
        <form method="GET" action="/native/get" className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search items…"
            className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          {query && (
            <a
              href="/native/get"
              className="px-4 py-2 rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Clear
            </a>
          )}
        </form>
      </div>

      {/* Current URL callout */}
      {query && (
        <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5 text-sm">
          <span className="text-muted-foreground">Current URL: </span>
          <code className="text-blue-600">
            /native/get<strong>?q={encodeURIComponent(query)}</strong>
          </code>
          <p className="text-xs text-muted-foreground mt-1">
            The query string is part of the URL — shareable, bookmarkable, and replay-safe on refresh.
          </p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {query ? (
            <>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
              <strong className="text-foreground">"{query}"</strong>
            </>
          ) : (
            <>Showing all {ALL_ITEMS.length} items</>
          )}
        </p>
        {filtered.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border overflow-hidden">
            {filtered.map((item) => (
              <li key={item} className="px-4 py-3 bg-card text-sm text-foreground">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 rounded-lg border bg-card text-center text-sm text-muted-foreground">
            No items match your search.
          </div>
        )}
      </div>

      {/* Code callout */}
      <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What the server does</p>
        <pre className="text-xs text-foreground overflow-x-auto">
          {`// Server Component — runs on every request
const { q } = await searchParams   // Next.js 16: searchParams is a Promise
const filtered = q
  ? ALL_ITEMS.filter(item => item.toLowerCase().includes(q.toLowerCase()))
  : ALL_ITEMS`}
        </pre>
        <p className="text-xs text-muted-foreground">
          No database, no API call — just reading the URL and rendering HTML. The browser did all the work.
        </p>
      </div>
    </div>
  )
}

export default function NativeGetPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return (
    <Suspense fallback={<div className="text-muted-foreground text-sm">Loading…</div>}>
      <GetContent searchParams={searchParams} />
    </Suspense>
  )
}
