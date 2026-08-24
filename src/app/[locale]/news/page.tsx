import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { listNews } from "@/lib/content";
import { href } from "@/lib/routes";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.news.title, description: m.news.lede };
}

export default async function NewsIndexPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const items = await listNews(locale);

  return (
    <section className="wrap pb-20 pt-12 lg:pt-20">
      <div className="max-w-2xl animate-rise">
        <p className="eyebrow">{m.news.eyebrow}</p>
        <h1 className="display mt-4 text-[clamp(2.1rem,3.2vw+1rem,3.4rem)] text-ink">
          {m.news.title}
        </h1>
        <p className="lede mt-6">{m.news.lede}</p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={item.slug}
            href={href(locale, `/news/${item.slug}`)}
            data-reveal
            style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}
            className="group overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
          >
            {item.image && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 31vw, (min-width:768px) 46vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <time className="text-xs text-ink-faint" dateTime={item.date}>
                {new Date(item.date + "T12:00:00Z").toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="serif mt-2 text-lg font-semibold leading-snug text-ink transition group-hover:text-blue">
                {item.title}
              </h2>
              {item.lede && (
                <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-3">
                  {item.lede}
                </p>
              )}
              <span className="mt-4 inline-block text-sm font-semibold text-blue">
                {m.news.readMore} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
