import type { Metadata } from "next";
import { ConnectBand } from "@/components/content/ConnectBand";
import { getProfile } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Connect",
  description: "The one place to reach me.",
};

export default async function ConnectPage() {
  const profile = await getProfile();
  return <ConnectBand linkedinUrl={profile?.linkedinUrl} />;
}
