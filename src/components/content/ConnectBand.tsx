import { StudioField } from "@/components/field/StudioField";
import { Button } from "@/components/ui/Button";

/**
 * The closing bookend, and one of exactly two Graphite bands on the site.
 *
 * No contact form, no email address, no phone number. One link, one action.
 * A single well-made door is more convincing than five half-open ones.
 */
export function ConnectBand({ linkedinUrl }: { linkedinUrl?: string }) {
  return (
    <section id="connect" data-chapter="connect" className="u-band scroll-mt-24">
      <StudioField variant="inverted" />
      <div className="u-wrap relative z-10 py-[var(--space-2xl)]">
        <span className="u-eyebrow block mb-4">Connect</span>
        <h2 className="u-h2 max-w-(--measure-section)">
          If any of this is useful to you, I would like to hear about it
        </h2>
        <p
          className="mt-6 text-(length:--text-prose)/[1.7]"
          style={{
            maxWidth: "var(--measure-default)",
            color: "var(--ink-secondary-inverted)",
          }}
        >
          LinkedIn is the best place to reach me — about roles, collaboration,
          or something I have written that you disagree with.
        </p>

        {/* Without a LinkedIn URL this section would promise contact and then
            offer nothing — a dead end under a heading that says "I would like
            to hear about it". The fallback keeps the page honest and points
            at the one place that fixes it. */}
        <div className="mt-9">
          {linkedinUrl ? (
            <Button href={linkedinUrl} external magnetic>
              Connect on LinkedIn
            </Button>
          ) : (
            <Button href="/studio" variant="ghost">
              Add your LinkedIn in the Studio
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
