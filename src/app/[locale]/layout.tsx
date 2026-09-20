import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Script from "next/script";
import { isLocale, locales, localeTags, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { site } from "@/lib/site";
import { href } from "@/lib/routes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Concierge from "@/components/Concierge";
import WelcomeBand from "@/components/WelcomeBand";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${m.meta.title} | ${m.meta.tagline}`,
      template: `%s | ${m.meta.title}`,
    },
    description: m.meta.description,
    alternates: {
      languages: Object.fromEntries(
        locales.map((code) => [localeTags[code], `/${code}`]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: m.meta.title,
      locale: localeTags[locale],
      images: [
        {
          url: `/og/${locale}.png`,
          width: 1200,
          height: 630,
          alt: m.meta.tagline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/og/${locale}.png`],
    },
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  const headerList = await headers();
  const country = headerList.get("x-visitor-country") ?? "";
  const isHaiti = country === "HT";
  const welcome = isHaiti ? m.welcome.haiti : m.welcome.global;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.name,
    url: site.url,
    logo: `${site.url}/img/pilh-logo.png`,
    taxID: site.ein,
    nonprofitStatus: "Nonprofit501c3",
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.addresses.mail.line1,
      addressLocality: site.addresses.mail.city,
      addressRegion: site.addresses.mail.region,
      postalCode: site.addresses.mail.postal,
      addressCountry: "US",
    },
    sameAs: Object.values(site.social),
    areaServed: "Haiti",
    foundingDate: "2021-09",
    description: m.meta.description,
  };

  return (
    <div lang={localeTags[locale as Locale]}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-blue focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        {m.common.skip}
      </a>

      <Header locale={locale} nav={m.nav} donateHref={href(locale, "/give")} />

      <WelcomeBand
        isHaiti={isHaiti}
        copy={welcome}
        ctaHref={href(locale, isHaiti ? "/contact" : "/give")}
        dismissLabel={m.welcome.dismiss}
      />

      <main id="main">{props.children}</main>

      <Footer locale={locale} m={m} />
      <Concierge locale={locale} copy={m.concierge} />
      <Reveal />

      <Script
        id="pilh-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
