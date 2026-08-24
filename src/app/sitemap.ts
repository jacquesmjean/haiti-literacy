import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { listNewsSlugs, listPageSlugs } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/give", "/contact", "/news", "/reports", "/get-involved", "/board"];
  const pageSlugs = listPageSlugs().map((slug) => `/${slug}`);
  const newsSlugs = listNewsSlugs().map((slug) => `/news/${slug}`);
  const all = [...staticPaths, ...pageSlugs, ...newsSlugs];

  return all.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/give" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, `${site.url}/${code}${path}`]),
        ),
      },
    })),
  );
}
