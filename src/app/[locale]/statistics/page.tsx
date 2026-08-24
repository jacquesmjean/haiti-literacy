import type { Metadata } from "next";
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
  return { title: m.nav.workItems.statistics, description: m.numbersPage.lede };
}

/**
 * USAID International Data and Economic Analysis, November 2022.
 * Values are percentages on a shared 0 to 100 scale.
 * Palette validated for color vision deficiency and contrast:
 * Haiti #3a4bb5, Region #b57917, World #0c8a6d on surface #fdfaf5.
 */
const SERIES = {
  haiti: "#3a4bb5",
  region: "#b57917",
  world: "#0c8a6d",
} as const;

const PERCENT_ROWS = [
  { key: "outOfSchool", haiti: 41.9, region: 6.8, world: 9.0 },
  { key: "youthLit", haiti: 83.0, region: 97.5, world: 91.5 },
  { key: "adultLit", haiti: 61.7, region: 92.3, world: 84.6 },
  { key: "enrollment", haiti: 58.1, region: 92.9, world: 91.5 },
  { key: "prePrimary", haiti: 5.6, region: 66.2, world: 60.0 },
  { key: "completion", haiti: 46.0, region: 92.3, world: 85.7 },
] as const;

/** Different units, so each gets its own scale and its own small chart. */
const YEARS_ROW = { haiti: 6.1, region: 7.7, world: 7.8, max: 10 };
const SPEND_ROW = { haiti: 1.63, region: 5.02, world: 4.62, max: 6 };

function fmt(value: number, locale: string) {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function BarGroup({
  values,
  max,
  legend,
  locale,
  unit = "",
}: {
  values: { haiti: number; region: number; world: number };
  max: number;
  legend: { haiti: string; region: string; world: string };
  locale: string;
  unit?: string;
}) {
  const rows = (["haiti", "region", "world"] as const).map((series) => ({
    series,
    value: values[series],
  }));
  return (
    <div className="grid gap-[6px]">
      {rows.map(({ series, value }) => (
        <div
          key={series}
          className="flex items-center gap-3"
          title={`${legend[series]}: ${fmt(value, locale)}${unit}`}
        >
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-[3px]"
            style={{ background: SERIES[series] }}
          />
          <div className="h-[12px] flex-1 overflow-hidden rounded-[4px] bg-ink/6">
            <div
              className="bar-fill h-full rounded-r-[4px]"
              style={{
                width: `${Math.max((value / max) * 100, 1)}%`,
                background: SERIES[series],
              }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-[0.8125rem] font-semibold tabular-nums text-ink">
            {fmt(value, locale)}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function NumbersPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.numbersPage;

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

      {/* Context tiles */}
      <section className="wrap">
        <h2 className="serif text-xl font-semibold text-ink" data-reveal>
          {t.contextTitle}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.contextStats.map((stat, index) => (
            <div
              key={stat.value}
              data-reveal
              style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
              className="rounded-3xl border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)]"
            >
              <p className="display text-4xl text-blue">{stat.value}</p>
              <div className="tricolor mt-3 h-[3px] w-10" aria-hidden />
              <p className="mt-3 text-sm leading-snug text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison chart */}
      <section className="wrap py-20 lg:py-24">
        <div className="rounded-[2rem] border border-ink/8 bg-white p-7 shadow-[var(--shadow-lift)] sm:p-10" data-reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="serif text-2xl font-semibold text-ink">{t.chartTitle}</h2>
            {/* Legend */}
            <ul className="flex flex-wrap gap-4 text-[0.8125rem] font-medium text-ink-soft">
              {(["haiti", "region", "world"] as const).map((series) => (
                <li key={series} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-3 w-3 rounded-[3px]"
                    style={{ background: SERIES[series] }}
                  />
                  {t.legend[series]}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid gap-7 lg:grid-cols-2 lg:gap-x-12">
            {PERCENT_ROWS.map((row, index) => (
              <div
                key={row.key}
                data-reveal
                style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
              >
                <h3 className="mb-2.5 text-sm font-semibold text-ink">
                  {t.indicators[row.key as keyof typeof t.indicators]}
                </h3>
                <BarGroup
                  values={row}
                  max={100}
                  legend={t.legend}
                  locale={locale}
                />
              </div>
            ))}
          </div>

          {/* Two indicators with their own units and scales */}
          <div className="mt-10 grid gap-7 border-t border-ink/8 pt-8 lg:grid-cols-2 lg:gap-x-12">
            <div data-reveal>
              <h3 className="mb-2.5 text-sm font-semibold text-ink">{t.miniTitle1}</h3>
              <BarGroup
                values={YEARS_ROW}
                max={YEARS_ROW.max}
                legend={t.legend}
                locale={locale}
              />
            </div>
            <div data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties}>
              <h3 className="mb-2.5 text-sm font-semibold text-ink">{t.miniTitle2}</h3>
              <BarGroup
                values={SPEND_ROW}
                max={SPEND_ROW.max}
                legend={t.legend}
                locale={locale}
                unit="%"
              />
            </div>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-ink-faint">{t.chartNote}</p>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-faint" data-reveal>
          {t.sourceNote}
        </p>
      </section>

      {/* Takeaway */}
      <section className="wrap pb-20">
        <div
          data-reveal
          className="grid gap-8 rounded-[2rem] bg-blue-deep p-10 text-white lg:grid-cols-[auto_1fr_auto] lg:items-center lg:p-12"
        >
          <div className="flex items-baseline gap-6">
            <span className="display text-6xl text-gold">95%</span>
            <span className="display text-6xl text-red">5.6%</span>
          </div>
          <div>
            <h2 className="serif text-2xl font-semibold">{t.takeTitle}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-white/75">{t.takeBody}</p>
          </div>
          <Link
            href={href(locale, "/give")}
            className="self-center rounded-full bg-red px-8 py-4 text-center text-sm font-semibold text-white shadow-[0_10px_28px_-8px_rgba(213,31,54,0.7)] transition hover:-translate-y-0.5 hover:bg-red-deep"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
