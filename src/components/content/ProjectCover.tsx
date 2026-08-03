import Image from "next/image";
import { imageUrl } from "@/sanity/lib/image";
import type { ProjectSummary } from "@/sanity/lib/types";

/**
 * A project's cover — photographed or made.
 *
 * The clay cover is not a fallback. It is the cover a project has until it
 * has a photograph, designed to the same standard as everything around it:
 * matte solids on a warm ground, one soft key light from the upper left,
 * warm two-layer contact shadows and an interior lip along each top edge.
 * The same physics as the Studio Field and the avatar plinth, composed to
 * fit a frame rather than a viewport.
 *
 * Both branches render as `position: absolute; inset: 0` inside whatever
 * aspect-ratio box the caller provides. That is deliberate and load-bearing:
 * adding a real image in the Studio swaps the content of the frame and
 * changes nothing about the layout around it — no reflow, no height shift,
 * no per-page special case.
 *
 * Before this existed the three surfaces disagreed. Featured rows drew the
 * clay, index cards drew an empty slip rectangle, and case studies drew
 * nothing at all. One component, one answer.
 */

/**
 * Which of the four still lifes a project gets.
 *
 * Derived from the slug rather than the index, so a project's cover is the
 * same on the home page, the index and its own case study, survives
 * reordering, and never changes between renders. Randomness would break all
 * four of those, and on a server-rendered page would also risk a hydration
 * mismatch.
 */
function variantFor(slug: string): number {
  let sum = 0;
  for (let i = 0; i < slug.length; i += 1) sum += slug.charCodeAt(i);
  return sum % 4;
}

export function ProjectCover({
  project,
  width,
  height,
  sizes,
  priority = false,
}: {
  project: ProjectSummary;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
}) {
  const src = imageUrl(project.coverImage, width, height);

  if (src) {
    return (
      <Image
        src={src}
        alt={project.coverImage?.alt ?? ""}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    <div
      className="project-cover"
      data-variant={variantFor(project.slug)}
      /* Decorative. The project's name is already adjacent in every context
         this appears in, so announcing the initial would only repeat it. */
      aria-hidden="true"
    >
      <span className="project-cover__solid" data-solid="1" />
      <span className="project-cover__solid" data-solid="2" />
      <span className="project-cover__solid" data-solid="3" />
      <span className="project-cover__mark">
        {project.title.trim().charAt(0)}
      </span>
    </div>
  );
}
