# Content Studio

Content Studio is the private, Git-backed editor for notes, projects, covers, images, and research videos.

## Production Login

Open:

```text
https://xulin-academic-portfolio.vercel.app/studio
```

Choose **Continue with GitHub**. The server validates the GitHub identity and only accepts the login configured by `GITHUB_ADMIN_LOGIN`.

Production saves use the GitHub Contents API to commit the generated MDX file to `main`. The connected Vercel project then rebuilds the public website. Content updates are not immediate; allow the deployment to finish.

## Create Content

### Note

1. Select `New` beside Notes.
2. Add a title. A URL slug is generated automatically.
3. Set summary, date, tags, visibility, and document body.
4. Enable `Show in rotating archive` when the note should appear in the homepage showcase.
5. Choose a default cover palette or upload a custom cover.
6. Save the document.

Every visible note appears in the homepage research index and `/notes`. The archive switch only controls the rotating showcase.

### Project

1. Select `New` beside Projects.
2. Choose Paper, Reproduction, Project, Experiment, or Note.
3. Set year, status, visibility, links, tags, and the technical document body.
4. Choose whether it appears in the rotating archive.
5. Save the document.

No TypeScript edit is required. New project documents become project records automatically.

## Visibility

- `public`: visible in indexes and the detail page is available.
- `locked`: visible in indexes, but opens the Coming Soon prompt.
- `hidden`: excluded from public indexes and the rotating archive.

## Media

- Cover uploads set the project or note cover.
- Document image/video uploads insert an MDX component into the body.
- Production media uploads directly from the browser to Vercel Blob.
- External video embeds remain available for YouTube, Bilibili, or other hosted demos.

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000/studio`. Development mode trusts the local workspace and writes directly to `content/` and `public/media/`.

For a remote development server, bind to localhost and use an SSH tunnel:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
ssh -L 3000:127.0.0.1:3000 USER@SERVER
```

## Required Vercel Variables

```text
NEXT_PUBLIC_SITE_URL
GITHUB_OAUTH_CLIENT_ID
GITHUB_OAUTH_CLIENT_SECRET
GITHUB_CONTENT_TOKEN
GITHUB_ADMIN_LOGIN
ADMIN_SESSION_SECRET
BLOB_READ_WRITE_TOKEN
```

Never commit these values or paste them into documents. Rotate the fine-grained GitHub token before it expires.
