import type { Metadata } from "next";
import { ConnectBand } from "@/components/content/ConnectBand";
import { getProfile } from "@/sanity/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Connect",
  description: "The one place to reach me.",
  alternates: { canonical: `${siteUrl}/connect` }
};

export default async function ConnectPage() {
  const profile = await getProfile();
  return <ConnectBand linkedinUrl={profile?.linkedinUrl} />;
}
