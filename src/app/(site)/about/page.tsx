import type { Metadata } from "next";
import Image from "next/image";
import { ConnectBand } from "@/components/content/ConnectBand";
import { Prose } from "@/components/content/Prose";
import { StudioField } from "@/components/field/StudioField";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHead } from "@/components/ui/primitives";
import { getProfile } from "@/sanity/lib/content";
import type { SkillLevel } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "About",
  description:
    "My learning journey, education, the tools I work with, and where I am heading.",
};

/**
 * Named tiers, never percentage bars.
 *
 * "React 72%" asserts a precision nobody can justify and everybody discounts.
 * A named tier says something falsifiable about how you actually work.
 */
const LEVEL: Record<SkillLevel, { label: string; dots: number }> = {
  daily: { label: "Working with daily", dots: 3 },
  comfortable: { label: "Comfortable", dots: 2 },
  learning: { label: "Learning", dots: 1 },
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <>
      <section className="relative u-top-clear pb-[clamp(2rem,5vw,4rem)]">
        <StudioField />
        <div className="u-wrap relative z-10 grid lg:grid-cols-12 gap-x-10 gap-y-8 lg:gap-y-10 items-end">
          <div className="lg:col-span-7">
            <span className="u-eyebrow block mb-4">About</span>
            <h1 className="u-h1 max-w-[16ch]">
              {profile?.headline ?? "Software engineer, learning in public"}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 max-w-[220px] sm:max-w-[260px] mx-auto lg:mx-0 w-full">
            <div className="avatar-stage avatar-stage--portrait">
              <div className="avatar-stage__plinth" />
              <Image
                src="/avatar/avatar-portrait.webp"
                alt={
                  profile?.avatar?.alt ??
                  `${profile?.name ?? "Shawmiya Zarook"}, illustrated as a 3D clay figure`
                }
                width={900}
                height={1009}
                /* Above the fold on this page, so it is the LCP candidate —
                   it must not be lazy-loaded. */
                priority
                /* Without this it silently falls back to quality 75 while
                   every other avatar renders at 90, and this one reads
                   visibly softer than the same figure on the home page. */
                quality={90}
                sizes="(max-width: 1023px) 46vw, 22vw"
                className="avatar-stage__figure"
              />
            </div>
          </div>
        </div>
      </section>

      {profile?.bio ? (
        <section className="u-section pt-0">
          <div className="u-wrap">
            <Reveal>
              <Prose value={profile.bio} />
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="u-section pt-0">
          <div className="u-wrap">
            <EmptyState
              title="No profile yet"
              body="Add your bio, education, skills, and timeline in the Studio and they will appear here."
              href="/studio"
              cta="Open the Studio"
            />
          </div>
        </section>
      )}

      {profile?.skillGroups && profile.skillGroups.length > 0 && (
        <section className="u-section pt-0">
          <div className="u-wrap">
            <SectionHead eyebrow="Toolkit" title="What I work with" />
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {profile.skillGroups.map((group, i) => (
                <Reveal key={group.category} index={i}>
                  <div className="grid gap-4">
                    <h3
                      className="u-eyebrow"
                      style={{ color: "var(--ink-technical)" }}
                    >
                      {group.category}
                    </h3>
                    <ul className="list-none m-0 p-0 grid gap-3">
                      {group.skills?.map((skill) => {
                        const tier = LEVEL[skill.level] ?? LEVEL.comfortable;
                        return (
                          <li
                            key={skill.name}
                            className="flex items-baseline justify-between gap-4 pb-3"
                            style={{
                              borderBottom: "1px solid var(--line-hairline)",
                            }}
                          >
                            <span className="font-medium">{skill.name}</span>
                            <span
                              className="u-caption whitespace-nowrap"
                              title={tier.label}
                            >
                              {tier.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {profile?.education && profile.education.length > 0 && (
        <section className="u-section pt-0">
          <div className="u-wrap">
            <SectionHead eyebrow="Education" title="Where I studied" />
            <ul className="list-none m-0 p-0 grid gap-6">
              {profile.education.map((e, i) => (
                <Reveal key={`${e.qualification}-${i}`} index={i} as="li">
                  {/* Anchored at both ends from 768 up: period at the left
                      edge, qualification against it, institution driven to
                      the right. Previously the period took 3 of 12 columns
                      and the rest sat in the remaining 9 — which for one
                      degree left ~630px of empty row beneath a hairline
                      spanning the full 1200px. A rule that wide has to have
                      something at both ends or it reads as an unfinished
                      table. */}
                  <div
                    className="education-row grid gap-x-8 gap-y-1 pb-6"
                    style={{ borderBottom: "1px solid var(--line-hairline)" }}
                  >
                    <span className="u-caption education-row__period">
                      {e.period}
                    </span>
                    <span className="u-h3 education-row__qualification">
                      {e.qualification}
                    </span>
                    <span
                      className="education-row__institution"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      {e.institution}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {profile?.milestones && profile.milestones.length > 0 && (
        <section className="u-section pt-0">
          <div className="u-wrap">
            <SectionHead eyebrow="Timeline" title="How I got here" />
            <ul className="list-none m-0 p-0 max-w-[var(--measure-prose)]">
              {profile.milestones.map((m, i) => (
                <Reveal key={`${m.year}-${i}`} index={i} as="li">
                  <div
                    className="relative pl-8 pb-9"
                    style={{
                      borderLeft:
                        i === profile.milestones!.length - 1
                          ? "1px solid transparent"
                          : "1px solid var(--line-hairline)",
                    }}
                  >
                    <span
                      className="absolute left-0 top-1.5 size-2 rounded-full -translate-x-1/2"
                      style={{ background: "var(--color-cobalt)" }}
                      aria-hidden="true"
                    />
                    <span className="u-caption block mb-1">{m.year}</span>
                    <span className="u-h3 block mb-1.5">{m.event}</span>
                    {m.detail && (
                      <p style={{ color: "var(--ink-secondary)" }}>
                        {m.detail}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ConnectBand linkedinUrl={profile?.linkedinUrl} />
    </>
  );
}
