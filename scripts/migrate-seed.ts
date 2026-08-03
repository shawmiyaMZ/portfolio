/**
 * Push the seed content into Sanity.
 *
 * The seed was written to be migrated: its bodies are already portable text
 * in the shape the Studio emits, so this is a transcription rather than a
 * transformation. Only three things genuinely differ between the local shape
 * and the CMS shape, and each is handled below:
 *
 *   1. slugs        — a plain string locally, a { _type: "slug", current }
 *                     object in Sanity
 *   2. post tags    — embedded objects locally, references to real tag
 *                     documents in Sanity
 *   3. identity     — documents need stable _ids so re-running this updates
 *                     rather than duplicating
 *
 * Idempotent by design. `createOrReplace` keyed on a deterministic _id means
 * running it twice leaves the dataset identical, so a failed run can simply
 * be repeated.
 *
 * Images are deliberately not migrated: there are none in the seed, and the
 * clay covers are a designed state rather than a placeholder. Upload real
 * covers in the Studio when you have them.
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
const slugField = (current: string) => ({ _type: "slug", current });

async function migrate() {
  const docs: Array<Record<string, unknown>> = [];

  // Tags first — posts reference them, so they must exist.
  for (const tag of seedTags) {
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

  for (const p of seedProjects) {
    docs.push({
      _id: `project-${p.slug}`,
      _type: "project",
      title: p.title,
      slug: slugField(p.slug),
      summary: p.summary,
      date: p.date,
      featured: p.featured ?? false,
      role: p.role,
      techTags: p.techTags,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      problem: p.problem,
      approach: p.approach,
      outcome: p.outcome,
    });
  }

  for (const post of seedPosts) {
    docs.push({
      _id: `post-${post.slug}`,
      _type: "post",
      title: post.title,
      slug: slugField(post.slug),
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      body: post.body,
      // Embedded objects locally; real references in the CMS, so the tag
      // pages and filters resolve against one canonical tag document.
      tags: post.tags?.map((t) => ({
        _key: t.slug,
        _type: "reference",
        _ref: tagId(t.slug),
      })),
    });
  }

  const tx = docs.reduce(
    (t, doc) => t.createOrReplace(doc as never),
    client.transaction(),
  );

  await tx.commit();

  console.log(
    `Migrated ${docs.length} documents to ${projectId}/${dataset}:\n` +
      `  ${seedTags.length} tags\n` +
      `  1 profile\n` +
      `  ${seedProjects.length} projects\n` +
      `  ${seedPosts.length} posts\n\n` +
      `Reading time is computed in GROQ from the body, so it will match what\n` +
      `the site showed from seed. Open /studio to confirm.`,
  );
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message ?? err);
  process.exit(1);
});
