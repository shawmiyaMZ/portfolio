"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProjectGrid } from "@/components/content/cards";
import type { ProjectSummary } from "@/sanity/lib/types";

/**
 * Filtering runs on an already-statically-generated list, and writes the
 * active filter to the URL so a filtered view can be linked and shared.
 * Nothing is fetched; nothing hits the network.
 */
export function ProjectFilter({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("tech");

  const tech = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects)
      for (const t of p.techTags ?? [])
        counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name);
  }, [projects]);

  const visible = active
    ? projects.filter((p) => p.techTags?.includes(active))
    : projects;

  const select = (value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("tech", value);
    else next.delete("tech");
    const qs = next.toString();
    router.replace(qs ? `/work?${qs}` : "/work", { scroll: false });
  };

  return (
    <>
      {tech.length > 0 && (
        <div
          className="filter-strip flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filter projects by technology"
        >
          <FilterChip on={!active} onClick={() => select(null)}>
            All ({projects.length})
          </FilterChip>
          {tech.map((t) => (
            <FilterChip key={t} on={active === t} onClick={() => select(t)}>
              {t}
            </FilterChip>
          ))}
        </div>
      )}

      {visible.length > 0 ? (
        <ProjectGrid projects={visible} />
      ) : (
        <p style={{ color: "var(--ink-secondary)" }}>
          No projects use {active} yet.
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
          ? { background: "var(--color-cobalt)", color: "#fff" }
          : {
              background: "rgba(62,92,118,.08)",
              color: "var(--color-cobalt)",
            }
      }
    >
      {children}
    </button>
  );
}
