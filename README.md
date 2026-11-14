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

## Contact form email (Hostinger)

The Contact Us form posts to `public/api/contact.php`, which Vite copies into `dist/` and the deploy workflow uploads to `public_html/api/contact.php`. It sends the full enquiry to **info@klarusco.com** (Reply-To is the visitor) and a short confirmation to the visitor with their name, company and selected plan only. It uses Hostinger SMTP: `smtp.hostinger.com`, port 465, SSL.

**The SMTP password is never in the code or in GitHub.** It lives in a private file on the server, outside `public_html`, so the website can't serve it and deploys never overwrite it.

### One-time setup (do this before deploying)

1. In hPanel open **Files → File Manager**, and go to `domains/klarusco.com/` (the folder that *contains* `public_html`).
2. Create a folder named `private` there, so you have `domains/klarusco.com/private/`.
3. Inside it, create a file named `mail.ini`. Paste in the contents of [`server-config/mail.ini.example`](server-config/mail.ini.example) and replace `PUT-THE-MAILBOX-PASSWORD-HERE` with the info@klarusco.com mailbox password. Keep the quotes around the password.
4. Set the permissions for `mail.ini` to **600** (right-click → Permissions).
5. Push to `main`. The workflow builds the site and uploads `api/contact.php`.
6. Submit a test enquiry on https://klarusco.com/contact and check both inboxes.

If the form says it couldn't send, look at **hPanel → Advanced → PHP error logs** for lines starting with `[contact]`. They report a missing config file, a refused login or a connection problem, and they never include the password.

### Built-in protection

- POST + JSON only, accepted only from https://klarusco.com and https://www.klarusco.com (`allowed_origins`)
- Server-side validation of every field; header-injection-safe
- Hidden honeypot field to silently drop bot submissions
- Limit of 5 submissions per IP address per hour (`rate_limit` / `rate_window`)
- The confirmation email never repeats the visitor's free-text message, so the form can't be used to send spam

### Local development

`npm run dev` has no PHP, so the form shows its email/WhatsApp fallback. To test the endpoint locally, run `php -S localhost:8099 -t public` with `KLARUS_MAIL_CONFIG` pointing to a test `mail.ini`. Production builds read `VITE_FORM_ENDPOINT=/api/contact.php` from `.env.production`.

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

The Klarus & Co wordmark and its “Next Is Now” tagline are typographic (no icon). Their text lives in `brand` in `src/content/site.ts`; to use final logo artwork, replace the contents of `src/components/layout/Logo.tsx`. The browser-tab icons (`public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`) use a navy “K&C” monogram; when replacing them, bump the `?v=` number on their links in `index.html` so browsers drop cached copies.
