import { ImageResponse } from "next/og";
import { getPost } from "@/sanity/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Journal post";

/**
 * Open Graph cards, generated per post.
 *
 * Deliberately built from the design tokens rather than a screenshot: same
 * porcelain ground, same Madder rule, same hierarchy. A shared link should
 * look like it came from this site.
 *
 * next/og runs on the edge with a tiny CSS subset — no custom properties, no
 * clamp(), no gap shorthand quirks — so the values here are literals that
 * mirror the tokens rather than references to them.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title ?? "Journal";
  const excerpt = post?.excerpt ?? "";
  const meta = post
    ? `${post.readingTime} min read · ${new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F6F3EE",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* A single clay solid, echoing the Studio Field. */}
        <div
          style={{
            position: "absolute",
            top: -110,
            right: -90,
            width: 460,
            height: 460,
            borderRadius: 999,
            background: "rgba(178,58,82,0.10)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            right: 190,
            width: 300,
            height: 300,
            borderRadius: 72,
            background: "rgba(62,92,118,0.08)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 34,
              height: 4,
              background: "#B23A52",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 21,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#6E6963",
              display: "flex",
            }}
          >
            Journal
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: title.length > 60 ? 62 : 76,
              lineHeight: 1.1,
              color: "#1A1917",
              letterSpacing: -2,
              maxWidth: 940,
              display: "flex",
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                marginTop: 26,
                fontSize: 27,
                lineHeight: 1.45,
                color: "#6E6963",
                maxWidth: 820,
                display: "flex",
              }}
            >
              {excerpt.length > 150 ? `${excerpt.slice(0, 150)}…` : excerpt}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(26,25,23,0.12)",
            paddingTop: 26,
          }}
        >
          <div style={{ fontSize: 23, color: "#1A1917", display: "flex" }}>
            Shawmiya Zarook
          </div>
          <div style={{ fontSize: 21, color: "#6E6963", display: "flex" }}>
            {meta}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
