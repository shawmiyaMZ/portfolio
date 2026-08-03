import { ImageResponse } from "next/og";
import { getProfile } from "@/sanity/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shawmiya Zarook — Software Engineer";

/**
 * The site's default Open Graph card.
 *
 * Journal posts generate their own; every other route — the home page, Work,
 * a case study, Connect — had none at all, so sharing any of them produced a
 * bare link with no image. This is the fallback Next hands to all of them.
 *
 * Built from the design tokens rather than a screenshot, and deliberately
 * quieter than the per-post card: a name, a role, a thesis and the Madder
 * rule. A shared link should look like it came from this site.
 *
 * next/og runs with a tiny CSS subset — no custom properties, no clamp() —
 * so these are literals mirroring the tokens rather than references to them.
 */
export default async function OpengraphImage() {
  const profile = await getProfile();

  const name = profile?.name ?? "Shawmiya Zarook";
  const role = profile?.headline ?? "Software Engineering Intern";
  const thesis =
    profile?.thesis ??
    "I'm learning to build software where AI does real work, not demo work.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px 88px",
          /* Porcelain, with the same upper-left key light the site is lit by. */
          backgroundColor: "#f6f3ee",
          backgroundImage:
            "radial-gradient(1000px 620px at 12% 6%, #fdfbf8 0%, transparent 62%), radial-gradient(760px 520px at 88% 92%, #efeae1 0%, transparent 66%)",
        }}
      >
        {/* The chapter mark: Madder, the identity accent. */}
        <div
          style={{
            display: "flex",
            width: 64,
            height: 4,
            backgroundColor: "#b23a52",
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1.05,
            letterSpacing: "-0.028em",
            color: "#1a1917",
            fontWeight: 600,
          }}
        >
          {name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 25,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#3e5c76",
            marginTop: 22,
            fontWeight: 600,
          }}
        >
          {role}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            lineHeight: 1.42,
            color: "#6e6963",
            marginTop: 40,
            maxWidth: 820,
          }}
        >
          {thesis}
        </div>
      </div>
    ),
    size,
  );
}
