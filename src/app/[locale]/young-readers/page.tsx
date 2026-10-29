import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { zeffyLink } from "@/lib/site";
import CountUp from "@/components/CountUp";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.nav.workItems["young-readers"], description: m.readersPage.lede };
}

export default async function YoungReadersPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.readersPage;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pb-14 pt-12 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16 lg:pt-20">
          <div className="animate-rise">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(2.2rem,3.6vw+1rem,3.8rem)] text-ink">
              {t.title}
            </h1>
            <p className="lede mt-6 max-w-xl">{t.lede}</p>
          </div>
          <figure className="arch relative hidden aspect-[4/4.4] animate-rise shadow-[var(--shadow-deep)] [animation-delay:140ms] lg:block">
            <Image
              src="/img/mother-reading.webp"
              alt=""
              fill
              priority
              sizes="38vw"
              className="object-cover"
            />
          </figure>
        </div>
        <div aria-hidden className="absolute -left-40 top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-red-wash blur-3xl" />
      </section>

      {/* The window */}
      <section className="wrap" data-reveal>
        <div className="grid items-center gap-8 rounded-[2rem] bg-blue-deep p-10 text-white lg:grid-cols-[auto_1fr] lg:gap-12 lg:p-12">
          <p className="display whitespace-nowrap text-[clamp(3.4rem,6vw,6rem)] leading-none text-gold">
            0–4
          </p>
          <div>
            <h2 className="serif text-2xl font-semibold">{t.windowTitle}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-white/75">{t.windowBody}</p>
          </div>
        </div>
      </section>

      {/* Book deserts */}
      <section className="wrap py-20 lg:py-24">
        <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink" data-reveal>
          {t.desertTitle}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {(
            [
              { key: "schools", value: 6 },
              { key: "classrooms", value: 32 },
              { key: "books", value: 0 },
            ] as const
          ).map((stat, index) => (
            <div
              key={stat.key}
              data-reveal
              style={{ "--reveal-delay": `${index * 110}ms` } as React.CSSProperties}
              className={`rounded-3xl p-8 text-center shadow-[var(--shadow-lift)] ${
                stat.key === "books"
                  ? "bg-red text-white"
                  : "border border-ink/8 bg-white"
              }`}
            >
              <p className={`display text-6xl ${stat.key === "books" ? "" : "text-blue"}`}>
                {stat.value === 0 ? (
                  "0"
                ) : (
                  <CountUp value={stat.value} locale={locale} duration={1100} />
                )}
              </p>
              <p
                className={`mt-3 text-sm leading-snug ${
                  stat.key === "books" ? "text-white/85" : "text-ink-soft"
                }`}
              >
                {t.desertLabels[stat.key]}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl leading-relaxed text-ink-soft" data-reveal>
          {t.desertBody}
        </p>
      </section>

      {/* Why Kreyol */}
      <section className="bg-sand/50 py-20 lg:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <figure className="arch relative aspect-[4/3.4]" data-reveal>
            <Image
              src="/img/young-readers.webp"
              alt=""
              fill
              sizes="(min-width:1024px) 42vw, 100vw"
              className="object-cover"
            />
          </figure>
          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink">
              {t.whyTitle}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">{t.whyBody}</p>
            <blockquote className="mt-6 rounded-2xl border-l-4 border-sea bg-sea/8 p-6 text-sm leading-relaxed text-ink">
              {t.policyCallout}
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap py-16">
        <div
          data-reveal
          className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-red p-10 text-white"
        >
          <div className="max-w-xl">
            <h2 className="serif text-2xl font-semibold">{t.ctaTitle}</h2>
            <p className="mt-2 text-white/85">{t.ctaBody}</p>
          </div>
          <a
            href={zeffyLink(15)} target="_blank" rel="noopener"
            className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-red-deep transition hover:-translate-y-0.5 hover:bg-sand"
          >
            {t.cta}
          </a>
        </div>
      </section>
    </>
  );
}
