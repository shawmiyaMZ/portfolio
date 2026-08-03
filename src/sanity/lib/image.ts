import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({
  projectId: projectId || "placeholder",
  dataset,
});

/**
 * Sanity images are served through their CDN with the hotspot respected,
 * so a cover image cropped to a wide card still keeps its subject.
 */
export function urlForImage(source: Image) {
  return builder.image(source).auto("format").fit("max");
}

export function imageUrl(
  source: Image | undefined,
  width: number,
  height?: number,
): string | undefined {
  if (!source) return undefined;
  const b = urlForImage(source).width(width);
  return (height ? b.height(height).fit("crop") : b).url();
}
