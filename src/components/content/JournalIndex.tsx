"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { PostListItem } from "@/components/content/cards";
import type { PostSummary, Tag } from "@/sanity/lib/types";

/**
 * Search runs entirely in the browser over the already-generated list.
 *
 * A journal of this size does not need a search service — that would add a
 * network round-trip, an API key, and a monthly bill to solve a problem that
 * fits in memory. Fuse indexes title, excerpt, and tags only, so the payload
 * stays the same list the page already had.
 */
export function JournalIndex({
  posts,
  tags,
}: {
  posts: PostSummary[];
  tags: Tag[];
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 3 },
          { name: "excerpt", weight: 1 },
          { name: "tags.title", weight: 2 },
        ],
        threshold: 0.34,
        ignoreLocation: true,
      }),
    [posts],
  );

  const results = useMemo(() => {
    const byQuery = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : posts;
    return tag
      ? byQuery.filter((p) => p.tags?.some((t) => t.slug === tag))
      : byQuery;
  }, [query, tag, fuse, posts]);

  return (
    <>
      {/* Stacked on a phone, where there is only one column to have. From
          768 the field and the tags share a line, sitting on a common
          baseline at opposite ends — which turns a tall stack of controls
          stranded in a wide margin into a single composed bar above the
          list. See `.journal-controls` in chrome.css. */}
      <div className="journal-controls mb-10">
        <label className="journal-controls__search grid gap-2">
          <span className="u-eyebrow">Search the journal</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Retrieval, evaluation, prompts…"
            className="px-4 py-3 rounded-sm text-[15px] w-full"
            style={{
              background: "var(--surface-ground)",
              border: "1px solid var(--line-hairline)",
              color: "var(--ink-primary)",
            }}
          />
        </label>

        {tags.length > 0 && (
          <div
            className="journal-controls__tags filter-strip flex flex-wrap gap-2"
            role="group"
            aria-label="Filter posts by tag"
          >
            <Chip on={!tag} onClick={() => setTag(null)}>
              All ({posts.length})
            </Chip>
            {tags.map((t) => (
              <Chip
                key={t.slug}
                on={tag === t.slug}
                onClick={() => setTag(tag === t.slug ? null : t.slug)}
              >
                {t.title}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <p className="u-caption mb-2" aria-live="polite">
        {results.length} {results.length === 1 ? "post" : "posts"}
        {tag && ` tagged ${tags.find((t) => t.slug === tag)?.title}`}
        {query.trim() && ` matching “${query.trim()}”`}
      </p>

      {results.length > 0 ? (
        <div>
          {results.map((post, i) => (
            <PostListItem key={post.slug} post={post} index={i} />
          ))}
        </div>
      ) : (
        <p className="py-8" style={{ color: "var(--ink-secondary)" }}>
          Nothing matches that yet. Try a broader term, or clear the filters.
        </p>
      )}
    </>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      /* Same 44px touch minimum as every other control. The Journal's own
         art direction is a later pass; this is the identical defect to the
         Work chips and not worth leaving in place for the sake of a section
         boundary. */
      className="u-tap justify-center text-[13px] font-medium px-3.5 py-2 rounded-full transition-colors cursor-pointer border-0"
      style={
        on
          ? { background: "var(--color-cobalt)", color: "#fff" }
          : { background: "rgba(62,92,118,.08)", color: "var(--color-cobalt)" }
      }
    >
      {children}
    </button>
  );
}
