import type { CSSProperties } from "react";

type Shape = "cube" | "ball" | "capsule";
type Depth = 2 | 3 | 4;

type Solid = {
  shape: Shape;
  depth: Depth;
  /** Percentage offsets, so the arrangement holds its composition at any width. */
  x: string;
  y: string;
  size: number;
  /** Capsules only. */
  height?: number;
  /**
   * Drift period in seconds. Slower = further away.
   *
   * Shortened by about a quarter after a review found the field read as a
   * static 3D object rather than an animation. The far layer was turning at
   * roughly 4° per second behind 9px of blur at 8% alpha, which is motion
   * nobody can see. Still slow enough to read as ambient: the furthest solid
   * takes over a minute to come back round.
   */
  period: number;
  /** Which of the two drift keyframes, so neighbouring solids never move in lockstep. */
  path: "a" | "b";
  fill: { light: string; inverted: string };
};

/**
 * A composed still life, not a random scatter.
 *
 * Randomised positions look accidental, and accidental is the opposite
 * of what this site is trying to communicate. Every solid below is
 * placed: nothing sits dead-centre, nothing collides with the hero
 * text column, and the near layer stays out of the top-left quadrant
 * where headings land.
 */
const SOLIDS: Solid[] = [
  // Layer 2 — far. Large, softly blurred, quiet but no longer invisible.
  {
    shape: "ball",
    depth: 2,
    x: "6%",
    y: "14%",
    size: 190,
    period: 68,
    path: "a",
    fill: { light: "rgba(140,135,127,.11)", inverted: "rgba(246,243,238,.05)" },
  },
  {
    shape: "cube",
    depth: 2,
    x: "78%",
    y: "8%",
    size: 150,
    period: 72,
    path: "b",
    fill: { light: "rgba(140,135,127,.11)", inverted: "rgba(246,243,238,.05)" },
  },
  // Layer 3 — mid. The two accents meet here, at opposite temperatures.
  {
    shape: "cube",
    depth: 3,
    x: "64%",
    y: "52%",
    size: 120,
    period: 45,
    path: "a",
    fill: { light: "rgba(178,58,82,.14)", inverted: "rgba(178,58,82,.16)" },
  },
  {
    shape: "capsule",
    depth: 3,
    x: "2%",
    y: "64%",
    size: 172,
    height: 76,
    period: 50,
    path: "b",
    fill: { light: "rgba(62,92,118,.11)", inverted: "rgba(62,92,118,.20)" },
  },
  // Layer 4 — near. Small, sharp, and the only layer with a contact shadow.
  // Already legible, so these keep their fills and only gain a little pace.
  {
    shape: "ball",
    depth: 4,
    x: "72%",
    y: "64%",
    size: 64,
    period: 30,
    path: "a",
    fill: { light: "rgba(178,58,82,.13)", inverted: "rgba(139,150,131,.20)" },
  },
  {
    shape: "cube",
    depth: 4,
    x: "44%",
    y: "20%",
    size: 44,
    period: 34,
    path: "b",
    fill: { light: "rgba(139,150,131,.16)", inverted: "rgba(124,69,101,.20)" },
  },
  {
    shape: "capsule",
    depth: 4,
    x: "86%",
    y: "80%",
    size: 96,
    height: 42,
    period: 39,
    path: "a",
    fill: { light: "rgba(62,92,118,.11)", inverted: "rgba(62,92,118,.22)" },
  },
];

const DEPTHS: Depth[] = [2, 3, 4];

export type StudioFieldProps = {
  variant?: "light" | "inverted";
  className?: string;
};

export function StudioField({
  variant = "light",
  className,
}: StudioFieldProps) {
  return (
    <div
      className={`field field--${variant}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <div className="field__mesh" />
      <div className="field__layer" data-depth="1" />
      {DEPTHS.map((depth) => (
        <div key={depth} className="field__layer" data-depth={depth}>
          {SOLIDS.filter((s) => s.depth === depth).map((s, i) => (
            <div
              key={`${depth}-${i}`}
              className="field__solid"
              data-shape={s.shape}
              style={
                {
                  left: s.x,
                  top: s.y,
                  width: s.size,
                  height: s.height ?? s.size,
                  background: s.fill[variant],
                  animation: `field-drift-${s.path} ${s.period}s var(--ease-ambient) infinite`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
