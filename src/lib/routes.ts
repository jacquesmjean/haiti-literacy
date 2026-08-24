import type { Locale } from "./i18n";

/** Build a locale prefixed path. Pass paths without a leading locale. */
export function href(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Content pages that live as markdown files, in menu order. */
export const aboutSlugs = ["about", "history", "board"] as const;
export const workSlugs = [
  "our-work",
  "libraries",
  "duplan",
  "young-readers",
  "kreyol-materials",
  "alliance",
  "statistics",
] as const;

/** Old WordPress paths mapped to the new structure. */
export const legacyRedirects: Record<string, string> = {
  "/about-us": "/about",
  "/history": "/history",
  "/board-of-directors": "/board",
  "/board-of-directors-2": "/board",
  "/staff-and-committees": "/board",
  "/partners": "/board",
  "/our-work": "/our-work",
  "/libraries-for-children": "/libraries",
  "/tout-2": "/duplan",
  "/duplan": "/duplan",
  "/growing-young-readers": "/young-readers",
  "/growing-young-readers-part-2": "/young-readers",
  "/kreyol-print": "/kreyol-materials",
  "/print-materials": "/kreyol-materials",
  "/print-materials-2": "/kreyol-materials",
  "/pilh-kreyol-materials-2-haitian-creole-alphabet-poster": "/kreyol-materials",
  "/haiti-libraries-alliance": "/alliance",
  "/hla-resources": "/alliance",
  "/ressources-resources": "/alliance",
  "/reunions-meetings": "/alliance",
  "/coordonnees-des-membres-member-directory": "/alliance",
  "/education-and-libraries-in-haiti": "/statistics",
  "/statistics-related-to-our-work-part-2": "/statistics",
  "/annual-reports": "/reports",
  "/news": "/news",
  "/news-2": "/news",
  "/blog": "/news",
  "/tout-1": "/news/book-celebration",
  "/tout-3": "/news/three-thousand-books",
  "/give-financially": "/give",
  "/contact-us": "/contact",
  "/15c42-web-agency-gb-contact-us": "/contact",
  "/beverly-stephen": "/duplan",
};
