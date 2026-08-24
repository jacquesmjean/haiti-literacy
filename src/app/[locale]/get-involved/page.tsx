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
  return { title: m.involved.eyebrow, description: m.involved.lede };
}

export default async function GetInvolvedPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.involved;

  return (
    <>
      {/* Hero */}
      <section className="wrap pb-14 pt-12 lg:pt-20">
        <div className="max-w-3xl animate-rise">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,3.8vw+1rem,3.9rem)] text-ink">
            {t.title}
          </h1>
          <p className="lede mt-6">{t.lede}</p>
        </div>
      </section>

      {/* Diaspora band */}
      <section className="bg-blue-deep py-16 text-white lg:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div data-reveal>
            <p className="eyebrow !text-gold">{t.diasporaTitle}</p>
            <p className="serif mt-5 text-[clamp(1.3rem,1.6vw+1rem,1.9rem)] leading-snug">
              {t.diasporaBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={href(locale, "/contact")}
                className="rounded-full bg-red px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-red-deep"
              >
                {t.diasporaCta}
              </Link>
              <Link
                href={href(locale, "/give")}
                className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/70"
              >
                {m.nav.donate}
              </Link>
            </div>
          </div>
          <figure className="arch relative hidden aspect-[4/4.4] lg:block" data-reveal>
            <Image
              src="/img/mother-reading.webp"
              alt=""
              fill
              sizes="40vw"
              className="object-cover"
            />
          </figure>
        </div>
      </section>

      {/* Ways to serve */}
      <section className="wrap py-16 lg:py-24">
        <h2 className="display text-[clamp(1.7rem,2.2vw+1rem,2.7rem)] text-ink" data-reveal>
          {t.waysTitle}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.ways.map((way, index) => (
            <article
              key={way.title}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
              className="rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)]"
            >
              <span className="serif text-2xl font-semibold text-blue/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="serif mt-3 text-lg font-semibold text-ink">{way.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{way.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10" data-reveal>
          <Link
            href={href(locale, "/contact")}
            className="inline-block rounded-full bg-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-mid"
          >
            {t.contactCta}
          </Link>
        </div>
      </section>

      {/* Transparency */}
      <section className="bg-sand/50 py-16 lg:py-20">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
          <Image
            src="/img/candid-platinum.webp"
            alt="Candid Platinum Transparency seal"
            width={200}
            height={200}
            className="h-24 w-24 object-contain"
            data-reveal
          />
          <div data-reveal>
            <h2 className="serif text-2xl font-semibold text-ink">{t.transparencyTitle}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              {t.transparencyBody}
            </p>
          </div>
          <Link
            href={href(locale, "/reports")}
            data-reveal
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-blue/50 hover:text-blue"
          >
            {t.transparencyCta}
          </Link>
        </div>
      </section>
    </>
  );
}
