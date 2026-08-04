# Portfolio with AI Engineering Journal

A personal portfolio and writing site for **Shawmiya Zarook**, built to a supplied
project brief.

The site presents three things: who I am, the projects I have built, and a journal
where I write about learning AI-powered engineering. Every piece of content is
edited through a CMS rather than in code, so publishing a new post or project does
not require a developer or a redeploy.

**Live site:** not yet deployed
**CMS:** Sanity Studio, embedded at `/studio`
**Publishing:** see [`docs/publishing.md`](docs/publishing.md) for how to write and
publish without touching code

---

## Contents

- [What it is built with](#what-it-is-built-with)
- [Running it locally](#running-it-locally)
- [Environment variables](#environment-variables)
- [Setting up Sanity](#setting-up-sanity)
- [Deploying to Vercel](#deploying-to-vercel)
- [Connecting the publish webhook](#connecting-the-publish-webhook)
- [How the project is organised](#how-the-project-is-organised)
- [Available commands](#available-commands)
- [Design decisions worth knowing](#design-decisions-worth-knowing)

---

## What it is built with

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) with TypeScript |
| Styling | Tailwind CSS for layout, hand-written CSS for all animation |
| Content | Sanity CMS, with the Studio embedded at `/studio` |
| Rendering | Static generation, refreshed on publish by a webhook |
| Hosting | Vercel |

Content is fetched with GROQ queries through a single typed client, so every page
reads data the same way and a change to a query cannot drift out of sync with the
cache tag that clears it.

---

## Running it locally

You will need **Node.js 20 or newer** and npm.

```bash
git clone <repository-url>
cd dev
npm install
cp .env.example .env.local
npm run dev
```

Then open <http://localhost:3000>.

The Studio is at <http://localhost:3000/studio>.

> **The site runs before Sanity is connected.** With an empty `.env.local` every
> page renders sample content instead of failing, so you can look at the design
> immediately. Once a Sanity project ID is present, every page reads from the CMS
> instead.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. `.env.local` is
gitignored and must never be committed.

| Variable | Required | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Your Sanity project ID, from [sanity.io/manage](https://sanity.io/manage). Without it the site shows sample content. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Normally `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | A fixed date, so a future Sanity release cannot change how queries behave. |
| `SANITY_API_READ_TOKEN` | No | Only needed if draft previews are added later. Published content does not use it. |
| `SANITY_API_WRITE_TOKEN` | No | Used only by `npm run migrate` to seed an empty dataset. The website never reads it. |
| `SANITY_REVALIDATE_SECRET` | For webhook | A long random string, shared with the Sanity webhook so the site can verify a publish request is genuine. |
| `NEXT_PUBLIC_SITE_URL` | For deploy | The site's public address. Used by metadata, Open Graph images, the sitemap and the RSS feed. Falls back to `http://localhost:3000`. |

Anything prefixed `NEXT_PUBLIC_` is visible in the browser and is safe to expose.
The three without that prefix are server-only and must stay secret.

To generate a value for `SANITY_REVALIDATE_SECRET`:

```bash
openssl rand -base64 32
```

---

## Setting up Sanity

1. **Create a project** at [sanity.io/manage](https://sanity.io/manage). Choose the
   `production` dataset and make it public, so the site can read content without a
   token.

2. **Copy the project ID** into `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.

3. **Allow your site to talk to Sanity.** Add each address you use as a CORS origin:

   ```bash
   npx sanity cors add http://localhost:3000 --credentials --project-id <your-project-id>
   ```

   Repeat this for your deployed URL once you have one.

4. **Open the Studio** at <http://localhost:3000/studio> and sign in. The content
   types are already defined in code, so the forms are ready to use.

5. **Optionally seed sample content.** On an empty dataset this creates a profile
   and the tag list so the site is not blank:

   ```bash
   npm run migrate
   ```

   This requires `SANITY_API_WRITE_TOKEN` (an Editor token from Sanity → API →
   Tokens). It only creates documents that do not already exist, so it can never
   overwrite real content.

### The content model

Four document types, matching the brief:

| Type | Purpose |
| --- | --- |
| **profile** | Name, headline, bio, avatar, LinkedIn, education, toolkit, timeline. A single document — there is only ever one of you. |
| **project** | A case study: summary, cover image, gallery, tech tags, role, then problem / approach / outcome, plus repository and demo links. |
| **post** | A journal entry: excerpt, cover image, rich text body supporting code blocks and callouts, tags and a publish date. |
| **tag** | A label shared by journal posts, used by the filter on the journal index. |

---

## Deploying to Vercel

1. Push this repository to GitHub.

2. Go to [vercel.com/new](https://vercel.com/new), import the repository, and
   accept the detected Next.js settings. No build configuration is needed.

3. Add the environment variables from your `.env.local` under
   **Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to the real
   deployed address, for example `https://your-site.vercel.app`.

4. Deploy.

5. Add the deployed address as a Sanity CORS origin:

   ```bash
   npx sanity cors add https://your-site.vercel.app --credentials --project-id <your-project-id>
   ```

> Set `NEXT_PUBLIC_SITE_URL` before the first deploy if you can. The sitemap, the
> RSS feed and the social sharing images all build their links from it, so a
> placeholder value ends up published in those files.

---

## Connecting the publish webhook

Pages are generated once at build time, which is what makes them fast. The webhook
tells the site to rebuild just the pages affected when you publish something, so
changes appear without a full redeploy.

1. In [sanity.io/manage](https://sanity.io/manage), open your project and go to
   **API → Webhooks → Create webhook**.

2. Fill it in:

   | Field | Value |
   | --- | --- |
   | URL | `https://your-site.vercel.app/api/revalidate` |
   | Dataset | `production` |
   | Trigger on | Create, Update, Delete |
   | Filter | `_type in ["post", "project", "profile", "tag"]` |
   | Secret | the same value as `SANITY_REVALIDATE_SECRET` |

3. Publish something in the Studio and confirm it appears on the live site.

The route checks the secret before doing anything, so an unauthenticated request
cannot trigger a rebuild. It also clears only the content type that changed —
publishing a journal post does not rebuild the project pages.

**Until the webhook is connected**, content changes will not appear locally until
you delete the `.next` folder and restart. Restarting alone is not enough, because
that folder holds a cache which survives it.

Day-to-day publishing is covered separately in
[`docs/publishing.md`](docs/publishing.md).

---

## How the project is organised

```
src/
  app/
    (site)/          every public page: home, work, journal, connect
    (studio)/        the embedded Sanity Studio at /studio
    api/revalidate/  the publish webhook endpoint
    global-not-found.tsx   404 for addresses that match no page
  components/
    chrome/          header, footer, navigation, monogram
    content/         cards, prose renderer, journal index, connect band
    field/           the animated 3D background
    ui/              buttons, reveals, small shared pieces
  sanity/
    schemaTypes/     what the Studio forms contain
    lib/             queries, typed client, TypeScript types, sample content
  styles/            design tokens, chrome, motion, the 3D field
  lib/               fonts, chapter definitions, small helpers

docs/                the project brief this was built to
scripts/             one-off content migration
tools/avatar-render/ the offline rig that produced the avatar images
```

---

## Available commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Serve the production build (run `build` first) |
| `npm run lint` | Check code style with ESLint |
| `npm run migrate` | Seed an empty Sanity dataset with sample content |

To check types without building: `npx tsc --noEmit`.

---

## Design decisions worth knowing

A few choices that are deliberate, so they are not mistaken for oversights.

**The home page is the whole site, not a summary.** It runs as five chapters —
introduction, work, journal, about, connect — so a visitor can read top to bottom.
The separate pages still exist for deep links and search, but nobody is asked to
choose a section before they have read anything. There is no `/about` route for
this reason: About is a chapter of the home page.

**The avatar is a pre-rendered image, not live 3D.** The source model is 57 MB.
Rendering it once, offline, produces the same picture in 122 KB and ships no 3D
code to the browser. The rig that produced the frames is kept in
`tools/avatar-render/` with instructions, so the images can be regenerated.

**Animation is hand-written CSS.** Every animation moves only `transform` and
`opacity`, so nothing triggers a layout recalculation. All of it is disabled
automatically when the visitor's system asks for reduced motion.

**Only one external link exists.** LinkedIn, and the CMS enforces it: the profile
has no field for an email address, a phone number or any other social profile, so a
contact detail with nowhere to go cannot be published by accident.

**The editor only offers formatting that has a design.** The journal body supports
headings, lists, quotes, links, images, code blocks and callouts — and nothing else.
An option that renders badly is worse than no option at all.

---

## Current status

| Requirement | State |
| --- | --- |
| Pages, content model, CMS, animation layer | Complete |
| Accessibility, Best Practices, SEO (Lighthouse) | 100 / 100 / 100 |
| Performance (Lighthouse) | 86 — below the target of 90 |
| Deployment | Not yet deployed |
| Publish webhook | Written and tested; needs a public URL to connect |

Performance is limited by a single metric, Largest Contentful Paint, on the hero
text. The other four performance metrics score close to perfect, including a
cumulative layout shift of zero.
