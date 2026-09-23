import type { MetadataRoute } from "next";
import { SITE_URL, assets, nav } from "@/lib/site";

/**
 * Sitemap.
 *
 * `lastModified` uses the build date: the site is statically generated, so a
 * rebuild is the only way content changes. Images are declared on the pages that
 * carry them, which is how they become eligible for Google Images.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const priority: Record<string, number> = {
    "/about": 0.9,
    "/bookings": 0.9,
    "/mentorship": 0.8,
    "/events": 0.8,
    "/press": 0.8,
    "/gallery": 0.7,
  };

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      images: [assets.hero, assets.ogImage],
    },
    ...nav.map((item) => ({
      url: `${SITE_URL}${item.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: priority[item.href] ?? 0.7,
      ...(item.href === "/about" || item.href === "/gallery"
        ? { images: [assets.hero] }
        : {}),
    })),
  ];
}
