# Shot by Gidikovv — Portfolio

Photography portfolio for Martin Gidikovv. React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion.

```
Shot-by-Gidikovv/
├── portfolio/          ← your ORIGINAL photos, one folder per category (never modified)
└── website/            ← this project
    ├── scripts/optimize-images.mjs   original JPEG → responsive WebP + manifest
    ├── public/photos/                generated WebP files (480/960/1600/2400 px)
    └── src/
        ├── config/site.ts            name, email, Instagram, form key  ← edit here
        ├── content/about.ts          About-page copy & equipment       ← edit here
        ├── data/categories.ts        category titles, blurbs, covers
        ├── data/photos.ts            titles, alt text, featured order  ← edit here
        ├── data/photos.manifest.json generated — don't edit by hand
        ├── styles/index.css          design tokens (colour, type, motion, spacing)
        ├── lib/motion.ts             animation tokens
        ├── components/               layout, gallery, lightbox, home sections, UI
        └── pages/                    Home, Portfolio, About, Contact, NotFound
```

## Everyday commands

```bash
npm install          # once
npm run dev          # local dev server → http://localhost:5173
npm run images       # after adding/changing photos in ../portfolio
npm run build        # type-check + production build → dist/
npm run preview      # serve the production build → http://localhost:4173
```

## Adding photographs

1. Put the JPEG in `../portfolio/<Category>/` — e.g. `../portfolio/Automotive/IMG_1234.jpg`.
   Folder names map to categories: Automotive, Street, Nature, Portraits, Events.
2. Run `npm run images`. Only new or changed files are processed. Metadata (EXIF/GPS) is
   stripped from the published files; only the camera settings shown in the lightbox are kept.
3. Open `src/data/photos.ts` and add a title and alt text for the new id
   (e.g. `'automotive-img-1234'`). Add `featured: 9` to show it on the homepage.
   Photos without an entry still appear, with a generic alt text.
4. To give Automotive a cover on the homepage, set `cover: 'automotive-img-1234'` in `src/data/categories.ts`.

Instagram exports with a white border can be listed in `TRIM_WHITE` in the image script so
the border is cropped automatically.

## Contact form (Web3Forms — free)

The form posts to [Web3Forms](https://web3forms.com), so no server is needed:

1. Go to web3forms.com, enter the email address that should receive inquiries, and copy the access key they email you.
2. Locally: copy `.env.example` → `.env` and set `VITE_WEB3FORMS_ACCESS_KEY=...`
3. On your host: add the same variable in the dashboard (see below) and redeploy.

The key is designed to be public. It can only send mail to your own inbox.
**Without a key**, the form still works honestly: it opens the visitor's email app with the
inquiry pre-filled and addressed to you. The free plan allows 250 submissions per month.

## Deploying (free)

### Option A: Netlify (recommended, already configured)

`netlify.toml`, `public/_redirects` (SPA routing) and `public/_headers` (caching) are included.

**Via GitHub (auto-deploys on every push):**
1. Create a GitHub repo and push the `website/` folder as the repository root
   (`git init && git add . && git commit -m "Initial site" && git remote add origin … && git push -u origin main`).
2. On [app.netlify.com](https://app.netlify.com): **Add new site → Import an existing project → GitHub** and choose the repo.
   The build settings are picked up from `netlify.toml`.
3. **Site configuration → Environment variables:** add
   - `VITE_SITE_URL` = your final URL, e.g. `https://shotbygidikovv.netlify.app`
   - `VITE_WEB3FORMS_ACCESS_KEY` = your key
4. Deploy. Rename the site under **Site configuration → Change site name** to get `shotbygidikovv.netlify.app`.

**Without Git (drag and drop):** run `npm run build` (with your `.env` filled in), then drag the
`dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

### Option B: Vercel
Import the repo at [vercel.com/new](https://vercel.com/new). Vite is auto-detected and `vercel.json` handles routing.
Add the same two environment variables.

### Option C: Cloudflare Pages
Create a Pages project from the repo, using build command `npm run build` and output directory `dist`.
`_redirects` and `_headers` work there too. Add the same two environment variables.

### Custom domain
Every host above offers free HTTPS on a custom domain (e.g. `shotbygidikovv.com`, about €10 a year from any registrar).
After connecting it, update `VITE_SITE_URL` and redeploy so canonical links, the sitemap and social previews use it.
Then submit `https://your-domain/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

## Notes
- The original photos (~390 MB) stay in `../portfolio` and are **not** part of the website repo.
  The optimized set in `public/photos` (~28 MB) is.
- Animations respect the visitor's "reduce motion" setting. The hero slideshow then starts paused,
  with a Play control.
- Lightbox: ← → keys, Home/End, Esc, swipe left/right on phones, swipe down to close. Every photo
  has a shareable URL (`/portfolio?photo=…`).
