<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## SiteLens project documents are the source of truth

The owner approved all four documents on 22 Nov 2026, so implementation has started. They live in [docs/](docs/):

| File | What it defines |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Product scope, phases, features, checks, scoring, AI rules, limits, acceptance criteria |
| [docs/DB.md](docs/DB.md) | Database schema, enums, access policies (RLS), database functions, storage, retention |
| [docs/Tech.md](docs/Tech.md) | Tech stack, architecture, audit pipeline, security, integrations, testing, deployment |
| [docs/UI-rules.md](docs/UI-rules.md) | Design tokens, layout, screens, components, states, exact interface wording, accessibility |

**How work is organized.** Work runs task by task, following [tasks/Tasks.md](tasks/Tasks.md). A planning agent writes a plan file for one task, the owner approves it, and an executing agent implements it and opens a pull request. Tasks.md describes the workflow, the standing rules, the definition of done and every task card.

**What to read.** Before starting a task, read the doc sections the task card lists under **Read** closely, and skim the rest of the four docs.

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
- **Respect open items.** Items marked **OPEN** (PRD.md §17) are not decided until the owner confirms them. The **Proposed — review** defaults are accepted for Phase 1 (O8) and are revisited with real audit data.
- **How the Next.js rule fits in.** The Next.js rule above still applies: the bundled docs in `node_modules/next/dist/docs/` decide *how* to use Next.js APIs, and these four documents decide *what* to build.
