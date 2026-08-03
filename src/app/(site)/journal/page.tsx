import type { Metadata } from "next";
import { ConnectBand } from "@/components/content/ConnectBand";
import { JournalIndex } from "@/components/content/JournalIndex";
import { StudioField } from "@/components/field/StudioField";
import { EmptyState } from "@/components/ui/primitives";
import { getAllPosts, getProfile, getTags } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from building AI-powered systems — what worked, what did not, and what I would do differently.",
};

export default async function JournalPage() {
  const [posts, tags, profile] = await Promise.all([
    getAllPosts(),
    getTags(),
    getProfile(),
  ]);

  return (
    <>
      <section data-chapter="journal" className="relative u-top-clear pb-[var(--space-md)]">
        <StudioField />
        <div className="u-wrap relative z-10">
          <span className="u-eyebrow block mb-4">Journal</span>
          <h1 className="u-h1 max-w-(--measure-title)">
            Working notes from learning in public
          </h1>
          <p
            className="mt-6 text-(length:--text-prose)/[1.7]"
            style={{
              maxWidth: "var(--measure-default)",
              color: "var(--ink-secondary)",
            }}
          >
            I write these mostly to think properly. If they are useful to you
            as well, that is a happy side effect.
          </p>
        </div>
      </section>

      <section className="u-section u-ground-raised">
        <div className="u-wrap">
          {posts.length > 0 ? (
            <JournalIndex posts={posts} tags={tags} />
          ) : (
            <EmptyState
              title="No posts yet"
              body="Write your first post in the Studio. It will appear here, on the home page, and in the RSS feed."
              href="/studio"
              cta="Open the Studio"
            />
          )}
        </div>
      </section>

      <ConnectBand linkedinUrl={profile?.linkedinUrl} />
    </>
  );
}
