import Link from "next/link";
import { ProjectCover } from "@/components/content/ProjectCover";
import type { PostSummary, ProjectSummary } from "@/sanity/lib/types";
import { Tag, formatDate } from "@/components/ui/primitives";

/**
 * Featured projects alternate 7/5 then 5/7 — on desktop.
 *
 * A uniform grid of equal cards reads as a database dump — every item the
 * same weight, no opinion expressed. Unequal alternating rows imply someone
 * decided what mattered, which is the whole point of a portfolio.
 *
 * Tablet is a different canvas and gets its own composition rather than a
 * narrower version of that one: the row stacks, the cover trades height for
 * width, and the alternation survives as an asymmetric inset on the cover.
 * The layout rules for it live beside their reasoning in `chrome.css` under
 * PROJECT ROW, because they are a composition rather than a set of tweaks.
 */
export function ProjectRow({
  project,
  flip,
}: {
  project: ProjectSummary;
  flip: boolean;
}) {
  return (
    <article
      className="tilt-stage project-row"
      /* Drives the tablet inset direction. Omitted rather than set to
         "false" so the CSS only ever has one state to match. */
      data-flip={flip ? "true" : undefined}
    >
      <Link
        href={`/work/${project.slug}`}
        className="grid gap-x-10 gap-y-5 md:gap-y-8 lg:gap-y-6 items-center no-underline lg:grid-cols-12"
        style={{ color: "inherit" }}
      >
        {/*
          Text before image in the DOM.
          Stacked, the title has to lead — a reader decides whether to care
          from the name and the summary, and the image supports that
          decision rather than preceding it. Side by side the order is
          invisible, so grid placement handles desktop and the DOM keeps the
          sequence that is correct for a phone and for a screen reader.
        */}
        <div
          className={`grid gap-3 lg:col-span-5 ${
            flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-8 lg:row-start-1"
          }`}
        >
          <h3 className="u-h3 project-row__title">{project.title}</h3>

          {/* Stacked, this paragraph spans the whole wrap unless it is told
              not to. At 1000px that is ~110 characters a line, against a
              system that defines 60ch as the comfortable measure. The token
              only ever caps — the desktop text column is already narrower
              than 60ch, so this changes nothing there. */}
          <p
            style={{
              color: "var(--ink-secondary)",
              maxWidth: "var(--measure-default)",
            }}
          >
            {project.summary}
          </p>

          {/* Stacked at both ends of the range; a split band on tablet. */}
          <div className="project-row__meta grid gap-4 mt-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="u-caption">{formatDate(project.date)}</span>
              {project.techTags && project.techTags.length > 0 && (
                <>
                  {/* No separator glyph between the date and the tags. The row
                      wraps, and a "·" left stranded at the end of the previous
                      line reads as a typo. The gap does the separating. */}
                  {/* Three on a phone, four above. A fourth chip pushes the row
                      to two lines at 390px and buries the summary. */}
                  <div className="flex flex-wrap gap-2">
                    {project.techTags.slice(0, 3).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                    {project.techTags.slice(3, 4).map((t) => (
                      <span key={t} className="hidden sm:contents">
                        <Tag>{t}</Tag>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <span
              className="link-underline font-medium justify-self-start whitespace-nowrap"
              style={{ color: "var(--ink-link)" }}
            >
              Read the case study
            </span>
          </div>
        </div>

        <div
          className={`project-row__cover lg:col-span-7 lg:row-start-1 ${
            flip ? "lg:col-start-6" : "lg:col-start-1"
          }`}
          style={{ viewTransitionName: `project-${project.slug}` }}
        >
          {/* The crop is the other half of demoting the image on tablet.
              Full-width 10:7 at 900px is a 630px-tall picture — taller than
              most of the viewport, so the row can only be read in two
              glances. 16:9 brings that to ~400px and the row becomes one
              unit again. Desktop keeps 10:7: in a seven-column well it is
              already a supporting shape rather than a dominant one. */}
          <div
            className="tilt-target rounded-md overflow-hidden aspect-[10/7] md:aspect-[16/9] lg:aspect-[10/7] relative"
            style={{
              background: "var(--surface-raised)",
              boxShadow: "var(--shadow-e2)",
            }}
          >
            <ProjectCover
              project={project}
              width={1000}
              height={700}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 93vw, 58vw"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

/** The projects index uses a real grid — there, comparability beats emphasis. */
export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="tilt-stage h-full">
      <Link
        href={`/work/${project.slug}`}
        className="tilt-target rounded-md overflow-hidden no-underline h-full flex flex-col"
        style={{
          background: "var(--surface-ground)",
          boxShadow: "var(--shadow-e2)",
          color: "inherit",
        }}
      >
        {/* One column on a phone means the card is as wide as the screen, and
            a 10:7 crop there is a 250px picture sitting above 80px of text —
            the card becomes a tower with a lid. A 16:9 crop restores the
            balance. From 640px the grid is two-up, the card is half as wide,
            and 10:7 is the better shape again. */}
        <div
          className="aspect-[16/9] sm:aspect-[10/7] relative"
          style={{ background: "var(--surface-raised)" }}
        >
          <ProjectCover
            project={project}
            width={800}
            height={560}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 md:p-7 lg:p-6 grid gap-2.5 flex-1 content-start">
          <h3 className="u-h3">{project.title}</h3>
          <p className="text-[15px]" style={{ color: "var(--ink-secondary)" }}>
            {project.summary}
          </p>
          {project.techTags && project.techTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1.5">
              {project.techTags.slice(0, 3).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

/**
 * The journal renders as an editorial list, not a card grid.
 *
 * A list says "there is more where this came from"; a grid of three cards
 * says "here are three things". For a site whose heart is the writing, the
 * first message is the right one.
 */
export function PostListItem({
  post,
  index,
}: {
  post: PostSummary;
  index: number;
}) {
  return (
    <article style={{ borderTop: "1px solid var(--line-hairline)" }}>
      <Link
        href={`/journal/${post.slug}`}
        className="grid md:grid-cols-12 gap-x-8 gap-y-2 py-7 no-underline items-baseline"
        style={{ color: "inherit" }}
      >
        <span
          className="font-mono text-[13px] md:col-span-1 tabular-nums"
          style={{ color: "var(--ink-secondary)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="md:col-span-7 grid gap-2">
          <h3 className="u-h3">{post.title}</h3>
          {/* Seven of twelve columns is 673px at desktop, which at 15px is
              75 characters a line — against a system that calls 60ch the
              comfortable measure. The column earns its width from the
              title; the excerpt should not inherit it. */}
          <p
            className="text-[15px]"
            style={{
              color: "var(--ink-secondary)",
              maxWidth: "var(--measure-default)",
            }}
          >
            {post.excerpt}
          </p>
        </div>

        <div className="md:col-span-4 flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
          {post.tags?.slice(0, 2).map((t) => (
            <Tag key={t.slug} tone="sage">
              {t.title}
            </Tag>
          ))}
          <span className="u-caption whitespace-nowrap">
            {post.readingTime} min · {formatDate(post.publishedAt)}
          </span>
        </div>
      </Link>
    </article>
  );
}
