import type { Metadata } from "next";
import { Suspense } from "react";
import { ConnectBand } from "@/components/content/ConnectBand";
import { ProjectFilter } from "@/components/content/ProjectFilter";
import { StudioField } from "@/components/field/StudioField";
import { EmptyState } from "@/components/ui/primitives";
import { getAllProjects, getProfile } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects and case studies — the problem, the approach, the stack, and what actually came out of it.",
};

export default async function WorkPage() {
  const [projects, profile] = await Promise.all([
    getAllProjects(),
    getProfile(),
  ]);

  return (
    <>
      <section className="relative u-top-clear pb-[clamp(2rem,5vw,3.5rem)]">
        <StudioField />
        <div className="u-wrap relative z-10">
          <span className="u-eyebrow block mb-4">Work</span>
          <h1 className="u-h1 max-w-[18ch]">
            Every project, with the reasoning left in
          </h1>
          <p
            className="mt-6 text-(length:--text-prose)/[1.7]"
            style={{
              maxWidth: "var(--measure-default)",
              color: "var(--ink-secondary)",
            }}
          >
            Each case study follows the same four beats — problem, approach,
            stack, outcome — so they can actually be compared rather than just
            admired.
          </p>
        </div>
      </section>

      <section className="u-section u-ground-raised">
        <div className="u-wrap">
          {projects.length > 0 ? (
            <Suspense fallback={null}>
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
