# Avatar render pipeline

The avatar ships as pre-rendered WebP, not as a live 3D model. This folder
holds the rig that produced those frames, so they can be regenerated if the
source model ever changes.

## Why pre-rendered

The source GLB is **57.4 MB**, and 98% of that is geometry — 1.97M triangles
at full f32 precision from an AI 3D generator. The three 4K textures are only
1.4 MB combined, and there are no animations.

A 57 MB hero and a Lighthouse score above 90 cannot both be true. Rendering
the model once, offline, gets the same image for **122 KB across three
frames** and ships no WebGL runtime at all. The Studio Field already supplies
the site's dimensionality, so a live-rendered avatar would have added cost
without adding much.

Result: **57,438 KB → 122 KB, a 469× reduction.**

## Regenerating the frames

1. **Simplify the source.** Texture compression is skipped deliberately — the
   textures are a rounding error next to the geometry, and `textureCompress`
   fails on some Windows/libvips setups.

   ```bash
   npx @gltf-transform/cli simplify source.glb tmp.glb --ratio 0.08 --error 0.0008
   npx @gltf-transform/cli quantize tmp.glb avatar.glb
   ```

   57.4 MB → 5.2 MB, which a browser can load comfortably.

2. **Reinstall the renderer.** Three.js is not a dependency of the site — the
   site ships no WebGL — so it is not in `package.json`. Add it back only for
   as long as you are regenerating:

   ```bash
   npm i -D three @types/three
   ```

3. **Stage it and restore the rig.** Copy `avatar.glb` to `public/_tmp/`, then
   copy `render-page.tsx.txt` to `src/app/(site)/render-avatar/page.tsx` and
   `api-route.ts.txt` to `src/app/api/render-avatar/route.ts`.

   Note: the folders must **not** start with `_` — the App Router treats
   underscore-prefixed directories as private and will not route them.

4. **Run it.** Start `npm run dev`, visit `/render-avatar`, and wait for the
   log to print `DONE`. Frames land in `public/avatar/` as PNG.

5. **Convert to WebP**, trimming the transparent margin:

   ```js
   await sharp(src).trim({ threshold: 1 }).resize({ width: 900 })
     .webp({ quality: 82, effort: 6 }).toFile(out);
   ```

6. **Delete the two rig routes again, and uninstall Three.js.** The routes must
   never exist in a deployed build — the API route writes files to disk, and
   although it refuses to run outside development, the safest version of that
   endpoint is one that isn't there.

   ```bash
   npm uninstall three @types/three
   ```

## The lighting rig is the design system

The rig is not arbitrary. It is the physical statement the rest of the site is
tuned to agree with:

- **Key light** — upper left, warm (`0xfff4e8`), soft shadows. Every shadow
  elsewhere on the site falls in the direction this light implies.
- **Hemisphere fill** — porcelain above, warm clay bounce below. Keeps the
  shadow side readable without implying a second light.
- **Rim** — cool (`0xdfe9f2`), weak, from behind right. Separates the
  silhouette from the porcelain ground. The one cool note, matching Cobalt.
- **Contact shadow** — warm (`0x4a3527`) at 22% on a transparent ground, never
  black. Black shadow on a warm ground reads as a different light source.
- **Material override** — metalness forced to 0, roughness to 0.92. The source
  is a generated PBR material with a metallic-roughness map; Studio Light has
  no specular highlights anywhere, and the avatar does not get to be the
  exception.

Framing is derived from the model's own bounding box rather than hard-coded
numbers, so a replacement model is framed correctly instead of silently
drifting out of shot.
