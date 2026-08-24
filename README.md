# Partners in Literacy Haiti — haiti-literacy.org

The intelligent, quadrilingual, self managing website of Partners in Literacy Haiti (PILH), a 501(c)(3) nonprofit (EIN 87-0904773) building children's libraries in rural Haiti.

Website donated by [TechFides](https://techfides.com).

## What this site does

- **Four languages, automatically.** English, Haitian Kreyòl, French and Spanish. Visitors are routed by country and browser language at the edge. Visitors from Haiti see community services first; everyone else sees the giving story first. A one click switcher is always in the header.
- **Sèvitè PILH, the AI concierge.** A floating assistant fluent in all four languages. It explains where gifts go, guides donors to checkout, and collects material requests from Haitian educators. Runs on the Anthropic API. Without an API key it degrades gracefully to an email pointer.
- **Zero fee donations.** The checkout is Zeffy, which passes one hundred percent of each gift to PILH and issues instant 501(c)(3) receipts. Givebutter remains linked for peer to peer campaigns. The donation layer is one component, so Stripe can be added later without touching pages.
- **Zero maintenance content.** All copy lives as markdown in `content/` and JSON in `messages/`. No WordPress, no plugins, no security patches. Edit a file on GitHub, press commit, and Vercel redeploys in about a minute.
- **Every old URL still works.** All WordPress era paths redirect permanently to their new homes, so search rankings and bookmarks survive the migration.
- **SEO built in.** Per locale metadata, hreflang alternates, sitemap, robots, and NGO structured data for Google.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, deployed on Vercel. No database. No CMS subscription. Zero monthly cost beyond the domain, unless you enable the optional APIs in `.env.example`.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. The proxy redirects `/` to a locale automatically.

## Editing content

| What | Where |
| --- | --- |
| Page copy (about, history, projects...) | `content/{en,ht,fr,es}/pages/*.md` |
| News stories | `content/{en,ht,fr,es}/news/*.md` |
| UI strings, tiers, nav labels | `messages/{en,ht,fr,es}.json` |
| Impact numbers, addresses, links | `src/lib/site.ts` |
| Photos | `public/img/` (webp preferred) |

A page missing in a language falls back to English automatically, so you can translate at your own pace.

To add a news story: copy an existing file in `content/en/news/`, change the frontmatter (`title`, `date`, `lede`, `image`) and body, then repeat in the other language folders when ready. It appears on the homepage and news index on the next deploy.

## Deploying

See `DEPLOY.md` for the exact GitHub, Vercel and DNS steps.

## Environment variables

All optional. See `.env.example`. The concierge needs `ANTHROPIC_API_KEY`. The contact and newsletter forms deliver by email when `RESEND_API_KEY` is set, and to a webhook when `LEAD_WEBHOOK_URL` is set; with neither, submissions are accepted and logged so the forms never break.
