import { ImageResponse } from "next/og";

/**
 * Branded social card, 1080 x 1350 (4:5), used as the image on every PILH post.
 * Public on purpose: the publishing service fetches it, then hosts its own copy.
 *
 *   /api/social-card?en=Headline&ht=Tit+kreyol&img=girl-with-book&tag=story
 *
 * img is the base name of a photo in /public/img/social (JPEG copies of the site
 * photos, because the image engine cannot read WebP).
 */

const TAGS: Record<string, { en: string; ht: string; color: string }> = {
  story: { en: "Reader story", ht: "Istwa lektè", color: "#d51f36" },
  learn: { en: "Learn", ht: "Aprann", color: "#273792" },
  act: { en: "Take action", ht: "Aji", color: "#0e6e63" },
};

const clean = (s: string | null, max: number) => (s ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const en = clean(url.searchParams.get("en"), 90) || "Every Haitian child deserves books in their own language.";
  const ht = clean(url.searchParams.get("ht"), 90);
  const img = (url.searchParams.get("img") ?? "girl-with-book").replace(/[^a-z0-9-]/gi, "");
  const tag = TAGS[url.searchParams.get("tag") ?? ""] ?? TAGS.story;

  const [fraunces, inter500, inter700] = await Promise.all(
    ["fraunces-latin-600-normal.woff", "inter-latin-500-normal.woff", "inter-latin-700-normal.woff"].map((f) =>
      fetch(`${origin}/fonts/${f}`).then((r) => r.arrayBuffer()),
    ),
  );

  const size = en.length > 40 ? 64 : 76;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#fdfaf5" }}>
        <div style={{ display: "flex", position: "relative", height: 780, width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${origin}/img/social/${img}.jpg`}
            alt=""
            width={1080}
            height={780}
            style={{ width: 1080, height: 780, objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              left: 64,
              top: 56,
              display: "flex",
              alignItems: "center",
              background: tag.color,
              color: "white",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              padding: "12px 24px",
              borderRadius: 999,
            }}
          >
            {tag.en} · {tag.ht}
          </div>
        </div>
        <div style={{ display: "flex", height: 10, width: "100%" }}>
          <div style={{ flex: 1, background: "#273792" }} />
          <div style={{ flex: 1, background: "#d51f36" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "52px 64px 40px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Fraunces", fontSize: size, lineHeight: 1.08, color: "#10142a" }}>{en}</div>
            {ht ? (
              <div style={{ marginTop: 22, fontFamily: "Inter", fontWeight: 500, fontSize: 36, lineHeight: 1.25, color: "#273792" }}>
                {ht}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${origin}/img/pilh-logo.png`} alt="" width={237} height={88} />
            <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 30, color: "#4a5068" }}>haiti-literacy.org</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
        { name: "Inter", data: inter700, weight: 700, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000" },
    },
  );
}
