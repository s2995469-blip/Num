# Powerhouse Numerology — website

Production website for **Powerhouse Numerology** (Saamruddhi Varkhede): numerology, Reiki healing, career counselling and relationship counselling. It has an immersive WebGL hero, four service pages, a journal, and a booking-enquiry system with database storage and a protected admin area.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4 + CSS design tokens (`app/globals.css`) |
| 3D | three.js, React Three Fiber 9, Drei 10 (procedural geometry only, no downloaded models or HDRs) |
| Motion | Motion (`LazyMotion`, `domAnimation`) + CSS transitions |
| Data | PostgreSQL + Drizzle ORM (`pg` driver), migrations in `drizzle/` |
| Validation | Zod 4, shared by the browser and the server |
| Auth | scrypt password hashes, DB-backed sessions, httpOnly cookie |
| Tests | Vitest (unit), Playwright scripts (browser QA / e2e) |

## Getting started

Requirements: Node 20.9+ and PostgreSQL 14+.

```bash
npm install
cp .env.example .env.local          # then edit DATABASE_URL etc.

# create the database (example for a local Postgres)
createuser powerhouse --pwprompt
createdb powerhouse --owner powerhouse

npm run db:migrate                  # apply migrations in drizzle/
npm run admin:create -- you@example.com   # prompts for a password (min 12 chars)

npm run dev                         # http://localhost:3000
```

Sign in to the admin area at `/admin` with that email and password.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` · `npm run typecheck` · `npm test` | ESLint · `tsc` · Vitest unit tests |
| `npm run db:generate` | Generate a migration after editing `lib/db/schema.ts` |
| `npm run db:migrate` | Apply migrations (reads `.env.local`) |
| `npm run admin:create -- <email>` | Create the admin login or reset its password (`ADMIN_PASSWORD` env var skips the prompt) |
| `npm run logo:process` | Regenerate logo variants from the original file |
| `node scripts/qa/screens.mjs <dir> [paths…]` | Screenshot pages at several widths; reports horizontal overflow and console errors |
| `node scripts/qa/e2e.mjs` | Browser test of booking → admin login → confirm → logout (needs `ADMIN_EMAIL`, `ADMIN_PASSWORD`, a running app) |

In the cloud sandbox, Playwright needs `CHROME_PATH=/opt/pw-browsers/chromium`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | Public origin, e.g. `https://powerhousenumerology.com`. Used for canonical URLs, the sitemap, Open Graph and admin links in emails. |
| `DATABASE_URL` | yes | PostgreSQL connection string. |
| `DATABASE_SSL` | no | Set to `true` for managed databases that require TLS. |
| `DATABASE_POOL_MAX` | no | Connection pool size (default 5). |
| `RATE_LIMIT_SALT` | yes (prod) | Long random string used to hash IP addresses for rate limiting. |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `EMAIL_FROM` | no | Turn on email notifications for new enquiries and messages through [Resend](https://resend.com). If any is missing, no email is sent and the site doesn't claim one was. |

No secrets reach the browser; only `NEXT_PUBLIC_SITE_URL` is public.

## Deployment

Any Node host that runs `next start` will work (Vercel, Render, Fly.io, a VPS), with a managed PostgreSQL database.

1. Provision Postgres and set the environment variables above.
2. `npm ci && npm run db:migrate && npm run build`
3. `npm run admin:create -- <email>` once, against the production database.
4. `npm start` (or the platform's Next.js preset).

**Rate limiting is per process (in memory).** That suits a single instance. On serverless or multi-instance hosting, replace the store in `lib/rate-limit.ts` with Redis or Upstash; the function signature can stay the same.

## How it fits together

```
app/
  (site)/            public site with shared Header/Footer
    page.tsx         homepage (hero → services → intro → process → testimonials* → insights → CTA)
    services/        index + numerology, reiki-healing, career-counselling, relationship-counselling
    insights/        journal index + [slug] articles (statically generated)
    book-session/    enquiry form (?service=<slug> pre-selects a service)
    about, contact, privacy, terms
  admin/             login + protected enquiries/messages (noindex)
  api/bookings       POST only: validate → de-duplicate → store → optional notify
  api/contact        POST only
  sitemap.ts, robots.ts, opengraph-image.tsx, icon.png
components/
  3d/                HeroExperience (Canvas), HeroScene, ArchitecturalArch, NumerologySphere,
                     OrbitalElements, Horizon (shader), Lighting, CameraRig, HeroFallback (SVG)
  home/              HeroStage (tier detection, lazy-load, pause, explore mode) + sections
  services/, booking/, art/ (per-service SVG art), layout/, ui/
lib/
  site.ts            business details: name, practitioner, contact, social, session formats
  services.ts        service summaries + FAQs
  articles.ts        journal content
  testimonials.ts    approved testimonials (section hidden while empty)
  validation/        Zod schemas shared by client and server
  db/                Drizzle schema + pool
  auth/              scrypt hashing, sessions
```

### The hero

- The headline, copy and buttons are server-rendered HTML. The canvas sits behind them as decoration (`aria-hidden`).
- `HeroStage` waits for idle time, then picks a tier. With no WebGL, Save-Data, or 2 GB or less of device memory, it uses the static SVG fallback only. Small screens, coarse pointers and low-core devices get a lite scene: no reflections or shadows, lower DPR, fewer particles. Everything else gets the full scene.
- The three.js bundle loads only on the homepage, after first paint. The fallback is always rendered underneath and the canvas fades in once real frames exist, so the hero is never blank. A lost WebGL context drops back to the fallback.
- Rendering stops when the hero is off-screen or the tab is hidden. `PerformanceMonitor` lowers DPR if frame rate drops.
- With `prefers-reduced-motion`, the scene renders a single still frame on demand: no rotation, drift, intro or pointer parallax.
- "Explore the Experience" (desktop) hides the copy and enables limited drag-to-orbit. Escape returns to the page.

### Booking flow and statuses

Visitors send an **enquiry** (status `new`). It becomes an appointment only when the practitioner sets **Confirmed** in `/admin`. The visitor's confirmation screen says this clearly. Other statuses are `contacted`, `completed` and `cancelled`.

Protection on the public endpoints:

- Zod validation on both client and server.
- JSON-only bodies with a size cap, and a same-origin check.
- A honeypot field plus a minimum time-on-form; bot submissions get a silent 202.
- Per-IP rate limits, applied to hashed IPs.
- Idempotency keys, so a double-click or retry returns the original reference.
- A friendly 409 when the same email already has an open enquiry for that service in the last 24 hours.

No endpoint lists enquiries. The admin list view leaves out contact details; they appear only on an individual enquiry. All admin pages and server actions check the session on the server.

The booking form doesn't ask for birth dates or health details. Its message hint tells visitors not to include them, and the numerology page explains that birth details are requested separately after confirmation.

### Logo

`public/logo/powerhouse-logo-original.png` is the supplied file: white artwork on solid black, 226×222. Because the artwork is monochrome, `scripts/process-logo.mjs` maps luminance directly to alpha. This produces two transparent variants that keep the exact shape (`-on-dark` in porcelain, `-on-light` in espresso), plus the favicon. The only crop removes a 1 px grey screenshot edge, and nothing is rescaled.

## Client content still required

Nothing below has been invented. Each item is either hidden or presented neutrally until it's supplied.

| Item | Where to add it | Current behaviour |
| --- | --- | --- |
| **High-resolution or vector logo** (SVG, or PNG ≥ 1000 px) | replace `public/logo/powerhouse-logo-original.png`, run `npm run logo:process` | The 226 px source is legible but soft on retina screens at larger sizes. |
| **Portrait of Saamruddhi Varkhede** | `site.practitioner.portrait` in `lib/site.ts` (file under `public/images/`) | An "SV" monogram in an arch frame |
| **Biography** | `site.practitioner.biography` | A neutral one-paragraph introduction |
| **Verified qualifications** | `site.practitioner.credentials` | None shown. Career and relationship pages say qualifications will be listed once confirmed. |
| **Contact email, phone, address, hours** | `site.contact` | Footer and contact page point to the contact form |
| **Social media URLs** | `site.social` | Hidden |
| **Session formats offered** (in person / video / phone / distance) | `site.sessionFormats` | The booking field is hidden and the form says the format is agreed on confirmation |
| **Session durations, fees, cancellation policy** | service pages / terms | Pages say these are confirmed personally |
| **Whether joint/couples relationship sessions are offered** | relationship page + FAQ | Described as one-to-one; visitors are asked to mention partners in their enquiry |
| **Testimonials** (real, with written permission) | `lib/testimonials.ts` | Section hidden |
| **Business location / jurisdiction** | privacy policy | The policy names no legal entity or jurisdiction. Have it reviewed before launch. |
| **Email provider credentials** | env vars above | Notifications off; enquiries are visible in `/admin` |
| **Production domain** | `NEXT_PUBLIC_SITE_URL` | Defaults to localhost |

Articles are written as informational pieces with careful claims. The practitioner should review them before publishing under her name.

## Verification performed

- `npm run typecheck`, `npm run lint`: clean.
- `npm test`: 15 unit tests pass (validation, hashing, rate limiting, content integrity).
- `npm run build`: succeeds. Marketing pages are static, articles are SSG, and admin/API/booking routes are dynamic.
- API checks with curl: create (201), replay (200, same reference), duplicate (409), invalid (422 with field errors), honeypot (202, nothing stored), malformed JSON (400), cross-origin (403), form-encoded (415), rate limit (429), GET (405). Rows confirmed in Postgres.
- Playwright e2e against both the dev and production servers:
  - The service CTA pre-fills the booking form.
  - Field errors appear and focus moves to the first invalid field.
  - A valid submission returns a reference.
  - The mobile drawer handles focus, Escape and returning focus.
  - Admin login rejects a bad password; the list view hides emails.
  - The filtered list leads to the detail page, and Confirmed is saved.
  - Logout ends the session, and there are no uncaught page errors.
- Screenshots of every route at 1440 and 390 px: no horizontal overflow. The hero was also checked at 1280 and 768 px, with WebGL disabled (SVG fallback) and with reduced motion.

Not verified here: real-GPU frame rates on physical phones (the sandbox renders WebGL in software), screen-reader passes with NVDA/VoiceOver, and actual email delivery (no provider key).
