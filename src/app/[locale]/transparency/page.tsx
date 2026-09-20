import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { reports, site } from "@/lib/site";
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
  return { title: m.nav.aboutItems.transparency, description: m.transparencyPage.lede };
}

const POINT_ICONS = [SealIcon, PeopleIcon, ChartIcon, ReceiptIcon];

export default async function TransparencyPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.transparencyPage;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="wrap max-w-3xl pb-12 pt-12 lg:pt-20">
          <p className="eyebrow animate-rise">{t.eyebrow}</p>
          <h1 className="display mt-4 animate-rise text-[clamp(2.2rem,3.6vw+1rem,3.8rem)] text-ink [animation-delay:80ms]">
            {t.title}
          </h1>
          <p className="lede mt-6 animate-rise [animation-delay:160ms]">{t.lede}</p>
        </div>
        <div aria-hidden className="absolute -right-40 top-8 -z-10 h-[24rem] w-[24rem] rounded-full bg-blue-wash blur-3xl" />
      </section>

      {/* The four proofs */}
      <section className="wrap grid gap-5 sm:grid-cols-2">
        {t.points.map((point, index) => {
          const Icon = POINT_ICONS[index % POINT_ICONS.length];
          return (
            <article
              key={point.title}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
              className="rounded-3xl border border-ink/8 bg-white p-8 shadow-[var(--shadow-lift)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sea/10 text-sea">
                <Icon />
              </span>
              <h2 className="serif mt-4 text-lg font-semibold text-ink">{point.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{point.body}</p>
            </article>
          );
        })}
      </section>

      {/* Candid verification */}
      <section className="wrap py-14" data-reveal>
        <a
          href={site.candid}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-blue-deep p-8 text-white transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-deep)] lg:p-10"
        >
          <span className="flex items-center gap-5">
            <Image
              src="/img/candid-platinum.webp"
              alt="Candid Platinum Transparency Seal"
              width={120}
              height={120}
              className="h-16 w-16 object-contain"
            />
            <span>
              <span className="serif block text-xl font-semibold">{m.home.trust.seal}</span>
              <span className="mt-1 block text-sm text-white/70">
                {m.home.trust.ein} · {m.home.trust.status}
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold transition group-hover:bg-white/20">
            {t.verify} <span aria-hidden>→</span>
          </span>
        </a>
      </section>

      {/* Annual reports */}
      <section className="wrap pb-6">
        <h2 className="display text-[clamp(1.7rem,2.2vw+1rem,2.5rem)] text-ink" data-reveal>
          {t.reportsTitle}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reports.map((report, index) => (
            <a
              key={report.year}
              href={report.href}
              target="_blank"
              rel="noreferrer"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
              className="group rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:border-blue/30 hover:shadow-[var(--shadow-deep)]"
            >
              <p className="display text-4xl text-blue">{report.year}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{m.reports.year}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red transition group-hover:gap-3">
                {m.reports.download} <span aria-hidden>↓</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Check by mail */}
      <section className="wrap py-14">
        <div
          data-reveal
          className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-sand/60 p-9"
        >
          <div>
            <h2 className="serif text-xl font-semibold text-ink">{t.checkTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.checkBody}</p>
          </div>
          <Link
            href={href(locale, "/give")}
            className="rounded-full bg-red px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-red-deep"
          >
            {m.common.donateNow}
          </Link>
        </div>
      </section>
    </>
  );
}

function SealIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M10 2 3.5 4.5v5C3.5 13.6 6.3 16.9 10 18c3.7-1.1 6.5-4.4 6.5-8.5v-5L10 2Z" />
      <path d="m7.3 9.8 2 2 3.4-3.6" strokeLinecap="round" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="7" cy="7" r="2.6" />
      <path d="M2.5 16.5c.6-2.6 2.4-4 4.5-4s3.9 1.4 4.5 4M13.5 5.2a2.6 2.6 0 1 1 0 4.4M13.8 12.7c1.8.3 3.2 1.6 3.7 3.8" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M3 17h14M5 13v-3M9 13V6M13 13V9M17 13V4" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M5 2h10v16l-2.5-1.5L10 18l-2.5-1.5L5 18V2Z" />
      <path d="M8 6.5h4M8 10h4" strokeLinecap="round" />
    </svg>
  );
}
