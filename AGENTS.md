# Rules for coding agents

These rules apply to every agent working in this repository. Work runs task by task, following [tasks/Tasks.md](tasks/Tasks.md): a planning agent writes a plan file for one task, the owner approves it, and an executing agent implements it and opens a pull request. Tasks.md holds those steps, the definition of done, the standing decisions and every task card. This file holds the rules that apply to all tasks.

## Project documents

The owner approved all four documents on 22 Nov 2026, so implementation has started. They live in [docs/](docs/):

| File                                 | What it defines                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| [docs/PRD.md](docs/PRD.md)           | Product scope, phases, features, checks, scoring, AI rules, limits, acceptance criteria    |
| [docs/DB.md](docs/DB.md)             | Database schema, enums, access policies (RLS), database functions, storage, retention      |
| [docs/Tech.md](docs/Tech.md)         | Tech stack, architecture, audit pipeline, security, integrations, testing, deployment      |
| [docs/UI-rules.md](docs/UI-rules.md) | Design tokens, layout, screens, components, states, exact interface wording, accessibility |

## Order of authority

1. The four documents in `docs/`.
2. This file.
3. [tasks/Tasks.md](tasks/Tasks.md).
4. The approved plan file for the task (`tasks/TNN-<slug>-plan.md`).

A higher item never silently overrides a lower one. If two of them disagree, stop and ask the owner.

## Building to the documents

- **Treat the documents as the absolute truth** for the project's scope, tech stack, data model, architecture and interface. Follow them exactly. Don't rely on assumptions, defaults or general knowledge where the documents say something different.
- **Don't go beyond them.**
  - Don't add features, libraries, services, tables or screens that the documents don't describe.
  - Don't build anything listed as excluded (PRD.md §1) or anything planned for a later phase than the current one.
- **Change the documents first.** Any change to scope, stack, schema or interface must first be made in the relevant document and approved by the owner. Only then is it implemented. Don't edit `docs/` unless the task card says to. Code and documents must always agree.
- **Respect open items.** Items marked **OPEN** (PRD.md §17) are not decided until the owner confirms them. The **Proposed — review** defaults are accepted for Phase 1 (O8): use them as written. They are revisited with real audit data.

## Stop and ask, or decide yourself

**Stop and ask the owner**, instead of guessing, when:

- a request conflicts with the documents;
- the documents, this file, Tasks.md or the plan contradict each other;
- something you need isn't covered;
- a choice touches scope, the schema, the interface or its wording, limits, security, or another task. This includes finding during execution that reality contradicts the approved plan in one of these ways.

**Decide everything else yourself.** Internal function names, file splits within the layout Tech §3 defines, test structure and similar details aren't gaps in the documents. Choose conservatively and list notable choices in the pull request description.

## Next.js

The web app lives in `apps/web`. Before writing Next.js code, read [apps/web/AGENTS.md](apps/web/AGENTS.md) (maintained by `next dev`) and the relevant guide in `apps/web/node_modules/next/dist/docs/`. Those decide _how_ to use Next.js APIs. The four documents decide _what_ to build.

## Git and branches

- **One task = one branch = one pull request into `main`.** Branch name: `tNN-<slug>`, with the slug from the Tasks.md status table (e.g. `t02-tokens`). Work the owner asks for outside a task (such as a workflow fix) gets a short descriptive branch and its own pull request.
- **One task at a time.** Don't plan or execute a task while another task's pull request is open, unless the owner says so. A task also starts only when every task it depends on is merged into `main`.
- **Branch lifecycle:**
  1. **The planning agent creates the branch** before writing the plan file. First delete leftover local branches that are already merged (every name `git branch --merged main` lists except `main`) with `git branch -d <name>`. Then run:
     `git checkout main && git pull && git checkout -b tNN-<slug>`.
     The plan file is written on this branch and left uncommitted.
  2. **The executing agent works on the existing branch.** It never creates it again. If it isn't checked out, run `git switch tNN-<slug>`. If the branch or the plan file is missing, stop and tell the owner. The plan file and the code are committed together and go in the same pull request.
  3. **After the merge.** When the owner says "merged", the agent they tell runs `git checkout main && git pull`, then `git branch -d tNN-<slug>`. If `git branch -d` refuses, stop and tell the owner. Never use `git branch -D`.
- **Before every commit:**
  - run `git status` and confirm you're on the task's branch. If not, stop and tell the owner;
  - run `pnpm lint`, `pnpm typecheck` and `pnpm test`, plus `supabase test db` if anything in `supabase/` changed. All of them must pass.
- **Never** commit or push to `main`, force-push, or rewrite pushed history.
- **Never merge a pull request.** The owner reviews and merges. If a task depends on a pull request that isn't merged yet, stop and tell the owner which one.
- **Use pnpm only.** Use pnpm for every dependency and script. The only npm command allowed is the one-time global install of pnpm itself (owner task OW1 in Tasks.md). Never create a `package-lock.json`.
