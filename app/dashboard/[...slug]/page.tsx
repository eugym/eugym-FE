import { findNavItemByHref } from "@/app/config/navigation";
import FeatureUnavailable from "@/components/FeatureUnavailable/FeatureUnavailable";

/**
 * Catch-all for any /dashboard/* path with no page of its own.
 *
 * Next.js gives static routes precedence over dynamic ones, so every real page
 * still wins; this only runs for URLs that would otherwise fall through to the
 * global 404 — which replaces the entire app shell, leaving the user with no
 * sidebar and no way back except the browser's Back button.
 *
 * Rendering here keeps them inside the dashboard, so a stale bookmark, a typo,
 * or a nav item whose page hasn't been built yet is a soft landing.
 */
export default async function DashboardCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = `/dashboard/${slug.join("/")}`;

  // If the path is a nav item we already advertise as unbuilt, name it.
  const navItem = findNavItemByHref(path);

  if (navItem?.status === "soon") {
    return (
      <FeatureUnavailable
        title={`${navItem.label} is coming soon`}
        description="This feature is on the way. It'll show up here as soon as it's ready."
        status="coming-soon"
      />
    );
  }

  return (
    <FeatureUnavailable
      title="Page not found"
      description={`There's nothing at ${path}. The link may be out of date, or the page may have moved.`}
      status="not-found"
    />
  );
}
