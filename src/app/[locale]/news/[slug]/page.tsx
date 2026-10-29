import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { allNewsParams, getNewsItem } from "@/lib/content";
import { href } from "@/lib/routes";
import { site, zeffyLink } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allNewsParams();
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) return {};
  const item = await getNewsItem(locale, slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.lede,
    openGraph: {
      type: "article",
      publishedTime: item.date,
      ...(item.image ? { images: [{ url: item.image }] } : {}),
    },
  };
}

export default async function NewsArticlePage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) notFound();
  const item = await getNewsItem(locale, slug);
  if (!item) notFound();
  const m = getMessages(locale);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.lede,
    datePublished: item.date,
    inLanguage: locale,
    ...(item.image ? { image: [`${site.url}${item.image}`] } : {}),
    mainEntityOfPage: `${site.url}${href(locale, "/news")}/${slug}`,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/img/pilh-logo.png` },
    },
  };

  return (
    <article className="wrap-narrow pb-20 pt-12 lg:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link
        href={href(locale, "/news")}
        className="text-sm font-medium text-blue underline underline-offset-4 hover:text-red"
      >
        ← {m.news.back}
      </Link>

      <header className="mt-6 animate-rise">
        <time className="text-sm text-ink-faint" dateTime={item.date}>
          {new Date(item.date + "T12:00:00Z").toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="display mt-3 text-[clamp(1.9rem,2.8vw+1rem,3rem)] text-ink">
          {item.title}
        </h1>
        {item.lede && <p className="lede mt-5">{item.lede}</p>}
      </header>

      {item.image && (
        <figure className="mt-9 animate-rise overflow-hidden rounded-3xl shadow-[var(--shadow-deep)] [animation-delay:100ms]">
          <Image
            src={item.image}
            alt=""
            width={1400}
            height={900}
            priority
            sizes="(min-width:768px) 46rem, 100vw"
            className="w-full object-cover"
          />
          {item.credit && (
            <figcaption className="bg-white px-5 py-3 text-xs text-ink-faint">
              {item.credit}
            </figcaption>
          )}
        </figure>
      )}

      <div
        className="prose-pilh mt-10"
        dangerouslySetInnerHTML={{ __html: item.html }}
      />

      <div className="rule mt-14" />
      <div className="flex flex-wrap items-center justify-between gap-5 py-8">
        <p className="serif text-lg text-ink">{m.meta.tagline}</p>
        <a
          href={zeffyLink()} target="_blank" rel="noopener"
          className="rounded-full bg-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-deep"
        >
          {m.common.donateNow}
        </a>
      </div>
    </article>
  );
}
