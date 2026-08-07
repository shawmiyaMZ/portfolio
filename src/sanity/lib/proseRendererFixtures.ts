import type { PortableText } from "./types";
import {
  block,
  bullets,
  callout,
  codeBlock,
  h2,
  h3,
  numbers,
  quote,
  rich,
  span,
  withLink,
} from "./seed";

/**
 * Prose renderer fixtures — deliberately NOT production content.
 *
 * These are synthetic bodies whose only job is to exercise every renderer in
 * `Prose`, so a change to that component can be tested without depending on
 * whatever the real portfolio happens to contain. The real seed is honest
 * content written by the owner and reads as it reads; it does not, and should
 * not, be crafted to hit every mark type. That duty lives here, in fixtures
 * that are never migrated, never rendered by any page, and never shipped.
 *
 * Keep this file aligned with `Prose.tsx`: if a block style, list kind, mark,
 * or custom type is added there, add a representative member here so coverage
 * stays complete.
 */

/** A single post-grade body that hits every renderer in one place. */
export const rendererBody: PortableText = [
  h2("A heading that renders an anchor", "fx-h2"),
  block(
    "An <h3> below and a blockquote, both of which the real journal happens not to use.",
    "fx-p1",
  ),
  h3("A subheading for the table of contents", "fx-h3"),
  ...numbers(
    [
      "A numbered item.",
      "A second numbered item.",
    ],
    "fx-n_",
  ),
  ...bullets(
    [
      "A bullet item.",
      "A second bullet item.",
    ],
    "fx-bul_",
  ),
  rich(
    "fx-code",
    [
      span("Inline code like ", "fx-code-a"),
      span("typedClient.fetch", "fx-code-b", ["code"]),
      span(" renders distinctly.", "fx-code-c"),
    ],
  ),
  withLink(
    "fx-linkdef",
    "Link text that resolves a ",
    "real markDef",
    "https://example.com/a-real-link",
    " — this is the shape most copy actually needs.",
  ),
  block("A closing paragraph after the anchors.", "fx-p2"),
  quote("A pull quote to prove the blockquote renders.", "fx-q"),
  h3("A code block", "fx-codh3"),
  codeBlock(
    "fx-code",
    "bash",
    "echo 1\necho 2\n# trailing comment",
    "fixtures/sample.sh",
  ),
  callout("fx-note", "note", "The note tone renders with its tint."),
  callout("fx-insight", "insight", "The insight tone: what I learned"),
  callout("fx-warning", "warning", "The warning tone: watch out."),
  {
    _type: "image",
    _key: "fx-img",
    // A placeholder asset; the Prose image renderer never ships in fixtures.
    asset: { _type: "reference", _ref: "image-seed-placeholder-1600x900-png" },
    alt: "A fixture image so the image renderer stays covered.",
  },
];

/** All fixture bodies, so tests can union their coverage in one place. */
export const proseRendererFixtures: { name: string; body: PortableText }[] = [
  { name: "every-renderer", body: rendererBody },
];