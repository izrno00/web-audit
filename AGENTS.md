<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## SiteLens project documents are the source of truth

Before starting any task, every agent must read these four files at the repository root:

| File | What it defines |
|---|---|
| [PRD.md](PRD.md) | Product scope, phases, features, checks, scoring, AI rules, limits, acceptance criteria |
| [DB.md](DB.md) | Database schema, enums, access policies (RLS), database functions, storage, retention |
| [Tech.md](Tech.md) | Tech stack, architecture, audit pipeline, security, integrations, testing, deployment |
| [UI-rules.md](UI-rules.md) | Design tokens, layout, screens, components, states, exact interface wording, accessibility |

Rules:

- **Treat these documents as the absolute truth** for the project's scope, tech stack, data model, architecture and interface. Follow them exactly. Don't rely on assumptions, defaults or general knowledge where the documents say something different.
- **Don't go beyond them.**
  - Don't add features, libraries, services, tables or screens that the documents don't describe.
  - Don't build anything listed as excluded (PRD.md §1) or anything planned for a later phase than the current one.
- **Stop and ask the product owner** in any of these cases, instead of guessing:
  - a request conflicts with the documents;
  - the documents conflict with each other;
  - something you need isn't covered.
- **Change the documents first.** Any change to scope, stack, schema or interface must first be made in the relevant document and approved by the owner. Only then is it implemented. Code and documents must always agree.
- **Respect open items.** Items marked **OPEN** or **Proposed — review** (PRD.md §17) are not final. Don't treat them as decided until the owner confirms them.
- **No application code before approval.** Until the owner has explicitly approved all four documents, don't write application code.
- **How the Next.js rule fits in.** The Next.js rule above still applies: the bundled docs in `node_modules/next/dist/docs/` decide *how* to use Next.js APIs, and these four documents decide *what* to build.
