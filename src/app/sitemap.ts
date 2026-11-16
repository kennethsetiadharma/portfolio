import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// One page, so one entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl }];
}
