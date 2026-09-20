import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { impact, libraries, tiers, site } from "@/lib/site";
import { listNews } from "@/lib/content";
import { href } from "@/lib/routes";
import CountUp from "@/components/CountUp";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const news = (await listNews(locale)).slice(0, 3);

  return (
    <>
      {/* ------------------------------------------------ Hero */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-16">
          <div className="animate-rise">
            <p className="eyebrow">{m.home.hero.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(2.6rem,5.4vw+1rem,4.9rem)] text-ink">
              {m.home.hero.title}
            </h1>
            <p className="lede mt-6 max-w-xl">{m.home.hero.lede}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={href(locale, "/give")}
                className="rounded-full bg-red px-7 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_10px_28px_-8px_rgba(213,31,54,0.75)] transition hover:-translate-y-0.5 hover:bg-red-deep"
              >
                {m.home.hero.ctaPrimary}
              </Link>
              <Link
                href={href(locale, "/our-work")}
                className="rounded-full border border-ink/15 px-7 py-4 text-[0.9375rem] font-semibold text-ink transition hover:border-blue/50 hover:text-blue"
              >
                {m.home.hero.ctaSecondary}
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 text-xs text-ink-faint">
              <a href={site.candid} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-ink">
                <Image
                  src="/img/candid-platinum.webp"
                  alt="Candid Platinum Transparency"
                  width={120}
                  height={120}
                  className="h-8 w-8 object-contain"
                />
                {m.home.trust.seal}
              </a>
              <span className="h-4 w-px bg-ink/15" aria-hidden />
              <span>{m.home.trust.status}</span>
              <span className="hidden h-4 w-px bg-ink/15 sm:block" aria-hidden />
              <span className="hidden sm:block">{m.home.trust.ein}</span>
            </div>
          </div>

          <figure className="relative animate-rise [animation-delay:150ms]">
            <div className="arch relative aspect-[4/4.6] shadow-[var(--shadow-deep)]">
              <Image
                src="/img/hero-lachapelle.webp"
                alt={m.home.hero.caption}
                fill
                priority
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {/* Floating book count chip */}
            <div className="absolute -bottom-5 left-1/2 flex w-max -translate-x-1/2 items-center gap-3 rounded-2xl border border-ink/8 bg-paper px-5 py-3.5 shadow-[var(--shadow-lift)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-wash text-red">
                <BookIcon />
              </span>
              <div>
                <p className="serif text-xl font-semibold leading-none text-ink">
                  <CountUp value={3000} suffix="+" locale={locale} />
                </p>
                <p className="mt-1 text-xs text-ink-faint">{m.home.impact.books}</p>
              </div>
            </div>
            <figcaption className="sr-only">{m.home.hero.caption}</figcaption>
          </figure>
        </div>

        {/* Soft background tint */}
        <div
          aria-hidden
          className="absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-blue-wash blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-52 top-64 -z-10 h-[26rem] w-[26rem] rounded-full bg-sand blur-3xl"
        />
      </section>

      {/* ------------------------------------------------ Impact counters */}
      <section className="bg-blue-deep py-16 text-white lg:py-20">
        <div className="wrap">
          <p className="eyebrow !text-gold" data-reveal>
            {m.home.impact.eyebrow}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {impact.map((item, index) => (
              <div key={item.key} data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}>
                <p className="display text-[clamp(2.5rem,3.4vw+1rem,4rem)] text-white">
                  <CountUp value={item.value} suffix={item.suffix} locale={locale} />
                </p>
                <div className="tricolor mt-3 h-[3px] w-10" aria-hidden />
                <p className="mt-3 max-w-[16rem] text-sm leading-snug text-white/70">
                  {m.home.impact[item.key as keyof typeof m.home.impact] as string}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-xl text-xs text-white/45" data-reveal>
            {m.home.impact.note}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ Problem */}
      <section className="py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow">{m.home.problem.eyebrow}</p>
            <h2 className="display mt-4 text-[clamp(1.9rem,2.6vw+1rem,3.1rem)] text-ink">
              {m.home.problem.title}
            </h2>
            <p className="mt-6 leading-relaxed text-ink-soft">{m.home.problem.body}</p>

            <blockquote className="mt-9 border-l-[3px] border-red pl-5">
              <p className="serif text-xl leading-snug text-ink">
                “{m.home.problem.quote}”
              </p>
              <cite className="mt-3 block text-sm not-italic text-ink-faint">
                {m.home.problem.quoteBy}
              </cite>
            </blockquote>
          </div>

          <div className="grid content-start gap-5">
            {[
              { value: m.home.problem.stat1Value, label: m.home.problem.stat1Label, tone: "red" },
              { value: m.home.problem.stat2Value, label: m.home.problem.stat2Label, tone: "blue" },
              { value: m.home.problem.stat3Value, label: m.home.problem.stat3Label, tone: "gold" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                data-reveal
                style={{ "--reveal-delay": `${index * 110}ms` } as React.CSSProperties}
                className="flex items-center gap-6 rounded-3xl border border-ink/8 bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7"
              >
                <p
                  className={`display text-[clamp(2.2rem,2.4vw+1rem,3.2rem)] ${
                    stat.tone === "red"
                      ? "text-red"
                      : stat.tone === "blue"
                        ? "text-blue"
                        : "text-gold"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-[0.9375rem] leading-snug text-ink-soft">{stat.label}</p>
              </div>
            ))}
            <p className="text-[0.6875rem] leading-relaxed text-ink-faint" data-reveal>
              {m.home.problem.sources}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Approach */}
      <section className="bg-sand/50 py-20 lg:py-28">
        <div className="wrap">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow">{m.home.approach.eyebrow}</p>
            <h2 className="display mt-4 text-[clamp(1.9rem,2.6vw+1rem,3.1rem)] text-ink">
              {m.home.approach.title}
            </h2>
            <p className="lede mt-5">{m.home.approach.lede}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {m.home.approach.items.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 110}ms` } as React.CSSProperties}
                className="group relative overflow-hidden rounded-3xl border border-ink/8 bg-paper p-8 shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
              >
                <span className="serif absolute -right-3 -top-6 text-[7rem] font-semibold leading-none text-blue/8 transition group-hover:text-blue/14">
                  {index + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue text-white">
                  {index === 0 ? <BookIcon /> : index === 1 ? <LibraryIcon /> : <PeopleIcon />}
                </span>
                <h3 className="serif mt-6 text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Libraries */}
      <section className="py-20 lg:py-28">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">{m.home.libraries.eyebrow}</p>
              <h2 className="display mt-4 text-[clamp(1.9rem,2.6vw+1rem,3.1rem)] text-ink">
                {m.home.libraries.title}
              </h2>
              <p className="lede mt-5">{m.home.libraries.lede}</p>
            </div>
            <Link
              href={href(locale, "/libraries")}
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-blue/50 hover:text-blue"
            >
              {m.home.libraries.cta}
            </Link>
          </div>

          <div className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {libraries.map((library, index) => (
              <Link
                key={library.id}
                href={href(locale, library.id === "duplan" ? "/duplan" : "/libraries")}
                data-reveal
                style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
                className="group w-[16rem] shrink-0 snap-start lg:w-auto"
              >
                <div className="arch relative aspect-[3/3.6]">
                  <Image
                    src={library.image}
                    alt={library.name}
                    fill
                    sizes="(min-width:1024px) 19vw, 66vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-3 top-4 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wide text-white ${
                      library.service === "AS" ? "bg-sea" : "bg-blue"
                    }`}
                  >
                    {library.service === "AS" ? m.home.libraries.all : m.home.libraries.partial}
                  </span>
                </div>
                <h3 className="serif mt-4 text-[1.0625rem] font-semibold leading-tight text-ink transition group-hover:text-blue">
                  {library.name}
                </h3>
                <p className="mt-1 text-xs text-ink-faint">
                  {library.department} · {m.home.libraries.since} {library.year}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Testimonial */}
      <section className="relative overflow-hidden bg-blue py-20 text-white lg:py-28">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div className="wrap-narrow relative text-center" data-reveal>
          <p className="eyebrow !text-gold">{m.home.testimonial.eyebrow}</p>
          <p className="serif mt-7 text-[clamp(1.4rem,1.8vw+1rem,2.2rem)] leading-snug">
            “{m.home.testimonial.quote}”
          </p>
          <p className="mt-7 text-sm text-white/65">{m.home.testimonial.attribution}</p>
        </div>
      </section>

      {/* ------------------------------------------------ Giving tiers */}
      <section className="py-20 lg:py-28">
        <div className="wrap">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow">{m.home.give.eyebrow}</p>
            <h2 className="display mt-4 text-[clamp(1.9rem,2.6vw+1rem,3.1rem)] text-ink">
              {m.home.give.title}
            </h2>
            <p className="lede mt-5">{m.home.give.lede}</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, index) => {
              const amountText = m.give.amounts.find((a) => a.amount === tier.amount)?.text ?? "";
              return (
                <Link
                  key={tier.id}
                  href={`${href(locale, "/give")}?amount=${tier.amount}`}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
                  className="group overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={tier.image}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 24vw, (min-width:640px) 46vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="flex items-baseline gap-1.5">
                      <span className="display text-3xl text-red">${tier.amount}</span>
                      <span className="text-xs font-medium text-ink-faint">
                        {tier.recurring ? m.home.give.monthly : m.home.give.once}
                      </span>
                    </p>
                    <p className="mt-2.5 min-h-[2.6rem] text-sm leading-snug text-ink-soft">
                      {amountText}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue transition group-hover:gap-2.5">
                      {m.home.give.cta} <ArrowIcon />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-ink-faint" data-reveal>
            {m.home.give.taxLine} · {m.home.trust.body}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ News */}
      {news.length > 0 && (
        <section className="bg-sand/50 py-20 lg:py-24">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
              <div>
                <p className="eyebrow">{m.home.news.eyebrow}</p>
                <h2 className="display mt-4 text-[clamp(1.9rem,2.4vw+1rem,2.9rem)] text-ink">
                  {m.home.news.title}
                </h2>
              </div>
              <Link
                href={href(locale, "/news")}
                className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-blue/50 hover:text-blue"
              >
                {m.home.news.cta}
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {news.map((item, index) => (
                <Link
                  key={item.slug}
                  href={href(locale, `/news/${item.slug}`)}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}
                  className="group overflow-hidden rounded-3xl border border-ink/8 bg-paper shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
                >
                  {item.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(min-width:768px) 31vw, 100vw"
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
                    <h3 className="serif mt-2 text-lg font-semibold leading-snug text-ink transition group-hover:text-blue">
                      {item.title}
                    </h3>
                    {item.lede && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-3">
                        {item.lede}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 3.5C8 2.3 5.4 2 3 2.4v12.2c2.4-.4 5-.1 7 1.1 2-1.2 4.6-1.5 7-1.1V2.4c-2.4-.4-5-.1-7 1.1Zm0 0v12.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.5 8 10 3l7.5 5M4 8v8m4-8v8m4-8v8m4-8v8M2.5 16h15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7 9.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Zm6.5-.5a2.25 2.25 0 1 0 0-4.5M2.5 16c.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4m1.5-3.6c1.7.3 3 1.5 3.5 3.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 8h11M9.5 3.5 14 8l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
