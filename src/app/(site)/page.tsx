import Image from "next/image";
import { AvatarPlinth } from "@/components/content/AvatarPlinth";
import { ConnectBand } from "@/components/content/ConnectBand";
import { ChapterLink } from "@/components/content/chapters";
import { Prose } from "@/components/content/Prose";
import { PostListItem, ProjectRow } from "@/components/content/cards";
import { ChapterRail } from "@/components/chrome/ChapterRail";
import { StudioField } from "@/components/field/StudioField";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState, SectionHead } from "@/components/ui/primitives";
import {
  getFeaturedProjects,
  getLatestPosts,
  getProfile,
} from "@/sanity/lib/content";
import { TechIcon } from "@/lib/tech-icons";
import type { SkillLevel } from "@/sanity/lib/types";

/**
 * Named tiers, never percentage bars.
 *
 * "React 72%" asserts a precision nobody can justify and everybody
 * discounts. A named tier says something falsifiable about how you work.
 */
const LEVEL: Record<SkillLevel, string> = {
  daily: "Working with daily",
  comfortable: "Comfortable",
  learning: "Learning",
};

/**
 * Home is the primary text, not a summary of it.
 *
 * Five chapters, read top to bottom: who I am, what I have built, what I am
 * learning, who is behind it, and how to reach me. The dedicated pages still
 * exist — for search, for deep links, and for full detail — but they are
 * where a reader goes once a chapter has earned their interest, not the
 * first decision they are asked to make.
 *
 * The philosophy sits in the hero rather than in a chapter of its own.
 * Stated under a name it reads as conviction; given its own section it
 * starts to read as marketing copy, which is the one thing a belief
 * statement cannot survive.
 */
export default async function HomePage() {
  const [profile, projects, posts] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getLatestPosts(),
  ]);

  const name = profile?.name ?? "Shawmiya Zarook";
  const role = profile?.headline ?? "Software Engineering Intern";
  const thesis =
    profile?.thesis ??
    "I'm learning to build software where AI does real work, not demo work. The projects here are what I've built; the journal is what it took to get there.";

  return (
    <>
      <ChapterRail />

      {/* ============ 01 · HERO ============ */}
      <section
        id="hero"
        data-chapter="hero"
        className="relative pb-[clamp(3rem,7vw,6rem)] u-top-clear scroll-mt-24"
      >
        <StudioField />

        <div className="u-wrap relative z-10 grid lg:grid-cols-12 gap-x-8 gap-y-12 sm:gap-y-14 lg:gap-y-10 items-end">
          <div className="lg:col-span-6 lg:pb-2">
            {/* Identity, then role, then belief. A visitor should know who
                they are reading before they are told what that person
                believes — a conviction only carries weight once it is
                attached to a name.

                The name holds the h1 because this is a personal portfolio
                and a recruiter should not have to read a sentence to learn
                whose site this is. The thesis is then promoted to a lede so
                the hero still *acts* as a thesis statement: roughly half the
                name's size, primary ink, tight leading, short measure. Two
                voices, one hierarchy — see `.u-lede` in globals.css. */}
            <h1 className="u-hero max-w-[13ch]">{name}</h1>

            {/* The chapter accent, not the technical ink — Chapter 01's
                signature is Madder, and the role line is where it lands. */}
            <p
              className="u-eyebrow mt-4"
              style={{ color: "var(--chapter-accent-ink)" }}
            >
              {role}
            </p>

            <p className="u-lede mt-7 md:mt-8">{thesis}</p>

            <div className="mt-9 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-3.5">
              {/* The primary action keeps the reader inside the story. */}
              <Button href="/#work" magnetic>
                View selected work
              </Button>
              <Button href="/#journal" variant="ghost">
                Read journal
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:max-w-none lg:w-[118%]">
            <AvatarPlinth
              alt={
                profile?.avatar?.alt ??
                `${name}, illustrated as a 3D clay figure`
              }
            />
          </div>
        </div>
      </section>

      {/* ============ 02 · SELECTED WORK ============ */}
      <section
        id="work"
        data-chapter="work"
        className="relative u-section scroll-mt-24"
      >
        <StudioField />
        <div className="u-wrap relative z-10">
          <SectionHead
            eyebrow="Chapter 02 · Selected work"
            title="Things I have built, and what they taught me"
            action={<ChapterLink href="/work">All projects</ChapterLink>}
          />

          {projects.length > 0 ? (
            <div className="work-rows grid gap-[clamp(3rem,6vw,5rem)]">
              {projects.map((project, i) => (
                <Reveal key={project.slug} index={i} weight="heavy">
                  <ProjectRow project={project} flip={i % 2 === 1} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No featured projects yet"
              body="Projects appear here once you mark one as featured in the Studio."
              href="/studio"
              cta="Open the Studio"
            />
          )}
        </div>
      </section>

      {/* ============ 03 · JOURNAL ============ */}
      <section
        id="journal"
        data-chapter="journal"
        className="relative u-section u-ground-raised scroll-mt-24"
      >
        <StudioField />
        <div className="u-wrap relative z-10">
          <SectionHead
            eyebrow="Chapter 03 · Journal"
            title="Learning in public"
            lede="I write these mostly to think properly. If they are useful to you as well, that is a happy side effect."
            action={<ChapterLink href="/journal">All posts</ChapterLink>}
          />

          {posts.length > 0 ? (
            <div>
              {posts.map((post, i) => (
                <Reveal key={post.slug} index={i} weight="light">
                  <PostListItem post={post} index={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="The journal is empty"
              body="Write your first post in the Studio and it will appear here, on the journal index, and in the RSS feed."
              href="/studio"
              cta="Open the Studio"
            />
          )}
        </div>
      </section>

      {/* ============ 04 · ABOUT ============
          The whole profile lives here now. There is no /about route: this
          chapter *is* the About page, so a reader never leaves the narrative
          to learn who wrote it.

          It reads as one composition rather than four stacked sections. Each
          movement is announced by a title on a hairline instead of a full
          section head — Education is a single degree, and a three-part head
          above it weighed more than the content it introduced. The grounds
          alternate between the two surfaces the system already defines, so
          a chapter this long has something to measure progress against
          instead of running as one flat wall of Porcelain. */}
      <section
        id="about"
        data-chapter="about"
        className="relative u-section pt-0 scroll-mt-24"
      >
        <StudioField />
        <div className="u-wrap relative z-10 grid lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
          <div className="lg:col-span-7">
            <SectionHead
              eyebrow="Chapter 04 · About"
              title="Who is behind all this"
            />
            {profile?.bio ? (
              <Prose value={profile.bio} />
            ) : (
              <EmptyState
                title="No bio yet"
                body="Add your professional bio in the Studio and it will appear here, along with your education, toolkit and timeline."
                href="/studio"
                cta="Open the Studio"
              />
            )}
          </div>

          {/* The avatar returns once, straight-on. It introduced you in the
              hero, stepped back while the work spoke, and comes back at the
              one moment the page is genuinely personal. Decorative here —
              the hero already named the figure — so its alt stays empty. */}
          <div className="lg:col-span-4 lg:col-start-9 max-w-[220px] sm:max-w-[280px] mx-auto lg:mx-0 w-full">
            <div className="avatar-stage avatar-stage--portrait">
              <div className="avatar-stage__plinth" />
              <Image
                src="/avatar/avatar-portrait.webp"
                alt=""
                width={900}
                height={1009}
                quality={90}
                sizes="(max-width: 1023px) 46vw, 22vw"
                className="avatar-stage__figure"
              />
            </div>
          </div>
        </div>
      </section>

      {profile?.skillGroups && profile.skillGroups.length > 0 && (
        <section data-chapter="about" className="about-movement about-movement--raised">
          <div className="u-wrap">
            <h3 className="about-movement__title">Toolkit</h3>
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {profile.skillGroups.map((group, i) => (
                <Reveal key={group.category} index={i} weight="light">
                  <div className="grid gap-4">
                    <h4
                      className="u-eyebrow"
                      style={{ color: "var(--ink-technical)" }}
                    >
                      {group.category}
                    </h4>
                    <ul className="list-none m-0 p-0 grid gap-1">
                      {group.skills?.map((skill) => (
                        <li key={skill.name} className="tech-row">
                          <TechIcon name={skill.name} />
                          <span className="tech-row__name">{skill.name}</span>
                          {skill.level && (
                            <span className="tech-row__tier u-caption">
                              {LEVEL[skill.level] ?? LEVEL.comfortable}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {profile?.education && profile.education.length > 0 && (
        <section data-chapter="about" className="about-movement">
          <div className="u-wrap">
            <h3 className="about-movement__title">Education</h3>
            <ul className="list-none m-0 p-0 grid gap-6">
              {profile.education.map((e, i) => (
                <Reveal key={`${e.qualification}-${i}`} index={i} as="li">
                  {/* Anchored at both ends from 768. A hairline spanning the
                      full measure has to divide something at each end, or it
                      reads as an unfinished table. */}
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
        <section data-chapter="about" className="about-movement about-movement--raised">
          <div className="u-wrap">
            <h3 className="about-movement__title">How I got here</h3>
            <ul className="list-none m-0 p-0 max-w-[var(--measure-prose)]">
              {profile.milestones.map((m, i) => (
                <Reveal key={`${m.year}-${i}`} index={i} as="li" weight="light">
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

      {/* ============ 05 · CONNECT ============ */}
      <ConnectBand linkedinUrl={profile?.linkedinUrl} />
    </>
  );
}
