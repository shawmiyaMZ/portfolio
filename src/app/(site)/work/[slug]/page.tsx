import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConnectBand } from "@/components/content/ConnectBand";
import { ProjectCover } from "@/components/content/ProjectCover";
import { Prose } from "@/components/content/Prose";
import { StudioField } from "@/components/field/StudioField";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Tag, formatDate } from "@/components/ui/primitives";
import { getProfile, getProject, getProjectSlugs } from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Not found" };

  const cover = imageUrl(project.coverImage, 1200, 630);
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: cover ? [{ url: cover, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([
    getProject(slug),
    getProfile(),
  ]);

  if (!project) notFound();

  return (
    <>
      <section className="relative u-top-clear">
        <StudioField />
        <div className="u-wrap relative z-10">
          <Link
            href="/work"
            className="link-underline text-sm no-underline"
            style={{ color: "var(--ink-secondary)" }}
          >
            ← All work
          </Link>

          <h1 className="u-h1 max-w-[18ch] mt-6">{project.title}</h1>

          <p
            className="mt-5 text-(length:--text-prose)/[1.7]"
            style={{
              maxWidth: "var(--measure-default)",
              color: "var(--ink-secondary)",
            }}
          >
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {project.liveUrl && (
              <Button href={project.liveUrl} external magnetic>
                View live
              </Button>
            )}
            {project.githubUrl && (
              <Button href={project.githubUrl} external variant="ghost">
                Source on GitHub
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Always rendered. The cover is the plate this page opens on, and a
          project without a photograph still has one — the view transition
          from the index needs a shape to land in either way, and a page whose
          layout depends on whether an image exists shifts the moment one is
          added in the Studio. */}
      <div className="u-wrap mt-[clamp(2.5rem,6vw,4.5rem)]">
        <div
          className="rounded-lg overflow-hidden relative aspect-[16/10]"
          style={{
            boxShadow: "var(--shadow-e3)",
            background: "var(--surface-raised)",
            viewTransitionName: `project-${project.slug}`,
          }}
        >
          <ProjectCover
            project={project}
            width={1600}
            height={1000}
            sizes="(max-width: 1240px) 100vw, 1240px"
            priority
          />
        </div>
      </div>

      {/* ---------- meta rail ---------- */}
      <section className="u-section u-ground-raised">
        <div className="u-wrap grid lg:grid-cols-12 gap-x-10 gap-y-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 grid gap-7">
              <MetaItem label="Date" value={formatDate(project.date)} />
              {project.role && (
                <MetaItem label="My role" value={project.role} />
              )}
              {project.techTags && project.techTags.length > 0 && (
                <div className="grid gap-3">
                  <span className="u-eyebrow">Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {project.techTags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="lg:col-span-9 grid gap-[clamp(2.5rem,5vw,4rem)]">
            <Beat n="01" title="The problem" body={project.problem} />
            <Beat n="02" title="My approach" body={project.approach} />
            <Beat n="03" title="The outcome" body={project.outcome} />
          </div>
        </div>
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section className="u-section pt-0">
          <div className="u-wrap grid gap-8 sm:grid-cols-2">
            {project.gallery.map((img, i) => {
              const src = imageUrl(img, 1000, 700);
              if (!src) return null;
              return (
                <Reveal key={i} index={i}>
                  <figure className="grid gap-3">
                    <div
                      className="rounded-md overflow-hidden relative aspect-[10/7]"
                      style={{
                        boxShadow: "var(--shadow-e2)",
                        background: "var(--surface-raised)",
                      }}
                    >
                      <Image
                        src={src}
                        alt={img.alt ?? ""}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="u-caption">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <ConnectBand linkedinUrl={profile?.linkedinUrl} />
    </>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <span className="u-eyebrow">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

/**
 * The four-beat spine. Numbering here is not decoration — a case study is a
 * genuine sequence, and the reader benefits from knowing where they are in it.
 */
function Beat({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body?: Parameters<typeof Prose>[0]["value"];
}) {
  if (!body?.length) return null;
  return (
    <Reveal>
      <div className="grid gap-4">
        <div className="flex items-baseline gap-4">
          <span
            className="font-mono text-[13px] tabular-nums"
            style={{ color: "var(--ink-technical)" }}
          >
            {n}
          </span>
          <h2 className="u-h2">{title}</h2>
        </div>
        <Prose value={body} />
      </div>
    </Reveal>
  );
}
