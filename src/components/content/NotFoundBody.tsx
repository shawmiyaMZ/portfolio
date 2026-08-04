import { Button } from "@/components/ui/Button";

/**
 * The 404 copy and layout, shared by both not-found routes.
 *
 * There are two of them because this app has two root layouts —
 * `(site)` and `(studio)` — so Next has no single layout from which to
 * compose a global 404. `(site)/not-found.tsx` catches `notFound()` from a
 * missing post or project and inherits the site chrome; `global-not-found.tsx`
 * catches URLs that match no route at all and has to supply its own document.
 * Keeping the body here means the two can never drift apart.
 */
export function NotFoundBody() {
  return (
    <div className="u-wrap relative z-10">
      <span className="u-eyebrow block mb-4" style={{ color: "var(--ink-technical)" }}>
        404
      </span>

      <h1 className="u-h1 max-w-(--measure-title)">
        There is nothing at this address
      </h1>

      <p
        className="mt-6 text-(length:--text-prose)/[1.7]"
        style={{ maxWidth: "var(--measure-default)", color: "var(--ink-secondary)" }}
      >
        Either the page moved, or the link that sent you here was wrong. Both
        are worth knowing about — the work and the writing are still where you
        would expect.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button href="/" magnetic>
          Back to the start
        </Button>
        <Button href="/work" variant="ghost">
          Selected work
        </Button>
        <Button href="/journal" variant="ghost">
          Journal
        </Button>
      </div>
    </div>
  );
}
