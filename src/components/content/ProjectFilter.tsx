"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProjectGrid } from "@/components/content/cards";
import type { ProjectSummary } from "@/sanity/lib/types";

/**
 * Filtering runs on an already-statically-generated list, and writes the
 * active filter to the URL so a filtered view can be linked and shared.
 * Nothing is fetched; nothing hits the network.
 *
 * Filters on `tags` — the curated vocabulary shared with the journal — and
 * deliberately not on `techTags`. Tech was the original axis and it does not
 * group: because the two projects share no stack, it produced 18 chips for 2
 * projects, each isolating a single item, and pushed the work below the fold.
 * A tag says what kind of thing a project is; tech says what it was built
 * with, which is a fact about one project rather than a category across many.
 *
 * The chips are derived from the projects on screen rather than fetched, so a
 * chip can never be offered that matches nothing.
 */
export function ProjectFilter({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("tag");

  const tags = useMemo(() => {
    const bySlug = new Map<string, { slug: string; title: string; n: number }>();
    for (const p of projects)
      for (const t of p.tags ?? []) {
        const seen = bySlug.get(t.slug);
        if (seen) seen.n += 1;
        else bySlug.set(t.slug, { slug: t.slug, title: t.title, n: 1 });
      }
    return [...bySlug.values()].sort(
      (a, b) => b.n - a.n || a.title.localeCompare(b.title),
    );
  }, [projects]);

  const visible = active
    ? projects.filter((p) => p.tags?.some((t) => t.slug === active))
    : projects;

  const select = (value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("tag", value);
    else next.delete("tag");
    const qs = next.toString();
    router.replace(qs ? `/work?${qs}` : "/work", { scroll: false });
  };

  /* One category is not a choice — it filters nothing and only adds noise.
     The strip earns its place from two upwards. */
  const worthShowing = tags.length > 1;

  return (
    <>
      {worthShowing && (
        <div
          className="filter-strip flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filter projects by category"
        >
          <FilterChip on={!active} onClick={() => select(null)}>
            All ({projects.length})
          </FilterChip>
          {tags.map((t) => (
            <FilterChip
              key={t.slug}
              on={active === t.slug}
              onClick={() => select(active === t.slug ? null : t.slug)}
            >
              {t.title}
            </FilterChip>
          ))}
        </div>
      )}

      {visible.length > 0 ? (
        <ProjectGrid projects={visible} />
      ) : (
        <p style={{ color: "var(--ink-secondary)" }}>
          No projects in {tags.find((t) => t.slug === active)?.title ?? "that category"} yet.
        </p>
      )}
    </>
  );
}

function FilterChip({
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
      /* `u-tap` carries the 44px minimum, and is scoped to `pointer: coarse`
         so a mouse still gets the compact 34px chip. These were the last two
         controls on the site still missing it. */
      className="u-tap justify-center text-[13px] font-medium px-3.5 py-2 rounded-full transition-colors cursor-pointer border-0"
      style={
        on
          ? { background: "var(--color-cobalt)", color: "var(--ink-on-accent)" }
          : {
              background: "var(--surface-tint-cobalt)",
              color: "var(--ink-technical)",
            }
      }
    >
      {children}
    </button>
  );
}
