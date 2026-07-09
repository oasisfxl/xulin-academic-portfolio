# Content Guide

This site is designed to be edited from either the Mac or a server.

## Folder Layout

```text
content/
  projects/
    robotwin-act-reproduction.mdx
  notes/
    flow-matching-notes.mdx

public/
  covers/
  images/
  videos/
  papers/
```

## Project Documents

Create a project document in `content/projects/<slug>.mdx`.

The `<slug>` should match `data/projects.ts`.

```mdx
---
title: "Project Title"
subtitle: "Short subtitle"
summary: "One short public summary."
year: "2026"
status: "In Progress"
visibility: "public"
tags:
  - Robot Learning
  - Humanoid Manipulation
---

## Overview

Write the project document here.
```

## Notes

Create a note in `content/notes/<slug>.mdx`.

Or generate a template:

```bash
npm run new:note -- act-normalization-debug
```

```mdx
---
title: "Note Title"
subtitle: "Short subtitle"
summary: "One short summary."
date: "2026-07-10"
updated: "2026-07-10"
visibility: "public"
tags:
  - Imitation Learning
---

## Main Idea

Write the note here.
```

## Visibility

- `public`: listed and detail page is generated.
- `locked`: can appear in indexes but does not expose a detail page.
- `hidden`: not listed.

Do not commit truly private research details, unreleased paper drafts, private videos, secrets, credentials, datasets, or model weights to this public repository.

## MDX Components

```mdx
<Callout title="Practical rule" type="warning">
Short warning or note.
</Callout>

<Figure
  src="/images/example.png"
  alt="Example figure"
  caption="Figure caption."
/>

<Video
  src="/videos/demo.mp4"
  poster="/images/demo-poster.jpg"
  caption="Short demo clip."
/>

<ExternalVideo
  title="External demo"
  src="https://www.youtube.com/embed/..."
  caption="External video."
/>
```

## Server Writing Workflow

```bash
git pull
npm install
npm run new:note -- my-note-slug
npm run build
git add .
git commit -m "Add note"
git push
```
