import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { site, zeffyLink } from "@/lib/site";
import { href } from "@/lib/routes";
import DonateEmbed from "@/components/DonateEmbed";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.nav.give, description: m.give.hero.lede };
}

export default async function GivePage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ amount?: string }>;
}) {
  const { locale } = await props.params;
  const { amount } = await props.searchParams;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const preselect = amount ? Number.parseInt(amount, 10) || undefined : undefined;

  return (
    <>
      <section className="wrap pb-12 pt-12 lg:pt-20">
        <div className="max-w-3xl animate-rise">
          <p className="eyebrow">{m.give.hero.eyebrow}</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,3.6vw+1rem,3.8rem)] text-ink">
            {m.give.hero.title}
          </h1>
          <p className="lede mt-6">{m.give.hero.lede}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={zeffyLink(preselect)}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-red px-8 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_10px_28px_-8px_rgba(213,31,54,0.75)] transition hover:-translate-y-0.5 hover:bg-red-deep"
            >
              {m.give.donateCta}
            </a>
            <span className="text-sm text-ink-soft">{m.give.donateSub}</span>
          </div>
        </div>
      </section>

      {/* The Book Club: named monthly giving community */}
      <section className="wrap pb-12" data-reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-blue-deep p-9 text-white lg:p-11">
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
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-gold">
                {m.give.clubBadge}
              </span>
              <h2 className="serif mt-4 text-2xl font-semibold">{m.give.clubTitle}</h2>
              <p className="mt-3 leading-relaxed text-white/75">{m.give.clubBody}</p>
            </div>
            <a
              href={zeffyLink(15)}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-red px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_28px_-8px_rgba(213,31,54,0.7)] transition hover:-translate-y-0.5 hover:bg-red-deep"
            >
              {m.home.give.cta}
            </a>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-12 pb-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* What each gift buys */}
        <div>
          <h2 className="serif text-2xl font-semibold text-ink" data-reveal>
            {m.give.amountsTitle}
          </h2>
          <p className="mt-2 text-sm text-ink-soft" data-reveal>{m.give.amountsHint}</p>
          <ul className="mt-6 grid gap-3">
            {m.give.amounts.map((row, index) => (
              <li
                key={row.amount}
                data-reveal
                style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
              >
                <a
                  href={zeffyLink(row.amount)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${m.give.giveAmount} $${row.amount.toLocaleString(locale)}: ${row.text}`}
                  className="group flex items-center gap-3 rounded-2xl border border-ink/8 bg-white px-4 py-4 sm:gap-5 sm:px-5 shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5 hover:border-red/30 hover:shadow-[var(--shadow-deep)]"
                >
                  <span className="display w-16 shrink-0 text-right text-xl text-red sm:w-20 sm:text-2xl">
                    ${row.amount.toLocaleString(locale)}
                  </span>
                  <span className="h-8 w-px bg-ink/10" aria-hidden />
                  <span className="flex-1 text-sm leading-snug text-ink-soft">{row.text}</span>
                  <span className="shrink-0 rounded-full bg-red/10 px-2.5 py-1.5 text-xs sm:px-3 font-semibold text-red transition group-hover:bg-red group-hover:text-white">
                    {m.give.giveAmount} →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-ink-faint" data-reveal>
            {m.home.give.taxLine}
          </p>

          {/* Other ways */}
          <h2 className="serif mt-12 text-2xl font-semibold text-ink" data-reveal>
            {m.give.altTitle}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {m.give.alt.map((way, index) => (
              <div
                key={way.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
                className="rounded-2xl bg-sand/60 p-5"
              >
                <h3 className="text-sm font-semibold text-ink">{way.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {way.title.includes("Givebutter") ? (
                    <>
                      {way.body}{" "}
                      <a
                        href={site.giving.givebutter}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue underline underline-offset-2"
                      >
                        givebutter.com/WSWj3X
                      </a>
                    </>
                  ) : (
                    way.body
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Volunteer */}
          <div
            className="mt-12 rounded-3xl bg-blue-deep p-8 text-white"
            data-reveal
          >
            <h2 className="serif text-xl font-semibold">{m.give.volunteerTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {m.give.volunteerBody}
            </p>
            <Link
              href={href(locale, "/get-involved")}
              className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-deep transition hover:bg-sand"
            >
              {m.give.volunteerCta}
            </Link>
          </div>
        </div>

        {/* Secure form */}
        <div id="give-form" className="scroll-mt-28 lg:sticky lg:top-24 lg:self-start" data-reveal>
          <h2 className="serif mb-5 text-2xl font-semibold text-ink">
            {m.give.formTitle}
          </h2>
          <DonateEmbed
            title={m.give.formTitle}
            note={m.give.formNote}
            fallbackLabel={site.giving.zeffyForm.replace("https://", "")}
            amount={preselect}
          />
          <p className="mt-3 text-sm">
            <Link
              href={href(locale, "/transparency")}
              className="font-medium text-blue underline underline-offset-4 hover:text-red"
            >
              {m.nav.aboutItems.transparency} →
            </Link>
          </p>
        </div>
      </section>

      {/* Donor FAQ: visible answers for people, FAQPage schema for search and answer engines */}
      <section className="wrap pb-20" data-reveal>
        <h2 className="serif text-2xl font-semibold text-ink">{m.give.faq.title}</h2>
        <div className="mt-6 grid gap-3 lg:max-w-4xl">
          {m.give.faq.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-ink/8 bg-white px-6 py-4 shadow-[var(--shadow-lift)]"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="mr-2 inline-block text-red transition group-open:rotate-90">›</span>
                {item.q}
              </summary>
              <p className="mt-3 pl-5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: m.give.faq.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
    </>
  );
}
