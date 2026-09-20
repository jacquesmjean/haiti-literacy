"use client";

import { useRef, useState } from "react";
import type { Messages } from "@/lib/messages";

type FormCopy = Messages["contact"]["form"];

export default function ContactForm({
  copy,
  locale,
}: {
  copy: FormCopy;
  locale: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  // Anti spam: the moment the form mounted. Bots submit in under two seconds.
  const mountedAt = useRef(Date.now());

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capture the element before any await. React nulls currentTarget after.
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    // Honeypot: real people never fill a field they cannot see.
    if (form.get("website")) {
      setState("done");
      return;
    }

    setState("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          locale,
          name: form.get("name"),
          email: form.get("email"),
          org: form.get("org"),
          location: form.get("location"),
          topic: form.get("topic"),
          message: form.get("message"),
          elapsed: Date.now() - mountedAt.current,
        }),
      });
      if (response.ok) {
        formElement.reset();
        setState("done");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-sea/25 bg-sea/8 px-6 py-8">
        <p className="serif text-lg text-sea">{copy.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* Honeypot. Hidden from people, filled by spam bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label={copy.name} required />
        <Field name="email" label={copy.email} type="email" required />
        <Field name="org" label={copy.org} />
        <Field name="location" label={copy.location} />
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">
          {copy.topic}
        </span>
        <select
          name="topic"
          defaultValue="materials"
          className="rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink focus:border-blue focus:outline-none"
        >
          {Object.entries(copy.topics).map(([key, label]) => (
            <option key={key} value={key}>
              {label as string}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">
          {copy.message}
        </span>
        <textarea
          name="message"
          rows={6}
          required
          className="rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink focus:border-blue focus:outline-none"
        />
      </label>

      {state === "error" && (
        <p className="rounded-xl bg-red-wash px-4 py-3 text-sm text-red-deep">
          {copy.error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="justify-self-start rounded-full bg-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-mid disabled:opacity-60"
      >
        {state === "sending" ? copy.sending : copy.submit}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink focus:border-blue focus:outline-none"
      />
    </label>
  );
}
