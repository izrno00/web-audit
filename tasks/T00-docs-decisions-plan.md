# T00 · Record Q&A decisions and commit the baseline (`docs-decisions`): plan

**Status:** executed 23 Nov 2026 · baseline `7e36932` on `main` · doc changes in PR #1 (`t00-docs-decisions`)
**Note:** this plan was written **after** the work. For T00 the owner skipped the separate planning step (decision 3): the 12 answers below served as the plan. This file completes the record, so every task has a plan file (Tasks.md §1).

---

## Context

The four docs were approved on 22 Nov 2026 but weren't on `main` yet, and the 23 Nov 2026 decisions weren't in them yet:
- Node 26;
- the sign-in allowlist;
- the `start_audit` phase split;
- O8, O7 and the landing page.

T00 puts the docs on `main` and records those decisions, so later tasks build on docs that agree with each other, starting with T01 ([T01-monorepo-plan.md](T01-monorepo-plan.md)).

**Read:** AGENTS.md · PRD §2, §17 · DB §6.1, §9 · Tech §1, §3, §4.2, §7.1, §7.2, §13, §14, §15, §17 · UI-rules §6.15, §9.

## Owner decisions (23 Nov 2026)

| # | Question | Decision |
|---|---|---|
| 1 | The docs are in `docs/`, but AGENTS.md, Tech §3 and Tasks.md said "repository root" | **Keep them in `docs/`.** Update AGENTS.md, Tech §3 and Tasks.md |
| 2 | Commit the baseline straight to `main` and push? | **Yes.** Commit and push |
| 3 | Write a plan file before executing T00? | **No.** The answers serve as the plan (this file is written afterwards) |
| 4 | Line endings (LF vs CRLF on Windows) | **Add `.gitattributes`** (`* text=auto eol=lf`) in the baseline |
| 5 | `ALLOWED_EMAILS` empty or not set | **Nobody can sign in** (fail closed) |
| 6 | How emails are matched | **Exact, ignoring case:** trim spaces and lowercase. No Gmail normalization, no domain entries |
| 7 | Free-plan allowlisted users aren't limited by L1 until Phase 3 | **Accept it** and document it as a Phase 1–2 risk |
| 8 | Wording of `EMAIL_NOT_ALLOWED` | **"This account doesn't have access to SiteLens yet."** |
| 9 | If Vercel doesn't support Node 26 | **Stop and ask** (it wasn't needed: Vercel supports Node 26) |
| 10 | Worker image base | **The official Playwright image with Node 26** |
| 11 | How the docs show the change | **v1.1** in the header plus a **change log** at the end of each changed doc |
| 12 | The 14 "Proposed — review" markers in PRD | **Keep them.** O8 records the acceptance for Phase 1 |

## Research

- **Vercel:** Node 26 is generally available on Vercel and is the default for new projects.
  - Sources: [Node.js 26 LTS is now Generally Available on Vercel](https://vercel.com/changelog/node-js-26-lts-is-now-generally-available-on-vercel) and [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
- **Playwright:** the `mcr.microsoft.com/playwright:v1.65.1-noble` tag exists in the MCR tag list.
  - Its Dockerfile (`utils/docker/Dockerfile.noble` at tag `v1.65.1`) has `ARG NODE_VERSION=26` and creates `pwuser`, so no separate Node install is needed.
  - Source: [Playwright Docker docs](https://playwright.dev/docs/docker).

## Files

- **Baseline (`7e36932`, `main`):**
  - **new:** `.gitattributes`;
  - **changed:** `.gitignore` (added `!.env.example`);
  - **committed for the first time:** `docs/` (the four docs), AGENTS.md, the preset files (`components.json`, `components/`, `lib/`, `app/`), `package.json`, `package-lock.json` and `tasks/Tasks.md`.
- **PR #1 (`796636c`):** `docs/PRD.md`, `docs/DB.md`, `docs/Tech.md`, `docs/UI-rules.md`, `AGENTS.md`, `tasks/Tasks.md`.

## Steps (as executed)

1. **Baseline:**
   - checked `.gitignore` (`.next/`, `node_modules/` and `.env*` were covered) and added `!.env.example`;
   - added `.gitattributes`;
   - staged with `git add --renormalize .`;
   - committed `7e36932` to `main` and pushed.
2. **Research:** checked Vercel and Playwright for Node 26 (see Research).
3. **Branch `t00-docs-decisions`, doc edits:**
   - **PRD:**
     - **§2:** the allowlist in the Phase 1 row, its removal in the Phase 3 row, and a note on the sign-in allowlist with the accepted risk (decision 7);
     - **§17 O8:** "Accepted for Phase 1 (23 Nov 2026); revisit with real audit data";
     - **change log.**
   - **DB:**
     - **§6.1:** "Delivered in two phases":
       - **Phase 1:** L7, L10, L12, the website limit, admin bypass logging and the outbox;
       - **Phase 3:** L1–L6, L8, L9 and L11, by replacing the function, with no data migration;
       - `reserve_final_site` follows the same split;
     - **§9:** the pgTAP limit tests follow the split;
     - **change log.**
   - **UI-rules:**
     - **§6.15:** what a non-allowlisted user sees;
     - **new §9.4 "Sign-in messages":** `EMAIL_NOT_ALLOWED`;
     - **change log.**
   - **Tech:**
     - **Node 26:** §1 (worker row plus a new Node.js row), the §2 diagram, §7.2 (the Playwright image ships Node 26), §13 (CI on Node 26 with `npm i -g pnpm`), §15 (Node 26 LTS, pnpm via `npm i -g pnpm`, Vercel Node 26.x);
     - **layout:** §3 (`docs/`, `tasks/`, `AGENTS.md`);
     - **allowlist:**
       - §4.2: the rules, fail-closed, where they are checked, removal in Phase 3;
       - §7.1(5): the accepted risk is now limited by the allowlist;
       - §14: the `ALLOWED_EMAILS` row;
       - §18: the SSRF risk row;
     - **build order:**
       - §17 M2: the `start_audit` split;
       - §17 M5: the O7 comparison is a script the owner runs;
       - §17 M6: agents build the landing skeleton and `/bot`, and the owner designs the sections;
       - Phase 3 item 2: the allowlist is removed;
     - **change log.**
   - **AGENTS.md:**
     - the docs were approved on 22 Nov 2026, replacing the "no application code before approval" rule;
     - links to `docs/`;
     - the reading rule: read the sections the card lists closely, and skim the rest;
     - a pointer to `tasks/Tasks.md`;
     - the open-items bullet reflects O8;
     - **the generated Next.js block is untouched.**
   - **Tasks.md:** the source-of-truth line points to `docs/`, and T00 is ticked.
4. Committed `796636c`, pushed and opened PR #1.

## Tests

None, because the task changes only docs. Consistency checks run instead:
- **Searches:**
  - no Node 22 or `corepack enable` references remain;
  - no links point to docs at the repository root;
  - every remaining L1–L13 mention describes the full product or Phase 3.
- **Headers:** every changed doc has a v1.1 header and a change log.

## Acceptance

- **PRD §16:** none directly. This task prepares the docs for the Phase 1 tasks.
- **Card "done when":**
  - the baseline is on `origin/main` ✔;
  - the PR is open ✔;
  - the four docs and AGENTS.md agree with each other ✔ (final once the owner merges PR #1).

## Assumptions (made during execution; the owner can veto them in PR #1)

- **`EMAIL_NOT_ALLOWED`** sits in a new UI-rules **§9.4 "Sign-in messages"** rather than in §9.1, because it isn't a limit message.
- **The allowlist is checked in two places:** in `/auth/callback`, and in the DAL guards. Taking an email off the list ends that user's existing sessions. The admin's email must be on the list too.
- **`reserve_final_site`** follows the split: Phase 1 re-checks L12 and L7, and L6 arrives in Phase 3.
- **Tech §7.2** keeps a fallback: install Node 26 on the same Playwright image if a pinned version ever ships an older Node.
- **Tech §15 and §18** were updated to match: Vercel Node 26.x and `ALLOWED_EMAILS` in the Vercel env vars; the SSRF risk is accepted while sign-in is limited to the allowlist.
- **The AGENTS.md "Respect open items" bullet** now says the "Proposed — review" defaults are accepted for Phase 1 (O8) and revisited with real audit data.

## Questions for the owner (approve in PR #1)

- The `EMAIL_NOT_ALLOWED` wording in UI-rules §9.4.
- The allowlist rules in Tech §4.2.

## Follow-ups

- The owner merges PR #1. It also carries [T01-monorepo-plan.md](T01-monorepo-plan.md) and this file to `main`.
- OW1: install pnpm (`npm i -g pnpm`) and Docker Desktop.
- T01 then starts with *"Execute tasks/T01-monorepo-plan.md."*
