import { describe, expect, it } from "vitest";
import type { PortableTextBlock } from "@portabletext/react";
import {
  blockToText,
  bodyToPlainText,
  extractHeadings,
  slugifyHeading,
} from "./headings";
import type { PortableText } from "@/sanity/lib/types";

const block = (text: string, style = "normal"): PortableTextBlock =>
  ({
    _type: "block",
    _key: "b",
    style,
    children: [{ _type: "span", _key: "s", text, marks: [] }],
  }) as PortableTextBlock;

describe("blockToText", () => {
  it("flattens span text, dropping formatting", () => {
    const b = {
      _type: "block",
      _key: "b",
      style: "normal",
      children: [
        { _type: "span", _key: "a", text: "Hello ", marks: [] },
        { _type: "span", _key: "c", text: "world", marks: ["code"] },
      ],
    } as PortableTextBlock;
    expect(blockToText(b)).toBe("Hello world");
  });

  it("returns empty string for a block with no children", () => {
    expect(blockToText({ _type: "block", _key: "b" } as PortableTextBlock)).toBe("");
  });
});

describe("slugifyHeading", () => {
  it("lowercases, trims, and collapses whitespace to dashes", () => {
    expect(slugifyHeading(block("  What It Cost  "))).toBe("what-it-cost");
  });

  it("strips non-word characters but keeps internal dashes", () => {
    expect(slugifyHeading(block("Rerank, then truncate"))).toBe("rerank-then-truncate");
    expect(slugifyHeading(block("three — not four"))).toBe("three-not-four");
  });

  it("leaves apostrophes and underscores removed", () => {
    expect(slugifyHeading(block("Leading — what it means"))).toBe(
      "leading-what-it-means",
    );
  });

  it("caps the id length at 60 characters", () => {
    const long = "x".repeat(120);
    expect(slugifyHeading(block(long)).length).toBe(60);
  });
});

describe("extractHeadings", () => {
  const body: PortableText = [
    block("Intro", "paragraph"),
    block("First", "h2"),
    block("Sub heading", "h3"),
    block("Another h2", "h2"),
    { _type: "image", _key: "img", asset: {} },
    { _type: "callout", _key: "c", tone: "note", body: "x" },
  ];

  it("returns h2 and h3 blocks in order with ids matching slugifyHeading", () => {
    const headings = extractHeadings(body);
    expect(headings.map((h) => h.text)).toEqual(["First", "Sub heading", "Another h2"]);
    expect(headings.map((h) => h.id)).toEqual([
      slugifyHeading(block("First", "h2")),
      slugifyHeading(block("Sub heading", "h3")),
      slugifyHeading(block("Another h2", "h2")),
    ]);
    expect(headings.map((h) => h.level)).toEqual([2, 3, 2]);
  });

  it("ignores non-blocks, non-heading styles, and empty headings", () => {
    const headings = extractHeadings([
      ...body,
      block("", "h2"),
      { _type: "image", _key: "i2", asset: {} } as PortableText[number],
    ]);
    expect(headings.map((h) => h.text)).toEqual(["First", "Sub heading", "Another h2"]);
  });

  it("returns an empty array for empty or missing bodies", () => {
    expect(extractHeadings()).toEqual([]);
    expect(extractHeadings([])).toEqual([]);
  });
});

describe("bodyToPlainText", () => {
  it("joins block text with spaces, ignoring non-blocks", () => {
    const body: PortableText = [
      block("one"),
      block("two words", "h2"),
      { _type: "image", _key: "i", asset: {} },
    ];
    expect(bodyToPlainText(body)).toBe("one two words");
  });

  it("returns empty string for empty or missing bodies", () => {
    expect(bodyToPlainText()).toBe("");
    expect(bodyToPlainText([])).toBe("");
  });
});

describe("Prose/TOC id contract", () => {
  it("extractHeadings ids match slugifyHeading of the same heading", () => {
    const body: PortableText = [
      block("Where the confidence came from", "h2"),
      block("On case count", "h3"),
    ];
    const headings = extractHeadings(body);
    expect(headings.map((h) => h.id)).toEqual(body.map((b) => slugifyHeading(b as PortableTextBlock)));
  });
});