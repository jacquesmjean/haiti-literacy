import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { allPageParams, getPage } from "@/lib/content";
import { zeffyLink } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPageParams();
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) return {};
  const page = await getPage(locale, slug);
  if (!page) return {};
  return { title: page.title, description: page.description ?? page.lede };
}

export default async function ContentPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  if (!isLocale(locale)) notFound();
  const page = await getPage(locale, slug);
  if (!page) notFound();
  const m = getMessages(locale);

  return (
    <article>
      <header className="wrap pb-10 pt-12 lg:pt-16">
        <div className="max-w-3xl animate-rise">
          {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
          <h1 className="display mt-4 text-[clamp(2.1rem,3.4vw+1rem,3.6rem)] text-ink">
            {page.title}
          </h1>
          {page.lede && <p className="lede mt-6">{page.lede}</p>}
        </div>
      </header>

      {page.image && (
        <div className="wrap animate-rise [animation-delay:120ms]">
          <figure className="overflow-hidden rounded-3xl shadow-[var(--shadow-deep)]">
            <Image
              src={page.image}
              alt={page.imageCaption ?? ""}
              width={1600}
              height={900}
              priority
              sizes="(min-width:1280px) 76rem, 100vw"
              className="max-h-[28rem] w-full object-cover"
            />
            {page.imageCaption && (
              <figcaption className="bg-white px-5 py-3 text-xs text-ink-faint">
                {page.imageCaption}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      <div className="wrap mt-12 grid gap-12 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <div
          className="prose-pilh max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />

        {page.headings.length > 2 && (
          <nav aria-label={m.common.onThisPage} className="order-first lg:order-none">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{m.common.onThisPage}</p>
              <ul className="mt-4 grid gap-2 border-l border-ink/10 text-sm">
                {page.headings
                  .filter((heading) => heading.level === 2)
                  .map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="-ml-px block border-l-2 border-transparent py-0.5 pl-4 text-ink-soft transition hover:border-red hover:text-ink"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </nav>
        )}
      </div>

      {/* Bottom call to action on every content page */}
      <div className="wrap mt-16">
        <div className="rule" />
        <div className="flex flex-wrap items-center justify-between gap-5 py-10">
          <p className="serif text-xl text-ink">{m.meta.tagline}</p>
          <a
            href={zeffyLink()} target="_blank" rel="noopener"
            className="rounded-full bg-red px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-red-deep"
          >
            {m.common.donateNow}
          </a>
        </div>
      </div>
    </article>
  );
}
