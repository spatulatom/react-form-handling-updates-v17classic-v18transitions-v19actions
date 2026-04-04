import Link from "next/link"

export default function NativeLandingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Intro */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">The Web Before JavaScript</h2>
        <p className="text-muted-foreground leading-relaxed">
          Before JavaScript took over the browser, the only way to send data from a web page to a server was through a
          native HTML <code className="bg-muted px-1.5 py-0.5 rounded text-sm">&lt;form&gt;</code> element. No{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">fetch()</code>, no{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">XMLHttpRequest</code>, no event handlers — just a{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">method</code> attribute and an{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">action</code> attribute on a{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">&lt;form&gt;</code> tag.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          When the user hit submit, the <strong>browser itself</strong> serialised the form fields, constructed the
          request, navigated to the new URL, and rendered whatever the server sent back. The entire experience was a
          series of full-page server round-trips. This wasn't a limitation to work around — it was the intended model.
        </p>
      </div>

      {/* Two form archetypes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/native/get"
          className="block p-6 rounded-lg border-2 border-blue-500/30 bg-card hover:border-blue-500 transition-colors"
        >
          <h3 className="font-semibold text-lg text-blue-600">GET Form — Query String</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            <code className="bg-muted px-1 py-0.5 rounded">method="GET"</code> serialises each input as a{" "}
            <code className="bg-muted px-1 py-0.5 rounded">?key=value</code> query parameter and appends it to the
            action URL. The browser then navigates to that URL.
          </p>
          <ul className="text-xs text-muted-foreground mt-3 space-y-1">
            <li>✓ Result URL is bookmarkable and shareable</li>
            <li>✓ Browser back/forward works naturally</li>
            <li>✓ Idempotent — safe to refresh</li>
            <li>→ Used for search, filter, and read operations</li>
          </ul>
        </Link>

        <Link
          href="/native/post"
          className="block p-6 rounded-lg border-2 border-orange-500/30 bg-card hover:border-orange-500 transition-colors"
        >
          <h3 className="font-semibold text-lg text-orange-600">POST Form — PRG Pattern</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            <code className="bg-muted px-1 py-0.5 rounded">method="POST"</code> sends the form data in the{" "}
            <strong>request body</strong>, not the URL. The server processes the mutation and responds with a{" "}
            <strong>303 redirect</strong> back to a GET page.
          </p>
          <ul className="text-xs text-muted-foreground mt-3 space-y-1">
            <li>✓ Data not exposed in the URL</li>
            <li>✓ PRG prevents double-submit on refresh</li>
            <li>✓ Appropriate for mutations (create, delete)</li>
            <li>→ Used for forms that change server state</li>
          </ul>
        </Link>
      </div>

      {/* PRG explanation */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">The PRG Pattern (Post / Redirect / Get)</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          After a successful POST, a naïve server that responds with HTML directly leaves the browser in a state where
          pressing Refresh would re-send the POST — potentially duplicating the mutation. The standard solution, widely
          adopted before any JavaScript frameworks existed, is the{" "}
          <strong>Post / Redirect / Get</strong> pattern:
        </p>
        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
          <li>Browser sends <code className="bg-muted px-1 py-0.5 rounded">POST /api/resource</code></li>
          <li>
            Server mutates data, then responds with{" "}
            <code className="bg-muted px-1 py-0.5 rounded">303 See Other → /resource</code>
          </li>
          <li>
            Browser follows the redirect with a <code className="bg-muted px-1 py-0.5 rounded">GET</code> — the last
            request in the history is now a GET
          </li>
          <li>Refresh replays the harmless GET, not the POST</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          A <strong>303</strong> (not 307) is required here because 307 would preserve the POST method on redirect —
          exactly what we want to avoid.
        </p>
      </div>

      {/* Full-circle callout */}
      <div className="p-6 rounded-lg border border-green-500/30 bg-green-500/5 space-y-2">
        <h3 className="font-semibold text-green-600">Full Circle: React 19 Server Actions</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          React 19's Server Actions restore exactly this model. A{" "}
          <code className="bg-muted px-1 py-0.5 rounded">{"<form action={serverFn}>"}</code> with{" "}
          <code className="bg-muted px-1 py-0.5 rounded">useActionState</code> works without JavaScript — the browser
          falls back to a native POST to the server. The decade of JavaScript frameworks in between was the detour;
          this is where we started and, in many ways, where we've returned.
        </p>
      </div>
    </div>
  )
}
