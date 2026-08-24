import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
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
  return { title: m.nav.workItems["our-work"], description: m.workPage.lede };
}

const EXPLORE = [
  { slug: "libraries", image: "/img/lachapelle-group.webp" },
  { slug: "duplan", image: "/img/duplan-1.webp" },
  { slug: "young-readers", image: "/img/young-readers.webp" },
  { slug: "kreyol-materials", image: "/img/girl-with-book.webp" },
  { slug: "alliance", image: "/img/teacher-training.webp" },
  { slug: "statistics", image: "/img/cange-plateau.webp" },
] as const;

const PILLAR_ICONS = [BookIcon, HomeIcon, PeopleIcon];

export default async function OurWorkPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.workPage;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="wrap max-w-3xl pb-14 pt-12 lg:pt-20">
          <p className="eyebrow animate-rise">{t.eyebrow}</p>
          <h1 className="display mt-4 animate-rise text-[clamp(2.2rem,3.6vw+1rem,3.8rem)] text-ink [animation-delay:80ms]">
            {t.title}
          </h1>
          <p className="lede mt-6 animate-rise [animation-delay:160ms]">{t.lede}</p>
        </div>
        <div aria-hidden className="absolute -right-40 top-8 -z-10 h-[24rem] w-[24rem] rounded-full bg-blue-wash blur-3xl" />
      </section>

      {/* Three pillars */}
      <section className="wrap grid gap-5 lg:grid-cols-3">
        {t.pillars.map((pillar, index) => {
          const Icon = PILLAR_ICONS[index];
          return (
            <article
              key={pillar.title}
              data-reveal
              style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}
              className="group rounded-3xl border border-ink/8 bg-white p-8 shadow-[var(--shadow-lift)] transition hover:-translate-y-1.5 hover:border-blue/30 hover:shadow-[var(--shadow-deep)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-wash text-blue transition group-hover:bg-blue group-hover:text-white">
                <Icon />
              </span>
              <h2 className="serif mt-5 text-xl font-semibold text-ink">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{pillar.body}</p>
            </article>
          );
        })}
      </section>

      {/* Explore grid */}
      <section className="wrap py-20 lg:py-24">
        <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink" data-reveal>
          {t.exploreTitle}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((card, index) => (
            <Link
              key={card.slug}
              href={href(locale, `/${card.slug}`)}
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-3xl p-6 text-white shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
            >
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width:1024px) 31vw, (min-width:640px) 46vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-blue-deep/90 via-blue-deep/35 to-transparent"
              />
              <span className="relative">
                <span className="serif block text-xl font-semibold leading-tight">
                  {m.nav.workItems[card.slug as keyof typeof m.nav.workItems]}
                </span>
                <span className="mt-1.5 block text-sm text-white/75">
                  {t.explore[card.slug as keyof typeof t.explore]}
                </span>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold transition group-hover:gap-3">
                  {m.common.learnMore} <span aria-hidden>→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Start a library */}
      <section className="bg-sand/50 py-20 lg:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div data-reveal>
            <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink">
              {t.startTitle}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">{t.startBody}</p>
            <p className="mt-5 rounded-2xl bg-red-wash/60 p-5 text-sm leading-relaxed text-red-deep">
              {t.waitNote}
            </p>
            <Link
              href={href(locale, "/contact")}
              className="mt-6 inline-block rounded-full bg-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-mid"
            >
              {t.cta}
            </Link>
          </div>
          <ol className="grid content-start gap-4">
            {t.commitments.map((commitment, index) => (
              <li
                key={commitment}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
                className="flex gap-5 rounded-3xl border border-ink/8 bg-white p-6 shadow-[var(--shadow-lift)]"
              >
                <span className="serif shrink-0 text-3xl font-semibold text-blue/30">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-relaxed text-ink-soft">
                  {commitment}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Words note */}
      <section className="wrap py-16">
        <div data-reveal className="rounded-[2rem] border-l-[6px] border-gold bg-white p-9 shadow-[var(--shadow-lift)]">
          <h2 className="serif text-xl font-semibold text-ink">{t.wordsTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">{t.wordsBody}</p>
        </div>
      </section>
    </>
  );
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M10 3.5C8 2.3 5.4 2 3 2.4v12.2c2.4-.4 5-.1 7 1.1 2-1.2 4.6-1.5 7-1.1V2.4c-2.4-.4-5-.1-7 1.1Zm0 0v12.2" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="m3 9 7-6 7 6v8a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V9Z" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="7" cy="7" r="2.6" />
      <path d="M2.5 16.5c.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4M13.5 5.2a2.6 2.6 0 1 1 0 4.4M13.8 12.7c1.8.3 3.2 1.6 3.7 3.8" />
    </svg>
  );
}
