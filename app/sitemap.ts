import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/services", "/insights", "/book-session", "/contact", "/privacy", "/terms"];
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...articles.map((a) => ({ url: `${site.url}/insights/${a.slug}`, lastModified: a.published, priority: 0.6 })),
  ];
}
