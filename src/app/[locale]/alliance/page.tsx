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
  return { title: m.nav.workItems.alliance, description: m.alliancePage.lede };
}

const BENEFIT_ICONS = [VideoIcon, MailIcon, FolderIcon, PeopleIcon];

export default async function AlliancePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.alliancePage;

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
            <div className="mt-6 flex flex-wrap gap-2">
              {t.facts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-full border border-blue/25 bg-blue-wash px-4 py-2 text-xs font-semibold text-blue"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>
          <figure className="arch relative hidden aspect-[4/4.2] animate-rise shadow-[var(--shadow-deep)] [animation-delay:140ms] lg:block">
            <Image
              src="/img/teacher-training.webp"
              alt=""
              fill
              priority
              sizes="38vw"
              className="object-cover"
            />
          </figure>
        </div>
        <div aria-hidden className="absolute -right-40 top-16 -z-10 h-[26rem] w-[26rem] rounded-full bg-blue-wash blur-3xl" />
      </section>

      {/* About */}
      <section className="wrap" data-reveal>
        <div className="rounded-[2rem] border-l-[6px] border-blue bg-white p-9 shadow-[var(--shadow-lift)] lg:p-11">
          <p className="max-w-4xl leading-relaxed text-ink-soft">{t.aboutBody}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="wrap py-20 lg:py-24">
        <h2 className="display text-[clamp(1.8rem,2.4vw+1rem,2.8rem)] text-ink" data-reveal>
          {t.benefitsTitle}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.map((benefit, index) => {
            const Icon = BENEFIT_ICONS[index];
            return (
              <article
                key={benefit.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
                className="group rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)] transition hover:-translate-y-1.5 hover:border-blue/30 hover:shadow-[var(--shadow-deep)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-wash text-blue transition group-hover:bg-blue group-hover:text-white">
                  <Icon />
                </span>
                <h3 className="serif mt-5 text-lg font-semibold leading-tight text-ink">
                  {benefit.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{benefit.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Join */}
      <section className="wrap pb-20">
        <div
          data-reveal
          className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-blue-deep p-10 text-white lg:p-12"
        >
          <div className="max-w-xl">
            <h2 className="serif text-2xl font-semibold">{t.joinTitle}</h2>
            <p className="mt-2 leading-relaxed text-white/75">{t.joinBody}</p>
          </div>
          <Link
            href={href(locale, "/contact")}
            className="rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-110"
          >
            {t.joinCta}
          </Link>
        </div>
      </section>
    </>
  );
}

function VideoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="11" height="10" rx="2" />
      <path d="m13 9 5-3v8l-5-3" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4.5" width="16" height="11" rx="2" />
      <path d="m3 6 7 5.5L17 6" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h4l2 2.5h7A1.5 1.5 0 0 1 18 8v6.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5v-9Z" />
      <path d="M10.5 9.5v4M8.5 11.5h4" strokeLinecap="round" />
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
