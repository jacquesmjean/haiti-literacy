import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { reports, site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.reports.title, description: m.reports.lede };
}

export default async function ReportsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <section className="wrap pb-20 pt-12 lg:pt-20">
      <div className="max-w-2xl animate-rise">
        <p className="eyebrow">{m.reports.eyebrow}</p>
        <h1 className="display mt-4 text-[clamp(2.1rem,3.2vw+1rem,3.4rem)] text-ink">
          {m.reports.title}
        </h1>
        <p className="lede mt-6">{m.reports.lede}</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((report, index) => (
          <a
            key={report.year}
            href={report.href}
            target="_blank"
            rel="noreferrer"
            data-reveal
            style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
            className="group rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-wash text-red">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 2H5.5A1.5 1.5 0 0 0 4 3.5v13A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5V6l-4-4Z" strokeLinejoin="round" />
                <path d="M12 2v4h4M7.5 11h5m-5 3h5" strokeLinecap="round" />
              </svg>
            </span>
            <p className="display mt-5 text-3xl text-ink">{report.year}</p>
            <p className="mt-1 text-sm text-ink-faint">{m.reports.year}</p>
            <span className="mt-5 inline-block text-sm font-semibold text-blue transition group-hover:text-red">
              {m.reports.download} ↓
            </span>
          </a>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-6 rounded-3xl bg-sand/60 p-8" data-reveal>
        <Image
          src="/img/candid-platinum.webp"
          alt="Candid Platinum Transparency seal"
          width={200}
          height={200}
          className="h-20 w-20 object-contain"
        />
        <div className="max-w-xl">
          <p className="serif text-lg font-semibold text-ink">{m.home.trust.seal}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            {m.home.trust.body}
          </p>
          <a
            href={site.candid}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-blue underline underline-offset-4 hover:text-red"
          >
            candid.org →
          </a>
        </div>
      </div>
    </section>
  );
}
