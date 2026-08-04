import type { Metadata } from "next";
import { StudioField } from "@/components/field/StudioField";

export const metadata: Metadata = {
  title: "Design system",
  description: "Studio Light — the token system behind this site.",
  robots: { index: false, follow: false },
};

const PALETTE = [
  {
    name: "Porcelain",
    hex: "#F6F3EE",
    ratio: "—",
    role: "Primary ground. The lit studio surface.",
    ring: true,
  },
  {
    name: "Graphite",
    hex: "#1A1917",
    ratio: "15.87:1",
    role: "Body text, and the ground of the two inverted bands.",
  },
  {
    name: "Madder",
    hex: "#B23A52",
    ratio: "5.24:1",
    role: "Primary accent and links. Sampled from the avatar's hijab.",
  },
  {
    name: "Madder Deep",
    hex: "#8F2C42",
    ratio: "7.28:1",
    role: "Hover, active, pressed.",
  },
  {
    name: "Cobalt",
    hex: "#3E5C76",
    ratio: "6.33:1",
    role: "Technical accent. Code, tags, metadata, timeline.",
  },
  {
    name: "Plum",
    hex: "#7C4565",
    ratio: "—",
    role: "Deep accent for the inverted bands. From the avatar's top.",
  },
  {
    name: "Sage",
    hex: "#8B9683",
    ratio: "2.80:1",
    role: "Fills and rules only — never text. From the under-cap.",
  },
  {
    name: "Ash",
    hex: "#8C877F",
    ratio: "3.22:1",
    role: "Hairlines and borders only.",
  },
  {
    name: "Ash Ink",
    hex: "#6E6963",
    ratio: "4.91:1",
    role: "Captions, dates, secondary text.",
  },
];

const SCALE = [
  { token: "display", label: "Display 76", cls: "u-display" },
  { token: "h1", label: "H1 52", cls: "u-h1" },
  { token: "h2", label: "H2 34", cls: "u-h2" },
  { token: "h3", label: "H3 24", cls: "u-h3" },
];

export default function DesignSystemPage() {
  return (
    <main>
      {/* ---------- hero ---------- */}
      <header className="relative u-top-clear pb-[var(--space-xl)]">
        <StudioField />
        <div className="u-wrap relative z-10">
          <span className="u-eyebrow block mb-3.5">
            Portfolio design system · Studio Light
          </span>
          <h1 className="u-display max-w-[15ch]">Studio Light</h1>
          <p
            className="mt-6 text-(length:--text-prose)/[1.7]"
            style={{
              maxWidth: "var(--measure-default)",
              color: "var(--ink-secondary)",
            }}
          >
            Every surface on this site is a matte physical object lit by a
            single soft key light from the upper left. Nothing glows. Nothing is
            glassy. Nothing is neon.
          </p>
        </div>
      </header>

      <Hr />

      {/* ---------- palette ---------- */}
      <Section
        eyebrow="Palette"
        title="Sampled from the avatar, named for the firing sequence"
        lede="Madder is the hijab, Sage the under-cap, Plum the top. Madder and Cobalt are temperature opposites at similar value — that opposition is where depth comes from, not a third hue competing for attention. Every ratio below is measured against Porcelain, not estimated."
      >
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(168px,1fr))]">
          {PALETTE.map((c) => (
            <div
              key={c.name}
              className="rounded-md overflow-hidden flex flex-col"
              style={{
                background: "var(--surface-ground)",
                boxShadow: "var(--shadow-e2)",
              }}
            >
              <div
                className="h-[104px]"
                style={{
                  background: c.hex,
                  boxShadow: c.ring
                    ? "inset 0 0 0 1px var(--line-hairline)"
                    : undefined,
                }}
              />
              <div className="p-4 grid gap-1">
                <span
                  className="u-h3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {c.name}
                </span>
                <span
                  className="font-mono text-[12.5px] tabular-nums"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  {c.hex} · {c.ratio}
                </span>
                <span
                  className="text-[13px] leading-snug mt-1"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  {c.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-7 p-4 pl-5 text-[15px] leading-relaxed rounded-r-sm"
          style={{
            borderLeft: "3px solid var(--color-sage)",
            background: "rgba(139,150,131,.10)",
            maxWidth: "var(--measure-prose)",
          }}
        >
          <strong>
            The palette is sampled from the avatar, not chosen beside it.
          </strong>{" "}
          Madder is the hijab, Sage the under-cap, Plum the top. An earlier
          terracotta accent sat 25° from the hijab crimson at the same value —
          close enough to read as a mistake rather than a choice. Ash was also
          specified for secondary text; measured at 3.22:1 it fails AA, so
          captions use <code>--color-ash-ink</code> at 4.91:1 and Ash is
          restricted to hairlines.
        </div>
      </Section>

      <Hr />

      {/* ---------- typography ---------- */}
      <Section
        eyebrow="Typography"
        title="A serif that can be tuned toward clay"
        lede="Fraunces has real SOFT and WONK axes, so the face is dialled toward the material rather than merely chosen. The site settles at SOFT 40 with WONK on — and WONK off below 24px, where its splayed forms stop reading as intent."
      >
        <div
          className="rounded-md p-[var(--space-sm)] grid gap-6"
          style={{
            background: "var(--surface-ground)",
            boxShadow: "var(--shadow-e2)",
          }}
        >
          {[0, 50, 100].map((soft) => (
            <div key={soft} className="flex items-baseline gap-4 flex-wrap">
              <span
                className="font-mono text-[11.5px] tracking-wider min-w-[112px]"
                style={{ color: "var(--ink-secondary)" }}
              >
                SOFT {soft}
              </span>
              <span
                className="text-(length:--text-h2)"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: `"SOFT" ${soft}, "WONK" 1, "opsz" 144`,
                }}
              >
                Engineering journal
              </span>
            </div>
          ))}
        </div>

        <div
          className="mt-6 rounded-md p-[var(--space-sm)]"
          style={{
            background: "var(--surface-ground)",
            boxShadow: "var(--shadow-e2)",
          }}
        >
          {SCALE.map((s) => (
            <div
              key={s.token}
              className="flex items-baseline gap-5 py-2.5"
              style={{ borderTop: "1px solid var(--line-hairline)" }}
            >
              <span
                className="font-mono text-[11px] tracking-wider min-w-[112px] shrink-0"
                style={{ color: "var(--ink-secondary)" }}
              >
                {s.label}
              </span>
              <span className={`${s.cls} truncate`}>Engineering journal</span>
            </div>
          ))}
          <div
            className="flex items-baseline gap-5 py-2.5"
            style={{ borderTop: "1px solid var(--line-hairline)" }}
          >
            <span
              className="font-mono text-[11px] tracking-wider min-w-[112px] shrink-0"
              style={{ color: "var(--ink-secondary)" }}
            >
              CAPTION 14
            </span>
            <span className="u-caption">7 min read · 14 August 2026</span>
          </div>
          <div
            className="flex items-baseline gap-5 py-2.5"
            style={{ borderTop: "1px solid var(--line-hairline)" }}
          >
            <span
              className="font-mono text-[11px] tracking-wider min-w-[112px] shrink-0"
              style={{ color: "var(--ink-secondary)" }}
            >
              MONO 13.5
            </span>
            <code
              className="text-[13.5px]"
              style={{ color: "var(--ink-technical)" }}
            >
              export const revalidate = 60
            </code>
          </div>
        </div>

        <div
          className="mt-6 rounded-md p-[var(--space-sm)]"
          style={{
            background: "var(--surface-ground)",
            boxShadow: "var(--shadow-e2)",
          }}
        >
          <span className="u-eyebrow block mb-4">
            Journal reading test · 68ch measure
          </span>
          <div
            className="text-(length:--text-prose)/[1.75] grid gap-[1.15em]"
            style={{ maxWidth: "var(--measure-prose)" }}
          >
            {/* Specimen text, not an anecdote. This panel exists to test the
                measure, the leading and the link treatment at reading size, so
                it is written about typography rather than pretending to be a
                journal entry — a design reference page should not be a place
                where claims about the author appear. */}
            <p>
              A measure is the length of a line of text, and it is the setting
              that decides whether long-form reading is comfortable or merely
              possible. Too wide and the eye loses its place returning to the
              left edge; too narrow and the rhythm breaks every few words. This
              column is set to sixty-eight characters.
            </p>
            <p>
              Leading has to move with it. A wide measure needs more space
              between lines to keep the return sweep accurate, which is why the
              two are set together here rather than chosen separately. The{" "}
              <a href="#" className="link-underline">
                link treatment
              </a>{" "}
              is included in the specimen because an underline that sits too
              close to the baseline is the fastest way to make set type look
              accidental.
            </p>
          </div>
        </div>
      </Section>

      <Hr />

      {/* ---------- field ---------- */}
      <Section
        eyebrow="Signature element"
        title="The Studio Field"
        lede="Four parallax depth layers in one perspective context, behind a gradient mesh whose chroma drifts over 180 seconds. On a light ground shapes cannot glow, so they read as tinted shadowed forms and the contact shadow does the work."
      >
        <div
          className="relative h-[340px] rounded-lg overflow-hidden"
          style={{
            boxShadow: "var(--shadow-e3)",
            background: "var(--surface-ground)",
          }}
        >
          <StudioField />
        </div>
      </Section>

      {/* ---------- inverted band ---------- */}
      <div className="u-band">
        <StudioField variant="inverted" />
        <div className="u-wrap relative z-10 py-[var(--space-xl)]">
          <span className="u-eyebrow block mb-3.5">Rhythm</span>
          <h2 className="u-h2 max-w-[22ch]">
            Dark appears twice, as a material — not as a mode
          </h2>
          <p
            className="mt-5 text-(length:--text-prose)/[1.7]"
            style={{
              maxWidth: "var(--measure-default)",
              color: "var(--ink-secondary-inverted)",
            }}
          >
            The Connect bookend and the case-study stack section. The field
            inverts here — same geometry, same loops, opposite value.
          </p>
        </div>
      </div>

      <Hr />

      {/* ---------- motion ---------- */}
      <Section
        eyebrow="Motion · nothing hurries"
        title="Calm is duration and amplitude, not less movement"
        lede="Two easing curves across the whole site. Reveals travel 12–16px, never 60px. Hover a card to feel the 4-degree tilt."
      >
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
          {[
            [
              "Hover tilt",
              "Maximum 4°, perspective 900px, 240ms. Most sites use 12–15° and it reads as a toy.",
            ],
            [
              "Magnetic pull",
              "Maximum 6px, released on pointer leave. Restraint separates premium from novelty.",
            ],
            [
              "Stagger",
              "60ms between siblings, capped at five. Beyond that it stops feeling deliberate.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="tilt-stage">
              <div
                className="tilt-target rounded-md p-6"
                style={{
                  background: "var(--surface-ground)",
                  boxShadow: "var(--shadow-e2)",
                }}
              >
                <h3 className="u-h3 mb-2">{t}</h3>
                <p
                  className="text-sm leading-snug"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  {d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}

function Hr() {
  return <hr style={{ border: 0, borderTop: "1px solid var(--line-hairline)" }} />;
}

function Section({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="u-section">
      <div className="u-wrap">
        <div className="grid gap-4 mb-[var(--space-md)]">
          <span className="u-eyebrow">{eyebrow}</span>
          <h2 className="u-h2 max-w-[20ch]">{title}</h2>
          {lede && (
            <p
              className="text-(length:--text-prose)/[1.7]"
              style={{
                maxWidth: "var(--measure-default)",
                color: "var(--ink-secondary)",
              }}
            >
              {lede}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
