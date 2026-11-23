# SiteLens — Task list

**Audience:** the planning and executing agents who take these tasks, and the owner who reviews them.
**Covers:** Phase 1 in full detail (T00–T49) and Phases 2–3 as an outline to be split up later.
**Source of truth:** the four docs in `docs/`: PRD.md, DB.md, Tech.md and UI-rules.md (approved 22 Nov 2026). The order of authority, when to stop and ask, and the git rules are in `AGENTS.md`. This file doesn't repeat them.

---

## 1. How a task runs

Every task goes through two agents: a planning agent and an executing agent. When a task may start, and how its branch is created and cleaned up, is in `AGENTS.md` (Git and branches).

### 1.1 Planning agent
Prompt from the owner: *"You are the planning agent for task T07 in tasks/Tasks.md."*

1. Read `AGENTS.md`, then this file's §1–§2 and the task's card.
2. Check that the task may start and create the branch `t07-<slug>` (`AGENTS.md`, Git and branches).
3. Read the doc sections listed under **Read** closely. Skim the rest of the four docs.
4. Look at the current code. For Next.js code, follow the Next.js rule in `AGENTS.md`. For Claude API calls, use the current Claude API reference (the `claude-api` skill), not memory.
5. Write `tasks/T07-<slug>-plan.md` on the branch with these sections:
   - **Context**: what the task delivers and why.
   - **Files**: files to create or change.
   - **Steps**: in order, detailed enough for an agent that hasn't seen this conversation.
   - **Tests**: what is tested and how.
   - **Acceptance**: which PRD §16 items this covers, fully or partly.
   - **Assumptions**: implementation details chosen conservatively. The owner can veto them.
   - **Questions for the owner**: everything `AGENTS.md` says to stop and ask about. **If there are questions, stop here.**
6. Don't write code, don't commit. Leave the plan file uncommitted on the branch.

### 1.2 Owner
Reads the plan, answers the questions in the plan file, approves it.

### 1.3 Executing agent
Prompt from the owner: *"Execute tasks/T07-<slug>-plan.md."*

1. Work on the branch `t07-<slug>` that the planning agent created, where the approved plan file is waiting uncommitted (`AGENTS.md`, Git and branches).
2. Read the task's card and the doc sections listed under **Read**.
3. Implement the plan. When reality contradicts it, follow the stop-and-ask rules in `AGENTS.md`.
4. Meet the definition of done (§1.4). Tick the task in the status table (§3).
5. Commit the plan file and the code, push, and open a PR with `gh`. The owner reviews and merges.
6. When the owner says "merged", clean up the branch (`AGENTS.md`, Git and branches).

### 1.4 Definition of done (every task)
- The pre-commit checks in `AGENTS.md` pass on the final commit, and CI is green.
- New logic has tests, and the card's **Done when** holds.
- The four docs are unchanged, unless the card says to change them.
- New environment variables are added to `.env.example`. No secrets are committed.
- The PR description says what changed, how it was verified, which PRD §16 items it covers, and the assumptions and notable choices.
- UI tasks attach dev-server screenshots: light and dark, desktop and 390 px wide.

---

## 2. Standing rules and decisions

- **Stay in the card's scope.** Items under **Not in this task** belong to other tasks. Don't build ahead.
- **Hosted services are owner-only.** Agents never run commands against hosted Supabase, Vercel, Google Cloud or GitHub settings. Those are the owner tasks (OW) in §4.
- **No live external calls in tests.** PageSpeed, CrUX and Claude are tested with recorded fixtures or mocks.
- **Explanation texts:** agents draft each check's title, description, impact and recommendation in the UI-rules §14 tone. The owner reviews them in the PR.
- **Node 26 everywhere** (local, CI, worker image, Vercel). pnpm is installed once, as OW1 describes, because Corepack no longer ships with Node.
- **Scoring method version** is `2026.1`.
- **Phase 1–2 sign-in allowlist:** only emails in `ALLOWED_EMAILS` can sign in (T00 documents it, T06 builds it). It is removed in Phase 3.
- **`start_audit` in Phase 1** has L7, L10, L12, the website limit, admin bypass logging and the outbox. L1–L6, L8, L9 and L11 arrive in Phase 3.
- **The landing page** is a skeleton built by agents (T49). The real sections are designed live with the owner (OW7).

---

## 3. Status

| ID | Task (slug) | Depends on | Done |
|---|---|---|---|
| T00 | Record Q&A decisions and commit the baseline (`docs-decisions`) | — | [x] |
| T01 | pnpm monorepo and CI skeleton (`monorepo`) | T00, OW1 | [x] |
| T02 | Design tokens, theme and base components (`tokens`) | T01, OW1 | [x] |
| T03 | Database 1: local Supabase, accounts, limits, websites, system (`db-accounts`) | T01, OW1 | [ ] |
| T04 | Database 2: audit snapshot tables, immutability, Storage (`db-snapshot`) | T03 | [ ] |
| T05 | Database 3: issues, scores, AI, sharing tables, generated types (`db-issues-ai`) | T04 | [ ] |
| T06 | Sign-in, sessions, allowlist, security headers (`auth`) | T02, T03, OW2 | [ ] |
| T07 | App shell, navigation, settings basics (`app-shell`) | T06 | [ ] |
| T08 | URL normalization, site key, SSRF guard (`core-url-net`) | T01 | [ ] |
| T09 | Clients and websites (`websites`) | T07, T08 | [ ] |
| T10 | `start_audit` (Phase 1 rules), finish, cancel, queue position (`start-audit`) | T05 | [ ] |
| T11 | Worker-side database functions (`worker-sql`) | T10 | [ ] |
| T12 | Worker skeleton: dispatcher, queues, heartbeat, cancellation (`worker-skeleton`) | T11 | [ ] |
| T13 | Quick audit box and start-audit action (`quick-audit`) | T09, T10, T12 | [ ] |
| T14 | Audit progress view, live updates, cancel (`progress-view`) | T13 | [ ] |
| T15 | Check framework: catalog types, severity, result writer (`check-framework`) | T12 | [ ] |
| T16 | Safe HTTP client, robots.txt, sitemaps (`http-robots-sitemap`) | T15 | [ ] |
| T17 | Browser rendering and capture (`rendering`) | T16 | [ ] |
| T18 | DOM data extraction (`extraction`) | T17 | [ ] |
| T19 | axe and interactive browser checks (`axe-browser-checks`) | T18 | [ ] |
| T20 | Initialization, discovery, crawl orchestration (`discovery-crawl`) | T19 | [ ] |
| T21 | Network checks: links, TLS, redirects, host variants (`network-checks`) | T20 | [ ] |
| T22 | SEO checks 1: titles, meta, canonicals, indexing, robots, sitemap (`seo-checks-1`) | T21 | [ ] |
| T23 | SEO checks 2: links, images, content (`seo-checks-2`) | T22 | [ ] |
| T24 | Technical & Security checks (`tech-checks`) | T21 | [ ] |
| T25 | Technology detection (`tech-detection`) | T24 | [ ] |
| T26 | Accessibility checks (`a11y-checks`) | T20 | [ ] |
| T27 | Performance: PageSpeed, CrUX, perf findings (`performance`) | T20, OW2 | [ ] |
| T28 | Page classification rules (`page-classification`) | T20 | [ ] |
| T29 | UX & Conversion automated checks (`ux-checks`) | T28 | [ ] |
| T30 | Scoring engine and scoring stage (`scoring`) | T22–T29 | [ ] |
| T31 | Issue identity and lifecycle engine (`issues-engine`) | T30 | [ ] |
| T32 | Finalization stage (`finalization`) | T31 | [ ] |
| T33 | Result UI components (`result-components`) | T14 | [ ] |
| T34 | Results header and Overview tab (`results-overview`) | T32, T33 | [ ] |
| T35 | Issues tab and global Issues list (`issues-list`) | T34 | [ ] |
| T36 | Issue detail (`issue-detail`) | T35 | [ ] |
| T37 | Pages tab, page detail, screenshot viewer (`pages-tab`) | T36 | [ ] |
| T38 | Performance and Technical tabs (`perf-tech-tabs`) | T37 | [ ] |
| T39 | Website detail page (`website-detail`) | T38 | [ ] |
| T40 | Audits list, notifications, audit deletion (`audits-list`) | T39 | [ ] |
| T41 | Overview dashboard (`overview`) | T40 | [ ] |
| T42 | AI wrapper, cost logging, cost views (`ai-wrapper`) | T32 | [ ] |
| T43 | AI page classification fallback and content analysis (`ai-content`) | T42 | [ ] |
| T44 | Finding advice, executive summary, AI retry (`ai-summary`) | T43 | [ ] |
| T45 | AI in the interface (`ai-ui`) | T44, T41 | [ ] |
| T46 | Fixture site and pipeline integration test (`integration-test`) | T45 | [ ] |
| T47 | Model comparison script, O7 (`model-compare`) | T44 | [ ] |
| T48 | Worker Docker image and deployment runbook (`deploy`) | T46, OW4 | [ ] |
| T49 | Crawler info page and landing skeleton (`bot-landing`) | T07 | [ ] |

T49 only needs T07 but is placed last so it doesn't interrupt the pipeline work.

---

## 4. Owner tasks

| ID | When | What |
|---|---|---|
| OW1 | Before T01 | Install **Docker Desktop** (WSL 2 backend) and **pnpm** (`npm i -g pnpm --allow-scripts=pnpm`; the flag is needed on Windows, where npm 12 otherwise blocks pnpm's install scripts and `pnpm` prints nothing). Connect the **shadcn MCP** before T02. |
| OW2 | Before T06 (API key before T27) | **Google Cloud project:** OAuth consent screen and a Web OAuth client, with redirect URIs for local Supabase (`http://127.0.0.1:54321/auth/v1/callback`) and later the hosted project. Put the client ID and secret in the local env for `supabase/config.toml`. Enable the **PageSpeed Insights API** and the **Chrome UX Report API**, and create an API key restricted to those two. Check the PageSpeed quota (O4). |
| OW3 | After T01 is merged | GitHub: branch protection on `main` (CI required) and secret scanning. |
| OW4 | Before T48 | **Supabase** production project in Frankfurt (URL, keys, session-pooler connection string, Google provider). **Vercel**: import the repo with root `apps/web` and region `fra1`. **Anthropic**: set a monthly spend limit. |
| OW5 | After T48 | Deploy by following the runbook from T48: migrations, Vercel env vars, set your own `role = admin`, run the worker on the PC, smoke test. |
| OW6 | After OW5 and a few real audits | Run the T47 script on 3 audits, pick the models, update `settings.ai.models` and record O7 in PRD §17. |
| OW7 | After T49 | Design the landing page sections live, section by section. |
| OW8 | End of Phase 1 | Walk through the Phase 1 exit criteria (PRD §16.2). |

---

## 5. Phase 1 task cards

### T00 · Record Q&A decisions and commit the baseline (`docs-decisions`)
**Goal:** Put the approved docs on `main`, then record the 23 Nov 2026 decisions in the docs and AGENTS.md through a PR.
**Read:** AGENTS.md · PRD §2, §17 · DB §6.1 · Tech §1, §3, §4.2, §7.1, §13, §14, §15, §17 · UI-rules §6.15, §9.
**Scope:**
1. **Baseline, committed directly to `main`.** This is an owner-approved exception before branch protection exists.
   - Check that `.gitignore` covers `.next/`, `node_modules/` and `.env*` (except `.env.example`).
   - Commit the working tree: the four docs, AGENTS.md, the preset files (`components.json`, `components/`, `lib/`, `app/`), `package.json`, `package-lock.json` and `tasks/`. Push.
2. **Branch `t00-docs-decisions`** with these edits:
   - **PRD §17 O8:** "Accepted for Phase 1 (23 Nov 2026); revisit with real audit data."
   - **Node 26 everywhere:**
     - Tech §1 (worker row), §13 (CI), §15 (pnpm via `npm i -g pnpm`, since corepack is no longer bundled).
     - Tech §7.2 worker image: Playwright's image plus Node 26, or a `node:26` base plus Playwright's Chromium dependencies. Check which Playwright images exist.
     - **Check that Vercel supports Node 26.** If it doesn't, stop and ask the owner.
   - **Phase 1–2 sign-in allowlist:**
     - The `ALLOWED_EMAILS` env var (comma-separated) is checked in the auth callback and the DAL, and removed in Phase 3.
     - Update PRD §2 (Phase 1 and Phase 3 rows), Tech §4.2, Tech §7.1 point 5 (the accepted risk is now limited by the allowlist) and the Tech §14 env table.
     - Add the error code `EMAIL_NOT_ALLOWED` to UI-rules §6.15 and §9, with proposed wording such as "This account doesn't have access to SiteLens yet." The owner approves the wording in the PR.
   - **`start_audit` phase split:**
     - DB §6.1 and Tech §17 M2: Phase 1 implements L7, L10, L12, the website limit, admin bypass logging and the outbox.
     - L1–L6, L8, L9 and L11 arrive in Phase 3 by replacing the function, with no data migration.
     - The DB §9 pgTAP note follows the same split.
   - **Tech §17:**
     - M5: the O7 comparison is a script the owner runs.
     - M6: agents build the landing skeleton and `/bot`; the owner designs the sections live.
   - **Tech §3:** add `tasks/` (this file and the plan files) to the repo layout.
   - **AGENTS.md:**
     - Record that the docs were approved on 22 Nov 2026, replacing the "no application code before approval" rule.
     - Reading rule: read the sections the task card names closely and skim the rest of the four docs.
     - Point to `tasks/Tasks.md` for the plan-then-execute workflow.
     - Leave the generated Next.js block untouched.

**Not in this task:** any code.
**Done when:** the baseline is on `origin/main`, the PR is open, and the four docs and AGENTS.md agree with each other.

### T01 · pnpm monorepo and CI skeleton (`monorepo`)
**Goal:** pnpm workspace with `apps/web`, `apps/worker` and `packages/core`, plus CI for lint, type check and unit tests.
**Read:** Tech §1, §3, §13, §14 · UI-rules §2 (fonts).
**Scope:**
- **Workspace setup:**
  - `pnpm-workspace.yaml`.
  - Root scripts: `dev`, `dev:worker`, `lint`, `typecheck` (`tsc -b`), `test`.
  - `packageManager` and `engines.node` set to 26, plus `.nvmrc` / `.node-version` with 26.
  - Delete `package-lock.json`.
- **Move the Next.js app to `apps/web`** with `components.json`, `app/`, `components/`, `lib/`, `public/`, `next.config.ts` and the ESLint config.
  - Keep the preset intact.
  - Remove Geist Sans. Map Geist Mono to `--font-mono` (UI-rules §2).
- **`apps/worker`:** a Node 26 TypeScript package with a placeholder entry and a `dev` script.
- **`packages/core`:** the module folders from Tech §3 (empty `index.ts` files), a Vitest config and one sample test.
- **Tooling:**
  - TypeScript project references with a shared base config.
  - ESLint 9 flat config, with a rule that `packages/core` can't import `next` or `playwright`.
- **`.env.example`** with every variable from Tech §14 plus `ALLOWED_EMAILS`, each with a comment.
- **`.github/workflows/ci.yml`:** install (cached), lint, type check and unit tests on Node 26, for PRs and pushes to `main`.
- **README:** a short local development section.

**Not in this task:** Supabase, auth, UI changes beyond moving files.
**Done when:**
- `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm --filter web build` succeed.
- `pnpm dev` serves the existing page.
- CI passes on the PR.

### T02 · Design tokens, theme and base components (`tokens`)
**Goal:** The UI-rules foundation, so all later UI uses the same tokens and components.
**Read:** UI-rules §1, §2, §3, §4, §12, §15.
**Scope:**
- **Tokens:**
  - Add the UI-rules §3.2–§3.4 tokens to `globals.css` for `:root` and `.dark`.
  - Map them in `@theme inline` so classes like `bg-score-good-bg` and `text-severity-high-fg` work.
- **Contrast test** that runs in CI: every fg/bg pair ≥ 4.5:1, and every solid mark ≥ 3:1 against the card background, in both themes.
  - If a value fails, propose a fix in the same PR and update UI-rules §3 so the owner approves it there.
- **Theme:** light and dark, following the system by default, with a toggle component. No flash on load, and `prefers-reduced-motion` respected.
- **Components:** install the UI-rules §15 list from the `base-lyra` registry through the shadcn MCP.
- **Logo:** the "SiteLens" wordmark in Oxanium semibold with a Hugeicons lens or search icon in the primary color.

**Not in this task:** the app shell, pages.
**Done when:** the contrast test passes in CI, and the components render in both themes.

### T03 · Database 1: local Supabase, accounts, limits, websites, system (`db-accounts`)
**Goal:** Local Supabase with the first migrations, RLS, seed data and pgTAP in CI.
**Read:**
- DB §1, §3.1, §3.2, §3.3, §3.9, §4 and §9.
- DB §3.8: `notifications`, `settings`, `demo_publications`, `deletion_requests` and `data_exports`.
- Tech §5, §13.

**Scope:**
- **`supabase/` setup:**
  - `config.toml` with the local Google provider (read from env, never committed).
  - Site URL `http://localhost:3000`.
- **Migrations:**
  - **every enum** from DB §1;
  - the tables `profiles` (with the sign-up trigger), `plans`, `subscriptions`, `stripe_events`, `usage_ledger`, `free_audit_claims`, `ip_audit_events`, `site_reservations`, `blocked_sites`, `admin_actions`, `clients`, `websites` (with the URL-lock trigger), `page_type_overrides`, `noindex_intents`, `notifications`, `settings`, `demo_publications`, `deletion_requests` and `job_outbox` (with the `NOTIFY` trigger);
  - all their indexes.
  - Foreign keys to tables that don't exist yet (`audits`, `visual_analyses`) are added in T04 and T05.
- **Security:** RLS on every table, with the DB §4 policies and the column grants on `profiles`.
- **`seed.sql`:**
  - the `free` and `pro` plans;
  - every `settings` key from DB §3.8 (`ai.models` and `ai.prices` from Tech §8, `crawl.*` from PRD §6.4);
  - a local development admin.
- **pgTAP tests:**
  - RLS for each of these tables: the owner, another user and anonymous;
  - the profile trigger, the URL lock and the column grants.
- **CI:** a job that runs `supabase start` and `supabase test db` when `supabase/**` changes, and on `main`.

**Not in this task:** audit, issue, score, AI and sharing tables (T04, T05); RPCs (T10, T11).
**Done when:** `supabase db reset` works from scratch, and `supabase test db` passes locally and in CI.

### T04 · Database 2: audit snapshot tables, immutability, Storage (`db-snapshot`)
**Goal:** The audit snapshot tables, the trigger that freezes finished audits, and the Storage buckets.
**Read:** DB §3.4, §4, §5, §7 · PRD §10.4.
**Scope:**
- **Tables and keys:**
  - `audits`, `audit_stages`, `pages`, `check_results`, `performance_runs`, `crux_snapshots`, `link_checks`, `technologies`, `screenshots` and `artifacts`, with their indexes;
  - the foreign keys from T03 tables to `audits`.
- **RLS** following DB §4.
- **Snapshot trigger (DB §5)** on these tables, with every exception: the retention columns, `ai_status` and `ai_retry_used`, and `app.allow_snapshot_delete`.
- **Storage:** the private buckets `audit-files`, `branding` and `exports`, with the DB §7 policies.
- **Realtime:** a publication for `audits` and `audit_stages`.
- **pgTAP tests:**
  - RLS;
  - updates and deletes are rejected after `finished_at`, and the exceptions still work;
  - Storage policies where they can be tested.

**Done when:** `supabase test db` passes.

### T05 · Database 3: issues, scores, AI, sharing tables, generated types (`db-issues-ai`)
**Goal:** The rest of the schema, so later phases don't need data migrations, plus generated TypeScript types.
**Read:** DB §3.5, §3.6, §3.7, §3.8 (`public_reports`, `pdf_exports`), §4, §5, §9.
**Scope:**
- **Tables and view:**
  - `issues`, `issue_occurrences`, `issue_status_events`, `audit_findings`, `audit_finding_occurrences`, `score_revisions`, `page_scores`, `ai_runs`, `ai_page_analyses`, `ai_summaries`, `ai_advice`, `visual_analyses`, `ux_criterion_results`, `public_reports` and `pdf_exports`;
  - the remaining foreign keys;
  - the `audit_latest_scores` view, which must respect RLS (security invoker).
- **Security:**
  - RLS following DB §4; `ai_runs` isn't readable by users;
  - the snapshot trigger on these snapshot tables; revision 0 can never change.
- **Generated types:**
  - `supabase gen types typescript` writes to `packages/core/src/db/types.ts`, with a `db:types` script;
  - a CI step fails when the types are out of date.
- **pgTAP tests** for these tables.

**Done when:** `supabase test db` passes and the types check is green in CI.

### T06 · Sign-in, sessions, allowlist, security headers (`auth`)
**Goal:** Google sign-in, server-side authorization, the Phase 1 allowlist, and SiteLens's own security headers.
**Read:**
- Tech §4.1 (auth routes), §4.2, §4.6, §7.4, §14.
- UI-rules §6.15 and §9 (including `EMAIL_NOT_ALLOWED` from T00).
- PRD §3 (admin).
- The bundled Next.js docs for proxy, authentication and content security policy.

**Scope:**
- **Supabase clients:** `@supabase/ssr` clients for Server Components, Server Actions and Route Handlers, and a `server-only` service-role client module.
- **`proxy.ts`:**
  - session refresh and the optimistic redirect from signed-out app routes to `/sign-in`;
  - the Tech §4.6 headers: a CSP with a per-request nonce, HSTS, `nosniff`, Referrer-Policy, Permissions-Policy and `frame-ancestors 'none'`;
  - the CSP must keep working with Supabase Realtime websockets.
- **`lib/dal.ts`:** `requireUser()`, `requireAdmin()` and `requireOwner(resource)`, all of which also enforce the allowlist.
- **Sign-in flow:**
  - the `/sign-in` page (UI-rules §6.15);
  - the `/auth/callback` Route Handler: a non-allowlisted email is signed out and shown the `EMAIL_NOT_ALLOWED` message;
  - a sign-out action.
- **Planner:** propose whether to also reject sign-ups at the Supabase level (a before-user-created auth hook). The owner decides.
- **Tests:** unit tests for parsing and matching the allowlist and for the DAL guards.

**Not in this task:** the app shell (T07).
**Done when:**
- An allowlisted Google account signs in locally and reaches a protected placeholder.
- Others see the message.
- Signed-out users are redirected.
- The headers are shown in the PR (for example with `curl -I`).

### T07 · App shell, navigation, settings basics (`app-shell`)
**Goal:** The signed-in layout every screen lives in.
**Read:** UI-rules §4, §5, §6.11 (Profile, Appearance), §7.12, §7.13, §8, §12, §13, §14 · Tech §4.1, §4.3.
**Scope:**
- **Sidebar:**
  - Overview, Websites, Audits, Issues, Reports and Settings;
  - the user menu and plan badge at the bottom;
  - collapsible to an icon rail, and a sheet below `lg`.
- **Top bar:**
  - breadcrumbs;
  - the New audit button (a placeholder until T13) and the notification bell (a placeholder until T40);
  - the theme toggle and the user menu with sign-out.
- **Page structure:** the skip link and the landmarks.
- **Route stubs** with their UI-rules §7.13 empty states: `/overview`, `/websites`, `/audits` and `/issues`.
- **`/settings/profile`:** edit the name; the email is read-only.
- **Shared patterns:**
  - the error boundary (Try again, Go to Overview, the error code);
  - skeleton conventions, and "Still loading…" after 10 s;
  - the Sonner toaster;
  - date, duration and number formatting helpers from UI-rules §14, with unit tests.
- **Rendering:** signed-in pages render dynamically with Suspense (Tech §4.3).
- **Ask the owner:**
  - Does **Reports** (a Phase 2 feature) appear in the Phase 1 sidebar?
  - Where does **Appearance** go? Tech §4.1 has no route for it.

**Done when:** keyboard navigation and the skip link work; there's no horizontal scrolling at 390 px; screenshots in both themes.

### T08 · URL normalization, site key, SSRF guard (`core-url-net`)
**Goal:** The pure, heavily tested URL and network-safety code in `packages/core`.
**Read:** PRD §6.3, §12.2, §14 (Security) · Tech §7.1 · DB §3.3 (`entered_url`, `site_key`).
**Scope:**
- **`core/url`:**
  - URL validation: `http` or `https`, ports 80 and 443, no `user:pass@`, and the rejected host names;
  - normalization: drop the fragment, remove the tracking parameters, sort the rest, lowercase the scheme and host;
  - `computeSiteKey` with IDNA punycode, the trailing dot, and the leading `www.` removed;
  - the URL path, the low priority for parameter variants, the exact-host check, the non-HTML extension filter, and the skipped-path patterns with reason codes (PRD §6.3).
- **`core/net`:**
  - `isPublicUnicast(ip)` covering every range in Tech §7.1, including IPv4-mapped and NAT64 addresses;
  - `safeLookup(host)`: every A and AAAA record must be public;
  - IP-literal hosts are checked the same way;
  - `SSRF_TEST_ALLOWLIST` is honored only when `NODE_ENV=test`.
- **Validation:** the Zod schema for the quick-audit input (URL and mode).
- **Tests:** exhaustive unit tests (the URL and SSRF items in PRD §16.1 Crawling).

**Not in this task:** the HTTP client (T16), browser interception (T17).

### T09 · Clients and websites (`websites`)
**Goal:** Users can manage clients and websites.
**Read:** PRD §5, §12.2 · DB §3.3, §4, §6.3 (`delete_website`), §7 (deleting files) · UI-rules §6.3 (list and edit), §7.5, §7.7, §7.8, §7.13, §9.1 (`WEBSITE_LIMIT`).
**Scope:**
- **`/websites` list:** a table that becomes cards on mobile, with a client filter and a search field. The score and open-issue columns show "—" until audits exist.
- **Create:** a form using `core/url` (normalized URL and site key). A duplicate site key gets a friendly error.
- **Edit dialog:**
  - name, description and client;
  - the URL is read-only after the first audit, with the UI-rules hint;
  - the indexing-intent switch with its hint.
- **Clients:** create, edit and delete them, and assign a website to one.
  - **Docs gap:** no route or sidebar item says where clients are managed. The planner asks the owner (suggestion: a Clients panel on `/websites`).
- **Website limit (`WEBSITE_LIMIT`):** enforced in the Server Action.
  - Note for the owner: the "own insert" RLS policy lets a browser client bypass this check. This matters from Phase 3.
- **Delete:**
  - the `delete_website(id, confirm_hostname)` RPC deletes in cascade under `app.allow_snapshot_delete` and queues a `storage.cleanup` outbox job;
  - pgTAP tests for it;
  - a typed-hostname delete dialog.
- **Detail page:** a basic `/websites/[id]` with the header, Edit and Delete. The full page is T39.

**Not in this task:** page-type and noindex lists (T37, T39), audits.
**Done when:** the "Websites and clients" items in PRD §16.1 hold, except reuse by the quick box (T13).

### T10 · `start_audit` (Phase 1 rules), finish, cancel, queue position (`start-audit`)
**Goal:** The atomic audit start and the audit-end rules in the database.
**Read:** PRD §3, §12, §16.1 (Limits) · DB §3.1 (`usage_ledger`), §3.2, §3.9, §6.1, §6.2 (`finish_audit`, `queue_position`), §6.3 (`cancel_audit`) · Tech §4.4.
**Scope:**
- **`start_audit(...)`** with the DB §6.1 signature. The hash parameters are kept but unused until Phase 3.
  - **Locking:** lock the profile (`EMAIL_NOT_VERIFIED`), check **L12**, then take the advisory lock per site.
  - **Rules:** **L10**, the website limit, **L7**, and admin bypass logging to `admin_actions`.
  - **Writes:**
    - the new website when there is one;
    - `url_locked_at`, when a website gets its first audit;
    - the audit (priority 10 for the admin);
    - a `site_hourly` reservation (always);
    - a ledger `consume` row (not for the admin);
    - the `job_outbox` row, in the same transaction.
  - Only the service role can execute it.
- **`finish_audit(audit_id, status)`:** the credit-return rules and the reservation-release rules (DB §6.2).
- **`cancel_audit(audit_id)`:** works on the user's own queued or running audit. A queued audit is cancelled immediately through the finish rules.
- **`queue_position(audit_id)`.**
- **Tests:**
  - pgTAP for every rule, `retry_after`, bypass logging, cancel, and the return and release rules;
  - a Vitest script with parallel connections proving that L7 and L10 can't be exceeded.

### T11 · Worker-side database functions (`worker-sql`)
**Goal:** The SQL functions the worker calls during an audit.
**Read:** DB §3.2 (`site_reservations`), §3.4 (`audits`), §6.2 · PRD §12.2 (Redirects), §12.3 (Notes) · Tech §6.3.
**Scope:**
- **`mark_crawler_touched`.**
- **`reserve_final_site`:**
  - Phase 1 rules: L12 and L7 for the final key;
  - when they block: fail the audit, release with `final_host_blocked`, and return the credit.
- **`sweep_stale_audits`:** after 3 minutes without a heartbeat, the audit becomes `partially_completed` if it has scanned pages, or `failed` with `WORKER_INTERRUPTED`. It goes through `finish_audit`.
- **Tests:** pgTAP for each function.

### T12 · Worker skeleton: dispatcher, queues, heartbeat, cancellation (`worker-skeleton`)
**Goal:** A worker that picks up audits and walks through stub stages end to end.
**Read:** Tech §2, §5 (Connections), §6.1, §6.3, §6.4, §12 · DB §3.9, §6.2, §7 (deleting files), §8 (`sweep_stale_audits`, `queue.reconcile`).
**Scope:**
- **Basics:**
  - env config (Zod), pino JSON logs;
  - a `pg` pool on the session pooler, and a supabase-js service client for Storage;
  - a settings loader that `WORKER_CONCURRENCY` can override.
- **Queue:**
  - pg-boss;
  - the outbox dispatcher: LISTEN plus a 10 s poll, moving rows into pg-boss with their priority and singleton key, then setting `dispatched_at`;
  - schedules for `sweep_stale_audits` and `queue.reconcile`.
- **`audit.run` framework:**
  - a stage runner that writes `audit_stages`, with its progress and the statuses `pending`, `running`, `completed`, `failed`, `skipped` and `cancelled`;
  - moves the audit from `queued` to `running` and keeps `current_stage` up to date;
  - a heartbeat every 15 s;
  - checks for cancellation every 2 s, through an AbortController;
  - helpers for the deadlines at minutes 11, 14 and 15;
  - error classes and a retry-once helper.
  - **The stages are no-op stubs** that end with `finish_audit`.
- **Other:**
  - the `storage.cleanup` job handler;
  - `GET /healthz`;
  - graceful shutdown.
- **Tests:** the dispatcher and stage runner against local Supabase; unit tests for the retry helper.

**Not in this task:** real stages, the Docker image (T48).
**Done when:** the steps for each of these are documented in the PR:
- a `start_audit` call runs to `completed`;
- cancelling stops it within 10 s;
- a killed worker's audit is swept after 3 minutes.

### T13 · Quick audit box and start-audit action (`quick-audit`)
**Goal:** Users start an audit from a URL and a mode.
**Read:** PRD §4 (journey 2), §5, §12.1, §16.1 · DB §6.1 ("Before calling it") · Tech §4.2, §7.1 · UI-rules §6.2, §7.7, §9.1, §9.2.
**Scope:**
- **The Server Action**, in this order:
  1. `requireUser`;
  2. Zod validation (`https://` is added when the user leaves it out);
  3. normalization and the site key;
  4. the SSRF DNS pre-check;
  5. find the website by `(user, site_key)`, or pass null;
  6. call `start_audit` with the service role;
  7. map each error code to the exact UI-rules §9 message, with `[date]` and `[time]` filled in;
  8. redirect to `/audits/[id]`.
- **The quick audit dialog** (opened from the top bar's New audit) and a card variant for Overview:
  - the URL field and the Single page / Whole site control (default: Whole site);
  - the Client picker, shown only for a new website;
  - Start audit;
  - full screen below `sm`.
- **Tests:** unit tests for the error mapping and message formatting.

**Done when:** an existing website is reused by its site key, a new one is created, and the error messages match UI-rules §9.

### T14 · Audit progress view, live updates, cancel (`progress-view`)
**Goal:** The live progress screen for queued and running audits.
**Read:** PRD §4 (journey 3), §15 · UI-rules §6.4 (progress view), §7.3 (AuditStatusBadge), §7.11, §8 (Queue), §12 · Tech §4.4 · DB §4 (Realtime).
**Scope:**
- **`/audits/[id]` while queued or running:**
  - the header and the **AuditStatusBadge** (built here and reused later);
  - the queue line: "2nd in line · about 10 minutes", from `queue_position` and the rolling median duration, plus the worker-offline message;
  - the 12-stage tracker;
  - "Pages: x of 10" and the elapsed time;
  - Cancel audit with a confirmation dialog;
  - the "You can leave this page" note and a polite `aria-live` region.
- **Live updates:** Realtime on `audits` and `audit_stages`. If it isn't connected within 5 s or drops, poll every 5 s.
- **When the audit finishes:** switch to the results route (a placeholder until T34).

**Done when:** with the stub worker, the view updates live and survives a reload; cancel works within 10 s; the polling fallback is verified.

### T15 · Check framework: catalog types, severity, result writer (`check-framework`)
**Goal:** The contracts every check task builds on.
**Read:** PRD §7 (intro: levels, applies-to, page types), §8.1, §8.6, §10.1 · DB §1 (check definitions in code), §3.4 (`check_results`) · Tech §6.2 step 4, §9.
**Scope:**
- **`core/catalog`:**
  - the `CheckDefinition` type: key, category, scope, tier, severities by outcome, scored flag, UX confidence, applies-to, texts;
  - the registry for method version `2026.1`;
  - the page-type groups (C, Content, F).
- **Snapshot types:** `PageSnapshot` (per device) and `SiteSnapshot`, covering everything the checks need. Later tasks fill and extend them.
- **Check function signature:** `(snapshots, context) → results`, each with `result`, `level`, `scored`, `measured` and `evidence`.
  - The context includes the mode, the page types, the indexing intents and the scanned pages.
- **Severity engine (PRD §8.6)**, with unit tests that include the H1 example.
- **Worker:** a generic category-stage runner that writes `check_results`.
  - It applies the severity and snapshots the tier and credit.
  - Passed checks store no evidence.
- **Tests:** unit tests with fixture snapshots.

### T16 · Safe HTTP client, robots.txt, sitemaps (`http-robots-sitemap`)
**Goal:** All non-browser HTTP to audited sites goes through one SSRF-safe client.
**Read:** PRD §6.3 (robots.txt), §6.4, §6.5, §7.1 (rows `seo.robots_txt`, `seo.sitemap_available`, `seo.sitemap_valid`) · Tech §6.2 (initialization, network checks), §6.3 (Retries), §6.4, §7.1 (layers 3 and 6), §7.3.
**Scope:**
- **HTTP client (undici):**
  - the lookup is pinned to `safeLookup`;
  - manual redirects (at most 5), with every hop checked again;
  - timeouts and the 10 MB cap;
  - a HEAD-then-GET helper;
  - the user agent `<Chrome UA> SiteLensBot/1.0 (+<NEXT_PUBLIC_APP_URL>/bot)`;
  - retry-once for temporary errors, and the Tech §6.4 error codes.
- **robots.txt:**
  - parsing with `robots-parser`: `SiteLensBot` rules first, then `*`, and Googlebot for `seo.robots_allowed`;
  - Crawl-delay (at most 10 s);
  - status classes, the 500 KiB size, and invalid-file detection.
- **Sitemaps:**
  - found through robots.txt or `/sitemap.xml`;
  - index files followed up to 5 files and 50,000 URLs; gzip supported;
  - the facts `seo.sitemap_valid` needs.
- **Output:** fill those parts of `SiteSnapshot`.
- **Tests:** a local test server covering redirects, a redirect hop to `127.0.0.1` blocked outside test mode, and robots and sitemap fixtures.

### T17 · Browser rendering and capture (`rendering`)
**Goal:** Load a page safely in Chromium and capture its response, screenshot and HTML.
**Read:** Tech §6.1 (Browser), §6.2 step 3 (Loading, Files, login walls, certificate errors, progress), §7.1 layer 4, §7.2 · PRD §6.3 (login walls, bot protection), §6.4 · DB §3.4 (`pages`, `screenshots`, `artifacts`), §7.
**Scope:**
- **Chromium lifecycle:**
  - one Chromium per process, restarted after 20 audits or a crash;
  - a fresh context per page and device;
  - desktop is 1440×900 at DPR 1; mobile is 390×844 at DPR 2, with touch and a mobile user agent;
  - no downloads, permissions denied, dialogs dismissed, pop-ups closed, service workers blocked, `ignoreHTTPSErrors`.
- **SSRF interception:** `page.route` with a resolver cached per audit.
- **Navigation:**
  - a 30 s timeout, `load`, then up to 5 s of network idle;
  - lazy-load scrolling for at most 10 s.
- **Capture:**
  - the main response (status, headers, raw HTML up to 10 MB) and the redirect chain;
  - the cookies, failed resources and mixed-content requests.
- **Login walls and bot protection:** detected and marked `failed` with their reason. They are never bypassed.
- **Files:**
  - a full-page screenshot capped at 16,000 CSS px, converted to WebP quality 75 with `sharp`, uploaded to Storage, with its `screenshots` row (`retain_until` +90 days, `truncated`);
  - the rendered HTML, gzipped, in Storage with an `artifacts` row.
- **Concurrency:** 2 page loads at once per audit, 4 per process.
- **Tests:** local fixture pages.

**Not in this task:** DOM extraction (T18), axe (T19), discovery (T20).

### T18 · DOM data extraction (`extraction`)
**Goal:** Collect everything the SEO, Technical, UX and technology-detection code needs from a rendered page.
**Read:** PRD §6.2 (navigation and main links), §7.1, §7.4 (page-level rows and technology detection), §7.5 · Tech §6.2 step 3 (Data collection).
**Scope:** a `page.evaluate` extractor per device, plus parsing of the raw HTML with parse5. It collects:
- **Head:** titles; meta tags (description, robots, viewport, charset, `og:*`, generator); canonicals.
- **Structure:** headings; the doctype; duplicate IDs; DOM size; parse errors; content outside `head` and `body`.
- **Links:** `href`, text, `rel`, region (header, nav, main, footer), crawlability and `role`.
- **Images:** alt, declared size, natural and rendered size, transfer size.
- **Forms:** fields, labels, placeholder-only labels, required markers.
- **Content:** the main text with word and paragraph counts; the language (`lang` attribute and the text); schema.org types.
- **UX inputs:** the computed body font size; line length; first-viewport candidates (CTA, headline, bounding boxes); fixed and overlapping elements.
- **Site signals:** contact details, the privacy link, trust and business-info markers, video captions.
- **Technology signals:** script URLs, globals, the generator tag.

**Tests:** HTML fixtures compared against expected extraction output.

### T19 · axe and interactive browser checks (`axe-browser-checks`)
**Goal:** Run axe and the browser-only checks on each page and device.
**Read:** PRD §7.3, §7.5 (`ux.mobile_nav`, `ux.horizontal_scroll`, `ux.overlap`, `ux.interstitial`) · Tech §6.2 step 3.
**Scope:**
- **axe:** `@axe-core/playwright` with a pinned version, recorded as the axe version. Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`.
- **Extra checks:**
  - focus visibility on the first 20 focusable elements;
  - reflow at 320 px;
  - visible markers on required fields;
  - captions on videos.
- **Mobile only:**
  - horizontal overflow at 390 px;
  - an overlay covering more than half the viewport on load;
  - whether the menu toggle opens and the navigation is reachable.
- **Output:** results go into `PageSnapshot`.
- **Tests:** fixture pages.

### T20 · Initialization, discovery, crawl orchestration (`discovery-crawl`)
**Goal:** Real `initialization`, `discovery` and `crawling` stages.
**Read:** PRD §6.1, §6.2, §6.3, §6.4, §12.2 (Redirects), §15 · Tech §6.2 steps 1–3, §6.3 · DB §3.4 (`pages`), §6.2.
**Scope:**
- **`initialization`:**
  - re-check the URL with the SSRF guard (`UNSAFE_URL`: the audit fails and its reservations are released);
  - `mark_crawler_touched` before the first request;
  - follow the first redirect and store the final URL and site key;
  - call `reserve_final_site` when the hostname changed;
  - set `websites.final_hostname` on the first audit;
  - fetch robots.txt;
  - record the method, crawler and axe versions.
- **`discovery`** (whole site):
  - a pure selection function in `packages/core`: the PRD §6.2 order, the filters, parameter variants, canonical swaps that don't use a slot, robots.txt exclusions (never for the entered URL), at most 10 pages;
  - worker wiring that renders the homepage;
  - **every** discovered URL is written to `pages` with its outcome, including `not_scanned_limit`.
- **`crawling`:**
  - render the selected pages on both devices with T17–T19, respecting Crawl-delay;
  - update "x of 10" and set `first_page_done_at`;
  - when the homepage is unreachable or bot-protected, the audit fails;
  - single-page mode skips discovery.
- **Tests:** unit tests for the selection function (PRD §16.1 Crawling) and a worker run against local fixture pages.

### T21 · Network checks: links, TLS, redirects, host variants (`network-checks`)
**Goal:** Collect the site-level network facts for the SEO and Technical checks.
**Read:** PRD §6.4 (link limits and results), §7.1 (link rows), §7.4 (`tech.availability` through `tech.certificate_expiry`) · Tech §6.2 step 4 (Network checks) · DB `link_checks`.
**Scope:**
- **Link checker:**
  - at most 300 internal and 200 external URLs;
  - HEAD, then GET when needed; 10 s timeout; at most 5 redirects;
  - at most 2 requests at once per external host;
  - retries and outcomes as in the PRD §6.4 table;
  - writes `link_checks` rows with `found_on`.
- **TLS probe:** connect with SNI and record `authorized`, the issuer and the expiry date.
- **Other probes:** `http://` to `https://`, the `www` and non-`www` variants, and redirect-chain facts.
- **Output:** fill `SiteSnapshot`.
- **Tests:** local servers, including a self-signed certificate.

### T22 · SEO checks 1: titles, meta, canonicals, indexing, robots, sitemap (`seo-checks-1`)
**Goal:** The first half of the SEO catalog, wired into the `seo` stage.
**Read:** PRD §5 (indexing intent), §7 intro, §7.1 (rows `seo.title_present` to `seo.in_sitemap`, and the 10 scored checks) · UI-rules §14.
**Scope:** pure check functions, catalog entries and **drafted texts** for:
- `seo.title_present`, `title_length`, `title_unique`;
- `description_present`, `description_length`, `description_unique`;
- `canonical_present`, `canonical_valid`, `canonical_consistency`;
- `open_graph`;
- `h1_single`, `headings_empty`, `heading_hierarchy`, `heading_length`;
- `indexable`, `robots_allowed`, `robots_txt`;
- `sitemap_available`, `sitemap_valid`, `in_sitemap`.

Every level, scored flag, `not_applicable` and `unable_to_verify` rule and indexing-intent mark from PRD §7.1 is implemented, and the `seo` stage is wired up.
**Tests:** every outcome of every check.

### T23 · SEO checks 2: links, images, content (`seo-checks-2`)
**Goal:** The rest of the SEO catalog.
**Read:** PRD §6.4 (link results), §7.1 (rows `seo.internal_links_broken` to `seo.readability`), §10.2.
**Scope:** check functions, catalog entries and drafted texts for:
- **Links:** `internal_links_broken`, `external_links_broken`, `internal_links_redirect`, `links_crawlable`, `anchor_text`, `orphan_pages`.
- **Images:** `img_alt_missing`, `img_alt_quality`, `img_dimensions`, `img_oversized`, `img_format`.
- **Content:**
  - `content_thin`;
  - `content_duplicate` (similarity: Warn at 90% or more, Info at 80–89%);
  - `content_repetition`, `content_structure`;
  - `readability` (Flesch, English only).
- **Cross-category link:** a marker linking `seo.img_alt_missing` to `a11y.image-alt`, used by T31.

**Tests:** every outcome of every check.

### T24 · Technical & Security checks (`tech-checks`)
**Goal:** All 27 `tech.*` checks, wired into the `technical_security` stage.
**Read:** PRD §7.4 (the table, header and cookie sources, the critical rule) · UI-rules §9.3.
**Scope:**
- Pure check functions, catalog entries and drafted texts.
- **Headers** come from the homepage (or the entered URL in single-page mode). Pages with different headers are listed in the evidence.
- **Cookies:** only the ones observed while loading pages.
- **Mixed content:** active is critical, passive is medium.
- **Broken resources:** first-party is medium, third-party is low.

**Tests:** every outcome of every check.

### T25 · Technology detection (`tech-detection`)
**Goal:** Informational technology detection.
**Read:** PRD §7.4 (Technology detection) · DB `technologies`.
**Scope:**
- **Signatures:** about 50 technologies, matched on headers, cookies, the generator tag, script URLs and JavaScript globals.
- **Results:** name, version, confidence and evidence, written to `technologies`.
- No issues and no score impact.
- **Tests:** fixture signal sets.

### T26 · Accessibility checks (`a11y-checks`)
**Goal:** Turn axe results into `a11y.*` check results.
**Read:** PRD §7.3, §8.1, §10.2 · UI-rules §9.3.
**Scope:**
- **Scored rules:** only rules tagged WCAG A/AA are scored. The axe impact sets the tier and severity.
- **Combining devices:**
  - a rule fails if it fails on either device;
  - the same element on both devices counts once, tagged with both;
  - a rule passes only if it passes on both, and is `not_applicable` if it applies on neither.
- **Manual-review findings** (unscored): best-practice rules, `incomplete` results, and `a11y.focus_visible`, `reflow`, `required_indication` and `media_captions`.
- **Catalog:** entries and drafted texts for the axe rules in scope (about 50) and the extra checks.
- **Stage:** wire up the `accessibility` stage.
- **Tests:** recorded axe fixtures.

### T27 · Performance: PageSpeed, CrUX, perf findings (`performance`)
**Goal:** Lab and field performance data, plus the `perf.*` findings.
**Read:** PRD §7.2, §8.2 (Performance), §8.4 · Tech §6.2 step 5, §6.4, §12 (call counts) · DB `performance_runs`, `crux_snapshots`, `artifacts`, §7.
**Scope:**
- **PageSpeed client:**
  - Performance category only, mobile and desktop, with the API key;
  - 90 s timeout, 4 calls at once, one retry; `PSI_QUOTA`;
  - the raw JSON is gzipped into an artifact;
  - metrics are extracted and the Lighthouse version is recorded.
- **CrUX client:**
  - URL and origin, on phone and desktop;
  - a 404 means `no_data`;
  - at most 150 calls per minute;
  - `CRUX_FAILED` doesn't make the audit partial.
- **Stage:** `performance` starts right after discovery and runs alongside crawling.
- **Findings:**
  - the `perf.*` thresholds;
  - the mapping from Lighthouse diagnostics to `perf.opportunity` findings, in `packages/core` with its Lighthouse version.
- **Page scores:** 0.6 × mobile + 0.4 × desktop, with the "Partial" flags.
- **Tests:** recorded fixtures, which need the owner's key to record (OW2).

### T28 · Page classification rules (`page-classification`)
**Goal:** Every scanned page gets a page type.
**Read:** PRD §5 (page-type corrections), §7 (Page types) · DB `pages` (`page_type*`), `page_type_overrides` · Tech §6.2 step 3 (Page type).
**Scope:**
- A rule-based classifier in `packages/core`: URL patterns, schema.org types, content signals and the root path. It returns a type and a confidence.
- An override in `page_type_overrides` always wins (source `user_override`).
- When the rules aren't confident, it returns a "not confident" marker. T43 wires the Haiku fallback to it.
- **Tests:** unit tests.

### T29 · UX & Conversion automated checks (`ux-checks`)
**Goal:** All 20 automated `ux.*` checks, wired into the `ux_automated` stage.
**Read:** PRD §7.5 A–B, §8.2 (UX & Conversion), §8.6 (conversion pages).
**Scope:**
- Check functions with their confidence levels, catalog entries and drafted texts.
- Checks that run on both devices take the worse result and show both in the evidence.
- Site-level checks and the per-page-type applies-to rules are implemented.

**Tests:** every outcome of every check.

### T30 · Scoring engine and scoring stage (`scoring`)
**Goal:** Deterministic scores exactly as PRD §8 describes.
**Read:** PRD §8 (all), §15 · DB §3.6, `audits.coverage` · Tech §6.2 steps 7–8, §9.
**Scope:**
- **`core/scoring/v2026_1.ts`:**
  - credits and advisory exclusion; site-level and page-level points;
  - the category formulas: Performance is the average of page scores, and UX is automated-only in Phase 1;
  - caps with the indexing-intent exceptions and their display reasons;
  - coverage and the 60% rule;
  - the overall score, which needs 3 categories including SEO or Performance, with re-normalized weights and the Provisional flag;
  - rounding half up, and the bands.
- **Worker:**
  - the in-memory scoring call used before AI;
  - the `scoring` stage writes score revision 0, `page_scores` and `audits.coverage`.
- **Tests:**
  - the PRD §8.5 worked example;
  - the advisory guarantee from PRD §16.1;
  - every cap, the coverage edge cases and rounding.

### T31 · Issue identity and lifecycle engine (`issues-engine`)
**Goal:** Pure code that turns an audit's results into issue changes.
**Read:** PRD §9.1 (the top-15 order), §10 (Phase 1 = automatic lifecycle only) · DB §3.5 · Tech §9.
**Scope:**
- **Findings:**
  - built from the check results;
  - grouped by check key and variant, with occurrences by page and element, plus devices and levels;
  - informational results are left out; manual-review results are included;
  - related-issue links between categories.
- **Changes:**
  - occurrences are resolved only on pages that were scanned and verified;
  - an issue is resolved when all its occurrences are;
  - single-page audits only touch their own page and site-level checks;
  - cancelled audits change nothing;
  - severity is recalculated;
  - system status events are recorded.
- **Ranking:** top-15 advice ranking (severity, then tier, then pages affected).
- **Leave room for Phase 2:** manual statuses, ignored, reopened and verified are added later.
- **Tests:** sequences of fixture audits (PRD §16.1 Issues).

### T32 · Finalization stage (`finalization`)
**Goal:** Close an audit correctly and apply issue changes atomically.
**Read:** PRD §15 · DB §3.3 (`websites.latest_*`), §3.5, §3.8 (`notifications`), §6.2 · Tech §6.2 step 9, §6.3.
**Scope:**
- **One transaction:**
  - `audit_findings` and their occurrences, with `is_new` and `advice_rank`;
  - the lifecycle changes from T31;
  - `websites.latest_*` for whole-site audits that have an overall score.
- **Final status:** `completed`, `partially_completed` (including `AUDIT_TIME_LIMIT`), `failed` or `cancelled`. Cancelled audits keep their results but get no scores and no issue changes.
- **Then:**
  - call `finish_audit`;
  - add a notification row.
- **Tests:** two consecutive fixture audits; the second auto-resolves fixed occurrences.

### T33 · Result UI components (`result-components`)
**Goal:** The shared components every results screen uses.
**Read:** UI-rules §3.5, §7.1–§7.4, §7.10, §8, §12, §14.
**Scope:**
- **ScoreGauge:**
  - sizes, "Insufficient data", the Provisional and Capped chips;
  - `role="img"` with its accessible name;
  - reduced motion respected.
- **Badges:** ScorePill; the Severity, Result, IssueStatus, Level (with tooltips) and Confidence badges; the AI-generated, New and Regression chips.
- **Other components:**
  - the category score card;
  - evidence blocks: measured value against the threshold, a selector with an escaped snippet (expand and copy), the resource, device tags. **Never rendered as live HTML;**
  - the limitation and partial-result banners.
- **Icons:** choose the Hugeicons for each badge.
- **Tests:** bands, labels, accessible names and snippet escaping.

### T34 · Results header and Overview tab (`results-overview`)
**Goal:** The first results screen users see.
**Read:** PRD §8.3, §8.4, §11.1 · UI-rules §6.5 (header, Overview tab), §8, §9.2, §9.3 · Tech §4.1, §4.3.
**Scope:**
- **Layout:** the results layout with the 5 tab routes from Tech §4.1, and breadcrumbs.
- **Header:**
  - the website, date, mode, status and method version;
  - **Re-run** (same website and mode);
  - Share, PDF and Compare stay hidden until Phase 2;
  - the partially-completed banner, plus the failed and cancelled states.
- **Overview tab:**
  - the overall gauge (latest revision);
  - 5 category cards with coverage and SEO level counts that link to Issues;
  - findings by severity, and the passed-check count;
  - the top 10 issues;
  - the pages-scanned summary;
  - the limitations panel with the accessibility disclaimer;
  - audit details.
- AI cards come in T45.

### T35 · Issues tab and global Issues list (`issues-list`)
**Goal:** Browse and filter findings.
**Read:** PRD §10.1, §10.2, §11.1 · UI-rules §6.5 (Issues tab), §6.7, §7.5, §7.13.
**Scope:**
- **Shared data table** (shadcn Table with TanStack):
  - sorting, faceted filters, 25 rows a page and a sticky header;
  - filters kept in the URL query;
  - each row's primary cell is a link;
  - stacked cards below `md`, and the no-results state.
- **Issues tab:**
  - columns as in UI-rules §6.5;
  - failures and warnings by default, with an Include recommendations toggle;
  - ignored issues hidden by a toggle.
- **`/issues`** across all websites, with website, client and date-range filters.
- Status is read-only in Phase 1.

### T36 · Issue detail (`issue-detail`)
**Goal:** Everything about one issue.
**Read:** PRD §10 · UI-rules §6.6, §7.10.
**Scope:**
- **`/issues/[id]` header:** title, severity, category, status (read-only), first and last detected dates, and the Regression chip.
- **Explanation:** the fixed texts.
- **Occurrences:** grouped by page in an accordion, with evidence blocks, devices and a link to the screenshot.
- **History:** a timeline of system status events.
- **Related issues:** e.g. "Also reported under Accessibility".
- The AI advice card comes in T45.

### T37 · Pages tab, page detail, screenshot viewer (`pages-tab`)
**Goal:** Per-page results and screenshots.
**Read:** PRD §5 (corrections, intentional noindex), §6.2 · UI-rules §6.5 (Pages tab), §7.9, §8 · DB §7 (signed URLs), `page_type_overrides`, `noindex_intents`.
**Scope:**
- **Pages tab:** every discovered URL, with its status, reason, type, 5 page scores and device flags.
- **Page detail** (`/audits/[id]/pages/[pageId]`):
  - **header:** the URL; the type, with a **Correct type** control that applies from the next audit; the language; the HTTP status;
  - page scores;
  - checks grouped by category with level badges, and a separate Info group;
  - **Mark as intentionally noindex** on noindex pages.
- **Screenshot viewer:**
  - a desktop/mobile toggle; signed URLs; lazy loading;
  - zoom (fit width or 100%);
  - the truncation and retention messages, and the alt text;
  - room for markers in Phase 2.
- The AI section comes in T45.

### T38 · Performance and Technical tabs (`perf-tech-tabs`)
**Goal:** The two remaining result tabs.
**Read:** PRD §7.2, §7.4 · UI-rules §6.5 (Performance tab, Technical tab), §8, §9.3, §14.
**Scope:**
- **Performance tab:**
  - a per-page table: mobile, desktop and combined scores, LCP, CLS, TBT, and the Partial flag;
  - opportunities grouped across pages and sorted by savings;
  - the CrUX panel:
    - page and site data, with phone and desktop tabs;
    - p75 values against their thresholds, including INP, and the collection period;
    - the no-data text and the "doesn't affect the score" note;
    - INP is never shown from lab data.
- **Technical tab:** the UI-rules §6.5 panels: availability and redirects, HTTPS and certificate, headers, cookies, robots.txt, sitemap, technologies, and the discovered URLs.

### T39 · Website detail page (`website-detail`)
**Goal:** The complete `/websites/[id]`.
**Read:** PRD §5, §8.7, §10.4 · UI-rules §6.3 (detail page and Edit), §7.6 · Tech §4.1.
**Scope:**
- **Header:** hostnames (final and as entered), client, latest score and band.
- **Actions:** New audit (prefilled), Edit and Delete. Compare stays hidden until Phase 2.
- **Trend chart** of whole-site audits:
  - the overall score plus category lines that can be toggled;
  - band guide lines;
  - a text alternative and a "View as table" toggle.
- **Audit history:** tabs for Whole site and Single page.
- **Open issues** summarized by category.
- **Editable lists:** page-type corrections, and the intentionally-noindex list, placed as UI-rules §6.3 describes.

### T40 · Audits list, notifications, audit deletion (`audits-list`)
**Goal:** The audits list, in-app notifications, and deleting an audit.
**Read:** PRD §4 (journey 3), §5 · UI-rules §6.4 (list), §7.8, §7.12 · DB §3.8 (`notifications`), §6.3 (`delete_audit`).
**Scope:**
- **`/audits`** with filters for website, client, status, mode and date.
- **Notification bell:**
  - the unread list;
  - clicking opens the audit and marks it read;
  - new notifications arrive live;
  - a toast when the user's audit finishes.
- **Deleting an audit:**
  - the `delete_audit(id, confirm_hostname)` RPC, with pgTAP tests, queues `storage.cleanup`;
  - a typed-confirmation dialog, available from the list and the results header.

### T41 · Overview dashboard (`overview`)
**Goal:** The home screen after sign-in.
**Read:** PRD §11.1 · UI-rules §6.1, §7.6, §7.13.
**Scope:**
- The quick audit card (from T13).
- **Website cards:** a small gauge, a sparkline, the last audit date, and the open critical and high counts.
- **Recent audits** table.
- **The 10 newest open critical and high issues.**
- **Empty state.**
- No plan usage meter (Phase 3).

### T42 · AI wrapper, cost logging, cost views (`ai-wrapper`)
**Goal:** One safe, logged way to call Claude.
**Read:** PRD §9.1, §9.2, §9.4 · Tech §8 (not visual analysis), §12 (Cost) · DB §3.7 (`ai_runs`), §3.8 (`ai.models`, `ai.prices`), §7. Use the current Claude API reference for SDK calls.
**Scope:**
- **`core/ai` `runAiTask(task, input, ctx)`:**
  - the model comes from `settings`; versioned prompt templates;
  - structured output (JSON schema, or one tool when the model doesn't support it), validated with Zod, with one repair attempt;
  - one retry on 429, 5xx or timeout, respecting `retry-after`; timeouts;
  - prompt caching;
  - a semaphore: 3 calls at once per audit, 6 per worker.
- **Logging:**
  - an `ai_runs` row for each call: tokens including cache, cost from `ai.prices`, latency, attempt, bucket (from `plan_at_start`) and status;
  - the request and response gzipped as artifacts for 90 days.
- **`validate.ts`:** quote checks, number checks, `section_ref` checks, and dropping duplicates of deterministic findings.
- **Cost views:** `v_audit_costs` and `v_monthly_costs`, service role only.
- **Tests:** a mocked SDK.

**Not in this task:** the L8 budget (Phase 3). The bucket is recorded now.

### T43 · AI page classification fallback and content analysis (`ai-content`)
**Goal:** The `page_type_classification` and `page_content_analysis` tasks.
**Read:** PRD §7 (Page types), §9.1, §9.2 · Tech §6.2 steps 3 and 6, §8 (Input size) · DB `ai_page_analyses`.
**Scope:**
- **Page classification:** a Haiku prompt (v1) and schema, wired into T28's "not confident" path.
- **The `ai_content` stage:**
  - a page-analysis prompt (v1) and schema, using the §9.2 finding shape;
  - rewrites are suggested only where the related check didn't pass;
  - alt-text suggestions say they're based on the file name and context;
  - quotes are validated, and duplicates of deterministic findings are dropped;
  - results go to `ai_page_analyses`.
- **`ai_status` handling:** if AI fails, the audit is still `completed`.
- **Tests:** mocked responses.

### T44 · Finding advice, executive summary, AI retry (`ai-summary`)
**Goal:** The `ai_explanations` stage and the one-time AI retry.
**Read:** PRD §9.1, §9.2, §9.4 · Tech §6.2 step 7, §6.3 (Time budget), §8 · DB §5 (AI retry exception), §6.3 (`retry_ai`), `ai_summaries`, `ai_advice`.
**Scope:**
- **`finding_advice`** for the top 15 findings (Sonnet), written to `ai_advice`.
- **`executive_summary`** (Opus): ready to forward to a client, with 3–5 priorities and strengths.
  - Numbers are validated: the summary is regenerated once with feedback, then sentences with unverified numbers are removed.
  - It's written to `ai_summaries`.
- **AI retry:**
  - the `retry_ai(audit_id)` RPC, usable once, with pgTAP tests;
  - the `audit.ai_retry` job re-runs only the AI tasks that failed, and freezes the results.
- **Tests:** mocks.

### T45 · AI in the interface (`ai-ui`)
**Goal:** Show the AI output where UI-rules places it.
**Read:** UI-rules §6.5 (AI summary card, AI section of page detail), §6.6 (AI advice card), §7.3 (chips), §8 (AI unavailable, low confidence), §9.3, §12 (language attributes).
**Scope:**
- The summary card on Overview.
- **The "AI unavailable" banner** with Retry AI, usable once, and the text shown after that retry fails.
- The AI advice card on issue detail, and the AI icon on top issues.
- **Page detail:** AI observations with confidence badges, a lower-confidence group, and rewrite suggestions with copy buttons. Quotes are wrapped with their own `lang` attribute.

### T46 · Fixture site and pipeline integration test (`integration-test`)
**Goal:** Prove the whole pipeline works and keep it working in CI.
**Read:** Tech §7.1 (layer 6), §13 · PRD §16.1 (Issues), §16.2 (Phase 1).
**Scope:**
- **`fixtures/sample-site`:** the known problems from Tech §13, plus a "fixed" variant for a second audit.
- **Setup:** served on localhost with `NODE_ENV=test` and the allowlist; recorded PageSpeed, CrUX and Claude fixtures.
- **Test:** a full pipeline run against local Supabase that checks the expected check results, findings and scores. A second run checks that fixed occurrences are resolved automatically.
- **CI:** a job that installs Chromium.

### T47 · Model comparison script, O7 (`model-compare`)
**Goal:** A script so the owner can choose the summary model.
**Read:** PRD §9.1 (Choosing models), §17 (O7) · Tech §8, §16.
**Scope:**
- A worker script that takes 3 audit IDs and runs `executive_summary` with Sonnet and with Opus on the same input.
  - It goes through the wrapper, with the `admin` bucket, logged in `ai_runs`.
- It writes a side-by-side markdown file with the outputs, tokens, cost and latency.
- The `visual_analysis` comparison waits for Phase 2.
- **Tests:** mocks only.

### T48 · Worker Docker image and deployment runbook (`deploy`)
**Goal:** Everything the owner needs to deploy Phase 1. Agents run nothing against hosted services.
**Read:** Tech §2 (Worker hosting), §5, §7.2, §14, §15 · DB §9 (Migrations).
**Scope:**
- **Worker `Dockerfile`:**
  - Node 26 and Chromium, following T00's decision;
  - the non-root `pwuser`, the Chromium sandbox on, and the recommended seccomp profile;
  - a health check on `/healthz`.
- **`docker-compose.yml`** for the local worker, with a 2–4 GB memory cap.
- **Vercel settings:** root `apps/web`, region `fra1`, Node 26.
- **`tasks/deploy-phase1.md`:** the owner's exact steps for OW5:
  - `supabase link` and `db push`;
  - the Vercel env vars;
  - the SQL that sets the owner's role to admin;
  - running the worker container against the hosted pooler;
  - a smoke test.

### T49 · Crawler info page and landing skeleton (`bot-landing`)
**Goal:** The `/bot` page and the frame the landing page will be designed in.
**Read:** PRD §6.3 (robots.txt), §6.5, §17 (O3, O6) · UI-rules §2, §4, §6.14, §12, §13 · Tech §4.1.
**Scope:**
- **`/bot`:**
  - what the crawler does, and that it only reads pages;
  - how robots.txt is handled, including the entered-URL exception and Crawl-delay;
  - how to ask to be excluded;
  - the user agent string.
- **Landing skeleton at `/`:**
  - a header with the wordmark and the **Sign in** button;
  - a footer with a link to `/bot`;
  - empty section containers;
  - metadata.
  - No marketing copy; the owner designs the sections later.
- **Ask the owner:**
  - the contact address for exclusion and removal requests;
  - whether signed-in users who visit `/` are redirected to `/overview`.

---

## 6. Phase 2 outline (to be broken into cards after Phase 1)

Order from Tech §17:
1. **Manual issue statuses and history:**
   - `set_issue_status`, notes and the status control;
   - the ignored, reopened, regression and verified rules in `core/issues`.
2. **Comparing audits and trends:** the compare page, the method-change notice, and the Compare action.
3. **Public reports:** `create_public_report`, `/r/[token]`, `ReportView`, the Reports page, caching, `retain_until`.
4. **PDF and branding:** the print route, the `report.pdf` job, `pdf_exports`, and branding settings with logo upload.
5. **Visual analysis:**
   - `start_visual_analysis` and the `visual.run` job;
   - screenshot slicing and the criteria;
   - UX score revisions and the UI;
   - the visual-analysis half of O7.

## 7. Phase 3 outline (to be broken into cards later)

Order from Tech §17:
1. Admin page.
2. **Free plan rules:**
   - L1–L6, L8, L9 and L11 in `start_audit` and `reserve_final_site`, plus Turnstile;
   - remove `ALLOWED_EMAILS`;
   - close the website-limit RLS gap noted in T09.
3. Stripe Pro, `/upgrade` and billing settings.
4. Domain, Resend, email/password sign-in with disposable-email blocking, the "audit ready" email and notification settings.
5. Demo publishing and `/demo`.
6. GDPR export and deletion, the retention jobs, and the legal pages.
7. Supabase Pro, the container host with egress rules, and Sentry.
8. The launch checklist.
