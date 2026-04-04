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
        <p className="text-xs px-3 py-2 rounded-md border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>App Router note:</strong> App Router normally turns redirects into soft navigations — but only when
          a Server Action calls{" "}
          <code className="bg-amber-500/10 px-1 rounded">redirect()</code>. The POST demo uses a plain HTML form
          posting to a Route Handler that returns a real HTTP 303, so the Next.js client router is never involved.
          Both the POST and the redirect that follows it are genuine hard navigations.
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

      {/* Hard navigation */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">These Are Genuine Hard Navigations</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Both demos on this page produce <strong>real full-page reloads</strong> — not the soft, JS-intercepted
          navigations you get from Next.js{" "}
          <code className="bg-muted px-1 py-0.5 rounded">{"<Link>"}</code>. When a native{" "}
          <code className="bg-muted px-1 py-0.5 rounded">{"<form>"}</code> is submitted, the browser constructs and
          sends an HTTP request entirely on its own, before any JavaScript has a chance to intercept. Next.js's client
          router is bypassed completely. React re-initialises from scratch when the response arrives.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The POST demo involves <em>two</em> consecutive hard navigations: the POST itself, then the browser following
          the 303 redirect with a GET. Both happen at the HTTP level — the Next.js router is not involved in either.
        </p>
        <div className="pt-1 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            What triggers a hard navigation in Next.js
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">{"<form method=\"GET/POST\">"}</code> — browser-native,
              router never gets a chance to intercept
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">{"<a href>"}</code> (plain anchor, not{" "}
              <code className="bg-muted px-1 py-0.5 rounded">{"<Link>"}</code>) — no Next.js listener registered
            </li>
            <li>HTTP 3xx redirect — processed at HTTP level before page JS exists</li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">window.location.href = "..."</code> — explicitly bypasses
              the router
            </li>
            <li>First load / direct URL entry — always hard, React isn't loaded yet</li>
          </ul>
        </div>
      </div>

      {/* Next.js as the modern PHP */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">Next.js App Router as the Modern PHP</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The browser behavior in these demos is identical to what it would do against an Apache + PHP server in 1999.
          What changed is only the server side:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Historical (PHP)</p>
            <pre className="text-xs text-foreground bg-muted rounded p-3 overflow-x-auto">{`Browser → Apache
  → PHP reads $_GET["q"]
  → echoes HTML string
→ Browser renders`}</pre>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Today (Next.js App Router)
            </p>
            <pre className="text-xs text-foreground bg-muted rounded p-3 overflow-x-auto">{`Browser → Node.js
  → Server Component awaits searchParams
  → React renders to HTML stream
→ Browser renders`}</pre>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The browser has no idea which server it's talking to. The HTTP contract — GET with query params, POST with
          body — hasn't changed in 25 years. Server Components are doing the same job PHP did: run on the server,
          read the request, return markup. The difference is a better component model, TypeScript, async/await, and
          streaming instead of a blocking{" "}
          <code className="bg-muted px-1 py-0.5 rounded">echo</code>.
        </p>
      </div>

      {/* Pages Router difference */}
      <div className="p-6 rounded-lg border bg-card space-y-4">
        <h3 className="font-semibold text-foreground">Hard vs. Soft Navigation — App Router and Pages Router</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Every hard navigation trigger works identically in both routers — the browser doesn't know or care which
          Next.js router is in use. Soft navigation is where they diverge.
        </p>

        {/* Hard nav table */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Hard navigation — same in both routers
          </p>
          <div className="rounded-lg border overflow-hidden text-xs">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left px-3 py-2 font-semibold text-foreground">Trigger</th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">Who drives it</th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">Why it's hard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="px-3 py-2"><code className="bg-muted px-1 py-0.5 rounded">{"<form method=\"GET/POST\">"}</code></td>
                  <td className="px-3 py-2">Browser</td>
                  <td className="px-3 py-2">Browser-native — JS router never gets a chance to intercept</td>
                </tr>
                <tr>
                  <td className="px-3 py-2"><code className="bg-muted px-1 py-0.5 rounded">{"<a href>"}</code> (plain anchor)</td>
                  <td className="px-3 py-2">Browser</td>
                  <td className="px-3 py-2">No Next.js click listener registered on a plain anchor</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">HTTP 3xx redirect</td>
                  <td className="px-3 py-2">Browser</td>
                  <td className="px-3 py-2">Processed at HTTP level before page JS exists</td>
                </tr>
                <tr>
                  <td className="px-3 py-2"><code className="bg-muted px-1 py-0.5 rounded">window.location.href = "..."</code></td>
                  <td className="px-3 py-2">JS</td>
                  <td className="px-3 py-2">Explicitly bypasses the router</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">First load / direct URL entry</td>
                  <td className="px-3 py-2">Browser</td>
                  <td className="px-3 py-2">Always hard — React isn't loaded yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Soft nav table */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Soft navigation — mechanism differs between routers
          </p>
          <div className="rounded-lg border overflow-hidden text-xs">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left px-3 py-2 font-semibold text-foreground">Trigger</th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">App Router</th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">Pages Router</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="px-3 py-2"><code className="bg-muted px-1 py-0.5 rounded">{"<Link>"}</code></td>
                  <td className="px-3 py-2">Fetches RSC payload — pre-rendered server component output</td>
                  <td className="px-3 py-2">Fetches JSON props — client component re-renders with new data</td>
                </tr>
                <tr>
                  <td className="px-3 py-2"><code className="bg-muted px-1 py-0.5 rounded">router.push()</code></td>
                  <td className="px-3 py-2">Same as <code className="bg-muted px-1 py-0.5 rounded">{"<Link>"}</code>, imperative</td>
                  <td className="px-3 py-2">Same as <code className="bg-muted px-1 py-0.5 rounded">{"<Link>"}</code>, imperative</td>
                </tr>
                <tr>
                  <td className="px-3 py-2"><code className="bg-muted px-1 py-0.5 rounded">router.refresh()</code></td>
                  <td className="px-3 py-2">Re-fetches Server Components for current route — URL unchanged, no page reload</td>
                  <td className="px-3 py-2 text-destructive/70">Does not exist</td>
                </tr>
                <tr className="bg-amber-500/5">
                  <td className="px-3 py-2 font-medium text-foreground">Redirect after mutation</td>
                  <td className="px-3 py-2">
                    Server Action <code className="bg-muted px-1 py-0.5 rounded">redirect()</code> →{" "}
                    <strong className="text-foreground">soft</strong> — client router handles it in JS, no page flash
                  </td>
                  <td className="px-3 py-2">
                    <code className="bg-muted px-1 py-0.5 rounded">getServerSideProps</code>{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">redirect()</code> →{" "}
                    <strong className="text-foreground">hard</strong> — real HTTP 302, browser follows it
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The highlighted row is the key difference. Pages Router was closer to native PRG by default — a server-side
            redirect produced a genuine HTTP redirect. App Router deliberately moved this to a soft navigation with
            Server Actions: better UX (no flash, state preserved), but no longer a true HTTP redirect. The native POST
            demo on this page behaves like Pages Router used to — two hard navigations, no JS involved.
          </p>
        </div>
      </div>
    </div>
  )
}
