import type { PortableTextBlock } from "@portabletext/react";
import type { Image } from "sanity";

export type SanityImage = Image & {
  alt?: string;
  caption?: string;
};

/**
 * A non-block member of a body array.
 *
 * `blockContent` allows `image`, `codeBlock` and `callout` alongside ordinary
 * blocks, and `Prose` renders all three through its `types` map. None of them
 * carry `children`, which `PortableTextBlock` requires — so a body typed as
 * `PortableTextBlock[]` cannot actually hold what Sanity returns. The narrower
 * type went unnoticed only because no content had used those blocks yet.
 */
export type BodyObject = { _type: string; _key?: string } & Record<
  string,
  unknown
>;

export type PortableText = Array<PortableTextBlock | BodyObject>;

export type SkillLevel = "daily" | "comfortable" | "learning";

export type Profile = {
  name: string;
  headline: string;
  thesis: string;
  bio?: PortableText;
  avatar?: SanityImage;
  linkedinUrl: string;
  education?: Array<{
    qualification: string;
    institution: string;
    period: string;
  }>;
  skillGroups?: Array<{
    category: string;
    /** Proficiency is optional: a technology may simply be listed. */
    skills: Array<{ name: string; level?: SkillLevel }>;
  }>;
  milestones?: Array<{ year: string; event: string; detail?: string }>;
};

export type Tag = {
  title: string;
  slug: string;
};

export type ProjectSummary = {
  title: string;
  slug: string;
  summary: string;
  coverImage?: SanityImage;
  techTags?: string[];
  featured?: boolean;
  date: string;
};

export type Project = ProjectSummary & {
  gallery?: SanityImage[];
  role?: string;
  problem?: PortableText;
  approach?: PortableText;
  outcome?: PortableText;
  githubUrl?: string;
  liveUrl?: string;
};

export type PostSummary = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: SanityImage;
  tags?: Tag[];
  publishedAt: string;
  /** Computed in GROQ from the body, so the index never fetches full bodies. */
  readingTime: number;
};

export type Post = PostSummary & {
  body: PortableText;
};

export type PostNavigation = {
  previous: Pick<PostSummary, "title" | "slug"> | null;
  next: Pick<PostSummary, "title" | "slug"> | null;
};
