import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { libraries } from "@/lib/site";
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
  return { title: m.nav.workItems.libraries, description: m.librariesPage.lede };
}

export default async function LibrariesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.librariesPage;

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
              src="/img/lachapelle-group.webp"
              alt=""
              fill
              priority
              sizes="38vw"
              className="object-cover"
            />
          </figure>
        </div>
        <div aria-hidden className="absolute -left-40 top-20 -z-10 h-[26rem] w-[26rem] rounded-full bg-blue-wash blur-3xl" />
      </section>

      {/* The standard */}
      <section className="wrap">
        <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink" data-reveal>
          {t.standardsTitle}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.standards.map((standard, index) => (
            <article
              key={standard.title}
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
              className="rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:border-blue/25 hover:shadow-[var(--shadow-deep)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sea/10 text-sea">
                <CheckIcon />
              </span>
              <h3 className="serif mt-4 text-lg font-semibold leading-tight text-ink">
                {standard.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{standard.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* The five libraries */}
      <section className="wrap py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
          <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink">
            {t.listTitle}
          </h2>
          <div className="flex gap-2 text-xs">
            <span className="rounded-full bg-sea/10 px-3.5 py-1.5 font-semibold text-sea">
              {m.home.libraries.all}
            </span>
            <span className="rounded-full bg-gold/15 px-3.5 py-1.5 font-semibold text-[#8a6210]">
              {m.home.libraries.partial}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {libraries.map((library, index) => {
            const card = (
              <article
                className={`group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl p-6 text-white shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)] ${
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <Image
                  src={library.image}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 31vw, (min-width:640px) 46vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <span
                  className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-[0.6875rem] font-bold uppercase tracking-wide ${
                    library.service === "AS" ? "bg-sea text-white" : "bg-gold text-ink"
                  }`}
                >
                  {library.service === "AS" ? m.home.libraries.all : m.home.libraries.partial}
                </span>
                <span className="relative">
                  <span className="serif block text-xl font-semibold leading-tight">
                    {library.name}
                  </span>
                  <span className="mt-1.5 block text-sm text-white/75">
                    {library.department} · {m.home.libraries.since} {library.year}
                  </span>
                  {library.id === "duplan" && (
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold transition group-hover:gap-3">
                      {m.common.learnMore} <span aria-hidden>→</span>
                    </span>
                  )}
                </span>
              </article>
            );
            return library.id === "duplan" ? (
              <Link
                key={library.id}
                href={href(locale, "/duplan")}
                data-reveal
                style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
              >
                {card}
              </Link>
            ) : (
              <div
                key={library.id}
                data-reveal
                style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
              >
                {card}
              </div>
            );
          })}

          {/* Alliance banner fills the sixth slot */}
          <Link
            href={href(locale, "/alliance")}
            data-reveal
            style={{ "--reveal-delay": "350ms" } as React.CSSProperties}
            className="group flex h-72 flex-col justify-between rounded-3xl bg-blue-deep p-7 text-white shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
          >
            <p className="display text-5xl text-gold">12</p>
            <div>
              <h3 className="serif text-xl font-semibold leading-tight">{t.allianceTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{t.allianceBody}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold transition group-hover:gap-3">
                {t.allianceCta} <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Training partners */}
      <section className="bg-sand/50 py-20">
        <div className="wrap">
          <div className="max-w-2xl" data-reveal>
            <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink">
              {t.trainersTitle}
            </h2>
            <p className="lede mt-4">{t.trainersLede}</p>
          </div>
          <ul className="mt-10 grid gap-3">
            {t.trainers.map((trainer, index) => (
              <li
                key={trainer.who}
                data-reveal
                style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-2xl border border-ink/8 bg-white px-6 py-4 shadow-[var(--shadow-lift)]"
              >
                <span className="font-semibold text-ink">{trainer.who}</span>
                <span className="text-sm text-ink-soft">{trainer.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m3 8.5 3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
