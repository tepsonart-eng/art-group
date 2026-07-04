import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return locales.flatMap((locale) => [
    {
      url: `${base}/${locale}`,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${base}/${locale}/mentions-legales`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${base}/${locale}/confidentialite`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ]);
}
