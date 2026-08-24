import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.nav.contact, description: m.contact.lede };
}

export default async function ContactPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <section className="wrap grid gap-14 pb-20 pt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:pt-20">
      <div className="animate-rise">
        <p className="eyebrow">{m.contact.eyebrow}</p>
        <h1 className="display mt-4 text-[clamp(2.1rem,3.2vw+1rem,3.4rem)] text-ink">
          {m.contact.title}
        </h1>
        <p className="lede mt-6">{m.contact.lede}</p>

        <dl className="mt-10 grid gap-6 text-sm">
          <div>
            <dt className="eyebrow">{m.contact.emailTitle}</dt>
            <dd className="mt-2">
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-blue underline underline-offset-4 hover:text-red"
              >
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">{m.contact.officeTitle}</dt>
            <dd className="mt-2 leading-relaxed text-ink-soft">
              {site.name}
              <br />
              {site.addresses.office.line1}
              <br />
              {site.addresses.office.city}, {site.addresses.office.region}{" "}
              {site.addresses.office.postal} {site.addresses.office.country}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">{m.contact.mailTitle}</dt>
            <dd className="mt-2 leading-relaxed text-ink-soft">
              {site.name}
              <br />
              {site.addresses.mail.line1}
              <br />
              {site.addresses.mail.city}, {site.addresses.mail.region}{" "}
              {site.addresses.mail.postal} {site.addresses.mail.country}
            </dd>
          </div>
        </dl>

        <p className="mt-10 max-w-md text-xs leading-relaxed text-ink-faint">
          {m.contact.legal}
        </p>
      </div>

      <div className="animate-rise rounded-3xl border border-ink/8 bg-sand/40 p-6 sm:p-9 [animation-delay:120ms]">
        <ContactForm copy={m.contact.form} locale={locale} />
      </div>
    </section>
  );
}
