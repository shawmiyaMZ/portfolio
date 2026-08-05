import Image from "next/image";
import { AvatarParallax } from "@/components/content/AvatarParallax";

/**
 * The avatar, as two layered static images.
 *
 * The figure and its cast shadow are rendered separately from an identical
 * camera and cropped to the same box, so they composite pixel-exact. That
 * split is what lets the idle motion be physically honest: when the figure
 * lifts, the shadow stays on the ground and tightens rather than rising with
 * it. A single baked image floating as one piece is what makes most hero
 * float animations read as a sticker.
 *
 * Still no WebGL and no 3D runtime — 164 KB of WebP across both layers.
 *
 * Each transform gets its own element. Multiple CSS animations on one
 * element's `transform` overwrite each other rather than composing, so
 * recede, settle, parallax and float are separate nested boxes with one job
 * each. Nested divs are free; fighting animations are not.
 */
export function AvatarPlinth({ alt }: { alt: string }) {
  return (
    <div className="avatar-stage">
      <div className="avatar-stage__plinth" />

      <div className="avatar-stage__recede">
        <div className="avatar-stage__settle">
          {/* Ground plane. Never parallaxes and never floats — it is the
              thing everything else is measured against. */}
          {/* `priority` stays, and this is the best-evidenced of the three.
              Removing it was re-measured on 2026-08-05 with three warm runs:
              cumulative layout shift is 0.354 in every one of them — not the
              cold-run artifact the other two reverts turned out to be — and
              LCP goes 3695ms to 3844ms, score 89 to 71. Lighthouse puts the
              shift on `.field__mesh`, which moves once the hero's height
              settles. The preload is buying a stable page, not a faster
              image. */}
          <Image
            src="/avatar/avatar-hero-shadow.webp"
            alt=""
            width={1400}
            height={1596}
            priority
            quality={90}
            sizes="(max-width: 1023px) 62vw, 42vw"
            className="avatar-stage__shadow"
          />

          <AvatarParallax>
            <Image
              src="/avatar/avatar-hero-figure.webp"
              alt={alt}
              width={1400}
              height={1596}
              priority
              quality={92}
              sizes="(max-width: 1023px) 62vw, 42vw"
              className="avatar-stage__figure"
            />
          </AvatarParallax>
        </div>
      </div>
    </div>
  );
}
