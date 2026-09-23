import type { MetadataRoute } from "next";
import { person } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${person.name} — ${person.role}`,
    short_name: person.shortName,
    description: person.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f1",
    theme_color: "#6b1220",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
