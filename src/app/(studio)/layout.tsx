/**
 * A separate root layout for the Studio.
 *
 * The Studio ships its own complete design system, and the site's global
 * stylesheet — porcelain ground, Fraunces headings, a pinned light
 * colour-scheme — would fight it on every surface. Route groups let the two
 * live in one deployment without either one leaking into the other.
 */
export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
