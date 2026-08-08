import * as simpleIcons from "simple-icons";

/**
 * Technology name → brand mark, resolved at render time.
 *
 * Sanity stores only the name. Nothing about icons is authored, uploaded or
 * configured there, and adding "Supabase" or "Kubernetes" to a skill group
 * renders the right mark with no code change — the name *is* the lookup key.
 *
 * This runs on the server. Pages that use it are statically generated, so
 * the 3,453-icon dataset is read at build time and only the resolved `<svg>`
 * path reaches the browser: no icon library in the client bundle, nothing to
 * download, nothing to hydrate. That matters here — the obvious alternative,
 * importing a React icon set and looking components up dynamically, defeats
 * tree-shaking and would ship the whole set.
 */

type SimpleIcon = { title: string; slug: string; hex: string; path: string };

/**
 * Simple Icons' own slug rules, which is why "Next.js" finds `nextdotjs`
 * and "C++" finds `cplusplus` without either being special-cased.
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/&/g, "and")
    // Strip accents so "Ember.js" and friends with diacritics still resolve.
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function techIcon(name: string): SimpleIcon | null {
  const slug = toSlug(name);
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  return (simpleIcons as unknown as Record<string, SimpleIcon>)[key] ?? null;
}

/**
 * The mark itself.
 *
 * Monochrome by default, in the ink rather than the brand colour: twelve
 * brand palettes at once would read as a sticker sheet against a system
 * built on porcelain and two accents. The brand colour arrives on hover —
 * recognition comes from the form, warmth from the interaction.
 *
 * Not every technology has a mark. Simple Icons is a *brand* set, so anything
 * that is a language or a standard rather than a product is absent by design
 * — SQL is, and so is OpenAI. The fallback is therefore a real state, not a
 * defensive afterthought: a clay chip in the same vocabulary as everything
 * else, which keeps the icon column aligned and the row height constant.
 *
 * The chip used to carry the technology's initial. It cannot: this component
 * only ever renders immediately before the name, so the initial always
 * duplicated the first letter of the label beside it. With SQL that read as
 * "S SQL" and was reported as a typo in the skills list — the one place on a
 * portfolio where a typo is least affordable. A quiet neutral dot says "no
 * mark for this one" without repeating the word it sits next to.
 */
export function TechIcon({ name }: { name: string }) {
  const icon = techIcon(name);

  if (!icon) {
    return <span className="tech-icon tech-icon--fallback" aria-hidden="true" />;
  }

  return (
    <span
      className="tech-icon"
      style={{ "--tech-brand": `#${icon.hex}` } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" role="presentation" focusable="false">
        <path d={icon.path} />
      </svg>
    </span>
  );
}
