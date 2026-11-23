# T02 · Design tokens, theme and base components (`tokens`): implementation plan

**For:** the executing agent. **Approved by:** the owner, through plan mode (23 Nov 2026).
**This file** is committed together with the T02 code in the T02 PR. Update it in that PR if reality changes the plan (Tasks.md §1.3).

---

## Context

T02 lays the UI-rules foundation that every later screen builds on (T07 app shell, T33 result components, and onward):
- the UI-rules §3 color tokens, wired into Tailwind;
- a contrast test that runs in CI;
- light and dark themes with no flash on load;
- the base-lyra components from §15;
- the SiteLens logo.

Running the contrast math on the §3 starting values found three failures. The owner approved these fixes:

| Failure | Measured | Fix | Result |
|---|---|---|---|
| Light `--score-average` (gauge color) against the card | 2.18:1 (needs 3:1) | Lightness 0.76 → **0.66**, same hue and chroma | 3.16:1 |
| Light `--muted-foreground` on `--muted`, the "Not applicable" and "Info" badges (§3.3) | 4.41:1 (needs 4.5:1) | Lightness 0.553 → **0.54** | 4.66:1, and 5.08:1 on cards |
| Dark `--primary` used as link text (§3.5) | 2.69:1 on the background, 2.38:1 on cards | New **`--link`** token: light = `--primary`; dark = `oklch(0.705 0.213 47.604)`, the preset's dark `--sidebar-primary` | 6.83:1 on the background, 6.05:1 on cards, 5.25:1 on muted |

Everything else passes. All solid marks also pass against the dark `--background`; the lowest is `severity-critical` at 3.66:1.

**Read before starting:**
- AGENTS.md and Tasks.md §1–§2;
- UI-rules §1, §2, §3, §4, §12 and §15;
- the bundled Next.js guides:
  - `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`;
  - `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` (for the T06 hash note).

### Owner decisions (binding, Q&A of 23 Nov 2026)

| # | Decision |
|---|---|
| 1–3 | The three color fixes above, recorded in UI-rules §3 |
| 4 | The test covers the §3.2–§3.3 fg/bg pairs plus the preset pairs that carry text. Solid marks are checked against **both** `--card` and `--background` |
| 5 | The test parses `globals.css`, uses its own OKLCH→sRGB math (no new library), and lives in `apps/web`, inside the existing `pnpm test` CI step |
| 6 | `next-themes`, added to Tech §1 |
| 7 | **Light and Dark only.** With no saved choice, the app follows the system setting. After the first click, the choice is saved in localStorage, with no way back to "system" |
| 8 | **One icon button** (moon in light mode, sun in dark mode). Labels: "Switch to dark theme" / "Switch to light theme", with a matching tooltip |
| 9 | The theme script stays fixed and unchanging, so T06 can allow it by CSP hash. No nonce plumbing in T02 |
| 10 | One global `prefers-reduced-motion` rule, plus no transition when the theme switches |
| 11 | `field` + `label` instead of `form` (no react-hook-form) |
| 12 | The §15 list plus Card, Label, Spinner and Empty |
| 13 | Components are installed unchanged with the pinned local `shadcn` 4.23. No SiteLens variants (T33). Toaster not mounted globally (T07). Chart installed now |
| 14 | A dev-only `/dev/ui` reference page that returns "not found" in production |
| 15 | Logo icon candidates are shown on `/dev/ui`; the owner picks one in the PR |
| 16 | Logo: real "SiteLens" text plus a decorative icon. `full` and `icon` variants. No built-in link |
| 17 | Title pattern "%s · SiteLens" and a description now. Keep the default favicon |
| 18 | The token naming in Step 2 |
| 19 | No solid colors for high/medium/low severity yet. The chart task adds them |
| 20 | No heading utilities. Use the §4 class strings as written |

---

## Preconditions (stop if any fails)

- The branch `t02-tokens` exists and is checked out, with this file uncommitted on it.
- T01 is merged into `main`, and no other task PR is open.
- The shadcn MCP is connected (`.mcp.json`).

---

## Files

**Change**
- `apps/web/app/globals.css`: the tokens, the `@theme inline` mappings, the reduced-motion rule.
- `apps/web/app/layout.tsx`: ThemeProvider, `suppressHydrationWarning` on `<html>`, metadata.
- `apps/web/components/ui/button.tsx`: the `link` variant changes from `text-primary` to `text-link`. This is the only edit to a generated component; it applies fix 3.
- `apps/web/package.json` and `pnpm-lock.yaml`: `next-themes`, plus whatever the shadcn CLI adds (`sonner`, `recharts@3.8.0`, …).
- `docs/UI-rules.md` (§2, §3.1, §3.2, §3.3, §3.5, §15, change log **v1.2**) and `docs/Tech.md` (§1, change log **v1.3**).
- `tasks/Tasks.md`: tick T02.

**Create**
- `apps/web/components/ui/*`: the generated components. Also `apps/web/hooks/use-mobile.ts`, which Sidebar pulls in.
- `apps/web/components/theme-provider.tsx` and `apps/web/components/theme-toggle.tsx`.
- `apps/web/components/logo.tsx`.
- `apps/web/lib/contrast.ts`: pure color math.
- `apps/web/lib/contrast.test.ts` and `apps/web/lib/tokens.test.ts`.
- `apps/web/app/dev/ui/page.tsx`, plus small client demo components next to it (for example `app/dev/ui/demos.tsx`).

---

## Steps

### Step 1: Install components (first, so the CLI's CSS edits can be reviewed before the token edits)
- Confirm the item names with the shadcn MCP (`get_add_command_for_items`). Then, from `apps/web`, run the **pinned local CLI**:
  `pnpm exec shadcn add sidebar breadcrumb tabs sheet dialog alert-dialog table chart progress skeleton accordion dropdown-menu select toggle-group badge tooltip popover sonner alert field input switch checkbox avatar card label spinner empty --yes`
  Don't overwrite the existing `button.tsx`.
- Review `git diff app/globals.css`. Keep the CLI's changes only if they're additions the components need, and list them in the PR.
- **lucide-react:** `chart` lists it as a dependency, but UI-rules §2 says Hugeicons. Search `components/` and `hooks/` for `lucide-react`:
  - not imported → `pnpm --filter web remove lucide-react`;
  - imported → swap the icon for its Hugeicons equivalent, and note this in the PR.
- `sonner` brings `next-themes` (decision 6). Pin `next-themes` to an exact version (`0.4.6`).

### Step 2: Tokens in `globals.css`
Every value is a **literal** `oklch(...)` (no `var()`), so the test can parse it. Add each token to `:root` and `.dark` with the UI-rules §3 values, with fixes 1–3 applied:
- `--score-good`, `--score-good-fg`, `--score-good-bg` (the same three for `average` and `poor`). Light `--score-average` is `oklch(0.66 0.15 80)`.
- `--severity-critical` (solid) and `--severity-critical-fg` (`oklch(0.98 0 0)`).
- `--severity-high-fg` / `-bg`, and the same for `medium` and `low`.
- `--unverified-fg` / `-bg` and `--info-fg` / `-bg`.
- `--category-seo`, `--category-performance`, `--category-accessibility`, `--category-technical`, `--category-ux`.
- `--link`: light `oklch(0.553 0.195 38.402)`, dark `oklch(0.705 0.213 47.604)`.
- Light `--muted-foreground` becomes `oklch(0.54 0.013 58.071)`.

In `@theme inline`, map each new token as `--color-<name>: var(--<name>);`. That gives classes like `bg-score-good-bg`, `text-severity-high-fg`, `fill-category-seo` and `text-link`.

Reduced motion, at the end of the file:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Step 3: Contrast math (`lib/contrast.ts`, pure, no dependencies)
- `parseOklch(str)`.
- `oklchToSrgb`: OKLCH → OKLab → linear sRGB (Björn Ottosson's matrices), clipped to [0, 1].
- `relativeLuminance` and `contrastRatio`, using the WCAG 2.x formula.
- `readThemeTokens(css)`: reads the `:root { … }` and `.dark { … }` blocks into `{ light: Record<name, Oklch>, dark: … }`.

### Step 4: Theme
- `components/theme-provider.tsx` (`"use client"`) wraps `next-themes`' `ThemeProvider` with fixed props: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`. No `themes` override, so it uses the default light and dark. No nonce prop. The props never change, so the inline script stays identical and T06 can allow it by hash.
- In `layout.tsx`, wrap `{children}` in the provider and add `suppressHydrationWarning` to `<html>`.
- `components/theme-toggle.tsx` (`"use client"`):
  - a Button with `variant="ghost"` and `size="icon"` inside a Tooltip, with `onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}`;
  - the icon and label are swapped **by CSS**, so there's no hydration mismatch and no mount flag: the moon icon and the "Switch to dark theme" `sr-only` label carry `dark:hidden`; the sun icon and the "Switch to light theme" label carry `hidden dark:inline`. The tooltip text swaps the same way;
  - Hugeicons outline icons at 20 px. Check the exact export names (e.g. `Moon02Icon`, `Sun03Icon`) in `@hugeicons/core-free-icons`;
  - the toggle is **not placed in a layout**; T07 does that. It appears on `/dev/ui`.
- Check in dev that the Strict Mode remount doesn't drop the `dark` class. `next-themes` re-applies it in an effect. If the theme is lost, follow `preventing-flash-before-hydration.md` §"Re-applying attributes in development".

### Step 5: Logo (`components/logo.tsx`, a Server Component)
- Props: `variant?: "full" | "icon"` and `className`.
- The icon is a `HugeiconsIcon` in `text-primary`, `aria-hidden`.
- `full` adds `<span className="font-heading font-semibold">SiteLens</span>`. `icon` adds `<span className="sr-only">SiteLens</span>`.
- The default icon is a Hugeicons search/lens icon. `/dev/ui` shows 3–4 candidates side by side (for example `Search01Icon`, `SearchFocusIcon`, `ZoomInAreaIcon`, `CenterFocusIcon`; verify the names). The owner picks one in the PR, and the executor switches the default to it.

### Step 6: Metadata (`layout.tsx`)
`title: { default: "SiteLens", template: "%s · SiteLens" }`. The description is based on PRD §1: "SiteLens audits websites in five categories: SEO, Performance, Accessibility, Technical & Security, and UX & Conversion." Keep the default favicon.

### Step 7: `/dev/ui` reference page (`app/dev/ui/page.tsx`)
- `if (process.env.NODE_ENV === "production") notFound();`. Follow the bundled Next docs for `notFound` with `cacheComponents: true`.
- One `h1`; no skip link (that's T07). Sections, each with an `h2`:
  1. Logo variants and icon candidates, and the theme toggle.
  2. Token swatches: every fg/bg pair with sample text; solid marks on the card and on the background; category colors; `--link`.
  3. The type scale from UI-rules §4, using its class strings.
  4. Every installed component in a basic state:
     - Sidebar with `collapsible="none"` inside a bounded box;
     - Sonner with a page-local `<Toaster />` and a button that fires a toast;
     - Chart: a small bar chart using the `--category-*` colors;
     - Field: an input with a label, helper text and an error.
- Content is dev-only filler; it isn't product copy.

### Step 8: Docs (owner-approved in the Q&A; the card authorizes the §3 changes)
- **UI-rules:**
  - **§2 Themes row:** "Light and dark, via the `.dark` class. With no saved choice the app follows the system setting; the top-bar toggle switches between light and dark, and the choice is saved in the browser. The PDF is always light. Public reports follow the viewer's system setting."
  - **§3.1:** the new light `--muted-foreground` value and why; add `--link`.
  - **§3.2:** light `--score-average` is `oklch(0.66 0.15 80)`.
  - **§3.3:** list the token names. Note that high/medium/low have no solid color until the chart task defines them.
  - **§3.5:** links use `--link`.
  - **§15:** Field + Label instead of Form; add Card, Spinner and Empty; mark the install done; mention `/dev/ui`.
  - **Change log v1.2.**
- **Tech:** §1 Web app row adds `next-themes` (light/dark theme, no flash). **Change log v1.3.**

### Step 9: Finish
- Tick T02 in `tasks/Tasks.md`.
- Pre-commit checks from AGENTS.md: `git status` shows branch `t02-tokens`; `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm --filter web build` all pass.
- Commit this plan and the code together, push, and open the PR with `gh`.
- The PR description includes:
  - what changed and how it was verified (Acceptance below);
  - the contrast table, which the test prints;
  - the T06 hash note;
  - the CLI's CSS changes;
  - the lucide outcome;
  - the logo candidates, for the owner to pick;
  - screenshots of `/dev/ui` in light and dark, at desktop width and 390 px.

---

## Tests

Vitest, `web` project, node environment. These run in the existing CI "Unit tests" step, so CI needs no changes.

- **`lib/contrast.test.ts`** (the math):
  - white/black is 21:1, and a color against itself is 1:1;
  - `oklch(1 0 0)` → sRGB (1, 1, 1) and `oklch(0 0 0)` → (0, 0, 0);
  - one known mid-tone matches a reference value within ±0.01;
  - the parser handles whitespace, `/ alpha`, and degree-less hue.
- **`lib/tokens.test.ts`** (reads `app/globals.css` with `fs`, relative path, no `@/` alias). For **both themes**:
  - every new token exists in `:root` and `.dark` as a literal `oklch()`, and has a `--color-*` mapping in `@theme inline`;
  - **text pairs ≥ 4.5:1:**
    - `foreground`/`background`, `card-foreground`/`card`, `popover-foreground`/`popover`, `secondary-foreground`/`secondary`, `accent-foreground`/`accent`, `primary-foreground`/`primary`;
    - `muted-foreground` on `muted`, `card` and `background`;
    - `link` on `background`, `card` and `muted`;
    - `score-{good,average,poor}-fg` on its `-bg`;
    - `severity-critical-fg`/`severity-critical`;
    - `severity-{high,medium,low}-fg` on its `-bg`;
    - `unverified-fg`/`-bg` and `info-fg`/`-bg`;
  - **solid marks ≥ 3:1 against `card` and `background`:** `score-{good,average,poor}`, `severity-critical`, `category-*`;
  - pairs whose background color has alpha are skipped, with a comment explaining why;
  - test names include the pair and theme, for example `dark: link on card ≥ 4.5`, so a failure names itself.

---

## Acceptance

- **PRD §16:** no item is covered directly. T02 is groundwork for PRD §14 "Accessibility of SiteLens itself (WCAG 2.2 AA)" and UI-rules §12 contrast.
- **The card's Done when:** the contrast test passes in CI, and the components render in both themes (`/dev/ui` screenshots).

---

## Assumptions (the owner can veto in review)

- Out-of-gamut colors are clipped in sRGB before the contrast math. All §3 values are close to the sRGB gamut, so this changes nothing in practice.
- `next-themes` 0.4.6 (last published Mar 2025) renders a `<script>` from a client component. React may log a dev-only warning about it. That's accepted.
- `/dev/ui` stays as a living reference. It's added to UI-rules §15, not to the Tech §4.1 route list, because it isn't a product route.
- The one-word Button `link` variant change is the only edit to generated component code.

---

## Questions for the owner

None. All of them were answered in the Q&A of 23 Nov 2026 (20 questions plus the 2 follow-ups on the toggle and first-visit behavior).

---

## Verification (run in order, all must pass)

1. `pnpm lint && pnpm typecheck && pnpm test && pnpm --filter web build`: all pass. The build output still shows `/` as static.
2. To prove the test can fail, temporarily set light `--score-average` back to 0.76 and confirm `light: score-average on card ≥ 3` fails. Revert it.
3. `pnpm dev`, then open `/dev/ui`:
   - the toggle switches themes, and a hard reload keeps the choice with **no flash** (Network throttling set to Slow 4G);
   - with localStorage cleared, the page follows the OS setting;
   - the label and tooltip read correctly in each theme;
   - with DevTools "Emulate prefers-reduced-motion: reduce", dialogs and sheets open instantly;
   - there's no horizontal scrolling at 390 px.
4. `pnpm --filter web start` after the build: `/dev/ui` returns 404.
5. Take the screenshots (light and dark, desktop and 390 px) for the PR.

---

## Execution notes (23 Nov 2026)

What happened during execution, where it differs from or adds to the plan above:

- **Install:** the CLI dry run and the real install created 31 files and skipped the identical `button.tsx`. It made **no changes to `globals.css`** and added the dependencies `next-themes`, `sonner` and `recharts@3.8.0` (`cn` was already there). `next-themes` is pinned to exactly `0.4.6`.
- **lucide-react:** the CLI didn't add it. The generated `chart.tsx` imports no icons, so the lucide step wasn't needed.
- **Edits to generated code** (beyond the planned Button `link` → `text-link`). Two generated files failed the pre-commit checks:
  - `components/ui/spinner.tsx` failed `tsc`: the `strokeWidth` it spreads from SVG props can be a string, but `HugeiconsIcon` only accepts a number. The props type now omits `strokeWidth`.
  - `hooks/use-mobile.ts` failed the `react-hooks/set-state-in-effect` lint rule. It's rewritten with `useSyncExternalStore` (same result; the server snapshot is `false`, as before).
- **TooltipProvider:** the CLI's install notes say to wrap the app in `TooltipProvider`. The root layout now has `ThemeProvider` → `TooltipProvider` → children.
- **Not changed:** the Badge also has a `link` variant that uses `text-primary`. It's left as generated; nothing uses it yet. Any task that uses it should switch it to `text-link`.
- **Recharts and reduced motion:** Recharts animates in JavaScript, so the global CSS rule doesn't stop chart animations. UI-rules §7.6 now says charts turn off animation for reduced motion; the chart tasks implement it.
- **Theme script for T06:** next-themes' inline script is identical across requests. Its CSP hash in the production build is `'sha256-n46vPwSWuMC0W703pBofImv82Z26xo4LXymv0E9caPk='`. Recompute it whenever `next-themes` or the provider's props change.
- **Browser verification** (headless Chrome driven over the DevTools protocol, with no project dependency):
  - with no saved choice, the class follows the emulated system setting;
  - the toggle switches and saves the choice, and a reload keeps it;
  - the theme script is the first element in `<body>`, before any content;
  - the label and tooltip text match the theme;
  - with reduced motion, dialog animations are `1e-05s`;
  - no horizontal overflow at 390 px;
  - no console errors or warnings.
- **Production:** `next start` serves `/` (200) and returns 404 for `/dev/ui`. `/` is still static.
