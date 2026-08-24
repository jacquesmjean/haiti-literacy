import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { href } from "@/lib/routes";
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
  return { title: m.nav.workItems.duplan, description: m.duplanPage.lede };
}

const STATS = [
  { key: "students", value: 900, suffix: "" },
  { key: "years", value: 205, suffix: "" },
  { key: "families", value: 500, suffix: "" },
  { key: "operating", value: 21, suffix: "+" },
] as const;

const PEOPLE_IMAGES: Record<string, string | null> = {
  beverly: "/img/beverly-stephen.webp",
  judeline: null,
  beatrice: null,
  erick: null,
};

export default async function DuplanPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.duplanPage;

  return (
    <>
      {/* Hero with photo mosaic */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pb-14 pt-12 lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:pt-20">
          <div className="animate-rise">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(2.2rem,3.6vw+1rem,3.9rem)] text-ink">
              {t.title}
            </h1>
            <p className="lede mt-6 max-w-xl">{t.lede}</p>
            <Link
              href={`${href(locale, "/give")}?amount=250`}
              className="mt-8 inline-block rounded-full bg-red px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_-8px_rgba(213,31,54,0.7)] transition hover:-translate-y-0.5 hover:bg-red-deep"
            >
              {t.cta}
            </Link>
          </div>

          <div className="grid animate-rise grid-cols-2 gap-4 [animation-delay:140ms]">
            <figure className="arch relative aspect-[3/3.6] translate-y-6 overflow-hidden shadow-[var(--shadow-lift)]">
              <Image src="/img/duplan-2.webp" alt="" fill sizes="22vw" className="object-cover" />
            </figure>
            <figure className="arch relative aspect-[3/3.6] overflow-hidden shadow-[var(--shadow-deep)]">
              <Image src="/img/duplan-1.webp" alt="" fill sizes="22vw" className="object-cover" />
            </figure>
          </div>
        </div>
        <div aria-hidden className="absolute -right-40 top-10 -z-10 h-[28rem] w-[28rem] rounded-full bg-sand blur-3xl" />
      </section>

      {/* Village in numbers */}
      <section className="bg-blue-deep py-14 text-white">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <div key={stat.key} data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}>
              <p className="display text-[clamp(2.2rem,3vw+1rem,3.4rem)]">
                <CountUp value={stat.value} suffix={stat.suffix} locale={locale} />
              </p>
              <div className="tricolor mt-3 h-[3px] w-10" aria-hidden />
              <p className="mt-3 max-w-[15rem] text-sm leading-snug text-white/70">
                {t.statsLabels[stat.key as keyof typeof t.statsLabels]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Duplan */}
      <section className="wrap grid items-center gap-10 py-20 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:py-24">
        <div data-reveal>
          <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink">
            {t.whyTitle}
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">{t.whyBody}</p>
        </div>
        <figure
          data-reveal
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]"
        >
          <Image
            src="/img/duplan-map.webp"
            alt=""
            width={900}
            height={700}
            sizes="(min-width:1024px) 38vw, 100vw"
            className="w-full object-cover"
          />
        </figure>
      </section>

      {/* The people */}
      <section className="bg-sand/50 py-20 lg:py-24">
        <div className="wrap">
          <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink" data-reveal>
            {t.peopleTitle}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.people.map((person, index) => {
              const photo = PEOPLE_IMAGES[person.id];
              return (
                <article
                  key={person.id}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
                  className="group overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
                >
                  {photo ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={photo}
                        alt={person.name}
                        fill
                        sizes="(min-width:1024px) 24vw, (min-width:640px) 46vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-blue-wash">
                      <span className="display text-4xl text-blue/50">
                        {person.name
                          .split(" ")
                          .filter((word) => word[0] === word[0]?.toUpperCase())
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="serif text-lg font-semibold leading-tight text-ink">
                      {person.name}
                    </h3>
                    <p className="eyebrow mt-1.5">{person.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {person.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* What the project delivers */}
      <section className="wrap py-20 lg:py-24">
        <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink" data-reveal>
          {t.workTitle}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {t.workItems.map((item, index) => (
            <article
              key={item.title}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
              className="flex gap-5 rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)]"
            >
              <span className="serif shrink-0 text-3xl font-semibold text-blue/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="serif text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Accountability + CTA */}
      <section className="wrap pb-20">
        <div
          data-reveal
          className="grid gap-8 rounded-[2rem] bg-blue-deep p-10 text-white lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-14"
        >
          <div>
            <h2 className="serif text-2xl font-semibold">{t.accountTitle}</h2>
            <p className="mt-3 leading-relaxed text-white/75">{t.accountBody}</p>
          </div>
          <div className="rounded-3xl bg-white/8 p-7 backdrop-blur">
            <h3 className="serif text-xl font-semibold">{t.ctaTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{t.ctaBody}</p>
            <Link
              href={`${href(locale, "/give")}?amount=250`}
              className="mt-5 inline-block rounded-full bg-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-deep"
            >
              {t.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
