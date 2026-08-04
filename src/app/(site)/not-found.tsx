import type { Metadata } from "next";
import { NotFoundBody } from "@/components/content/NotFoundBody";
import { StudioField } from "@/components/field/StudioField";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

/**
 * Rendered when a page calls `notFound()` — a journal slug or a project slug
 * that does not resolve. It sits inside the `(site)` layout, so the header,
 * the footer and the fonts arrive with it.
 */
export default function NotFound() {
  return (
    <section
      data-chapter="hero"
      className="relative u-top-clear pb-[var(--space-2xl)]"
    >
      <StudioField />
      <NotFoundBody />
    </section>
  );
}
