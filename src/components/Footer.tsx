import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/lib/messages";
import { site } from "@/lib/site";
import { href, aboutSlugs, workSlugs } from "@/lib/routes";
import NewsletterForm from "./NewsletterForm";

export default function Footer({
  locale,
  m,
}: {
  locale: Locale;
  m: Messages;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-blue-deep text-white">
      <div className="tricolor h-[3px] w-full" />

      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <Image
            src="/img/pilh-logo.webp"
            alt="Partners in Literacy Haiti"
            width={400}
            height={116}
            className="h-11 w-auto brightness-0 invert"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            {m.footer.mission}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={site.candid}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-white/80 transition hover:bg-white/20"
            >
              <Image
                src="/img/candid-platinum.webp"
                alt=""
                width={120}
                height={120}
                className="h-6 w-6 object-contain"
              />
              {m.home.trust.seal}
            </a>
          </div>
        </div>

        <nav aria-label={m.footer.explore}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            {m.footer.explore}
          </h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-white/75">
            {workSlugs.slice(0, 5).map((slug) => (
              <li key={slug}>
                <Link className="transition hover:text-white" href={href(locale, `/${slug}`)}>
                  {m.nav.workItems[slug as keyof typeof m.nav.workItems]}
                </Link>
              </li>
            ))}
            <li>
              <Link className="transition hover:text-white" href={href(locale, "/news")}>
                {m.nav.news}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={m.footer.support}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            {m.footer.support}
          </h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-white/75">
            <li>
              <Link className="transition hover:text-white" href={href(locale, "/give")}>
                {m.nav.give}
              </Link>
            </li>
            {aboutSlugs.map((slug) => (
              <li key={slug}>
                <Link className="transition hover:text-white" href={href(locale, `/${slug}`)}>
                  {m.nav.aboutItems[slug as keyof typeof m.nav.aboutItems]}
                </Link>
              </li>
            ))}
            <li>
              <Link className="transition hover:text-white" href={href(locale, "/transparency")}>
                {m.nav.aboutItems.transparency}
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href={href(locale, "/contact")}>
                {m.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            {m.newsletter.title}
          </h2>
          <p className="mt-4 text-sm text-white/70">{m.newsletter.body}</p>
          <div className="mt-4">
            <NewsletterForm labels={m.newsletter} />
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              {m.contact.mailTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {site.name}
              <br />
              {site.addresses.mail.line1}
              <br />
              {site.addresses.mail.city}, {site.addresses.mail.region}{" "}
              {site.addresses.mail.postal} {site.addresses.mail.country}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {(
              [
                ["Facebook", site.social.facebook],
                ["Instagram", site.social.instagram],
                ["YouTube", site.social.youtube],
                ["LinkedIn", site.social.linkedin],
                ["X", site.social.x],
              ] as const
            ).map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/50 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="wrap flex flex-col gap-4 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            {m.footer.legal} {year} {site.name}. {m.footer.rights}
          </p>
          <p className="flex items-center gap-1.5">
            {m.footer.builtBy}{" "}
            <a
              href="https://techfides.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-white"
            >
              TechFides
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
