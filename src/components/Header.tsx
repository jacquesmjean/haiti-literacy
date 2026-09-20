"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeNames, localeShort, type Locale } from "@/lib/i18n";
import { href, aboutSlugs, workSlugs } from "@/lib/routes";

type NavMessages = {
  about: string;
  work: string;
  news: string;
  give: string;
  contact: string;
  donate: string;
  involved: string;
  menu: string;
  close: string;
  language: string;
  aboutItems: Record<string, string>;
  workItems: Record<string, string>;
};

export default function Header({
  locale,
  nav,
  donateHref,
}: {
  locale: Locale;
  nav: NavMessages;
  donateHref: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<"about" | "work" | "lang" | null>(null);
  const [mobile, setMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setOpen(null);
      setMobile(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  /** Same page, different language. */
  const swapLocale = (next: Locale) => {
    const rest = pathname.split("/").slice(2).join("/");
    return `/${next}${rest ? `/${rest}` : ""}`;
  };

  const isActive = (path: string) => pathname === href(locale, path);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/92 backdrop-blur-xl shadow-[0_1px_0_rgba(16,20,42,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="tricolor h-[3px] w-full" />

      <div className="wrap flex items-center justify-between gap-4 py-3">
        <Link
          href={href(locale)}
          className="flex shrink-0 items-center gap-3"
          aria-label={nav.about}
        >
          <Image
            src="/img/pilh-logo.webp"
            alt="Partners in Literacy Haiti"
            width={400}
            height={116}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <Dropdown
            label={nav.about}
            open={open === "about"}
            onToggle={() => setOpen(open === "about" ? null : "about")}
            items={aboutSlugs.map((slug) => ({
              href: href(locale, `/${slug}`),
              label: nav.aboutItems[slug] ?? slug,
            })).concat({
              href: href(locale, "/transparency"),
              label: nav.aboutItems.transparency,
            })}
          />
          <Dropdown
            label={nav.work}
            open={open === "work"}
            onToggle={() => setOpen(open === "work" ? null : "work")}
            items={workSlugs.map((slug) => ({
              href: href(locale, `/${slug}`),
              label: nav.workItems[slug] ?? slug,
            }))}
          />
          <TopLink href={href(locale, "/get-involved")} active={isActive("/get-involved")}>
            {nav.involved}
          </TopLink>
          <TopLink href={href(locale, "/news")} active={isActive("/news")}>
            {nav.news}
          </TopLink>
          <TopLink href={href(locale, "/contact")} active={isActive("/contact")}>
            {nav.contact}
          </TopLink>
        </nav>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(open === "lang" ? null : "lang")}
              aria-expanded={open === "lang"}
              aria-label={nav.language}
              className="flex items-center gap-1.5 rounded-full border border-ink/12 px-3 py-2 text-[0.8125rem] font-medium text-ink transition hover:border-blue/40 hover:bg-blue-wash/60"
            >
              <GlobeIcon />
              <span>{localeShort[locale]}</span>
              <Chevron open={open === "lang"} />
            </button>
            {open === "lang" && (
              <ul className="absolute right-0 top-[calc(100%+8px)] w-52 overflow-hidden rounded-2xl border border-ink/10 bg-paper py-1.5 shadow-[var(--shadow-deep)]">
                {locales.map((code) => (
                  <li key={code}>
                    <Link
                      href={swapLocale(code)}
                      hrefLang={code}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm transition hover:bg-blue-wash ${
                        code === locale ? "font-semibold text-blue" : "text-ink-soft"
                      }`}
                    >
                      {localeNames[code]}
                      {code === locale && <CheckIcon />}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href={donateHref}
            className="hidden rounded-full bg-red px-5 py-2.5 text-[0.8125rem] font-semibold tracking-wide text-white shadow-[0_6px_18px_-6px_rgba(213,31,54,0.7)] transition hover:bg-red-deep hover:shadow-[0_10px_24px_-8px_rgba(213,31,54,0.8)] sm:block"
          >
            {nav.donate}
          </Link>

          <button
            type="button"
            onClick={() => setMobile(true)}
            className="rounded-full border border-ink/12 p-2.5 lg:hidden"
            aria-label={nav.menu}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobile(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-paper shadow-[var(--shadow-deep)]">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <Image
                src="/img/pilh-logo.webp"
                alt="Partners in Literacy Haiti"
                width={400}
                height={116}
                className="h-8 w-auto"
              />
              <button
                type="button"
                onClick={() => setMobile(false)}
                aria-label={nav.close}
                className="rounded-full border border-ink/12 p-2"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="flex-1 px-5 py-6" aria-label="Mobile">
              <MobileGroup title={nav.about}>
                {aboutSlugs.map((slug) => (
                  <MobileLink key={slug} href={href(locale, `/${slug}`)}>
                    {nav.aboutItems[slug] ?? slug}
                  </MobileLink>
                ))}
                <MobileLink href={href(locale, "/transparency")}>
                  {nav.aboutItems.transparency}
                </MobileLink>
              </MobileGroup>

              <MobileGroup title={nav.work}>
                {workSlugs.map((slug) => (
                  <MobileLink key={slug} href={href(locale, `/${slug}`)}>
                    {nav.workItems[slug] ?? slug}
                  </MobileLink>
                ))}
              </MobileGroup>

              <MobileGroup title="">
                <MobileLink href={href(locale, "/get-involved")}>{nav.involved}</MobileLink>
                <MobileLink href={href(locale, "/news")}>{nav.news}</MobileLink>
                <MobileLink href={href(locale, "/contact")}>{nav.contact}</MobileLink>
                <MobileLink href={href(locale, "/give")}>{nav.give}</MobileLink>
              </MobileGroup>

              <div className="mt-6 border-t border-ink/10 pt-6">
                <p className="eyebrow mb-3">{nav.language}</p>
                <div className="flex flex-wrap gap-2">
                  {locales.map((code) => (
                    <Link
                      key={code}
                      href={swapLocale(code)}
                      hrefLang={code}
                      className={`rounded-full border px-3.5 py-2 text-sm transition ${
                        code === locale
                          ? "border-blue bg-blue text-white"
                          : "border-ink/15 text-ink-soft hover:border-blue/40"
                      }`}
                    >
                      {localeNames[code]}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="border-t border-ink/10 p-5">
              <Link
                href={donateHref}
                className="block rounded-full bg-red px-5 py-3.5 text-center text-sm font-semibold text-white"
              >
                {nav.donate}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function TopLink({
  href: to,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={to}
      className={`rounded-full px-3.5 py-2 text-[0.875rem] font-medium transition hover:bg-blue-wash ${
        active ? "text-blue" : "text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function Dropdown({
  label,
  open,
  onToggle,
  items,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.875rem] font-medium text-ink transition hover:bg-blue-wash"
      >
        {label}
        <Chevron open={open} />
      </button>
      {open && (
        <ul className="absolute left-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl border border-ink/10 bg-paper py-1.5 shadow-[var(--shadow-deep)]">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-2.5 text-sm text-ink-soft transition hover:bg-blue-wash hover:text-blue"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MobileGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {title && <p className="eyebrow mb-2">{title}</p>}
      <ul className="grid gap-0.5">{children}</ul>
    </div>
  );
}

function MobileLink({ href: to, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={to}
        className="block rounded-xl px-3 py-2.5 text-[0.9375rem] text-ink transition hover:bg-blue-wash"
      >
        {children}
      </Link>
    </li>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M1 3.5 5 7l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="8" r="6.4" />
      <path d="M8 1.6c1.8 2 2.6 4 2.6 6.4s-.8 4.4-2.6 6.4C6.2 12.4 5.4 10.4 5.4 8S6.2 3.6 8 1.6ZM1.8 8h12.4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 8.5 3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2 5h14M2 9h14M2 13h14" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
    </svg>
  );
}
