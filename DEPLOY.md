# Deploying haiti-literacy.org

Fifteen minutes, three phases. No step requires a developer.

## Phase 1 — Push to GitHub

From this folder:

```bash
gh auth login                       # or use github.com in the browser
gh repo create jacquesmjean/haiti-literacy --private --source . --push
```

Or without the GitHub CLI:

1. Create an empty private repo named `haiti-literacy` at github.com/jacquesmjean.
2. Then:

```bash
git remote add origin https://github.com/jacquesmjean/haiti-literacy.git
git push -u origin main
```

## Phase 2 — Deploy on Vercel

1. Go to vercel.com/jacquesmjeans-projects and click **Add New, Project**.
2. Import `jacquesmjean/haiti-literacy`. Framework is detected as Next.js. Leave every setting at its default and press **Deploy**.
3. Two minutes later you have a live preview at `haiti-literacy.vercel.app`. Test all four languages and the donation form.
4. In **Settings, Environment Variables**, add the optional keys from `.env.example`:
   - `ANTHROPIC_API_KEY` to turn on Sèvitè PILH.
   - `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` to deliver contact form messages by email.
   - `NEXT_PUBLIC_SITE_URL=https://www.haiti-literacy.org`
5. Redeploy after adding variables (Deployments, three dot menu, Redeploy).

## Phase 3 — Point the domain

1. In the Vercel project, **Settings, Domains**, add `haiti-literacy.org` and `www.haiti-literacy.org`. Set www as primary.
2. Vercel shows the DNS records needed. At the current DNS provider (wherever the WordPress site's domain is managed):
   - `A` record for `haiti-literacy.org` to `76.76.21.21`
   - `CNAME` for `www` to `cname.vercel-dns.com`
3. Wait for propagation, usually under an hour. Vercel issues SSL automatically.
4. Keep the old WordPress hosting alive for thirty days as a safety net, then cancel it. The annual report PDFs are currently still served from the old host's `wp-content/uploads` path; before cancelling, upload those PDFs to `public/reports/` in this repo and update the two links in `src/lib/site.ts`.

## Geo detection

The locale routing reads Vercel's `x-vercel-ip-country` header. It works on Vercel with no configuration. If the site is ever fronted by Cloudflare, it also understands `cf-ipcountry`.

## Ongoing operation for one backend manager

- **Edit content:** open the file on github.com, press the pencil icon, commit. Vercel redeploys automatically.
- **Or ask Claude:** clone the repo into a Claude Code or Cowork session and ask for the change in plain English.
- **Leads:** contact form and newsletter submissions arrive at the `LEAD_TO_EMAIL` inbox with reply to set to the sender.
- **Monitoring:** Vercel emails you if a deploy fails. There is nothing else to patch, update or renew.

## Costs

| Item | Monthly |
| --- | --- |
| Vercel Hobby tier | $0 (Pro at $20 if traffic grows large) |
| Zeffy donations | $0, donors optionally tip Zeffy |
| Anthropic API for concierge | roughly $3 to $15 at small nonprofit traffic |
| Resend email | $0 on free tier |
| Domain renewal | unchanged |
