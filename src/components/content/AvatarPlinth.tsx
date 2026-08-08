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
/**
 * What the avatar actually occupies, per breakpoint.
 *
 * This element is sized by HEIGHT — `.avatar-stage` sets `--avatar-cap` and
 * the layers take `max-height: var(--avatar-cap)` with `width: auto`. Its
 * width is therefore the cap times the render's 1400/1596 ratio, and is
 * governed by the viewport's height, not its width.
 *
 * `sizes` can only speak in widths, so the previous `62vw, 42vw` was
 * describing a layout that does not exist. At 1536px it claimed 645px for an
 * element painting 323px, and the browser dutifully fetched `w=828` — 77 KB
 * across both layers where ~404 device pixels were needed. Both carry
 * `priority` and are preloaded, so those bytes were on the critical path.
 *
 * These are the caps converted to widths (cap x 0.8772), which makes each one
 * an upper bound: a tall viewport reaches it exactly, a short one paints
 * smaller and the hint merely over-declares slightly. Under-declaring would
 * be the expensive mistake — this is the LCP element, and a soft avatar is
 * worse than a few extra kilobytes.
 *
 * Keep in step with `--avatar-cap` in field.css. If a cap changes, this
 * changes.
 */
const AVATAR_SIZES = [
  "(max-width: 389px) 290px", // cap min(38vh, 330px)
  "(max-width: 479px) 316px", // cap min(40vh, 360px)
  "(max-width: 767px) 342px", // cap min(42vh, 390px)
  "(max-width: 1023px) 386px", // cap min(46vh, 440px)
  "500px", // cap min(58vh, 570px)
].join(", ");

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
            sizes={AVATAR_SIZES}
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
              sizes={AVATAR_SIZES}
              className="avatar-stage__figure"
            />
          </AvatarParallax>
        </div>
      </div>
    </div>
  );
}
