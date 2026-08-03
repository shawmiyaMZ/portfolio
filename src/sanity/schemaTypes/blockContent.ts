import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The journal body.
 *
 * Kept deliberately small. Every block type here has a designed
 * counterpart in the Studio Light system — if a block cannot be styled
 * in the system it does not belong in the editor, because an option
 * that renders badly is worse than no option at all.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Only h2 and h3: the page already owns h1, and h4+ never earns
      // its place in a post this length.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ["http", "https", "mailto"] }),
              }),
            ],
          }),
        ],
      },
    }),

    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          description:
            "What the image conveys, for screen readers and when it fails to load.",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "caption", type: "string", title: "Caption" }),
      ],
    }),

    defineArrayMember({
      name: "codeBlock",
      type: "object",
      title: "Code",
      fields: [
        defineField({
          name: "language",
          type: "string",
          title: "Language",
          initialValue: "typescript",
          options: {
            list: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "TSX", value: "tsx" },
              { title: "Python", value: "python" },
              { title: "Bash", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "SQL", value: "sql" },
              { title: "CSS", value: "css" },
              { title: "Plain text", value: "text" },
            ],
          },
        }),
        defineField({
          name: "filename",
          type: "string",
          title: "Filename",
          description: "Optional. Shown above the block.",
        }),
        defineField({
          name: "code",
          type: "text",
          title: "Code",
          rows: 12,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { language: "language", filename: "filename", code: "code" },
        prepare({ language, filename, code }) {
          return {
            title: filename || `${language ?? "code"} block`,
            subtitle: (code ?? "").split("\n")[0]?.slice(0, 60),
          };
        },
      },
    }),

    defineArrayMember({
      name: "callout",
      type: "object",
      title: "Callout",
      fields: [
        defineField({
          name: "tone",
          type: "string",
          title: "Tone",
          initialValue: "note",
          options: {
            list: [
              { title: "Note", value: "note" },
              { title: "What I learned", value: "insight" },
              { title: "Watch out", value: "warning" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "body",
          type: "text",
          title: "Text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: { tone: "tone", body: "body" },
        prepare: ({ tone, body }) => ({
          title: body?.slice(0, 60),
          subtitle: `Callout · ${tone}`,
        }),
      },
    }),
  ],
});
