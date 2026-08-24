import { NextResponse, type NextRequest } from "next/server";
import {
  countryLocale,
  defaultLocale,
  locales,
  localeFromAcceptLanguage,
  isLocale,
} from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const COOKIE = "pilh_locale";

/**
 * Routes every visitor to a locale. Runs at the edge on every request.
 * Order of precedence: a locale already in the URL, then the visitor's saved
 * choice, then the country the request came from, then the browser language,
 * then English.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE, first, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
    const country = countryOf(request);
    if (country) response.headers.set("x-visitor-country", country);
    return response;
  }

  const saved = request.cookies.get(COOKIE)?.value;
  const country = countryOf(request);

  const target =
    (saved && isLocale(saved) && saved) ||
    (country && countryLocale[country]) ||
    localeFromAcceptLanguage(request.headers.get("accept-language")) ||
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

function countryOf(request: NextRequest): string | null {
  // Vercel and Cloudflare both expose the visitor country as a header.
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null
  );
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

export const supportedLocales = locales;
