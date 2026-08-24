import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { href } from "@/lib/routes";
import TimelineRail from "@/components/TimelineRail";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.nav.aboutItems.history, description: m.historyPage.lede };
}

/** Milestones in order. Text lives in messages, imagery and years live here. */
const MILESTONES = [
  { id: "epiphany", year: "2009", image: "/img/cange-library.webp" },
  { id: "rotary", year: "2011", image: "/img/cange-plateau.webp" },
  { id: "materials", year: "2016", image: "/img/girl-with-book.webp" },
  { id: "nonprofit", year: "2021", image: "/img/about-hero.webp" },
  { id: "duplan", year: "2022", image: "/img/duplan-1.webp" },
  { id: "kreyol", year: "2022", image: "/img/young-readers.webp" },
  { id: "books", year: "2025", image: "/img/book-give.webp" },
] as const;

export default async function HistoryPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.historyPage;

  return (
    <>
      <section className="wrap pb-16 pt-12 lg:pt-20">
        <div className="max-w-3xl animate-rise">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,3.6vw+1rem,3.8rem)] text-ink">
            {t.title}
          </h1>
          <p className="lede mt-6">{t.lede}</p>
        </div>
      </section>

      {/* Interactive timeline */}
      <section className="wrap pb-10">
        <TimelineRail>
          <ol className="space-y-14 sm:space-y-20">
            {MILESTONES.map((milestone, index) => {
              const copy = t.items[milestone.id as keyof typeof t.items];
              const left = index % 2 === 0;
              return (
                <li
                  key={`${milestone.id}-${index}`}
                  className="relative grid gap-5 pl-12 sm:grid-cols-2 sm:gap-12 sm:pl-0"
                >
                  {/* Node on the rail */}
                  <span
                    aria-hidden
                    className="absolute left-[1.15rem] top-2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-red bg-paper sm:left-1/2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red" />
                  </span>

                  {/* Text card */}
                  <div
                    data-reveal
                    className={`sm:pt-0 ${left ? "sm:order-1 sm:pr-14 sm:text-right" : "sm:order-2 sm:pl-14"}`}
                  >
                    <p className="display text-3xl text-blue/40">{milestone.year}</p>
                    <h2 className="serif mt-2 text-xl font-semibold leading-tight text-ink">
                      {copy.title}
                    </h2>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {copy.body}
                    </p>
                  </div>

                  {/* Photo */}
                  <figure
                    data-reveal
                    style={{ "--reveal-delay": "130ms" } as React.CSSProperties}
                    className={`group relative aspect-[16/10] overflow-hidden rounded-3xl shadow-[var(--shadow-lift)] transition hover:shadow-[var(--shadow-deep)] ${
                      left ? "sm:order-2 sm:ml-14" : "sm:order-1 sm:mr-14"
                    }`}
                  >
                    <Image
                      src={milestone.image}
                      alt=""
                      fill
                      sizes="(min-width:640px) 44vw, 90vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </figure>
                </li>
              );
            })}
          </ol>
        </TimelineRail>
      </section>

      {/* Next chapter */}
      <section className="wrap pb-20 pt-8">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] bg-blue-deep p-10 text-white lg:p-14"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #fff 1.5px, transparent 1.5px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-xl">
              <p className="display text-3xl text-gold">…</p>
              <h2 className="serif mt-2 text-2xl font-semibold">{t.todayTitle}</h2>
              <p className="mt-3 leading-relaxed text-white/75">{t.todayBody}</p>
            </div>
            <Link
              href={href(locale, "/give")}
              className="rounded-full bg-red px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_28px_-8px_rgba(213,31,54,0.7)] transition hover:-translate-y-0.5 hover:bg-red-deep"
            >
              {t.todayCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
