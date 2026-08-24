import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="display text-[6rem] leading-none text-blue/20">404</p>
      <h1 className="display mt-4 text-3xl text-ink">This page has moved.</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        The library is still open. Let us take you back.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-mid"
      >
        haiti-literacy.org
      </Link>
    </div>
  );
}
