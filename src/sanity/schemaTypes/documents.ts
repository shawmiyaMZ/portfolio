import { defineField, defineType } from "sanity";

/** Shared slug config — generated from the title, and required everywhere. */
const slugField = (source = "title") =>
  defineField({
    name: "slug",
    type: "slug",
    title: "Slug",
    description: "The URL for this page. Generate it from the title.",
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  });

/**
 * profile — a singleton.
 *
 * Note what is absent: no email, no phone, no location, no resume, no
 * secondary socials. LinkedIn is the only external personal link on this
 * site, and the schema enforces that rather than trusting the editor to
 * remember. You cannot publish a contact detail that has nowhere to go.
 */
export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      type: "string",
      title: "Headline",
      description: "One line. Appears under your name in the hero.",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "thesis",
      type: "text",
      rows: 3,
      title: "Hero thesis",
      description:
        "The hero statement, shown under your name and role. What you believe about building software — in your own voice, not marketing copy.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "bio",
      type: "blockContent",
      title: "Professional bio",
      description: "Shown on the About page. Learning journey and goals.",
    }),
    defineField({
      name: "avatar",
      type: "image",
      title: "Avatar",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "linkedinUrl",
      type: "url",
      title: "LinkedIn URL",
      description: "The only external personal link on the site.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom((value) =>
            !value || value.includes("linkedin.com")
              ? true
              : "Must be a LinkedIn URL — it is the only personal link this site carries.",
          ),
    }),
    defineField({
      name: "education",
      type: "array",
      title: "Education",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "qualification", type: "string" }),
            defineField({ name: "institution", type: "string" }),
            defineField({ name: "period", type: "string" }),
          ],
          preview: {
            select: { title: "qualification", subtitle: "institution" },
          },
        },
      ],
    }),
    defineField({
      name: "skillGroups",
      type: "array",
      title: "Skills",
      description: "Grouped by category. Named tiers — never percentages.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "category", type: "string" }),
            defineField({
              name: "skills",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "name", type: "string" }),
                    defineField({
                      name: "level",
                      type: "string",
                      options: {
                        list: [
                          { title: "Working with daily", value: "daily" },
                          { title: "Comfortable", value: "comfortable" },
                          { title: "Learning", value: "learning" },
                        ],
                        layout: "radio",
                      },
                      initialValue: "comfortable",
                    }),
                  ],
                  preview: { select: { title: "name", subtitle: "level" } },
                },
              ],
            }),
          ],
          preview: { select: { title: "category" } },
        },
      ],
    }),
    defineField({
      name: "milestones",
      type: "array",
      title: "Timeline",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "year", type: "string" }),
            defineField({ name: "event", type: "string" }),
            defineField({ name: "detail", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "event", subtitle: "year" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "headline" },
  },
});

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
  ],
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      title: "Summary",
      description: "One or two sentences. Shown in the grid and on the home page.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      type: "array",
      title: "Gallery",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "techTags",
      type: "array",
      title: "Tech",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "role",
      type: "string",
      title: "My role",
      description: "What you actually did. Be specific.",
    }),
    // The four-beat spine. Every case study answers the same questions in
    // the same order, which is what makes projects comparable to a reader.
    defineField({
      name: "problem",
      type: "blockContent",
      title: "1 · Problem",
    }),
    defineField({
      name: "approach",
      type: "blockContent",
      title: "2 · Approach",
    }),
    defineField({
      name: "outcome",
      type: "blockContent",
      title: "3 · Outcome",
    }),
    defineField({
      name: "githubUrl",
      type: "url",
      title: "GitHub repository",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "liveUrl",
      type: "url",
      title: "Live demo",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured on the home page",
      initialValue: false,
    }),
    defineField({
      name: "date",
      type: "date",
      title: "Date",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
      media: "coverImage",
      featured: "featured",
    },
    prepare: ({ title, subtitle, media, featured }) => ({
      title: featured ? `★ ${title}` : title,
      subtitle,
      media,
    }),
  },
});

export const post = defineType({
  name: "post",
  title: "Journal post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      title: "Excerpt",
      description:
        "Shown in the index and used as the meta description. Write it for someone deciding whether to read.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "body",
      type: "blockContent",
      title: "Body",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "excerpt", media: "coverImage" },
  },
});
