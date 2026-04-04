export default function RedirectPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Intro */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Redirects — A Complete History</h2>
        <p className="text-muted-foreground leading-relaxed">
          Redirects are one of the oldest mechanisms in the web. They predate JavaScript, predate PHP, predate
          React — they are part of the HTTP spec itself, present since HTTP/1.0 in 1996. Every technology stack you
          have ever used (Apache, WordPress, Next.js, Vercel) is ultimately just issuing HTTP responses with a 3xx
          status code and a <code className="bg-muted px-1.5 py-0.5 rounded text-sm">Location</code> header. The
          browser does the rest.
        </p>
      </div>

      {/* What is a redirect */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">What Actually Happens in a Redirect</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A redirect is just a server response with two things: a status code in the 300–399 range, and a{" "}
          <code className="bg-muted px-1 py-0.5 rounded">Location</code> header pointing to the new URL. That's it.
          The browser sees it, throws away the current request, and automatically starts a new request to the{" "}
          <code className="bg-muted px-1 py-0.5 rounded">Location</code> URL. No JavaScript involved. No permission
          asked of the user.
        </p>
        <pre className="text-xs text-foreground bg-muted rounded p-3 overflow-x-auto">{`HTTP/1.1 303 See Other
Location: /thank-you
Content-Length: 0

(browser immediately fires a new GET to /thank-you)`}</pre>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The browser's job after receiving a 3xx is to issue a second request. The interesting question — and the
          one that took years and multiple spec revisions to get right — is: <strong>what method should that second
          request use?</strong>
        </p>
      </div>

      {/* Method preserved explained */}
      <div className="p-6 rounded-lg border bg-card space-y-4">
        <h3 className="font-semibold text-foreground">What "Method Preserved" Actually Means</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Every redirect causes the browser to make a second HTTP request to a new URL. That second request needs a
          method. The redirect status code determines whether the browser <strong>reuses</strong> whatever method it
          used for the first request, or <strong>switches</strong> to GET.
        </p>
        <div className="space-y-3">
          <div className="p-4 rounded-md border border-blue-500/20 bg-blue-500/5 space-y-2">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Method NOT preserved (301, 302, 303)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Whatever method you used for the first request — GET, POST, PUT, anything — the second request (to the
              redirect destination) will always be a <strong>GET</strong>. The browser switches.
            </p>
            <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`1. Browser: POST /submit        (submitting a form)
2. Server:  302 → /thank-you   (redirect response)
3. Browser: GET  /thank-you    ← switched to GET automatically`}</pre>
          </div>
          <div className="p-4 rounded-md border border-orange-500/20 bg-orange-500/5 space-y-2">
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">Method preserved (307, 308)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The browser reuses the same method for the second request. If you POSTed, you'll POST again — to the
              new URL, with the same body. If you used PUT, you'll PUT again.
            </p>
            <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`1. Browser: POST /submit         (submitting a form)
2. Server:  307 → /new-submit   (redirect response)
3. Browser: POST /new-submit    ← kept POST, same body`}</pre>
            <p className="text-xs text-muted-foreground">
              The browser will show a confirmation dialog before re-sending a POST body — so in practice 307 is
              mainly used in APIs where the client is code (not a human clicking a form).
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong>Why does this matter for HTML forms?</strong> When a user submits a{" "}
          <code className="bg-muted px-1 py-0.5 rounded">method="POST"</code> form, you almost always want the
          redirect destination to load as a GET (so refreshing it doesn't resubmit). That's why the PRG pattern
          uses <strong>303</strong> — it guarantees a GET regardless of what the browser supports. 301 and 302 also
          switch to GET in practice, but their specs were ambiguous for decades and browser behaviour varied. 303 was
          added precisely to be unambiguous: always GET.
        </p>
      </div>

      {/* Status code table */}
      <div className="p-6 rounded-lg border bg-card space-y-4">
        <h3 className="font-semibold text-foreground">The Five Redirect Codes</h3>
        <div className="rounded-lg border overflow-hidden text-xs">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-3 py-2 font-semibold text-foreground w-12">Code</th>
                <th className="text-left px-3 py-2 font-semibold text-foreground">Name</th>
                <th className="text-left px-3 py-2 font-semibold text-foreground">Second request method</th>
                <th className="text-left px-3 py-2 font-semibold text-foreground">Permanent?</th>
                <th className="text-left px-3 py-2 font-semibold text-foreground">Typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="px-3 py-2 font-mono font-semibold text-foreground">301</td>
                <td className="px-3 py-2">Moved Permanently</td>
                <td className="px-3 py-2">Always GET <span className="text-muted-foreground/60">(historically unreliable, 303 is safer)</span></td>
                <td className="px-3 py-2">Yes — browser caches it</td>
                <td className="px-3 py-2">SEO: page moved forever, pass link equity to new URL</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono font-semibold text-foreground">302</td>
                <td className="px-3 py-2">Found (temporary)</td>
                <td className="px-3 py-2">Always GET <span className="text-muted-foreground/60">(historically unreliable)</span></td>
                <td className="px-3 py-2">No — not cached</td>
                <td className="px-3 py-2">"Under construction", login wall, temporary content move</td>
              </tr>
              <tr className="bg-amber-500/5">
                <td className="px-3 py-2 font-mono font-semibold text-foreground">303</td>
                <td className="px-3 py-2">See Other</td>
                <td className="px-3 py-2 font-medium text-foreground">Always GET — unambiguously</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">PRG pattern — the right code after a POST form submission</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono font-semibold text-foreground">307</td>
                <td className="px-3 py-2">Temporary Redirect</td>
                <td className="px-3 py-2 font-medium text-foreground">Same as first request</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">API: move an endpoint temporarily while keeping POST semantics</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono font-semibold text-foreground">308</td>
                <td className="px-3 py-2">Permanent Redirect</td>
                <td className="px-3 py-2 font-medium text-foreground">Same as first request</td>
                <td className="px-3 py-2">Yes — browser caches it</td>
                <td className="px-3 py-2">API: move an endpoint permanently while keeping POST semantics</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          301 and 302 were defined in HTTP/1.0 (1996). Their specs said browsers "may" change POST to GET — and most
          did, but not all. The ambiguity was so problematic in practice that HTTP/1.1 (1999) added 303 specifically
          to say "switch to GET, no ambiguity". Then 307 was added to fill the gap: "temporary, but I actually want
          you to keep the method". 308 arrived much later (2015) as the permanent version of 307.
        </p>
      </div>

      {/* Why GET forms don't need redirects */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">Why GET Forms Rarely Involve Redirects</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your instinct is correct. A <code className="bg-muted px-1 py-0.5 rounded">method="GET"</code> form
          serialises its fields into the URL as query parameters and navigates directly to that URL. There is no
          separate POST step, no mutation to worry about, no double-submit risk. The URL itself is the state.
        </p>
        <pre className="text-xs text-foreground bg-muted rounded p-3 overflow-x-auto">{`<form method="GET" action="/search">
  <input name="q" value="bread" />
</form>
→ Browser navigates to: /search?q=bread
→ Server reads ?q=bread, returns filtered HTML
→ Refresh is safe — it just re-fetches /search?q=bread`}</pre>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The redirect was invented because POST is stateful — it carries a body that could change server data. GET
          is stateless — the entire request is visible in the URL and idempotent by definition. No redirect needed;
          the URL can be bookmarked, shared, and refreshed freely.
        </p>
      </div>

      {/* Historical: Apache era */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">The Apache Era — .htaccess and PHP</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Before application frameworks, redirects were managed in two places: the web server config and the
          application code. Apache's{" "}
          <code className="bg-muted px-1 py-0.5 rounded">.htaccess</code> file handled the server level;
          PHP handled the application level.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">.htaccess (server level)</p>
            <pre className="text-xs text-foreground bg-muted rounded p-3 overflow-x-auto">{`# Permanent redirect — old page to new
Redirect 301 /old-page /new-page

# Whole site under construction
Redirect 302 / /coming-soon.html

# Regex rewrite (mod_rewrite)
RewriteRule ^product/([0-9]+)$
  /item.php?id=$1 [L,R=301]`}</pre>
            <p className="text-xs text-muted-foreground">
              Intercepted before PHP ran. No PHP process started. The old URL didn't need to exist as a file.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">PHP (application level)</p>
            <pre className="text-xs text-foreground bg-muted rounded p-3 overflow-x-auto">{`<?php
// PRG pattern in raw PHP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // process form...
  header('Location: /thank-you.php');
  header('HTTP/1.1 303 See Other');
  exit; // critical — stop PHP outputting HTML
}`}</pre>
            <p className="text-xs text-muted-foreground">
              The <code className="bg-muted px-1 py-0.5 rounded">exit</code> after{" "}
              <code className="bg-muted px-1 py-0.5 rounded">header()</code> is important — if PHP continued
              and output HTML, the browser might render it instead of following the redirect.
            </p>
          </div>
        </div>
      </div>

      {/* WordPress era */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">The WordPress Era — Two Levels of Redirect</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          WordPress kept both levels. The{" "}
          <code className="bg-muted px-1 py-0.5 rounded">.htaccess</code> file (or nginx equivalent) was still
          there — WordPress writes to it automatically when you change permalink settings. And then redirects could
          also be managed inside WordPress itself via plugins like Redirection or Rank Math.
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Server level (.htaccess / nginx)</p>
            <p>
              Intercepted before WordPress's PHP runs. Fastest possible. The old URL does not need to exist in
              WordPress at all — the server never hands the request to WordPress. Used for: site-wide redirects,
              domain migrations, HTTPS enforcement.
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Plugin level (Redirection, Rank Math, Yoast)</p>
            <p>
              WordPress boots, the plugin intercepts the request early via a hook, issues the redirect in PHP. Slower
              than .htaccess (PHP runs), but managed through the admin UI. Crucially: the old URL still doesn't need
              to exist as a real WordPress page. The plugin stores the redirect rules in the database and matches
              incoming URLs against them.
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Which to use, and when</p>
            <p>
              301 for any URL that has changed permanently and may have been indexed by Google or bookmarked. Always.
              Even if you're just redirecting to the home page — a dead URL should never return 404 if avoidable.
              302 for login walls, maintenance mode, anything temporary. Never 302 for permanent SEO moves — Google
              will not pass link equity through a 302.
            </p>
          </div>
        </div>
      </div>

      {/* Next.js levels */}
      <div className="p-6 rounded-lg border bg-card space-y-4">
        <h3 className="font-semibold text-foreground">Next.js — Redirects at Every Layer</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Next.js gives you six distinct places to redirect, from outermost (closest to the network) to innermost
          (inside your components). They are not all equal.
        </p>
        <div className="space-y-3">

          <div className="p-3 rounded-md border border-border space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded">1 — Hosting</span>
              <p className="font-medium text-foreground">Vercel / CDN / nginx (before Node.js)</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Equivalent to <code className="bg-muted px-1 rounded">.htaccess</code>. The redirect is served from
              the edge before your Node.js process is involved at all. Fastest. Configured in Vercel's dashboard or
              vercel.json. No Next.js code involved.
            </p>
          </div>

          <div className="p-3 rounded-md border border-border space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded">2 — next.config.js</span>
              <p className="font-medium text-foreground"><code className="bg-muted px-1 rounded">redirects()</code> array</p>
            </div>
            <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`// next.config.js
async redirects() {
  return [
    { source: '/old-page', destination: '/new-page', permanent: true },
    // permanent: true  → 308 (method-preserving permanent)
    // permanent: false → 307 (method-preserving temporary)
    // Note: Next.js uses 308/307, not 301/302, for its config redirects
  ]
}`}</pre>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Evaluated at request time before routing. Supports wildcards, regex, and{" "}
              <code className="bg-muted px-1 rounded">has</code> conditions (match on headers, cookies, query
              params). The old URL does not need to exist as a page. Real HTTP response — both routers.
            </p>
          </div>

          <div className="p-3 rounded-md border border-border space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded">3 — Middleware</span>
              <p className="font-medium text-foreground"><code className="bg-muted px-1 rounded">middleware.ts</code></p>
            </div>
            <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`// middleware.ts
export function middleware(request: NextRequest) {
  if (!isLoggedIn(request)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}`}</pre>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Runs on the Edge before any page or route handler. Full access to request headers, cookies, URL.
              Best for auth-gating, locale detection, A/B routing. Real HTTP redirect — both routers.
            </p>
          </div>

          <div className="p-3 rounded-md border border-border space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded">4 — Route Handler</span>
              <p className="font-medium text-foreground"><code className="bg-muted px-1 rounded">route.ts</code> (App Router only)</p>
            </div>
            <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`// app/api/native-post/route.ts  ← what the POST demo uses
export async function POST(request: Request) {
  addItem(text)
  return NextResponse.redirect(url, { status: 303 })
  // Real HTTP 303 — browser follows it natively
}`}</pre>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is exactly what the POST demo on this site does. Because a Route Handler returns a real HTTP
              response, the redirect is a genuine HTTP 303 — <strong>hard navigation</strong>, even in App Router.
            </p>
          </div>

          <div className="p-3 rounded-md border border-border space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded">5 — Server Component</span>
              <p className="font-medium text-foreground"><code className="bg-muted px-1 rounded">redirect()</code> in page.tsx</p>
            </div>
            <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`// app/dashboard/page.tsx
import { redirect } from 'next/navigation'
export default async function DashboardPage() {
  if (!session) redirect('/login')  // real HTTP 302
}`}</pre>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Called during server rendering — produces a real HTTP redirect. Both routers support this pattern
              (App Router via Server Components, Pages Router via{" "}
              <code className="bg-muted px-1 rounded">getServerSideProps</code> returning{" "}
              <code className="bg-muted px-1 rounded">{'{ redirect: { destination } }'}</code>).
            </p>
          </div>

          <div className="p-3 rounded-md border border-amber-500/30 bg-amber-500/5 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">6 — Server Action</span>
              <p className="font-medium text-foreground"><code className="bg-muted px-1 rounded">redirect()</code> inside an action — the special case</p>
            </div>
            <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`// app/actions/actions.ts
'use server'
export async function addTodo(formData: FormData) {
  await saveTodo(formData.get('text'))
  redirect('/todos')  // ← intercepted by client router!
}`}</pre>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This looks identical to level 5, but the outcome is different. When the client invokes a Server Action,
              it uses a special POST to{" "}
              <code className="bg-muted px-1 rounded">/_next/server-action</code>. The response comes back as an RSC
              payload, not a raw HTTP response. When <code className="bg-muted px-1 rounded">redirect()</code> is
              inside this payload, the <strong>client router intercepts it</strong> and performs a{" "}
              <strong>soft navigation</strong> — no page reload, no browser flash. This is the one uniquely App Router
              behaviour: a "redirect" that isn't a real HTTP redirect at all.
            </p>
          </div>

        </div>
      </div>

      {/* Browser security */}
      <div className="p-6 rounded-lg border bg-card space-y-3">
        <h3 className="font-semibold text-foreground">Can the Browser Refuse a Redirect? Is It Safe?</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <strong>No — the browser always follows HTTP redirects automatically.</strong> There is no prompt, no user
          confirmation, no opt-out in the HTTP spec. The browser sees a 3xx, reads the{" "}
          <code className="bg-muted px-1 py-0.5 rounded">Location</code> header, and issues a second request. The
          user typically doesn't notice — they just land on the final page.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The only limit is redirect loops: if A redirects to B and B redirects back to A, browsers stop after ~20
          hops and show a "too many redirects" error.
        </p>
        <div className="p-4 rounded-md border border-red-500/20 bg-red-500/5 space-y-2">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">Same-Origin Policy does NOT protect against redirects</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Same-Origin Policy restricts what JavaScript on one page can <em>read</em> from a different origin.
            It has nothing to do with where the browser navigates. A redirect can point to any URL, including a
            completely different domain, and the browser will follow it without hesitation.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is the basis of the <strong>open redirect</strong> vulnerability. If your server accepts a redirect
            destination from user input, an attacker can craft a URL that lands the user on a malicious page:
          </p>
          <pre className="text-xs text-foreground bg-muted rounded p-2 overflow-x-auto">{`# Attacker sends this link in an email:
https://yourbank.com/login?next=https://evil.com/fake-login

# Vulnerable server does:
header('Location: ' . $_GET['next']);   // ← never trust user input here

# Browser follows the redirect to evil.com
# User sees a convincing phishing page, trusts it because they came from yourbank.com`}</pre>
        </div>
        <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">How to defend against open redirects</p>
          <ul className="space-y-1">
            <li>• Only redirect to <strong>relative paths</strong> — <code className="bg-muted px-1 rounded">/thank-you</code>, never caller-supplied absolute URLs</li>
            <li>• If you must accept a <code className="bg-muted px-1 rounded">returnTo</code> parameter, validate it against an allowlist of your own origins</li>
            <li>• <code className="bg-muted px-1 rounded">next.config.js</code> redirects are safe — destinations are hardcoded in source</li>
            <li>• The POST demo is safe — destination is <code className="bg-muted px-1 rounded">new URL("/native/post?added=1", request.url)</code>, nothing from form input influences where you land</li>
          </ul>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-lg border border-purple-500/20 bg-purple-500/5 space-y-2">
        <h3 className="font-semibold text-purple-600">The Thread from 1996 to Today</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          HTTP's redirect codes were defined in 1996 and haven't fundamentally changed. Apache's{" "}
          <code className="bg-muted px-1 py-0.5 rounded">.htaccess</code> issued them, PHP issued them, WordPress
          plugins issue them, and Next.js issues them — all at different layers, but always the same HTTP mechanism.
          The only genuine novelty in modern frameworks is Server Action redirects in App Router, where the JS
          client intercepts the redirect signal before it ever becomes an HTTP response. Every other redirect layer
          — Vercel, <code className="bg-muted px-1 py-0.5 rounded">next.config.js</code>, Middleware, Route
          Handlers, Server Components — produces a real HTTP 3xx that any browser from 1998 would follow correctly.
        </p>
      </div>
    </div>
  )
}
