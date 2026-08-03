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

            <p
              className="u-eyebrow mt-4"
              style={{ color: "var(--ink-technical)" }}
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
      <section id="work" className="u-section scroll-mt-24">
        <div className="u-wrap">
          <SectionHead
            eyebrow="Chapter 02 · Selected work"
            title="Things I have built, and what they taught me"
            action={<ChapterLink href="/work">All projects</ChapterLink>}
          />

          {projects.length > 0 ? (
            <div className="grid gap-[clamp(3rem,6vw,5rem)]">
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
      <section id="journal" className="u-section pt-0 scroll-mt-24">
        <div className="u-wrap">
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

      {/* ============ 04 · ABOUT ============ */}
      <section id="about" className="u-section pt-0 scroll-mt-24">
        <div className="u-wrap grid lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
          <div className="lg:col-span-7">
            <SectionHead
              eyebrow="Chapter 04 · About"
              title="Who is behind all this"
              action={<ChapterLink href="/about">Full profile</ChapterLink>}
            />
            {profile?.bio ? (
              <Prose value={profile.bio} />
            ) : (
              <EmptyState
                title="No bio yet"
                body="Add your professional bio in the Studio and it will appear here. Education, skills and your timeline live on the full About page."
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

      {/* ============ 05 · CONNECT ============ */}
      <ConnectBand linkedinUrl={profile?.linkedinUrl} />
    </>
  );
}
