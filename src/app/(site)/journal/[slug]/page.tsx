import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/content/Prose";
import { ReadingProgress, TableOfContents } from "@/components/content/PostChrome";
import { StudioField } from "@/components/field/StudioField";
import { Tag, formatDate } from "@/components/ui/primitives";
import { extractHeadings } from "@/lib/headings";
import {
  getPost,
  getPostNavigation,
  getPostSlugs,
} from "@/sanity/lib/content";
import { imageUrl } from "@/sanity/lib/image";

type Params = { params: Promise<{ slug: string }> };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: `/journal/${slug}/opengraph-image`, width: 1200, height: 630 }],
    },
    alternates: { canonical: `${siteUrl}/journal/${slug}` },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const nav = await getPostNavigation(post.publishedAt);
  const headings = extractHeadings(post.body);
  const cover = imageUrl(post.coverImage, 1600, 900);

  // JSON-LD so the post is machine-readable as an article, not just a page.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${siteUrl}/journal/${slug}`,
    mainEntityOfPage: `${siteUrl}/journal/${slug}`,
    keywords: post.tags?.map((t) => t.title).join(", "),
    wordCount: post.readingTime * 200,
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="relative u-top-clear">
          <StudioField />
          <div className="u-wrap relative z-10">
            <Link
              href="/journal"
              className="link-underline text-sm no-underline"
              style={{ color: "var(--ink-secondary)" }}
            >
              ← Journal
            </Link>

            <h1
              className="u-h1 mt-6"
              style={{ maxWidth: "18ch" }}
            >
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="u-caption">
                {formatDate(post.publishedAt)} · {post.readingTime} min read
              </span>
              {post.tags?.map((t) => (
                <Tag key={t.slug} tone="sage">
                  {t.title}
                </Tag>
              ))}
            </div>
          </div>
        </header>

        {cover && (
          <div className="u-wrap mt-[clamp(2rem,5vw,3.5rem)]">
            <div
              className="rounded-lg overflow-hidden relative aspect-[16/9]"
              style={{
                boxShadow: "var(--shadow-e3)",
                background: "var(--surface-raised)",
              }}
            >
              <Image
                src={cover}
                alt={post.coverImage?.alt ?? ""}
                fill
                priority
                sizes="(max-width: 1240px) 100vw, 1240px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="u-section">
          <div className="u-wrap grid xl:grid-cols-12 gap-x-12">
            <div className="xl:col-span-8 xl:col-start-2">
              <Prose value={post.body} />
            </div>

            {/* Sticky TOC lives in the right gutter, and only where there is
                genuinely a gutter to put it in. */}
            <aside className="hidden xl:block xl:col-span-3">
              <div className="sticky top-24">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          </div>
        </div>

        <nav
          className="u-wrap pb-[clamp(4rem,8vw,7rem)] grid sm:grid-cols-2 gap-6"
          aria-label="More posts"
        >
          <PostLink post={nav.previous} direction="previous" />
          <PostLink post={nav.next} direction="next" />
        </nav>
      </article>
    </>
  );
}

function PostLink({
  post,
  direction,
}: {
  post: { title: string; slug: string } | null;
  direction: "previous" | "next";
}) {
  if (!post) return <div aria-hidden="true" />;
  const next = direction === "next";

  return (
    <Link
      href={`/journal/${post.slug}`}
      className={`tilt-target rounded-md p-6 no-underline grid gap-2 ${next ? "sm:text-right" : ""}`}
      style={{
        background: "var(--surface-ground)",
        boxShadow: "var(--shadow-e2)",
        color: "inherit",
      }}
    >
      <span className="u-eyebrow">{next ? "Newer" : "Older"}</span>
      <span className="u-h3">{post.title}</span>
    </Link>
  );
}
