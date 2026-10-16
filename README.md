# Accounting & Financial Services Website

Multi-page marketing site built with **React 19 + Vite + TypeScript**, **React Router**, **Framer Motion** and **Lucide** icons. Styling is plain CSS with design tokens (forest green, warm ivory, champagne gold, charcoal, soft sage).

## Commands

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run lint
npm run preview   # serve the production build
```

Append `?static` to a dev URL to render all animations in their final state (handy for screenshots).

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: cinematic hero, credibility strip, intro, services index, why us, systems, process, pricing teaser, CTA |
| `/about` | About Us |
| `/services` | Our Services (each service has its own layout) |
| `/systems` | Systems We Work With + Customized Solutions |
| `/how-it-works` | Four-step, scroll-linked timeline |
| `/pricing` | Get a Quote: plan chooser + interactive pricing |
| `/book-a-meeting` | Schedule a Meeting |
| `/contact` | Contact Us + validated form |

The site is a single-page app, so the host must send every path to `index.html`. `public/_redirects` (Netlify) and `vercel.json` (Vercel) already do this; other hosts need an equivalent rewrite.

## Editing content

All business copy, pricing, navigation and image paths live in [`src/content/site.ts`](src/content/site.ts), taken from *Webs Site Content.docx*. Pages only render this data.

## Configuration still needed

Copy `.env.example` to `.env.local` and fill in:

| Variable | Used for | When it's empty |
| --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp links (digits, international format) | The card shows "Contact detail to be added" |
| `VITE_CONTACT_EMAIL` | Email links (mailto) | The card shows "Contact detail to be added" |
| `VITE_BOOKING_URL` | Book a Meeting embed (Calendly, Cal.com, Microsoft Bookings…) | A clearly labelled scheduler placeholder appears |
| `VITE_FORM_ENDPOINT` | Contact form submission (any endpoint that accepts JSON POSTs, e.g. Formspree) | The form validates, then says the message was **not** sent and offers email/WhatsApp instead |

## Images

Photos in `public/images/` are optimized WebP files downloaded from Unsplash (free to use under the Unsplash License). If a file goes missing, the `Img` component shows a branded fallback surface instead of a broken image.

## Brand

The Klarus & Co wordmark and its “Consulting & Business Solutions / Next Is Now” slogan are typographic (no icon). Their text lives in `brand` in `src/content/site.ts`; to use final logo artwork, replace the contents of `src/components/layout/Logo.tsx` and `public/favicon.svg`.
