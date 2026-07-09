import fs from "node:fs";
import path from "node:path";

const kind = process.argv[2];
const slug = process.argv[3];

if (!["notes", "projects"].includes(kind) || !slug) {
  console.error("Usage: npm run new:note -- my-slug");
  console.error("   or: npm run new:project-doc -- my-project-slug");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const targetDir = path.join(process.cwd(), "content", kind);
const targetFile = path.join(targetDir, `${slug}.mdx`);

if (fs.existsSync(targetFile)) {
  console.error(`Content already exists: ${targetFile}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const title = slug
  .split("-")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

const frontmatter =
  kind === "notes"
    ? `---
title: "${title}"
subtitle: "Short subtitle"
summary: "One short summary."
date: "${today}"
updated: "${today}"
visibility: "public"
tags:
  - Robot Learning
---

## Main Idea

Write the note here.
`
    : `---
title: "${title}"
subtitle: "Short subtitle"
summary: "One short public summary."
year: "${today.slice(0, 4)}"
status: "In Progress"
visibility: "public"
tags:
  - Robot Learning
---

## Overview

Write the project document here.
`;

fs.writeFileSync(targetFile, frontmatter, "utf8");
console.log(`Created ${targetFile}`);
