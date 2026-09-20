"use client";

import { useEffect, useState } from "react";

/**
 * The administrator address collects heavy spam when printed in plain HTML.
 * This renders it only after JavaScript runs, assembled from parts, so
 * harvesting bots that scrape static markup never see a mailto address.
 */
const USER = "administrator";
const DOMAIN = "haiti-literacy" + ".org";

export default function ObfuscatedEmail() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <span className="font-medium text-ink-soft">
        {USER} [at] {DOMAIN.replace(".", " [dot] ")}
      </span>
    );
  }

  const address = `${USER}@${DOMAIN}`;
  return (
    <a
      href={`mailto:${address}`}
      className="font-medium text-blue underline underline-offset-4 hover:text-red"
    >
      {address}
    </a>
  );
}
