"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Copy = {
  name: string;
  subtitle: string;
  open: string;
  placeholder: string;
  send: string;
  greeting: string;
  suggestions: string[];
  offline: string;
  error: string;
  disclaimer: string;
  close: string;
};

type Message = { role: "user" | "assistant"; content: string };

/**
 * Sèvitè PILH. A floating quadrilingual assistant. Replies stream in live.
 * If it detects a donation link in a reply it renders a real button.
 */
export default function Concierge({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<"offline" | "error" | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setFailed(null);
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setBusy(true);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m, i) => !(i === 0 && m.role === "assistant")),
        }),
      });

      if (response.status === 503) {
        setFailed("offline");
        return;
      }
      if (!response.ok || !response.body) {
        setFailed("error");
        return;
      }

      setMessages((current) => [...current, { role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) => {
          const copy = [...current];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
    } catch {
      setFailed("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setMessages((current) =>
              current.length === 0
                ? [{ role: "assistant", content: copy.greeting }]
                : current,
            );
          }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-blue py-3 pl-4 pr-5 text-white shadow-[var(--shadow-deep)] transition hover:bg-blue-mid sm:bottom-6 sm:right-6"
          aria-label={copy.open}
        >
          <BookBubbleIcon />
          <span className="text-sm font-semibold">{copy.name}</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label={copy.name}
          className="fixed inset-0 z-50 flex flex-col bg-paper sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[36rem] sm:max-h-[calc(100dvh-3rem)] sm:w-[24rem] sm:rounded-3xl sm:border sm:border-ink/10 sm:shadow-[var(--shadow-deep)] overflow-hidden"
        >
          <header className="flex items-center justify-between gap-3 bg-blue-deep px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12">
                <BookBubbleIcon />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{copy.name}</p>
                <p className="text-[0.6875rem] text-white/60">{copy.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={copy.close}
              className="rounded-full p-2 transition hover:bg-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <Bubble key={index} message={message} locale={locale} />
            ))}
            {busy && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-1.5 px-3 py-2" aria-hidden>
                <Dot delay="0ms" />
                <Dot delay="150ms" />
                <Dot delay="300ms" />
              </div>
            )}
            {failed && (
              <p className="rounded-2xl bg-red-wash px-4 py-3 text-sm text-red-deep">
                {failed === "offline" ? copy.offline : copy.error}
              </p>
            )}

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {copy.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-blue/25 bg-blue-wash/60 px-3.5 py-2 text-left text-xs text-blue transition hover:bg-blue-wash"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="border-t border-ink/10 p-3"
          >
            <div className="flex items-end gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
                className="min-w-0 flex-1 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-blue focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={copy.send}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red text-white transition hover:bg-red-deep disabled:opacity-40"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                  <path d="M14 2 7.5 8.5M14 2 9.8 14l-2.3-5.5L2 6.2 14 2Z" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 px-1 text-[0.65rem] leading-snug text-ink-faint">
              {copy.disclaimer}
            </p>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ message, locale }: { message: Message; locale: Locale }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-blue px-4 py-2.5 text-sm text-white">
          {message.content}
        </p>
      </div>
    );
  }

  // Turn /xx/give and /xx/contact paths in replies into real buttons.
  const parts = message.content.split(/(\/(?:en|ht|fr|es)\/(?:give|contact)\b)/g);

  return (
    <div className="flex">
      <div className="max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-sand/70 px-4 py-2.5 text-sm leading-relaxed text-ink">
        {parts.map((part, index) =>
          /^\/(en|ht|fr|es)\/(give|contact)$/.test(part) ? (
            <Link
              key={index}
              href={part.replace(/^\/(en|ht|fr|es)/, `/${locale}`)}
              className="mx-0.5 inline-block rounded-full bg-red px-3 py-1 text-xs font-semibold text-white"
            >
              {part.endsWith("give") ? "→ ❤" : "→ ✉"}
              {part.endsWith("give") ? " Give" : " Contact"}
            </Link>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-ink-faint"
      style={{ animationDelay: delay }}
    />
  );
}

function BookBubbleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 3.5C8 2.3 5.4 2 3 2.4v12.2c2.4-.4 5-.1 7 1.1 2-1.2 4.6-1.5 7-1.1V2.4c-2.4-.4-5-.1-7 1.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 3.5v12.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
