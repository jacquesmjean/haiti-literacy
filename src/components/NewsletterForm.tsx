"use client";

import { useState } from "react";

export default function NewsletterForm({
  labels,
}: {
  labels: { placeholder: string; submit: string; success: string; error: string };
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", email }),
      });
      setState(response.ok ? "done" : "error");
      if (response.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-xl bg-sea/10 px-4 py-3 text-sm text-sea">{labels.success}</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="newsletter-email">
        {labels.placeholder}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={labels.placeholder}
        className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/60 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-deep transition hover:bg-sand disabled:opacity-60"
      >
        {labels.submit}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-wash sm:sr-only">{labels.error}</p>
      )}
    </form>
  );
}
