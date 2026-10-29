import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { href } from "@/lib/routes";
import { zeffyLink } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.nav.workItems["kreyol-materials"], description: m.kreyolPage.lede };
}

/** Credits and cover art direction per book. Text lives in messages. */
const BOOK_META: Record<
  string,
  { credit: string; from: string; to: string; emoji: string }
> = {
  jesula: { credit: "Dr. Peter Manuel · Jerry Rosenbert Moise", from: "#273792", to: "#3a4bb5", emoji: "📖" },
  malachi: { credit: "Cherilyn Flemming · Enine Fleurantin", from: "#0e6e63", to: "#15997f", emoji: "🍲" },
  serafina: { credit: "Kathryn Carter · Jemson Guerrier", from: "#d51f36", to: "#e4566a", emoji: "🐴" },
  istwa: { credit: "Dr. Peter Manuel · Dishka Joseph", from: "#7c3aed", to: "#a78bfa", emoji: "🐸" },
  zetwal: { credit: "Madeline Jenkins · Anev", from: "#141c4f", to: "#273792", emoji: "⭐" },
  mitan: { credit: "Ken Carter · Garry Bathol", from: "#e4a33c", to: "#f0c274", emoji: "🥭" },
};

export default async function KreyolMaterialsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.kreyolPage;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pb-14 pt-12 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16 lg:pt-20">
          <div className="animate-rise">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(2.2rem,3.6vw+1rem,3.9rem)] text-ink">
              {t.title}
            </h1>
            <p className="lede mt-6 max-w-xl">{t.lede}</p>
          </div>
          <figure className="arch relative hidden aspect-[4/4.6] animate-rise shadow-[var(--shadow-deep)] [animation-delay:140ms] lg:block">
            <Image
              src="/img/girl-with-book.webp"
              alt=""
              fill
              priority
              sizes="38vw"
              className="object-cover"
            />
          </figure>
        </div>
        <div aria-hidden className="absolute -left-44 top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-red-wash blur-3xl" />
      </section>

      {/* Why we publish */}
      <section className="wrap" data-reveal>
        <div className="rounded-[2rem] border-l-[6px] border-red bg-white p-9 shadow-[var(--shadow-lift)] lg:p-11">
          <h2 className="serif text-2xl font-semibold text-ink">{t.whyTitle}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">{t.whyBody}</p>
        </div>
      </section>

      {/* Inventory status */}
      <section className="wrap mt-6" data-reveal>
        <div className="flex flex-wrap items-start gap-4 rounded-[2rem] border border-gold/40 bg-gold/10 p-7">
          <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
            !
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="serif text-lg font-semibold text-ink">{t.inventoryTitle}</h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-soft">
              {t.inventoryBody}
            </p>
          </div>
          <a
            href={zeffyLink()} target="_blank" rel="noopener"
            className="shrink-0 self-center rounded-full bg-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-deep"
          >
            {m.common.donateNow}
          </a>
        </div>
      </section>

      {/* The bookshelf */}
      <section className="wrap py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink">
            {t.booksTitle}
          </h2>
          <p className="text-sm text-ink-faint">{t.booksHint}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.books.map((book, index) => {
            const meta = BOOK_META[book.id];
            return (
              <div
                key={book.id}
                data-reveal
                style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
                className="book-card group relative h-[21rem] [perspective:1200px]"
                tabIndex={0}
              >
                <div className="book-inner relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]">
                  {/* Front cover */}
                  <div
                    className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-2xl rounded-l-md p-7 text-white shadow-[var(--shadow-deep)] [backface-visibility:hidden]"
                    style={{
                      background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`,
                    }}
                  >
                    {/* Spine */}
                    <span aria-hidden className="absolute inset-y-0 left-0 w-2.5 bg-black/25" />
                    <span aria-hidden className="absolute inset-y-0 left-2.5 w-px bg-white/30" />
                    <div className="pl-3">
                      <span className="text-3xl" aria-hidden>{meta.emoji}</span>
                      <h3 className="serif mt-4 text-2xl font-semibold leading-tight">
                        {book.title}
                      </h3>
                      <p className="mt-2 text-sm italic text-white/75">{book.subtitle}</p>
                    </div>
                    <p className="pl-3 text-[0.6875rem] uppercase tracking-[0.14em] text-white/60">
                      Partners in Literacy Haiti
                    </p>
                  </div>

                  {/* Back with the story */}
                  <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-l-2xl rounded-r-md border border-ink/10 bg-paper p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div>
                      <h3 className="serif text-lg font-semibold leading-tight text-ink">
                        {book.subtitle}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                        {book.summary}
                      </p>
                    </div>
                    <p className="text-xs text-ink-faint">
                      {meta.credit} · Milady Auguste
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alphabet chart */}
      <section className="bg-blue-deep py-20 text-white lg:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div data-reveal>
            <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)]">
              {t.chartTitle}
            </h2>
            <p className="mt-5 leading-relaxed text-white/75">{t.chartBody}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.chartFacts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>
          <figure
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-deep)]"
          >
            <Image
              src="/img/alphabet-chart.webp"
              alt="Alfabè Kreyòl Mwen alphabet chart"
              width={1024}
              height={614}
              sizes="(min-width:1024px) 40vw, 100vw"
              className="w-full bg-white object-contain"
            />
          </figure>
        </div>
      </section>

      {/* Pricing */}
      <section className="wrap py-20 lg:py-24">
        <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink" data-reveal>
          {t.pricingTitle}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.pricing.map((row, index) => (
            <div
              key={row.item}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
              className="rounded-3xl border border-ink/8 bg-white p-7 text-center shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
            >
              <p className="display text-4xl text-red">{row.price}</p>
              <p className="serif mt-3 font-semibold leading-tight text-ink">{row.item}</p>
              <p className="mt-1.5 text-xs text-ink-faint">{row.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-faint" data-reveal>
          {t.pricingNote}
        </p>

        <div
          data-reveal
          className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-sand/60 p-9"
        >
          <div className="max-w-xl">
            <h2 className="serif text-xl font-semibold text-ink">{t.orderTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.orderBody}</p>
          </div>
          <Link
            href={href(locale, "/contact")}
            className="rounded-full bg-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-mid"
          >
            {t.orderCta}
          </Link>
        </div>
      </section>
    </>
  );
}
