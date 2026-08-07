/**
 * Push the seed content into Sanity.
 *
 * The seed is the owner's real portfolio (mirrored from the live CMS), so a
 * fresh dataset receives the actual site content: tags, the profile, the
 * three projects and the two journal posts. Bodies are already portable text
 * in the shape the Studio emits, so this is a transcription rather than a
 * transformation. Three things genuinely differ between the local shape and
 * the CMS shape, and each is handled below:
 *
 *   1. slugs     — a plain string locally, a { _type: "slug", current }
 *                  object in Sanity
 *   2. identity  — documents need stable _ids so re-running this updates
 *                  rather than duplicating
 *   3. tags      — a local { title, slug } pair becomes a reference to the
 *                  tag document created earlier in the same transaction
 *
 * This is a first-run convenience for an EMPTY dataset, and it is explicitly
 * non-destructive: every document is created with `createIfNotExists`, so
 * once real content is in the Studio a re-run leaves it untouched. Never
 * point this at a dataset that already holds content you own.
 *
 * Images are deliberately not migrated: the seed drops image members and
 * carries no covers or galleries, because an uploaded asset has a binary the
 * seed cannot ship. Upload real images in the Studio after seeding.
 *
 *   npx tsx scripts/migrate-seed.ts
 *
 * Requires SANITY_API_WRITE_TOKEN — an Editor token from
 * sanity.io/manage → API → Tokens. It is never committed and never read by
 * the site itself; only this script uses it.
 */

import { createClient } from "next-sanity";
import {
  seedPosts,
  seedProfile,
  seedProjects,
  seedTags,
} from "../src/sanity/lib/seed";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01";

if (!projectId) {
  console.error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Fill .env.local first.",
  );
  process.exit(1);
}

if (!token) {
  console.error(
    "SANITY_API_WRITE_TOKEN is not set.\n" +
      "Create an Editor token at sanity.io/manage → API → Tokens, then add it\n" +
      "to .env.local. It is only used by this script.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

/** Deterministic ids, so re-running updates in place. */
const tagId = (slug: string) => `tag-${slug}`;
const projectIdFor = (slug: string) => `project-${slug}`;
const postIdFor = (slug: string) => `post-${slug}`;
const slugField = (current: string) => ({ _type: "slug", current });

/** Resolve local { title, slug } tags to references the Studio understands. */
const toTagReferences = (tags?: Array<{ slug: string }>) =>
  tags?.map((t) => ({ _type: "reference", _ref: tagId(t.slug) }));

async function migrate() {
  const docs: Array<Record<string, unknown>> = [];

  // Tags first — posts and projects reference them, so they must exist.
  const seedTagSet = new Map(seedTags.map((tag) => [tag.slug, tag]));

  for (const tag of seedTagSet.values()) {
    docs.push({
      _id: tagId(tag.slug),
      _type: "tag",
      title: tag.title,
      slug: slugField(tag.slug),
    });
  }

  // The profile is a singleton: one fixed id, never duplicated.
  docs.push({
    _id: "profile",
    _type: "profile",
    name: seedProfile.name,
    headline: seedProfile.headline,
    thesis: seedProfile.thesis,
    bio: seedProfile.bio,
    linkedinUrl: seedProfile.linkedinUrl,
    education: seedProfile.education?.map((e, i) => ({ _key: `edu${i}`, ...e })),
    skillGroups: seedProfile.skillGroups?.map((g, i) => ({
      _key: `grp${i}`,
      category: g.category,
      skills: g.skills?.map((s, j) => ({ _key: `sk${i}-${j}`, ...s })),
    })),
    milestones: seedProfile.milestones?.map((m, i) => ({
      _key: `ms${i}`,
      ...m,
    })),
  });

  // Projects and journal posts, keyed by their own deterministic ids.
  for (const project of seedProjects) {
    docs.push({
      _id: projectIdFor(project.slug),
      _type: "project",
      title: project.title,
      slug: slugField(project.slug),
      summary: project.summary,
      date: project.date,
      featured: project.featured,
      role: project.role,
      techTags: project.techTags,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      tags: toTagReferences(project.tags),
      problem: project.problem,
      approach: project.approach,
      outcome: project.outcome,
    });
  }

  for (const post of seedPosts) {
    docs.push({
      _id: postIdFor(post.slug),
      _type: "post",
      title: post.title,
      slug: slugField(post.slug),
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      tags: toTagReferences(post.tags),
      body: post.body,
      // readingTime is computed in GROQ, so it is not stored on the document.
    });
  }

  // `createIfNotExists`, never `createOrReplace`.
  //
  // This script seeds an empty dataset. Once real content exists it must not
  // touch it — everything here, the profile included, is a first-run seed and
  // a later run must leave Studio edits alone. Seeding is a convenience, not
  // a reset, and it is therefore safe only against an empty dataset.
  const tx = docs.reduce(
    (t, doc) => t.createIfNotExists(doc as never),
    client.transaction(),
  );

  await tx.commit();

  console.log(
    `Seeded ${projectId}/${dataset} with up to ${docs.length} documents:\n` +
      `  ${seedTagSet.size} tags\n` +
      `  1 profile\n` +
      `  ${seedProjects.length} projects\n` +
      `  ${seedPosts.length} journal posts\n\n` +
      `Anything that already existed was left untouched.\n` +
      `Images were not migrated — upload real covers and bodies in the Studio.\n` +
      `Open /studio to confirm.`,
  );
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message ?? err);
  process.exit(1);
});