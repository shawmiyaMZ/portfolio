import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

/**
 * The Studio is a single-page app that owns its own routing below /studio,
 * so this catch-all renders the shell once and lets the Studio take over.
 */
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
