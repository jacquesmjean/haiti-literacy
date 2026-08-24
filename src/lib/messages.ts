import "server-only";
import type { Locale } from "./i18n";

import en from "../../messages/en.json";
import ht from "../../messages/ht.json";
import fr from "../../messages/fr.json";
import es from "../../messages/es.json";

export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = {
  en,
  ht: ht as unknown as Messages,
  fr: fr as unknown as Messages,
  es: es as unknown as Messages,
};

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.en;
}
