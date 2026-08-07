import type { PortableTextBlock } from "@portabletext/react";
import type { PortableText } from "@/sanity/lib/types";

/** Flatten a portable-text block to its plain text. */
export function blockToText(block: PortableTextBlock): string {
  const children = (block as { children?: Array<{ text?: string }> }).children;
  return (children ?? []).map((c) => c.text ?? "").join("");
}

/**
 * Heading ids are derived from the heading text, so the table of contents and
 * the headings themselves can never disagree — both call this.
 */
export function slugifyHeading(block: PortableTextBlock): string {
  return blockToText(block)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * A body array holds images, code blocks and callouts as well as blocks, so
 * every traversal has to narrow before it can read block-only fields.
 */
const isBlock = (value: PortableText[number]): value is PortableTextBlock =>
  value._type === "block";

/** Pull the h2/h3 outline out of a post body for the sticky TOC. */
export function extractHeadings(body?: PortableText): Heading[] {
  if (!body) return [];
  return body
    .filter(isBlock)
    .filter((b) => b.style === "h2" || b.style === "h3")
    .map((b) => ({
      id: slugifyHeading(b),
      text: blockToText(b),
      level: b.style === "h2" ? (2 as const) : (3 as const),
    }))
    .filter((h) => h.text.length > 0);
}

/** Plain text of a whole body — used for the search index and OG images. */
export function bodyToPlainText(body?: PortableText): string {
  if (!body) return "";
  return body.filter(isBlock).map(blockToText).join(" ");
}

/**
 * Word count of a body, used for the JSON-LD `wordCount` field.
 *
 * Counts whitespace-separated tokens, exactly as the reading-time GROQ query
 * does after it has normalised block boundaries to spaces. Keeping the page
 * and the query on the same definition is the whole point — the metadata must
 * not invent a number `readingTime * 200` would happen to imply.
 */
export function countWords(body?: PortableText): number {
  return bodyToPlainText(body).split(/\s+/).filter(Boolean).length;
}
