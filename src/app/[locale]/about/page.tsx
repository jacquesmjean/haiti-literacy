import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { impact } from "@/lib/site";
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
  return { title: m.nav.aboutItems.about, description: m.aboutPage.lede };
}

const VALUE_ICONS = [HandsIcon, BoltIcon, BookIcon, ShieldIcon, ScaleIcon];

export default async function AboutPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.aboutPage;

  return (
    <>
      {/* Hero with portrait */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pb-14 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-20">
          <div className="animate-rise">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(2.3rem,4vw+1rem,4.2rem)] text-ink">
              <span className="underline-sketch">{t.title}</span>
            </h1>
            <p className="lede mt-6 max-w-xl">{t.lede}</p>
          </div>
          <figure className="arch relative hidden aspect-[4/4.4] animate-rise shadow-[var(--shadow-deep)] [animation-delay:140ms] lg:block">
            <Image
              src="/img/mother-reading.webp"
              alt=""
              fill
              priority
              sizes="40vw"
              className="object-cover"
            />
          </figure>
        </div>
        <div aria-hidden className="absolute -left-40 top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-blue-wash blur-3xl" />
      </section>

      {/* Vision and mission, side by side, unmissable */}
      <section className="wrap grid gap-6 lg:grid-cols-2">
        <div
          data-reveal
          className="rounded-[2rem] bg-blue-deep p-10 text-white lg:p-12"
        >
          <p className="eyebrow !text-gold">{t.visionLabel}</p>
          <p className="serif mt-5 text-[clamp(1.25rem,1.4vw+1rem,1.75rem)] leading-snug">
            {t.vision}
          </p>
        </div>
        <div
          data-reveal
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          className="rounded-[2rem] border-2 border-red/70 bg-red-wash/40 p-10 lg:p-12"
        >
          <p className="eyebrow">{t.missionLabel}</p>
          <p className="serif mt-5 text-[clamp(1.25rem,1.4vw+1rem,1.75rem)] leading-snug text-ink">
            {t.mission}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="wrap py-20 lg:py-28">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow">{t.valuesEyebrow}</p>
          <h2 className="display mt-4 text-[clamp(1.9rem,2.6vw+1rem,3rem)] text-ink">
            {t.valuesTitle}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {t.values.map((value, index) => {
            const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
            return (
              <article
                key={value.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
                className="group relative overflow-hidden rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)] transition duration-300 hover:-translate-y-1.5 hover:border-blue/30 hover:shadow-[var(--shadow-deep)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-wash text-blue transition duration-300 group-hover:bg-blue group-hover:text-white">
                  <Icon />
                </span>
                <h3 className="serif mt-5 text-lg font-semibold leading-tight text-ink">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {value.body}
                </p>
                <span
                  aria-hidden
                  className="absolute -bottom-7 -right-3 font-[var(--font-display)] text-[6rem] font-semibold leading-none text-sand-deep/50 transition group-hover:text-blue-wash"
                >
                  {index + 1}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      {/* Numbers as proof */}
      <section className="bg-blue-deep py-16 text-white">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {impact.map((item, index) => (
            <div key={item.key} data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}>
              <p className="display text-[clamp(2.2rem,3vw+1rem,3.4rem)]">
                <CountUp value={item.value} suffix={item.suffix} locale={locale} />
              </p>
              <div className="tricolor mt-3 h-[3px] w-10" aria-hidden />
              <p className="mt-3 max-w-[16rem] text-sm leading-snug text-white/70">
                {m.home.impact[item.key as keyof typeof m.home.impact] as string}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* UN SDG */}
      <section className="wrap py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <figure className="arch relative aspect-[4/3.4]" data-reveal>
            <Image
              src="/img/teacher-training.webp"
              alt=""
              fill
              sizes="(min-width:1024px) 42vw, 100vw"
              className="object-cover"
            />
          </figure>
          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <p className="eyebrow">{t.sdgEyebrow}</p>
            <h2 className="display mt-4 text-[clamp(1.7rem,2.2vw+1rem,2.6rem)] text-ink">
              {t.sdgTitle}
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">{t.sdgBody}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.sdgTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sea/30 bg-sea/8 px-4 py-2 text-xs font-semibold text-sea"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open invitation */}
      <section className="wrap pb-8">
        <div
          data-reveal
          className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-sand/60 p-10"
        >
          <div className="max-w-xl">
            <h2 className="serif text-2xl font-semibold text-ink">{t.openTitle}</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{t.openBody}</p>
          </div>
          <Link
            href={href(locale, "/get-involved")}
            className="rounded-full bg-red px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-red-deep"
          >
            {t.openCta}
          </Link>
        </div>
      </section>
    </>
  );
}

function HandsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6.5 10.5 3 7a1.8 1.8 0 0 1 2.5-2.5L10 9m0 0 4.5-4.5A1.8 1.8 0 0 1 17 7l-5 5m-2-3 4.7 4.7M8 17l-3.2-3.2" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M11 2 4 11.5h5L9 18l7-9.5h-5L11 2Z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M10 3.5C8 2.3 5.4 2 3 2.4v12.2c2.4-.4 5-.1 7 1.1 2-1.2 4.6-1.5 7-1.1V2.4c-2.4-.4-5-.1-7 1.1Zm0 0v12.2" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M10 2 3.5 4.5v5C3.5 13.6 6.3 16.9 10 18c3.7-1.1 6.5-4.4 6.5-8.5v-5L10 2Z" />
      <path d="m7.3 9.8 2 2 3.4-3.6" strokeLinecap="round" />
    </svg>
  );
}
function ScaleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 3v14M4 17h12M10 3 5 5m5-2 5 2M5 5 3 10c.6 1 1.6 1.5 2.5 1.5S7.4 11 8 10L5 5Zm10 0-2 5c.6 1 1.6 1.5 2.5 1.5S17.4 11 18 10l-3-5Z" />
    </svg>
  );
}
