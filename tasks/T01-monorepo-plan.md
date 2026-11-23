# T01 · pnpm monorepo and CI skeleton (`monorepo`): implementation plan

**For:** the executing agent. **Approved by:** the owner, through plan mode (23 Nov 2026).
**This file** reached `main` with PR #1 (T00). Update it in the T01 PR if reality changes the plan (Tasks.md §1.3).

---

## Context

SiteLens is still one create-next-app project at the repo root. Every later task assumes the layout in Tech §3:
- `apps/web`: the Next.js app;
- `apps/worker`: the audit worker;
- `packages/core`: framework-free shared code;
- CI that runs on every PR.

T01 builds that structure and nothing else: no features, no Supabase, no UI work beyond moving files and one font fix.

All 20 decisions below were agreed with the owner on 23 Nov 2026. Follow them exactly.

**Read before starting:**
- AGENTS.md and Tasks.md §1–§2;
- Tech §1, §3, §13 and §14;
- UI-rules §2 (fonts);
- the bundled Next.js guides:
  - `node_modules/next/dist/docs/01-app/03-api-reference/05-config/02-typescript.md` (typegen, how `next build` type-checks);
  - `…/05-config/01-next-config-js/transpilePackages.md`;
  - `…/05-config/01-next-config-js/agentRules.md`;
  - `…/06-cli/next.md` (`next typegen`).

### Owner decisions (binding)

| # | Decision |
|---|---|
| 1 | Package names: `web`, `worker`, `@sitelens/core` |
| 2 | The apps import core's **TypeScript source** (no build step for core at runtime); Next uses `transpilePackages` |
| 3 | The root `AGENTS.md` keeps the SiteLens rules plus a **pointer** to `apps/web/AGENTS.md`. `next dev` maintains `apps/web/AGENTS.md`, and it is committed |
| 4 | Remove `experimental.agentFeedback` from `next.config.ts` |
| 5 | `pnpm typecheck` = `tsc -b` over **project references for all three packages** (web included, with route types generated first and declarations emitted to a cache folder) |
| 6 | The worker runs on Node 26's built-in TypeScript support: `node --watch src/index.ts`. Only erasable syntax is allowed (no enums or namespaces) |
| 7 | ESM everywhere (`"type": "module"` in every package.json) |
| 8 | One **root** Vitest config covering all packages; only core gets a sample test now |
| 9 | One **root** `eslint.config.mjs` |
| 10 | `packages/core` may not import: `next`, Playwright, React and the UI libraries, `@supabase/*`, or the apps |
| 11 | CI installs pnpm with `npm i -g pnpm@<version from packageManager>` |
| 12 | CI also runs `pnpm --filter web build` (Tech §13 is updated) |
| 13 | Move `shadcn` to devDependencies; bump `@types/node` to Node 26. Other versions stay as they are |
| 14 | Keep the `cn` package (`lib/utils.ts` re-exports it) |
| 15 | Move the `public/` SVGs and the demo page as they are |
| 16 | Pin Node to major 26: `.nvmrc` / `.node-version` = `26`, `engines.node` = `>=26 <27` |
| 17 | Env files per app: `apps/web/.env.local` and `apps/worker/.env`. One root `.env.example` |
| 18 | `.env.example` lists every Tech §14 variable; the Phase 3 ones are **commented out** |
| 19 | Replace the README with a short SiteLens README |
| 20 | No Turborepo or other tools the docs don't list |

---

## Preconditions (stop if any fails)

1. **PR #1 (T00) is merged:** `gh pr view 1 --json state` returns `MERGED`.
2. **pnpm works:** `pnpm -v` (OW1). Docker isn't used by T01, so don't block on it.
3. Then:
   - `git switch main && git pull`;
   - `git switch -c t01-monorepo`;
   - this plan file is already on `main`.
4. **Choose the pnpm version:** run `npm view pnpm version` and use that exact version in `packageManager`.

---

## Files

**Moved with `git mv`** from the root to `apps/web/`:
- `app/`, `components/`, `lib/`, `public/`;
- `components.json`, `next.config.ts`, `tsconfig.json`;
- `package.json` (rewritten as the web package).

**Deleted:**
- `package-lock.json`;
- the root `node_modules/`, `.next/` and `next-env.d.ts` (all untracked or ignored, so this is safe and they are regenerated).

**New files:**

| Where | Files |
|---|---|
| Root | `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` (generated), `tsconfig.base.json`, `tsconfig.json` (the solution file), `vitest.config.ts`, `.nvmrc`, `.node-version`, `.env.example`, `.github/workflows/ci.yml` |
| `apps/web/` | `AGENTS.md` |
| `apps/worker/` | `package.json`, `tsconfig.json`, `src/index.ts` |
| `packages/core/` | `package.json`, `tsconfig.json`, `src/{catalog,checks,scoring,issues,url,net,ai,db}/index.ts`, `src/sample.test.ts` |

**Changed:**
- `eslint.config.mjs` (rewritten for the monorepo), `.gitignore`, `README.md`, `AGENTS.md`;
- `apps/web/app/layout.tsx`, `apps/web/app/globals.css`, `apps/web/next.config.ts`;
- `docs/Tech.md`, `tasks/Tasks.md`.

---

## Steps

### Step 1: Docs first (separate commit: "Update docs for the T01 monorepo layout")

AGENTS.md requires the docs to change before the code. Make these edits:

- **Tech §3 (repo layout):**
  - **New entries in the tree:**
    - root config files: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `.env.example`;
    - `apps/web/AGENTS.md`, generated by `next dev` and committed;
    - the gitignored local env files `apps/web/.env.local` and `apps/worker/.env`.
  - **The "Linting" bullet:** a single root ESLint 9 flat config. The `eslint-config-next` rules apply to `apps/web`, and the TypeScript rules to all packages.
  - **The "Imports" bullet:** `packages/core` contains no imports of Next.js, Playwright, React or UI libraries, `@supabase/*` or the apps. An ESLint rule enforces this.
  - **New bullet:** apps import core's TypeScript source through `@sitelens/core/<module>`. Core has no runtime build; `tsc -b` emits only declarations, to `.tsbuild/`, for type checking.
- **Tech §13:**
  - **Unit row:** add "one root Vitest config covers every package".
  - **CI step list:** insert "web build (`pnpm --filter web build`)" after unit tests.
- **Tech §14:** after "`.env.example` lists them all", add: "Local values go in `apps/web/.env.local` and `apps/worker/.env` (both gitignored)."
- **Tech versioning:** set the header to **v1.2** (the date of execution) and add a change-log row for v1.2 summarizing these edits.
- **AGENTS.md (root):**
  - Remove the `<!-- BEGIN:nextjs-agent-rules -->…<!-- END -->` block from the root file. It moves to `apps/web/AGENTS.md` in Step 3.
  - Add a short **"Next.js"** section in its place: the web app lives in `apps/web`. Before writing Next.js code, read `apps/web/AGENTS.md` (maintained by `next dev`) and the guides in `apps/web/node_modules/next/dist/docs/`.
  - Update the "How the Next.js rule fits in" bullet to point at `apps/web/AGENTS.md`.

### Step 2: Move the app

1. **Clean up:** delete the root `node_modules/` and `.next/`, `next-env.d.ts` and `package-lock.json`.
2. **Move the files:** `git mv` `app components lib public components.json next.config.ts tsconfig.json package.json` into `apps/web/`.
   - `components.json` paths (`app/globals.css`, `@/components`…) stay valid, because they are relative to `apps/web`.

### Step 3: `apps/web`

- **`package.json`:**
  - `"name": "web"`, `"private": true`, `"type": "module"`.
  - **Scripts:**
    - `"dev": "next dev"`;
    - `"build": "tsc -b ../../packages/core && next build"`. `next build` runs `tsc --project tsconfig.json --noEmit`, which needs core's declaration output to exist because of the project reference;
    - `"start": "next start"`;
    - `"typegen": "next typegen"`.
  - **dependencies:** keep the preset's, minus `shadcn`, plus `"@sitelens/core": "workspace:*"`.
  - **devDependencies:**
    - `shadcn` (moved; `globals.css` imports `shadcn/tailwind.css`, which still resolves because devDependencies are installed for builds);
    - `@tailwindcss/turbopack`, `tailwindcss`, `typescript`;
    - `@types/node` at `^26`, `@types/react`, `@types/react-dom`.
  - **Moved to root:** `eslint` and `eslint-config-next`.
- **`tsconfig.json`:**
  - `"extends": "../../tsconfig.base.json"`.
  - **Keep the preset's options:**
    - `lib: ["dom","dom.iterable","esnext"]`, `allowJs`, `module: "esnext"`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`;
    - `plugins: [{ "name": "next" }]`, `paths: { "@/*": ["./*"] }`;
    - the `include` list (`next-env.d.ts`, `**/*.ts`, `**/*.tsx`, `**/*.mts`, `.next/types/**/*.ts`, `.next/dev/types/**/*.ts`);
    - `exclude: ["node_modules", ".tsbuild"]`.
  - **Add:**
    - `"composite": true`, `"emitDeclarationOnly": true`, `"outDir": ".tsbuild"`;
    - **`"noEmit": false` explicitly.** Next writes its *suggested* `noEmit: true` only when the key is missing. A referenced project may not disable emit (TS6310).
  - **References:** `"references": [{ "path": "../../packages/core" }]`.
- **`next.config.ts`:**
  - Delete the `experimental.agentFeedback` entry (and the `experimental` object if it becomes empty).
  - Add `transpilePackages: ["@sitelens/core"]`.
  - Keep `cacheComponents`, `partialPrefetching` and the `turbopack.rules` CSS loader unchanged.
- **Fonts (UI-rules §2):**
  - In `app/layout.tsx`:
    - remove the `Geist` import and `geistSans`;
    - change the `Geist_Mono` variable to `"--font-mono"`;
    - remove `geistSans.variable` from the `className`.
  - In `app/globals.css` `@theme inline`: change `--font-mono: var(--font-geist-mono);` to `--font-mono: var(--font-mono);`. This follows the preset's existing `--font-sans` pattern.
  - Leave everything else in both files untouched (title, page, the unused `Image` import).
- **`apps/web/AGENTS.md`:**
  - Create it containing **exactly** the managed block removed from the root (from `<!-- BEGIN:nextjs-agent-rules -->` to `<!-- END:nextjs-agent-rules -->`, plus a trailing newline).
  - In Step 7, `pnpm dev` must leave it unchanged. If `next dev` rewrites it, commit what Next writes.

### Step 4: `packages/core`

- **`package.json`:**
  - `"name": "@sitelens/core"`, `"private": true`, `"type": "module"`, no dependencies.
  - **`exports`:** one explicit subpath per module, pointing at the source:
    ```json
    "exports": {
      "./catalog": "./src/catalog/index.ts",
      "./checks": "./src/checks/index.ts",
      "./scoring": "./src/scoring/index.ts",
      "./issues": "./src/issues/index.ts",
      "./url": "./src/url/index.ts",
      "./net": "./src/net/index.ts",
      "./ai": "./src/ai/index.ts",
      "./db": "./src/db/index.ts"
    }
    ```
- **`src/<module>/index.ts`:**
  - Each file is `export {};` with a one-line comment naming the module's purpose from Tech §3 and the task that fills it.
  - Fill-in tasks: url and net → T08; catalog and checks → T15; scoring → T30; issues → T31; ai → T42; db → T05.
- **`src/sample.test.ts`:** a single trivial Vitest test, for example asserting `1 + 1 === 2`, with a comment saying it proves the test setup works and can be deleted once real tests exist (T08).
- **`tsconfig.json`:**
  - `"extends": "../../tsconfig.base.json"`, `composite`, `emitDeclarationOnly`, `"rootDir": "src"`, `"outDir": ".tsbuild"`.
  - `"module": "nodenext"`, `"moduleResolution": "nodenext"`, `"lib": ["ES2024"]`, `"types": ["node"]` (`core/net` will use `node:dns` in T08).
  - `"allowImportingTsExtensions": true`, `"erasableSyntaxOnly": true`, `"verbatimModuleSyntax": true`.
  - `"include": ["src"]`.
- **Import rule:** relative imports inside core always use the `.ts` extension (Node 26 runs the source directly).

### Step 5: `apps/worker`

- **`package.json`:**
  - `"name": "worker"`, `"private": true`, `"type": "module"`.
  - **Scripts:** `"dev": "node --watch src/index.ts"` and `"start": "node src/index.ts"`.
  - **dependencies:** `"@sitelens/core": "workspace:*"`.
- **`src/index.ts`:** a placeholder that logs one line: "SiteLens worker placeholder; the real worker arrives in T12". No other code.
- **`tsconfig.json`:**
  - the same compiler options as core;
  - plus `"references": [{ "path": "../../packages/core" }]`.

### Step 6: Root files

- **`package.json`:**
  - `"name": "sitelens"`, `"private": true`, `"type": "module"`.
  - `"packageManager": "pnpm@<exact version>"`, `"engines": { "node": ">=26 <27" }`.
  - **Scripts:**
    - `"dev": "pnpm --filter web dev"`;
    - `"dev:worker": "pnpm --filter worker dev"`;
    - `"build": "pnpm --filter web build"`;
    - `"lint": "eslint ."`;
    - `"typecheck": "pnpm --filter web typegen && tsc -b"`;
    - `"test": "vitest run"`.
  - **devDependencies:**
    - `typescript` (`^5`, Tech §1);
    - `eslint` (`^9`);
    - `eslint-config-next` (`16.4.6`, the same as `next`);
    - `vitest` (the current stable version);
    - `@types/node` (`^26`; if no 26.x types are published yet, use the newest and note it in the PR).
- **`pnpm-workspace.yaml`:**
  - `packages: ["apps/*", "packages/*"]`.
  - If `pnpm install` reports ignored dependency build scripts, allow only the ones the warning names that are needed (expected: `sharp`, `unrs-resolver`, `@tailwindcss/oxide`), using the setting the installed pnpm version documents (`onlyBuiltDependencies` or its successor).
  - Don't run the interactive `pnpm approve-builds`.
- **`tsconfig.base.json`:**
  - `target: "ES2024"`, `strict`, `skipLibCheck`, `esModuleInterop`, `isolatedModules`, `resolveJsonModule`, `forceConsistentCasingInFileNames`;
  - `declaration: true`, `composite: true`, `emitDeclarationOnly: true`.
  - Per-package files set `outDir`, `rootDir`, module settings and `lib`.
- **`tsconfig.json` (solution):** `{ "files": [], "references": [{ "path": "packages/core" }, { "path": "apps/worker" }, { "path": "apps/web" }] }`.
- **`eslint.config.mjs`:** `defineConfig` from `eslint/config`:
  1. **Ignores:** `globalIgnores(["**/node_modules/**", "**/.next/**", "**/out/**", "**/build/**", "**/coverage/**", "**/.tsbuild/**", "**/next-env.d.ts"])`.
  2. **Web:**
     - `{ files: ["apps/web/**/*.{js,jsx,mjs,ts,tsx}"], extends: [nextVitals] }`;
     - `settings: { next: { rootDir: "apps/web/" } }`.
  3. **TypeScript, all packages:** `...nextTs` (`eslint-config-next/typescript` = typescript-eslint recommended plus Next's two rule tweaks).
  4. **Core boundary:** `{ files: ["packages/core/**/*.ts"], rules: { "no-restricted-imports": ["error", { patterns: [{ group: [...], message: "packages/core must stay framework-free (Tech §3)." }] }] } }`.
     - The group list: `next`, `next/*`, `playwright`, `playwright/*`, `playwright-core`, `playwright-core/*`, `@playwright/*`, `@axe-core/playwright`, `react`, `react/*`, `react-dom`, `react-dom/*`, `@base-ui/*`, `@hugeicons/*`, `@supabase/*`, `web`, `web/*`, `worker`, `worker/*`, `**/apps/**`.
- **`vitest.config.ts`:** `defineConfig` from `vitest/config` with `test.projects` as **inline objects**, so there are no per-package config files:
  - `core`: root `./packages/core`, includes `src/**/*.test.ts`, node environment;
  - `worker`: root `./apps/worker`, includes `src/**/*.test.ts`, node environment;
  - `web`: root `./apps/web`, includes `**/*.test.{ts,tsx}`, excludes `node_modules` and `.next`, node environment.
- **`.nvmrc` and `.node-version`:** both contain `26`.
- **`.gitignore`:** remove the leading `/` from `node_modules`, `.next/`, `out/`, `build` and `coverage` so they match inside `apps/*`, and add `.tsbuild/`. Keep `.env*` / `!.env.example`, `*.tsbuildinfo` and `next-env.d.ts`.
- **`.env.example`:**
  - **Header:** copy the web variables to `apps/web/.env.local` and the worker variables to `apps/worker/.env`, and never commit real values.
  - **Active entries, one comment each (app + purpose, from Tech §14):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `DATABASE_URL`, `HASH_SECRET`, `GOOGLE_API_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_APP_URL`, `WORKER_CONCURRENCY`, `ALLOWED_EMAILS` (note: empty = nobody can sign in), `SSRF_TEST_ALLOWLIST` (tests only).
  - **Commented out under a "Phase 3" heading:** `SENTRY_DSN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.
  - All values are empty.
- **`README.md`:** replace it with:
  - a one-line description of SiteLens;
  - links to `docs/` (the source of truth), `tasks/Tasks.md` and `AGENTS.md`;
  - a "Local development" section:
    - prerequisites (Node 26, pnpm via `npm i -g pnpm`);
    - `pnpm install`, `pnpm dev`, `pnpm dev:worker`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`;
    - where the env files go.
  - Supabase and Docker steps are added by T03.

### Step 7: Install and prove the wiring

1. **Install:** run `pnpm install` and commit `pnpm-lock.yaml`.
2. **Temporary spike (not committed).** It proves the riskiest assumptions:
   - **Setup:**
     - add `packages/core/src/url/spike.ts` exporting `export const spike = "ok";`;
     - re-export it from `url/index.ts` with `export * from "./spike.ts";`;
     - import `spike` from `@sitelens/core/url` in `apps/worker/src/index.ts` and in `apps/web/app/page.tsx`.
   - **Then run:**
     - `pnpm typecheck`: proves the declaration emit keeps the `.ts` specifiers and the project-reference redirect works;
     - `pnpm build`: proves `next build`'s `tsc --noEmit` works with the reference, and `transpilePackages` works;
     - `pnpm --filter worker start`: proves Node strips types from core through the workspace symlink;
     - `pnpm test`.
   - **Fallbacks, tried in this order:**
     - if the `.ts` specifiers break `tsc -b` declaration resolution, add `"rewriteRelativeImportExtensions": true` to core and worker;
     - if Node refuses to strip core's types (a `node_modules` path), stop and ask the owner;
     - if web declaration emit fails with TS2742 ("inferred type cannot be named") in preset files, stop and ask. Don't edit preset components to fix it.
   - **Remove the spike** (`git status` must show none of it) and record the results in the PR.
3. **Final checks:**
   - all five commands from Verification pass;
   - `pnpm dev` serves the page at http://localhost:3000;
   - `git status` shows no rewrite of `apps/web/tsconfig.json` or `apps/web/AGENTS.md` by Next. If Next adds include entries, keep them and commit.

### Step 8: CI (`.github/workflows/ci.yml`)

- **Name:** `CI`.
- **Triggers:** `on: pull_request` and `push: branches: [main]`.
- **Permissions and concurrency:** `permissions: contents: read`; `concurrency` group `ci-${{ github.ref }}` with `cancel-in-progress: true`.
- **Env:** `NEXT_TELEMETRY_DISABLED: 1`.
- **One job, `checks`, on `ubuntu-latest`:**
  1. `actions/checkout`;
  2. `actions/setup-node` with `node-version-file: .nvmrc`;
  3. `npm i -g pnpm@$(node -p "require('./package.json').packageManager.split('@')[1]")`;
  4. a step that writes `pnpm store path --silent` to `$GITHUB_OUTPUT`;
  5. `actions/cache` on that path, key `pnpm-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}` with a restore key;
  6. `pnpm install --frozen-lockfile`;
  7. `pnpm lint`;
  8. `pnpm typecheck`;
  9. `pnpm test`;
  10. `pnpm --filter web build`.
- **Action versions:** use the current major tag of each action (check with `gh api repos/actions/<name>/releases/latest`).
- **Not yet:** the integration test, the database-types check and pgTAP. Those come in T46, T05 and T03.

### Step 9: Finish

- Tick T01 in the Tasks.md §3 table.
- **Commits:** Step 1 docs; the move and tooling; CI. Each ends with the Co-Authored-By line.
- **Push** `t01-monorepo` and open the PR with `gh`. The PR body covers:
  - what changed;
  - the spike results;
  - the verification output;
  - the PRD §16 items;
  - the assumptions below;
  - a note for OW4: Vercel root directory `apps/web`, with "Include files outside the root directory" left on.
- **No screenshots:** the UI is unchanged apart from the mono font variable, and the page is empty.
- Wait for CI to pass on the PR (`gh pr checks --watch`).

---

## Tests

- `packages/core/src/sample.test.ts` runs through the root Vitest config (`pnpm test`).
- The rest is configuration, proven by the Step 7 spike and the commands in Verification.

## Acceptance

- **PRD §16.2, Phase 1 exit, partly:** "CI is green: lint, type check, unit tests". The fixture integration test arrives in T46.
- **T01 "done when":**
  - `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm --filter web build` succeed;
  - `pnpm dev` serves the existing page;
  - CI passes on the PR.

## Assumptions (the owner can veto in review)

- **TypeScript output:** `.tsbuild/` is the declaration cache folder in each package (gitignored).
- **Builds:** the web `build` script compiles core's declarations first (`tsc -b ../../packages/core`) so that `next build` works on CI and Vercel.
- **Core layout:** `packages/core` uses `src/<module>/index.ts` with explicit `exports` subpaths, matching DB §9's `packages/core/src/db/types.ts`.
- **Worker:** the `start` script exists for T48. Neither app gets a test file yet.
- **Lint:** the unused `Image` import in the demo page stays (decision 15). It's a lint *warning*, so it doesn't fail `pnpm lint`.
- **Dependency builds:** only the build scripts pnpm names as needed are allowed.

## Questions for the owner

None. All 20 were settled on 23 Nov 2026.

---

## Verification (run in order, all must pass)

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck        # next typegen + tsc -b (core → worker → web)
pnpm test             # Vitest: core sample test
pnpm --filter web build
pnpm dev              # http://localhost:3000 renders; stop it afterwards
pnpm dev:worker       # prints the placeholder line; stop it
```

Then confirm:
- `git status` is clean apart from intended changes: no `.tsbuild/`, `.next/` or `node_modules/` under `apps/*` or `packages/*`, and no spike files;
- `apps/web/AGENTS.md` is unchanged after `pnpm dev`;
- **lint boundary:** temporarily add `import "react";` to a core file, check that `pnpm lint` fails with the core-boundary message, then remove it;
- CI is green on the PR.

---

## Execution notes (23 Nov 2026)

What happened during execution, where it differs from or adds to the plan above:

- **Preconditions:** PR #1 was still open and pnpm wasn't installed. With the owner's approval, the executing agent merged PR #1 and installed pnpm 12.21.0.
- **pnpm on Windows:** with npm 12, `npm i -g pnpm` blocks pnpm's install scripts, and the Windows shim then prints nothing. `npm i -g pnpm --allow-scripts=pnpm` fixes it; the README says so. On Linux (CI) the placeholder bin runs pnpm through Node, so CI uses the plan's command unchanged.
- **Dependency builds:** `pnpm install` reported no blocked build scripts (sharp, unrs-resolver and `@tailwindcss/oxide` use prebuilt binaries), so `pnpm-workspace.yaml` has no allow list.
- **TypeScript build info:** core and worker set `"tsBuildInfoFile": ".tsbuild/tsconfig.tsbuildinfo"`. Because their `rootDir` is `src`, TypeScript would otherwise write it next to `tsconfig.json`, outside the `.tsbuild/` cache folder.
- **Spike:** `tsc -b`, `next build`, `node src/index.ts` (worker) and Vitest all worked with core imported from both apps. No fallback was needed.
