import { isSanityConfigured } from "../env";
import { sanityFetch } from "./client";
import * as q from "./queries";
import {
  seedPostSummaries,
  seedPosts,
  seedProfile,
  seedProjectSummaries,
  seedProjects,
  seedTags,
} from "./seed";
import type {
  Post,
  PostNavigation,
  PostSummary,
  Profile,
  Project,
  ProjectSummary,
  Tag,
} from "./types";

/**
 * Every read the site performs, in one place.
 *
 * Pages call these rather than touching GROQ, so cache tags can never drift
 * out of sync with the query they belong to, and an unconfigured Sanity
 * degrades identically everywhere.
 *
 * Before Sanity is connected the fallbacks are the seed content rather than
 * empty arrays. That is deliberate: it means the site can be designed and
 * reviewed against real copy — long titles, dense tag rows, two-line
 * headings — instead of placeholder boxes, and a fresh clone shows what the
 * site is meant to look like. The moment a project ID exists, every one of
 * these reads from Sanity instead.
 */
const seeded = <T>(value: T, empty: T): T =>
  isSanityConfigured ? empty : value;

export const getProfile = () =>
  sanityFetch<Profile | null>(q.profileQuery, {
    fallback: seeded(seedProfile, null),
    tags: [q.TAGS.profile],
  });

export const getFeaturedProjects = () =>
  sanityFetch<ProjectSummary[]>(q.featuredProjectsQuery, {
    fallback: seeded(seedProjectSummaries, []),
    tags: [q.TAGS.project],
  });

export const getAllProjects = () =>
  sanityFetch<ProjectSummary[]>(q.allProjectsQuery, {
    fallback: seeded(seedProjectSummaries, []),
    tags: [q.TAGS.project],
  });

export const getProject = (slug: string) =>
  sanityFetch<Project | null>(q.projectBySlugQuery, {
    params: { slug },
    fallback: seeded(seedProjects.find((p) => p.slug === slug) ?? null, null),
    tags: [q.TAGS.project],
  });

export const getProjectSlugs = () =>
  sanityFetch<string[]>(q.projectSlugsQuery, {
    fallback: seeded(seedProjects.map((p) => p.slug), []),
    tags: [q.TAGS.project],
  });

export const getLatestPosts = () =>
  sanityFetch<PostSummary[]>(q.latestPostsQuery, {
    fallback: seeded(seedPostSummaries, []),
    tags: [q.TAGS.post],
  });

export const getAllPosts = () =>
  sanityFetch<PostSummary[]>(q.allPostsQuery, {
    fallback: seeded(seedPostSummaries, []),
    tags: [q.TAGS.post],
  });

export const getPost = (slug: string) =>
  sanityFetch<Post | null>(q.postBySlugQuery, {
    params: { slug },
    fallback: seeded(seedPosts.find((p) => p.slug === slug) ?? null, null),
    tags: [q.TAGS.post],
  });

export const getPostSlugs = () =>
  sanityFetch<string[]>(q.postSlugsQuery, {
    fallback: seeded(seedPosts.map((p) => p.slug), []),
    tags: [q.TAGS.post],
  });

export const getPostNavigation = (publishedAt: string) =>
  sanityFetch<PostNavigation>(q.postNavigationQuery, {
    params: { publishedAt },
    fallback: { previous: null, next: null },
    tags: [q.TAGS.post],
  });

/**
 * Tags used by posts. Named for the surface it serves, because projects now
 * share the same `tag` vocabulary and a bare `getTags` would not say which
 * filter it feeds.
 */
export const getPostTags = () =>
  sanityFetch<Tag[]>(q.postTagsQuery, {
    fallback: seeded(seedTags, []),
    tags: [q.TAGS.tag, q.TAGS.post],
  });
