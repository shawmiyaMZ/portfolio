import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidateSecret } from "@/sanity/env";

/**
 * Sanity publish webhook → targeted cache invalidation.
 *
 * `parseBody` verifies the request's signature against the shared secret, so
 * an unauthenticated caller cannot force revalidation. Publishing a journal
 * post invalidates only the post tag — the projects pages keep their cache.
 */
type WebhookBody = { _type?: string };

export async function POST(request: NextRequest) {
  if (!revalidateSecret) {
    return NextResponse.json(
      { error: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(
      request,
      revalidateSecret,
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json(
        { error: "Body is missing _type" },
        { status: 400 },
      );
    }

    // Next 16 requires a cache profile. `expire: 0` means "purge now" —
    // a publish should be visible on the next request, not in an hour.
    revalidateTag(body._type, { expire: 0 });

    return NextResponse.json({
      revalidated: true,
      tag: body._type,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[revalidate] failed", error);
    return NextResponse.json(
      { error: "Could not revalidate" },
      { status: 500 },
    );
  }
}
