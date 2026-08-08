import type { Metadata } from "next";
import { Suspense } from "react";
import { ConnectBand } from "@/components/content/ConnectBand";
import { ProjectFilter } from "@/components/content/ProjectFilter";
import { ProjectGrid } from "@/components/content/cards";
import { StudioField } from "@/components/field/StudioField";
import { EmptyState } from "@/components/ui/primitives";
import { getAllProjects, getProfile } from "@/sanity/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects and case studies: the problem, the approach, the stack, and what actually came out of it.",
  alternates: { canonical: `${siteUrl}/work` }
};

export default async function WorkPage() {
  const [projects, profile] = await Promise.all([
    getAllProjects(),
    getProfile(),
  ]);

  return (
    <>
      <section data-chapter="work" className="relative u-top-clear pb-[var(--space-md)]">
        <StudioField />
        <div className="u-wrap relative z-10">
          <span className="u-eyebrow block mb-4">Work</span>
          <h1 className="u-h1 max-w-(--measure-title)">
            Every project, with the reasoning left in
          </h1>
          <p
            className="mt-6 text-(length:--text-prose)/[1.7]"
            style={{
              maxWidth: "var(--measure-default)",
              color: "var(--ink-secondary)",
            }}
          >
            Each case study follows the same four beats (problem, approach,
            stack, outcome), so they can actually be compared rather than just
            admired.
          </p>
        </div>
      </section>

      <section className="u-section u-ground-raised">
        <div className="u-wrap">
          {projects.length > 0 ? (
            <Suspense fallback={<ProjectGrid projects={projects} />}>
              <ProjectFilter projects={projects} />
            </Suspense>
          ) : (
            <EmptyState
              title="No projects yet"
              body="Add a project in the Studio and it will appear here with its own case study page."
              href="/studio"
              cta="Open the Studio"
            />
          )}
        </div>
      </section>

      <ConnectBand linkedinUrl={profile?.linkedinUrl} />
    </>
  );
}
