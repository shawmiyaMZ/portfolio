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
          {/* `priority` stays. Swapping it for `fetchPriority="high"` was
              measured on 2026-08-05: it removes the preload, the layers arrive
              after first layout, and cumulative layout shift goes from 0 to
              0.477. The preload is buying a stable page, not a faster image. */}
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
