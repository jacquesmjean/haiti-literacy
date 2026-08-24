"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps the history timeline. A vertical rail runs down the left side and a
 * colored fill grows inside it as the reader scrolls, so progress through the
 * story is always visible.
 */
export default function TimelineRail({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrap.current;
    const bar = fill.current;
    if (!node || !bar) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Progress: how far the viewport middle has traveled through the section.
      const total = rect.height;
      const passed = Math.min(Math.max(viewport * 0.5 - rect.top, 0), total);
      bar.style.height = `${(passed / total) * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="relative">
      {/* Rail */}
      <div
        aria-hidden
        className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-ink/15 sm:left-1/2 sm:-translate-x-1/2"
      >
        <div
          ref={fill}
          className="tricolor-vertical w-[3px] -translate-x-[1px] transition-[height] duration-150 ease-out"
          style={{ height: "0%" }}
        />
      </div>
      {children}
    </div>
  );
}
