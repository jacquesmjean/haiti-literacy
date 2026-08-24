import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Unified lead intake for the contact form, the newsletter form and the
 * concierge handoff. Forwards each lead by email through Resend when a key is
 * configured, and can also post to a webhook (Zapier, Slack, Make) when
 * LEAD_WEBHOOK_URL is set. With neither configured it accepts the lead and
 * logs it, so the forms never error during preview deployments.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const kind = typeof body.kind === "string" ? body.kind : "contact";
  const email = typeof body.email === "string" ? body.email.slice(0, 200) : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }

  const clean = {
    kind,
    email,
    name: str(body.name),
    org: str(body.org),
    location: str(body.location),
    topic: str(body.topic),
    message: str(body.message, 4000),
    locale: str(body.locale, 5),
    at: new Date().toISOString(),
  };

  const results: string[] = [];

  // 1. Email through Resend, when configured.
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL ?? "administrator@haiti-literacy.org";
  if (resendKey) {
    const subject =
      kind === "newsletter"
        ? `Newsletter signup: ${clean.email}`
        : `Website ${clean.topic || "contact"}: ${clean.name || clean.email}`;
    const text = [
      `Kind: ${clean.kind}`,
      `Name: ${clean.name}`,
      `Email: ${clean.email}`,
      `Organization: ${clean.org}`,
      `Location: ${clean.location}`,
      `Topic: ${clean.topic}`,
      `Language: ${clean.locale}`,
      "",
      clean.message,
    ].join("\n");

    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "website@haiti-literacy.org",
        to: [to],
        reply_to: clean.email,
        subject,
        text,
      }),
    }).catch(() => null);
    results.push(sent?.ok ? "email" : "email_failed");
  }

  // 2. Webhook, when configured.
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    const posted = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clean),
    }).catch(() => null);
    results.push(posted?.ok ? "webhook" : "webhook_failed");
  }

  if (results.length === 0) {
    console.log("[lead]", JSON.stringify(clean));
  }

  return NextResponse.json({ ok: true, delivered: results });
}

function str(value: unknown, max = 300): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}
