# How to publish

A short guide to writing and publishing from the Studio. No code required.

- [Opening the Studio](#opening-the-studio)
- [Writing a journal post](#writing-a-journal-post)
- [What the editor offers](#what-the-editor-offers)
- [Cover images](#cover-images)
- [Publishing](#publishing)
- [Seeing it appear](#seeing-it-appear)
- [Editing and unpublishing](#editing-and-unpublishing)
- [Adding a project](#adding-a-project)
- [Checklist before you publish](#checklist-before-you-publish)

---

## Opening the Studio

The Studio is part of the site, at `/studio`.

- **Locally:** run `npm run dev`, then open <http://localhost:3000/studio>
- **Once deployed:** `https://your-site.vercel.app/studio`

Sign in with the account that owns the Sanity project.

The left-hand panel has four sections. **Profile** is a single document — your
name, bio, education, toolkit and timeline. **Journal**, **Projects** and
**Tags** are lists you add to.

---

## Writing a journal post

Open **Journal** and click the pencil icon at the top of the list to create a new
post. Nothing is visible on the site until you publish, so a half-finished draft
can sit there as long as you like.

The fields, in the order they appear:

### Title

Required. The page allows about three lines before it looks cramped, so six to ten
words sits best.

### Slug

Required. This becomes the web address: `/journal/your-slug`.

Click **Generate** to build one from the title, then **shorten it by hand**. A
generated slug from a long title produces a long address, and unlike the title,
**the slug is permanent** — changing it later breaks every link to the post and
its entry in the RSS feed.

> If you have already set a slug you are happy with, do not press Generate again.
> It will overwrite your shortened version with the full title.

### Excerpt

Required, up to 300 characters. This works in three places at once: the summary on
the journal index, the description in Google results, and the text on the card when
the post is shared. Write it for someone deciding whether to read, not as a summary
of what you wrote.

### Cover image

Optional. See [Cover images](#cover-images) below.

### Body

Required. See [What the editor offers](#what-the-editor-offers) below.

### Tags

Optional, but they power the filter on the journal index. One or two per post — if
every post carries every tag, the filter stops being useful. Create a new tag from
the **Tags** section in the left-hand panel.

### Published

Pre-filled with the current date and time. This sets the order posts appear in, and
the previous/next links at the bottom of each post are worked out from it. Leave it
unless you are deliberately backdating.

---

## What the editor offers

The body editor deliberately offers a small set of options. Everything in it has a
matching design on the site, so nothing you can insert will render badly.

| Type | Notes |
| --- | --- |
| **Normal** | Body text. |
| **Heading** and **Subheading** | Two levels only. |
| **Quote** | Indented with a rule beside it. |
| **Bullet** and **Numbered** lists | |
| **Bold**, **Italic**, **Code** | Inline formatting. |
| **Link** | Web addresses and email links. |
| **Image** | Alt text required, caption optional. |
| **Code** | Choose the language; add a filename to show above the block. |
| **Callout** | Three tones: Note, What I learned, Watch out. |

Two things happen automatically, so do not look for a field:

- **Reading time** is calculated from the length of your body text.
- **The table of contents** on the right of a post is built from your headings. It
  only appears when a post has two or more, so headings are navigation, not just
  visual rhythm. Three to six works well.

---

## Cover images

**Use 16:9.** The site displays covers in a 16:9 frame. A portrait or square image
is cropped from the centre to fit, which can remove most of it — a tall poster can
lose 60% of its height.

| | |
| --- | --- |
| Shape | 16:9, for example 1600 × 900 |
| Minimum width | 1240px, or it looks soft on a good screen |
| Alt text | **Required.** You cannot publish without it |
| Hotspot | Click the crop icon and set it if the subject is off-centre |

**Alt text should describe what the image conveys**, not just what is in it. "A
whiteboard covered in crossed-out attempts" is more useful than "a photo of a
whiteboard".

**Avoid images with small text baked into them.** On a phone a wide image is scaled
to roughly a third of its size, and text that was readable on your laptop becomes
unreadable. A headline survives; a paragraph does not.

Covers are optional on journal posts. A post without one still gets a proper
sharing card, because those are generated from the title, date and reading time
rather than from the image.

---

## Publishing

Press the green **Publish** button, bottom right.

If it is greyed out, something required is missing. On a journal post that is
usually the excerpt, the body, or **alt text on an image you added**.

---

## Seeing it appear

**On the deployed site**, a webhook tells the site to rebuild the affected pages,
so your change appears within a few seconds. Refresh the page.

**Locally**, there is no webhook, and pages are cached. If your change does not
appear:

1. Stop the dev server
2. Delete the `.next` folder
3. Start it again with `npm run dev`

**Restarting the server on its own will not work** — the cache lives in that folder
and survives a restart. This catches everyone, including people who know about it.

---

## Editing and unpublishing

**To edit**, open the document, make the change, and press **Publish** again. Your
edits are saved as a draft as you type; the live site keeps showing the published
version until you publish the new one.

**To unpublish**, use the **⋯** menu next to the Publish button and choose
*Unpublish*. The document stays in the Studio as a draft, so nothing is lost.

**To delete permanently**, the same menu has *Delete*. There is no undo.

---

## Adding a project

Projects work the same way, with a few differences.

- **The cover image is required**, not optional
- **Summary** is limited to 240 characters and appears on the work grid
- **My role** — be specific about what you personally did
- The body is **three separate fields**: Problem, Approach, Outcome. Every case
  study answers the same three questions in the same order, which is what makes
  projects comparable to a reader
- **Tech** tags list the technologies, and feed the filter on the work page
- **Gallery** images each need their own alt text
- **Featured** puts the project on the home page, which shows the three most recent
  featured projects

---

## Checklist before you publish

- [ ] Slug is short, and you have not pressed Generate since setting it
- [ ] Excerpt reads like an invitation, not a summary
- [ ] Cover image is 16:9 and has alt text
- [ ] Headings tell the story on their own — read just the headings back
- [ ] Tags are one or two, not all of them
- [ ] You have read it once as yourself, not as an editor
