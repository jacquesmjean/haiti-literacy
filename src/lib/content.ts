import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { defaultLocale, locales, type Locale } from "./i18n";

const ROOT = path.join(process.cwd(), "content");

export type PageFrontmatter = {
  title: string;
  eyebrow?: string;
  lede?: string;
  image?: string;
  imageCaption?: string;
  description?: string;
  order?: number;
  updated?: string;
};

export type PageDoc = PageFrontmatter & {
  slug: string;
  locale: Locale;
  html: string;
  headings: { id: string; text: string; level: number }[];
};

export type NewsFrontmatter = {
  title: string;
  date: string;
  lede?: string;
  image?: string;
  credit?: string;
};

export type NewsDoc = NewsFrontmatter & {
  slug: string;
  locale: Locale;
  html: string;
};

/** Turn a heading into a stable anchor id. */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function toHtml(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  let html = String(file);
  // Add ids to h2 and h3 so the in page navigation can link to them.
  html = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_m, level: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "");
      return `<h${level} id="${slugifyHeading(text)}">${inner}</h${level}>`;
    },
  );
  return html;
}

function extractHeadings(markdown: string) {
  const out: { id: string; text: string; level: number }[] = [];
  for (const line of markdown.split("\n")) {
    const m = /^(##|###)\s+(.*)$/.exec(line.trim());
    if (m) {
      const text = m[2].replace(/[*_`]/g, "").trim();
      out.push({ id: slugifyHeading(text), text, level: m[1].length });
    }
  }
  return out;
}

function readFileWithFallback(dir: string, slug: string, locale: Locale) {
  const primary = path.join(ROOT, locale, dir, `${slug}.md`);
  if (fs.existsSync(primary)) return { raw: fs.readFileSync(primary, "utf8"), locale };
  const fallback = path.join(ROOT, defaultLocale, dir, `${slug}.md`);
  if (fs.existsSync(fallback))
    return { raw: fs.readFileSync(fallback, "utf8"), locale: defaultLocale };
  return null;
}

export async function getPage(locale: Locale, slug: string): Promise<PageDoc | null> {
  const found = readFileWithFallback("pages", slug, locale);
  if (!found) return null;
  const { data, content } = matter(found.raw);
  return {
    ...(data as PageFrontmatter),
    slug,
    locale,
    html: await toHtml(content),
    headings: extractHeadings(content),
  };
}

export function listPageSlugs(locale: Locale = defaultLocale): string[] {
  const dir = path.join(ROOT, locale, "pages");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Every locale and slug pair, used for static generation. */
export function allPageParams() {
  const slugs = listPageSlugs(defaultLocale);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function getNewsItem(locale: Locale, slug: string): Promise<NewsDoc | null> {
  const found = readFileWithFallback("news", slug, locale);
  if (!found) return null;
  const { data, content } = matter(found.raw);
  return {
    ...(data as NewsFrontmatter),
    slug,
    locale,
    html: await toHtml(content),
  };
}

export function listNewsSlugs(locale: Locale = defaultLocale): string[] {
  const dir = path.join(ROOT, locale, "news");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function listNews(locale: Locale): Promise<NewsDoc[]> {
  const slugs = listNewsSlugs(defaultLocale);
  const items = await Promise.all(slugs.map((slug) => getNewsItem(locale, slug)));
  return items
    .filter((item): item is NewsDoc => item !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function allNewsParams() {
  const slugs = listNewsSlugs(defaultLocale);
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}
