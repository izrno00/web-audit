# SiteLens

SiteLens audits websites in five categories (SEO, Performance, Accessibility, Technical & Security, UX & Conversion) and explains each finding with evidence and a recommendation.

- [docs/](docs/): the product, database, technical and UI specifications (the source of truth)
- [tasks/Tasks.md](tasks/Tasks.md): the task list and how work is organized
- [AGENTS.md](AGENTS.md): rules for coding agents

## Local development

**Prerequisites:** Node 26 and pnpm (`npm i -g pnpm`). On Windows, if `pnpm -v` prints nothing afterwards, npm blocked pnpm's install scripts: reinstall with `npm i -g pnpm --allow-scripts=pnpm`.

```bash
pnpm install      # install all workspace packages
pnpm dev          # web app (apps/web) on http://localhost:3000
pnpm dev:worker   # audit worker (apps/worker)
pnpm lint         # ESLint over the whole repo
pnpm typecheck    # route types + tsc -b over every package
pnpm test         # Vitest over every package
pnpm build        # production build of the web app
```

**Environment variables:** `.env.example` lists them all. Copy the web variables to `apps/web/.env.local` and the worker variables to `apps/worker/.env`. Both files are gitignored.

The workspace contains `apps/web` (Next.js), `apps/worker` (the audit worker) and `packages/core` (shared, framework-free code).
