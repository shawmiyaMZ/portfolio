import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { codeToHtml } from "shiki";
import { imageUrl } from "@/sanity/lib/image";
import type { PortableText as PortableTextValue } from "@/sanity/lib/types";
import { slugifyHeading } from "@/lib/headings";

/**
 * Syntax highlighting happens here, on the server, at build time.
 *
 * Shiki runs during rendering and emits plain styled HTML, so the browser
 * downloads zero highlighting JavaScript. A client-side highlighter would
 * cost 40–100 KB and a flash of unstyled code for exactly the same result.
 */
async function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}) {
  let html: string;
  try {
    html = await codeToHtml(code, {
      lang: language || "text",
      theme: "vitesse-dark",
    });
  } catch {
    // An unknown language must never take down a whole post.
    html = await codeToHtml(code, { lang: "text", theme: "vitesse-dark" });
  }

  return (
    <figure className="not-prose my-8">
      {filename && (
        <figcaption
          className="font-mono text-[12.5px] px-4 py-2 rounded-t-sm"
          style={{
            background: "#16181d",
            color: "var(--color-ash)",
            borderBottom: "1px solid rgba(255,255,255,.07)",
          }}
        >
          {filename}
        </figcaption>
      )}
      <div
        className={`u-scroll-x shiki-host ${filename ? "rounded-b-sm" : "rounded-sm"}`}
        style={{ boxShadow: "var(--shadow-e2)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

const TONE = {
  note: { rule: "var(--color-cobalt)", wash: "rgba(62,92,118,.07)", label: "Note" },
  insight: {
    rule: "var(--color-sage)",
    wash: "rgba(139,150,131,.12)",
    label: "What I learned",
  },
  warning: {
    rule: "var(--color-madder)",
    wash: "rgba(178,58,82,.07)",
    label: "Watch out",
  },
} as const;

function Callout({ tone, body }: { tone?: keyof typeof TONE; body: string }) {
  const t = TONE[tone ?? "note"] ?? TONE.note;
  return (
    <aside
      className="not-prose my-8 py-5 px-6 rounded-r-sm grid gap-1.5"
      style={{ borderLeft: `3px solid ${t.rule}`, background: t.wash }}
    >
      <span className="u-eyebrow">{t.label}</span>
      <p className="text-[15.5px] leading-relaxed">{body}</p>
    </aside>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-[1.15em]">{children}</p>,
    // Headings carry generated ids so the table of contents can link to them
    // without the author having to think about anchors.
    h2: ({ children, value }) => (
      <h2
        id={slugifyHeading(value)}
        className="u-h2 mt-[1.9em] mb-[0.6em]"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={slugifyHeading(value)}
        className="u-h3 mt-[1.6em] mb-[0.5em]"
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-8 pl-6 italic"
        style={{
          borderLeft: "2px solid var(--color-ash)",
          color: "var(--ink-secondary)",
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-[1.15em] pl-6 list-disc grid gap-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-[1.15em] pl-6 list-decimal grid gap-2">{children}</ol>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code
        className="text-[0.88em] px-1.5 py-0.5 rounded-xs"
        style={{
          background: "rgba(62,92,118,.09)",
          color: "var(--color-cobalt)",
        }}
      >
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = (value?.href ?? "") as string;
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="link-underline"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const src = imageUrl(value, 1400);
      if (!src) return null;
      return (
        <figure className="not-prose my-10">
          <Image
            src={src}
            alt={value.alt ?? ""}
            width={1400}
            height={900}
            sizes="(max-width: 768px) 100vw, 68ch"
            className="rounded-md w-full h-auto"
            style={{ boxShadow: "var(--shadow-e2)" }}
          />
          {value.caption && (
            <figcaption className="u-caption mt-3">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => (
      <CodeBlock
        code={value.code}
        language={value.language}
        filename={value.filename}
      />
    ),
    callout: ({ value }) => <Callout tone={value.tone} body={value.body} />,
  },
};

export function Prose({
  value,
  className = "",
}: {
  value?: PortableTextValue;
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div
      className={`text-(length:--text-prose)/[1.75] ${className}`}
      style={{ maxWidth: "var(--measure-prose)" }}
    >
      <PortableText value={value} components={components} />
    </div>
  );
}
