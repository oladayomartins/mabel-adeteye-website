import type { Metadata } from "next";
import { SITE_URL, assets, person } from "./site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  /** Override the social share image. Defaults to the hero portrait. */
  image?: string;
};

/** Builds consistent, canonicalised metadata for every page. */
export function pageMetadata({
  title,
  description,
  path,
  image = assets.ogImage,
}: PageSeo): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${person.name}`,
      description,
      siteName: person.name,
      locale: "en_GB",
      images: [{ url: image, width: 1200, height: 630, alt: person.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${person.name}`,
      description,
      images: [image],
    },
  };
}
