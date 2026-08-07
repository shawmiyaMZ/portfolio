import { describe, expect, it } from "vitest";
import type { PortableTextBlock } from "@portabletext/react";
import { countWords } from "@/lib/headings";
import type { PortableText } from "./types";
import {
  seedPostSummaries,
  seedPosts,
  seedProfile,
  seedProjectSummaries,
  seedProjects,
  seedTags,
} from "./seed";

type Block = PortableText[number];

const isBlock = (value: Block): value is PortableTextBlock =>
  value._type === "block";

const blocksOf = (body?: PortableText): PortableTextBlock[] =>
  (body ?? []).filter(isBlock);

const summarize = (bodies: PortableText[]) => ({
  styles: new Set(bodies.flatMap((b) => blocksOf(b).map((x) => x.style))),
  listItems: new Set(
    bodies.flatMap((b) => blocksOf(b).map((x) => x.listItem).filter(Boolean)),
  ),
  spanMarks: new Set(
    bodies.flatMap((b) =>
      blocksOf(b).flatMap((x) => (x.children ?? []).flatMap((c) => c.marks ?? [])),
    ),
  ),
  markDefTypes: new Set(
    bodies.flatMap((b) =>
      blocksOf(b).flatMap((x) => (x.markDefs ?? []).map((m) => m._type)),
    ),
  ),
  memberTypes: new Set(
    bodies.flatMap((b) => b.filter((x) => x._type !== "block").map((x) => x._type)),
  ),
  calloutTones: new Set(
    bodies.flatMap((b) =>
      b
        .filter((x): x is Block & { tone: string } => x._type === "callout")
        .map((x) => x.tone),
    ),
  ),
});

const union = summarize(seedPosts.map((p) => p.body));

describe("seed data invariants", () => {
  it("keeps slugs unique across projects and posts", () => {
    const slugs = [
      ...seedProjects.map((p) => p.slug),
      ...seedPosts.map((p) => p.slug),
    ];
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps body keys unique within each array", () => {
    const bodies = [
      ...seedPosts.flatMap((p) => [p.body]),
      ...seedProjects.flatMap((p) => [p.problem, p.approach, p.outcome].filter(Boolean)),
    ] as PortableText[];
    for (const body of bodies) {
      const keys = body.map((x) => x._key);
      expect(new Set(keys).size, body.map((x) => x._key).join(",")).toBe(keys.length);
    }
  });

  it("carries the required identifying fields", () => {
    for (const post of seedPosts) {
      expect(post.title.trim().length).toBeGreaterThan(0);
      expect(post.slug).toBeTruthy();
      expect(post.excerpt.trim().length).toBeGreaterThan(0);
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(post.body.length).toBeGreaterThan(0);
    }
    for (const project of seedProjects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(project.slug).toBeTruthy();
      expect(project.summary.trim().length).toBeGreaterThan(0);
      expect(project.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof project.featured).toBe("boolean");
    }
    for (const summary of seedPostSummaries) {
      expect(summary.readingTime).toBeGreaterThan(0);
    }
    expect(seedProfile.name.trim().length).toBeGreaterThan(0);
    expect(seedProfile.headline.trim().length).toBeGreaterThan(0);
    expect(seedProfile.thesis.trim().length).toBeGreaterThan(0);
    expect(seedTags.length).toBeGreaterThan(0);
  });

  it("keeps manual readingTime in step with the GROQ formula", () => {
    for (const post of seedPosts) {
      const expected = Math.round(countWords(post.body) / 200) + 1;
      expect(post.readingTime, post.slug).toBe(expected);
    }
  });

  it("derives representative summaries from their full records", () => {
    const posts = new Map(seedPosts.map((p) => [p.slug, p]));
    for (const s of seedPostSummaries) {
      const full = posts.get(s.slug);
      expect(full).toBeDefined();
      expect(s.title).toBe(full?.title);
      expect(s.excerpt).toBe(full?.excerpt);
      expect(s.readingTime).toBe(full?.readingTime);
    }
    const projects = new Map(seedProjects.map((p) => [p.slug, p]));
    for (const s of seedProjectSummaries) {
      const full = projects.get(s.slug);
      expect(full).toBeDefined();
      expect(s.title).toBe(full?.title);
      expect(s.featured).toBe(full?.featured);
    }
  });
});

describe("renderer coverage", () => {
  it("covers every block style Prose renders", () => {
    expect([...union.styles]).toEqual(
      expect.arrayContaining(["normal", "h2", "h3", "blockquote"]),
    );
  });

  it("covers both list kinds", () => {
    expect([...union.listItems]).toEqual(
      expect.arrayContaining(["bullet", "number"]),
    );
  });

  it("covers inline and fenced code plus links", () => {
    expect(union.spanMarks).toContain("code");
    expect(union.markDefTypes).toContain("link");
    expect(union.memberTypes).toContain("codeBlock");
  });

  it("covers image blocks and all three callout tones", () => {
    expect(union.memberTypes).toContain("image");
    expect(union.memberTypes).toContain("callout");
    expect([...union.calloutTones]).toEqual(
      expect.arrayContaining(["note", "insight", "warning"]),
    );
  });

  it("marks go to resolvable markDefs or known decorators", () => {
    for (const post of seedPosts) {
      for (const block of blocksOf(post.body)) {
        const defKeys = new Set((block.markDefs ?? []).map((m) => m._key));
        for (const child of block.children ?? []) {
          for (const mark of child.marks ?? []) {
            if (defKeys.has(mark)) {
              const defs = (block.markDefs ?? []).filter((m) => m._key === mark);
              for (const def of defs) {
                if (def._type === "link") {
                  expect(
                    typeof (def as { href?: unknown }).href,
                    post.slug,
                  ).toBe("string");
                }
              }
            } else if (mark === "code") {
              expect((child.text ?? "").trim().length).toBeGreaterThan(0);
            } else {
              expect.fail(`${post.slug}: dangling mark "${mark}"`);
            }
          }
        }
      }
    }
  });
});