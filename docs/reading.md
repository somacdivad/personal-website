# Reading journal

The public journal is titled What I'm reading and lives at `/about/reading/`.
Each work has one permanent page and can have several reading sessions.
Everything in the reading collection publishes on the next site deploy; there are no drafts.

## Add a work

Create `src/content/reading/a-room-of-ones-own/work.md`:

```md
---
title: A Room of One's Own
authors:
  - Virginia Woolf
kind: book
sourceUrl: https://en.wikipedia.org/wiki/A_Room_of_One%27s_Own
description: My reading notes on A Room of One's Own.
tags:
  - Literature
  - Writing
sessions:
  - id: first-read
    started: '2026-11-04'
    totalPages: 128
---
```

These are writing examples, not actual reading records.
Use your edition's page count and your own dates.
The folder name becomes the page URL, `/about/reading/a-room-of-ones-own/`.
Use lowercase letters, numbers, and single hyphens in folder and session IDs.
Keep the IDs stable so existing links continue to work.
The metadata file needs no body.

`title`, `authors`, `kind`, and `sessions` are required.
Use `authors: []` for an unattributed work.
Kinds are `book`, `article`, `essay`, `paper`, `short story`, and `other`.
Every kind except `book` appears under Shorter works.
The source URL, description, thumbnail, and tags are optional.
Source links must use HTTP or HTTPS.

For a thumbnail, put `cover.jpg` beside `work.md` and add `thumbnail: ./cover.jpg` to its frontmatter.
The site sizes local images automatically.
Titles already identify these small images, so they have empty alternative text.

## Record progress and notes

Create `updates/2026-11-04-01.mdx` inside the work's folder:

```mdx
---
session: first-read
date: '2026-11-04'
pages: 32
location: Chapter 2
---

I'm thinking about the difference between having time and being able to call it your own.
```

All dates use quoted `YYYY-MM-DD` calendar dates.
The filename must match the date, followed by a sequence such as `-01` or `-02`.
Use the same sequence width throughout, and give later updates on the same day higher numbers.
An update can contain progress, a status change, or a note.
To create a blank note for later, supply only its `session` and `date`, then leave the body empty.
It appears as a dated note with a “Read note” preview until you add your thoughts.
Notes and progress are independent: omit `pages` to write a note without changing progress, or leave the body empty to record progress alone.

For a work without page numbers, omit `totalPages` from its session and use `percent: 45` in an update.
Percentages range from 0 to 100.
Sessions with `totalPages` use `pages`, which must be a whole number between zero and the total.
Do not supply both `pages` and `percent`.
Progress can also be omitted entirely; the site will show status without a bar.
Reaching 100% does not mark a session Finished.

The journal uses the latest recorded progress and the latest note independently.
Its Recent notes section shows six notes after filtering, newest first.
Work pages keep all updates, including progress-only updates.
Progress bars appear in the read summaries; dated updates show their recorded progress as plain text.

## Use rich MDX

Update bodies support the same MDX features as blog posts.
For example, put `passage.jpg` beside `work.md`, and write this inside an update:

```mdx
import VideoFigure from '../../../../components/VideoFigure.astro';

Here is the passage I want to return to:

![A description of the passage](../passage.jpg)

<VideoFigure
  src="/videos/example.mp4"
  poster="/images/example-poster.jpg"
  label="Describe what the video shows"
/>
```

Use real files and descriptive alternative text and labels.
Component imports are relative to the update file.
Files in `public/` use root-relative URLs, as in the video example.

The journal and RSS use the first text paragraph, shortened to 40 words.
Imports, code, and MDX expressions are ignored when extracting previews; components are never executed to produce them.
Override the preview by adding `summary: A short plain-text summary.` to the update's frontmatter.
For a media-only note without a summary, the preview is “Read note.”

## Pause, resume, stop, or finish

A new session starts in Reading automatically.
To pause, add an update such as `updates/2026-11-05-01.mdx`:

```mdx
---
session: first-read
date: '2026-11-05'
status: paused
---
```

Use `status: reading` in a later update to resume that session.
Use `status: stopped` or `status: finished` to close it.
For example, `updates/2026-11-10-01.mdx` can contain:

```mdx
---
session: first-read
date: '2026-11-10'
status: finished
---

A closing thought, if I have one.
```

Do not repeat the current status on ordinary progress or note updates.
You can add notes after closing a session, but no further progress or status changes.
To correct a mistake, edit the original update.
To return to a stopped or finished work, add a new session.

Finished sessions show 100% when progress tracking exists.
Earlier progress values remain in the update history.
Paused and stopped sessions retain their last recorded progress.

## Reread or return to a work

Keep the existing work folder and add a session to the end of its list:

```yaml
sessions:
  - id: first-read
    started: '2026-11-04'
    totalPages: 128
  - id: second-read
    started: '2027-02-01'
    totalPages: 128
```

The preceding session must already be Stopped or Finished.
Updates for the new session use `session: second-read` and their own dated filenames.
Only the newest session can remain Reading or Paused.
Sessions go oldest to newest in the metadata and display newest first on the site.
Each session has its own progress, dates, and notes.
Work pages group these under Reading history.
With one read, dates, status, progress, and notes appear directly beneath that heading.
With multiple reads, each group has a heading such as First read, Second read, or Third read, with the newest read first.

## Unknown start dates

Omit `started` when the start date is unknown:

```yaml
sessions:
  - id: first-read
```

Updates still need exact dates.
A past finished read can have one update with `status: finished` and its known finish date.
Do not invent a start date or use approximate dates.

## History, links, and RSS

Currently reading is ordered by the latest update, falling back to the known start date.
Undated sessions appear last.
Paused, stopped, and finished sessions appear in Reading history under their pause or closing year.
Each reread gets its own history row, linked to its session on the same work page.
Later notes do not change a closed session's archive year.
Resuming a paused session moves it back to Currently reading.

Everything, Books, and Shorter works switch the journal's work type.
Each type uses its own stable hand-drawn underline when selected, distinct from the blog topic underlines.
The selection stays in the URL and applies across current reading, recent notes, and history.
There is no item count, status filter, or topic filter.
Tags remain visible as plain metadata.
The RSS link sits to the right of the type controls on desktop and below them on mobile.
It uses the same `RssLink.astro` component as Blog and Stories, with no underline.
The newest matching year opens automatically; older years can be expanded.
Without JavaScript, the full log is still readable.

The separate `/about/reading/rss.xml` feed includes notes, status changes, and known session starts.
It skips progress-only updates and combines a note and status change from the same update into one item.
Existing blog and story feeds do not include reading entries.
The former `/reading/` URLs redirect on Vercel, including work pages and RSS.
Reading content folders and update IDs remain unchanged.

Run `npm run build` before deploying.
Content errors identify the source file that needs correction.
