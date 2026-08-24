"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * Secure checkout. The form is served by Zeffy, which passes one hundred
 * percent of each gift to PILH and issues the 501(c)(3) receipt.
 * The iframe only loads once it is close to the viewport so the page stays fast.
 */
export default function DonateEmbed({
  note,
  fallbackLabel,
  amount,
  title,
}: {
  note: string;
  fallbackLabel: string;
  amount?: number;
  title: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const src = amount
    ? `${site.giving.zeffyEmbed}?amount=${amount}`
    : site.giving.zeffyEmbed;

  return (
    <div ref={holder} className="w-full">
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[var(--shadow-lift)]">
        {load ? (
          <iframe
            title={title}
            src={src}
            loading="lazy"
            allow="payment"
            className="h-[720px] w-full border-0"
          />
        ) : (
          <div className="flex h-[720px] w-full items-center justify-center bg-sand/40">
            <span className="text-sm text-ink-faint">{title}</span>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-faint">{note}</p>
      <p className="mt-2 text-xs">
        <a
          href={site.giving.zeffyForm}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue underline underline-offset-4 hover:text-red"
        >
          {fallbackLabel}
        </a>
      </p>
    </div>
  );
}
