"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * A short, geo aware welcome. Visitors connecting from Haiti see the community
 * services message first. Everyone else sees the donor message.
 * Dismissed state is remembered for the session only.
 */
export default function WelcomeBand({
  isHaiti,
  copy,
  ctaHref,
  dismissLabel,
}: {
  isHaiti: boolean;
  copy: { eyebrow: string; title: string; body: string; cta: string };
  ctaHref: string;
  dismissLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem("pilh_welcome") === "seen";
      } catch {
        seen = false;
      }
      if (!seen) setVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem("pilh_welcome", "seen");
    } catch {
      /* private mode, nothing to remember */
    }
  };

  return (
    <div
      className={`animate-rise border-b ${
        isHaiti ? "border-sea/20 bg-sea/8" : "border-blue/15 bg-blue-wash/70"
      }`}
    >
      <div className="wrap flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          <span
            className={`mr-2 font-semibold ${isHaiti ? "text-sea" : "text-blue"}`}
          >
            {copy.title}
          </span>
          {copy.body}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={ctaHref}
            className={`rounded-full px-4 py-2 text-xs font-semibold text-white transition ${
              isHaiti ? "bg-sea hover:opacity-90" : "bg-blue hover:bg-blue-mid"
            }`}
          >
            {copy.cta}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label={dismissLabel}
            className="rounded-full p-1.5 text-ink-faint transition hover:bg-ink/5 hover:text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
