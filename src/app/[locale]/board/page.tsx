import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { board } from "@/lib/site";

type Person = (typeof board)[number];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  return { title: m.board.title, description: m.board.lede };
}

export default async function BoardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.board;

  return (
    <section className="wrap pb-20 pt-12 lg:pt-20">
      <div className="max-w-2xl animate-rise">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="display mt-4 text-[clamp(2.1rem,3.2vw+1rem,3.4rem)] text-ink">
          {t.title}
        </h1>
        <p className="lede mt-5">{t.lede}</p>
      </div>

      {(["officers", "members"] as const).map((group) => {
        const people = board.filter((p) => p.group === group);
        if (!people.length) return null;
        return (
          <div key={group} className="mt-14">
            <GroupHeading title={t.groups[group]} count={people.length} />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((person, index) => (
                <BoardCard key={person.id} person={person} index={index} t={t} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Single-person groups share one row so no card sits alone. */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(["leadership", "founder"] as const).map((group) =>
          board
            .filter((p) => p.group === group)
            .map((person, index) => (
              <div key={person.id}>
                <GroupHeading title={t.groups[group]} />
                <div className="mt-6">
                  <BoardCard person={person} index={index} t={t} />
                </div>
              </div>
            )),
        )}
      </div>

      <div className="mt-14 rounded-3xl bg-sand/60 p-8" data-reveal>
        <h2 className="serif text-lg font-semibold text-ink">{t.staffTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
          {t.staffBody}
        </p>
      </div>
    </section>
  );
}

function GroupHeading({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-ink/10 pb-3">
      <h2 className="serif text-2xl font-semibold text-ink">{title}</h2>
      {count !== undefined && <span className="text-sm text-ink-soft">{count}</span>}
    </div>
  );
}

function BoardCard({
  person,
  index,
  t,
}: {
  person: Person;
  index: number;
  t: ReturnType<typeof getMessages>["board"];
}) {
  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
      className="group overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[var(--shadow-lift)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-deep)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes="(min-width:1024px) 31vw, (min-width:640px) 46vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        {person.personal && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`${person.name}: ${t.cta}`}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-[#0A66C2] shadow-[var(--shadow-lift)] backdrop-blur transition hover:bg-[#0A66C2] hover:text-white"
          >
            <LinkedInIcon />
          </a>
        )}
      </div>

      <div className="p-6">
        <h3 className="serif text-xl font-semibold leading-tight text-ink transition group-hover:text-blue">
          {person.name}
        </h3>
        <p className="eyebrow mt-1.5">
          {t.roles[person.role as keyof typeof t.roles]}
        </p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
          {t.blurbs[person.id as keyof typeof t.blurbs]}
        </p>
        {person.personal && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0A66C2] hover:underline"
          >
            <LinkedInIcon />
            {t.cta}
          </a>
        )}
      </div>
    </article>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
