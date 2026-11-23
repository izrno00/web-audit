# SiteLens — Interface Rules (UI-rules)

**Status:** v1.2 · approved by the product owner 22 Nov 2026, updated 23 Nov 2026 (see the change log at the end)
**Companion documents:** [PRD.md](PRD.md) · [DB.md](DB.md) · [Tech.md](Tech.md)
**Source of the design system:** the shadcn preset already installed in the repo (`components.json`, `app/globals.css`, `app/layout.tsx`). The installed component list is in §15.

---

## 1. Principles

1. **An instrument, not a billboard.** The app is calm, precise and dense with data. Color carries meaning (scores, severity, status). The brand orange is for actions and identity only.
2. **Every number explains itself.** A score is always shown with its band label, coverage and a way to see how it was calculated. No unexplained numbers.
3. **Honest states.** "Unable to verify", "Not applicable", "Insufficient data", "Provisional" and "AI-generated" are always visible and labelled. The UI never implies more certainty than the data has.
4. **One interface everywhere.** The app, `/demo`, the public report and the PDF use the same components and tokens.
5. **Accessible by default.** WCAG 2.2 AA (§12). SiteLens should score "good" on its own audit.
6. **Use the preset; don't restyle by hand.** Components come from the installed `base-lyra` style. New visual decisions become tokens in `globals.css`, never one-off classes.

---

## 2. Foundations

| Item | Value |
|---|---|
| Component style | shadcn `base-lyra` (Base UI primitives), CSS variables, `rsc: true` |
| Base color | `stone` neutrals |
| Primary (brand) | Orange: light `oklch(0.553 0.195 38.402)`, dark `oklch(0.47 0.157 37.304)`. For primary buttons, links, focus accents and the logo mark. **Never used for status** |
| Radius | `--radius: 0.625rem`, with the derived `--radius-sm` … `--radius-4xl` scale already in `globals.css` |
| Fonts | **Oxanium** for headings (`--font-heading`), **Outfit** for UI and body text (`--font-sans`), **Geist Mono** for code, URLs and selectors (`--font-mono`). Geist Sans is loaded in `layout.tsx` but unused, so remove it at implementation |
| Icons | **Hugeicons** (`iconLibrary: hugeicons`). Outline style, 16 px inline and 20 px in buttons and navigation |
| Logo (until a real one exists) | The wordmark "SiteLens" in Oxanium semibold, next to a Hugeicons search or lens icon in the primary color |
| Themes | Light and dark from day one, via the `.dark` class (`next-themes`). With no saved choice the app follows the system setting. The top-bar toggle is one icon button that switches between light and dark, and the choice is saved in the browser (there is no "System" option). **The PDF is always light.** Public reports follow the viewer's system setting |
| Motion | Short, functional transitions (150–200 ms). No decorative animation. Everything respects `prefers-reduced-motion` |

---

## 3. Color tokens

### 3.1 Existing (preset)
`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1…5` (an orange ramp) and the `--sidebar-*` tokens. They are defined in `app/globals.css` for `:root` and `.dark`. **They are used as is,** with one change from the contrast test (§3.3): light `--muted-foreground` is `oklch(0.54 0.013 58.071)` instead of the preset's `0.553`, because the preset value was 4.41:1 on `--muted` (the "Not applicable" and "Info" badges).

**`--link` (new)** is the color of text links: light `oklch(0.553 0.195 38.402)` (the same as `--primary`), dark `oklch(0.705 0.213 47.604)`. It exists because the dark `--primary` is only 2.69:1 as text on the dark background; it works as a button fill, not as link text. The Button `link` variant uses it.

`--chart-1…5` is an orange ramp, so it is used only for **single-series brand visuals**, such as the landing page. Data charts use the category tokens (§3.4).

### 3.2 Score bands (new)

Each band has three tokens:
- a solid color for gauges and chart marks;
- `-fg` for text and icons on the soft background;
- `-bg` for the soft badge background.

| Token | Light | Dark |
|---|---|---|
| `--score-good` | `oklch(0.62 0.16 152)` | `oklch(0.72 0.17 152)` |
| `--score-good-fg` / `-bg` | `oklch(0.42 0.12 152)` / `oklch(0.95 0.04 152)` | `oklch(0.85 0.13 152)` / `oklch(0.30 0.06 152)` |
| `--score-average` | `oklch(0.66 0.15 80)` | `oklch(0.80 0.15 85)` |
| `--score-average-fg` / `-bg` | `oklch(0.47 0.10 70)` / `oklch(0.96 0.05 90)` | `oklch(0.88 0.12 85)` / `oklch(0.32 0.06 75)` |
| `--score-poor` | `oklch(0.60 0.21 25)` | `oklch(0.68 0.19 25)` |
| `--score-poor-fg` / `-bg` | `oklch(0.47 0.17 25)` / `oklch(0.95 0.03 25)` | `oklch(0.82 0.11 25)` / `oklch(0.31 0.08 25)` |

The bands follow PRD §8.2: 0–49 is **Poor**, 50–89 is **Needs improvement** and 90–100 is **Good**.

The amber "average" hue (75–90) is deliberately far from the brand orange (38), so a mid-range score never looks like a button.

The light `--score-average` started at lightness 0.76, which is only 2.18:1 against the white card. It is 0.66 (3.16:1) so gauges and chart marks stay visible.

### 3.3 Severity, check results, statuses (new)

| Meaning | Token family | Light fg / bg | Dark fg / bg | Badge style |
|---|---|---|---|---|
| Severity **critical** | `--severity-critical` | `oklch(0.98 0 0)` on solid `oklch(0.50 0.20 15)` | `oklch(0.98 0 0)` on solid `oklch(0.55 0.20 15)` | **Solid fill** with an icon. The only solid severity badge |
| Severity **high** | `--severity-high` | `oklch(0.48 0.17 27)` / `oklch(0.95 0.03 27)` | `oklch(0.80 0.12 27)` / `oklch(0.30 0.07 27)` | Soft, with an icon |
| Severity **medium** | `--severity-medium` | `oklch(0.48 0.10 70)` / `oklch(0.96 0.05 88)` | `oklch(0.87 0.12 85)` / `oklch(0.32 0.06 75)` | Soft, with an icon |
| Severity **low** | `--severity-low` | `oklch(0.45 0.10 245)` / `oklch(0.95 0.03 245)` | `oklch(0.82 0.08 245)` / `oklch(0.30 0.06 245)` | Soft, with an icon |
| Result `passed` | reuses `--score-good-*` | | | Check icon, "Passed" |
| Result `warning` | reuses `--score-average-*` | | | Warning icon, "Warning" |
| Result `failed` | reuses `--score-poor-*` | | | Cross icon, "Failed" |
| Result `not_applicable` | `--muted` / `--muted-foreground` | | | Dash icon, "Not applicable" |
| Result `unable_to_verify` | `--unverified` | `oklch(0.45 0.12 290)` / `oklch(0.95 0.03 290)` | `oklch(0.82 0.09 290)` / `oklch(0.30 0.06 290)` | Question-mark icon, "Unable to verify" |
| Info and running states | `--info` | `oklch(0.45 0.12 245)` / `oklch(0.95 0.03 245)` | `oklch(0.82 0.08 245)` / `oklch(0.30 0.06 245)` | Spinner or info icon |
| Level **failure** | reuses `--score-poor-*` | | | Cross icon, "Failure" |
| Level **warning** | reuses `--score-average-*` | | | Warning icon, "Warning" |
| Level **recommendation** | reuses `--info` | | | Lightbulb icon, "Recommendation" |
| Level **informational** | `--muted` / `--muted-foreground` | | | Info icon, "Info" |

**Level badges replace result badges for checks that have levels** (SEO for now, PRD §7). They are told apart from "Not applicable" and the running state by their icon and label.

**Token names.** Each family has `-fg` and `-bg` tokens: `--severity-high-fg` / `--severity-high-bg` (also `medium` and `low`), `--unverified-fg` / `-bg` and `--info-fg` / `-bg`. Critical has a solid `--severity-critical` and its text color `--severity-critical-fg`. They are mapped in `@theme inline`, so classes like `text-severity-high-fg` and `bg-info-bg` work. High, medium and low have **no solid color** yet; the task that builds the severity chart (§7.6) defines them.

**Contrast test.** `apps/web/lib/tokens.test.ts` reads `globals.css` and runs in CI. In both themes it checks that:
- every fg/bg pair is **≥ 4.5:1**, including the preset pairs that carry text and `--link`;
- every solid mark (score bands, critical, the §3.4 category colors) is **≥ 3:1** against both the card and the page background.

Token values must stay literal `oklch()` so the test can read them.

### 3.4 Category colors (data charts only)

| Category | Light | Dark |
|---|---|---|
| SEO | `oklch(0.58 0.15 250)` (blue) | `oklch(0.70 0.14 250)` |
| Performance | `oklch(0.62 0.11 190)` (teal) | `oklch(0.74 0.11 190)` |
| Accessibility | `oklch(0.56 0.17 295)` (violet) | `oklch(0.70 0.15 295)` |
| Technical & Security | `oklch(0.50 0.04 255)` (slate) | `oklch(0.72 0.04 255)` |
| UX & Conversion | `oklch(0.60 0.18 340)` (magenta) | `oklch(0.72 0.16 340)` |

The tokens are `--category-seo`, `--category-performance`, `--category-accessibility`, `--category-technical` and `--category-ux`.

**Rule:** orange and red are never used for data series, so they can't be confused with the brand or with "poor".

### 3.5 Color rules
- **Color never stands alone.** Every score, severity, result and status badge has **an icon and a text label**. Every score shows its number.
- **Brand orange** (`--primary`) is used for primary buttons, links (through `--link`, §3.1), the active navigation item, focus accents, the demo banner's call to action, and the logo. It is **never** used for a score, severity, result or audit status.
- **`--destructive`** is used only for destructive actions, such as delete buttons and their confirmation dialogs. It is not a severity color.

---

## 4. Typography, spacing and layout

**Type scale** (Tailwind classes)

| Use | Style |
|---|---|
| Page title (h1) | `font-heading text-2xl md:text-3xl font-semibold`. Exactly one per page |
| Section (h2) | `font-heading text-xl font-semibold` |
| Card title (h3) | `font-heading text-base font-semibold` |
| App body | `text-sm` (14 px). Dense screens use 14 px |
| Reading text | `text-base` (16 px), for the public report, landing page, AI summary and long explanations |
| Meta and captions | `text-xs` (12 px) in `--muted-foreground`. Never for important information |
| Score numbers | `font-heading tabular-nums`. Large gauges 40–48 px, cards 28–32 px, table pills 14 px |
| Code, URLs, selectors | `font-mono text-xs`, wrapping, with a copy button where useful |

**Spacing and layout**
- **Scale:** Tailwind's 4 px scale. Gaps inside a card are 8, 12 or 16 px; gaps between cards and sections are 16 or 24 px.
- **Page padding:** 24 px from `lg` up, 16 px below.
- **App shell:** a left sidebar 256 px wide (collapsible to a 56 px icon rail) and a top bar 56 px tall. Content is at most **1440 px** wide. Reading columns (summaries, explanations) are at most **72 characters** per line.
- **Surfaces:** cards use `--card` with a 1 px `--border` and the preset radius. Shadows are reserved for popovers, dialogs and sheets. Cards don't nest more than one level deep.
- **Density:**
  - tables use compact rows (40 px) with a 14 px font;
  - on touch, every interactive target is at least **24×24 px** (WCAG 2.5.8), and preferably 40 px.

---

## 5. Navigation and routes

**Sidebar** (top to bottom): **Overview**, **Websites**, **Audits**, **Issues**, **Reports**, **Settings**, then **Admin** (admin only, Phase 3). The user menu and plan badge sit at the bottom.

- The current section is highlighted with `--sidebar-primary`.
- **Below `lg`** the sidebar becomes an off-canvas sheet, opened with a menu button.

**Top bar** contains:
- **breadcrumbs** that follow the website-centered structure, e.g. *Websites › example.com › Audit 22 Nov 2026 › Issues*;
- the **New audit** button (the quick audit box, §6.2);
- notifications, a theme toggle and the user menu.

**Routes** are listed in Tech.md §4.1. **Pages are organized around each website.** An audit always shows its website in the breadcrumb, and website pages link to their audits and issues.

---

## 6. Screens

The phase of each screen follows PRD §2.

### 6.1 Overview (`/overview`), the home screen after sign-in
- **Quick audit card** at the top (§6.2).
- **Website cards:** name, client, latest score gauge (small), a sparkline of whole-site scores, the last audit date, and the open critical and high issue counts.
- **Recent audits:** a table with website, mode, status badge, score and date.
- **Open critical and high issues** across all websites, the 10 newest, with a link to Issues.
- **Plan usage meter** (Phase 3), e.g. "Free audit: used" or "Pro: 12 of 30 audits this month".

### 6.2 Quick audit box
A dialog opened from the top bar, and a card on the Overview page. It contains:
- a URL field (with `https://` pre-filled when the user leaves it out);
- a **Single page / Whole site** segmented control, which defaults to Whole site;
- an optional Client picker, shown only when the website is new;
- a **Start audit** button.

Validation happens inline (§9). On the free plan, the Turnstile widget appears above the button (Phase 3). On success, the user goes to the audit's progress view.

### 6.3 Websites (`/websites`, `/websites/[id]`)
- **List:** a table, or cards on mobile, with filters by client and a search field. Columns: name, hostname, client, latest score, last audit, open issues.
- **Detail page:**
  - **header:** name, hostname (final and as entered, when they differ), client, latest score and band;
  - **actions:** New audit, Compare (Phase 2), Edit, Delete;
  - **trend chart** of whole-site audits: overall score plus category lines that can be toggled;
  - **audit history** with two tabs, **Whole site** and **Single page**;
  - an open-issues summary by category;
  - **Page types:** the list of corrections, editable (applied from the next audit).
- **Edit:**
  - name, description and client can be edited;
  - the URL field is **read-only after the first audit**, with the hint "To audit a different address, add a new website";
  - the switch **"This website isn't meant to be indexed (e.g. a staging site)"**, with the hint "Applies from the next audit. Noindex and robots.txt blocks won't count as problems";
  - the list of pages marked **intentionally noindex**, editable;
  - deleting needs the hostname typed in (§7.8).

### 6.4 Audits (`/audits`) and the progress view (`/audits/[id]` while queued or running)
- **List:** website, mode, status, score, date, duration, with filters by website, client, status, mode and date.
- **Progress view:**
  - header with the URL, mode and status badge;
  - **while queued:** "2nd in line · about 10 minutes";
  - the **list of 12 stages** in PRD §15 order. Each stage is pending, running (spinner), completed, failed or skipped, and shows its own progress, e.g. "Crawling — 6 of 10 pages";
  - a progress bar for **"Pages: x of 10"**, and the elapsed time;
  - a **Cancel audit** button, with a confirmation dialog;
  - the note "You can leave this page. We'll notify you when the audit finishes."
  - Updates are announced through a polite `aria-live` region. **Results appear only when the audit finishes**; the page then switches to the results Overview tab.

### 6.5 Audit results (`/audits/[id]/…`), with 5 tabs

**Header (on every tab):** website, date, mode, status badge, method version, and the actions Re-run, Share (Phase 2), PDF (Phase 2) and Compare (Phase 2).
- **Partially completed:** a warning banner lists what's missing.
- **AI failed:** the "AI unavailable" banner with its one retry (§8).

**Overview tab**
- **Overall score gauge** with its band label. Marked **Provisional** when a category is missing, and showing a **Capped** chip with the reason when a cap applies.
- **5 category cards:** score, band, coverage %, and, for UX, the AI coverage ("AI coverage: 3/10 pages"). The SEO card also shows counts by level, for example "2 warnings · 9 recommendations", which link to the Issues tab.
- **AI executive summary card,** labelled "AI-generated", with priorities and strengths.
- **Findings by severity** (a horizontal bar with counts and labels) and the passed-checks count.
- **Top issues:** the 10 with the highest severity. An icon marks the ones that have AI advice.
- **Pages scanned:** "x scanned · y excluded · z failed", with a link to the Pages tab.
- **Limitations panel:** "Unable to verify" counts, missing categories, bot protection, and the accessibility disclaimer.
- **Audit details:** duration, and the Lighthouse, axe and crawler versions.

**Issues tab**
- A data table with filters for **level, category, severity, status, page, detection method (automated, manual review)** and **new / recurring**, plus a search field.
- **Failures and warnings are shown by default.** An **Include recommendations** toggle adds the rest. Informational findings never appear here; they're on the page detail view.
- Columns: level, severity, title, category, pages affected, status, first detected, and a "New" tag. Rows can be sorted.
- Ignored issues are hidden by default; there's a toggle to show them.

**Pages tab**
- One row per discovered URL: status, reason, page type, the 5 category scores for that page, and the device flags.
- Clicking a row opens the **page detail** view:
  - header with the URL, page type (with a "Correct type" control), language and HTTP status;
  - the page's category scores;
  - the screenshots viewer (§7.9);
  - checks grouped by category, with level badges. Informational findings are in a separate **Info** group;
  - on a noindex page, the action **Mark as intentionally noindex** (applies from the next audit);
  - **AI content analysis**: observations with a confidence badge, and rewrite suggestions with copy buttons;
  - **Visual analysis** (Phase 2): a launch button and its results.

**Performance tab**
- A table per page: mobile score, desktop score, combined score, LCP, CLS and TBT, with a "Partial" flag where one device failed.
- Opportunities grouped across pages, sorted by savings.
- **Real-user data panel:** labelled "Real users (CrUX), 28-day period: [dates]". It covers page and site data, with phone/desktop tabs and the p75 values with their thresholds, including INP. When there's no data: "No real-user data available for this page or site." A note says that field data doesn't affect the score.

**Technical tab** shows these panels:
- availability and redirects
- HTTPS and certificate (issuer, expiry)
- security headers (header, value seen, result)
- cookies seen while loading (name, Secure, HttpOnly, SameSite; "observed during page load only")
- robots.txt (status and an excerpt)
- sitemap (URL, number of URLs, problems)
- detected technologies (name, version, confidence; informational)
- the full list of discovered URLs with their outcomes

### 6.6 Issue detail (`/issues/[id]`)
- **Header:** title, severity badge, category, a **status control** (Phase 2: Open, In progress, Resolved, Ignored, plus a private note field), first and last detected dates, and a "Regression" chip where it applies.
- **Explanation:** description, impact and recommendation (fixed texts), then the **AI advice card**, labelled "AI-generated", if the issue was in the top 15.
- **Occurrences grouped by page** (an accordion). Each one shows evidence blocks (§7.10), the devices it was seen on, and a link to the related screenshot area.
- **Status history timeline** (who or "System", what changed, which audit, the note).
- **Related issues,** e.g. "Also reported under Accessibility".

### 6.7 Issues (`/issues`)
All issues across websites, in the same data table as §6.5 plus **website** and **client** filters, and a date range. Ignored issues are hidden by default.

### 6.8 Compare (`/websites/[id]/compare?a=&b=`), Phase 2
- **Two audit pickers** (whole-site audits only), with a swap button.
- **Method notice** when the versions differ (§9).
- **Score change cards:** each shows the score and the change ("▲ +6" or "▼ −4"), with an icon and text as well as color.
- **Issue tabs:** **New**, **Resolved**, **Recurring**.
- **Page changes:** pages added or removed, and score changes per page.

### 6.9 Visual analysis (Phase 2)
- **Before starting:** a confirmation dialog that states the quota used ("This uses 1 of your 20 visual analyses this month.").
- **Running:** a progress state.
- **Results:**
  - a criteria table: criterion, result badge, confidence, evidence, and a section link that scrolls the screenshot viewer to the numbered marker;
  - strengths, issues and recommendations;
  - suggested copy with copy buttons;
  - "Partially analyzed" when it applies;
  - a run history selector;
  - the revision note, e.g. "UX score updated from 68 to 72 (revision 1). Original audit score unchanged."

### 6.10 Reports (`/reports`), Phase 2
- **Public links:** audit, created, expires, views, status (Active, Expired, Revoked, Disabled), and the actions Copy link and Revoke.
- **PDFs:** audit, created, status, and the actions Download and Regenerate.
- **Create-link dialog:** expiry (7, 30 or 90 days, or Never), an "Include ignored issues" switch (off by default), and the URL shown **once** with a copy button.

### 6.11 Settings
- **Profile:** name, and the email (read-only).
- **Appearance:** theme.
- **Branding (Phase 2):** company name and logo upload (PNG, JPG or WebP, max 1 MB) with a preview of the PDF cover. On the free plan the fields are locked, with "Available on Pro".
- **Billing (Phase 3):** plan, usage this period, the period end date, Upgrade, and Manage subscription (the Stripe portal).
- **Notifications (Phase 3):** the "Email me when an audit finishes" switch.
- **Privacy (Phase 3):** Export my data, and Delete my account (with a typed confirmation and an explanation of the 30-day erasure).

### 6.12 Upgrade (`/upgrade`), Phase 3
A Free vs Pro comparison table (rows from PRD §3), the price (open item O1), and a **Continue to checkout** button. It is reached from every action the free plan blocks.

### 6.13 Admin (`/admin/...`), Phase 3, admin only
Tabs:
- **Users:** plan, audits used, AI cost; grant or remove Pro.
- **Costs:** cost per audit; daily and monthly totals by bucket; free budget left.
- **Limits & budget:** the settings from DB.md §3.8.
- **AI models:** the model per task.
- **Blocked sites.**
- **Public reports:** disable a link, with a reason.
- **Demo:** pick the audits and publish.
- **Activity log:** `admin_actions`, including limit bypasses.

These pages use plain data tables. Changing a setting asks for confirmation.

### 6.14 Landing page (`/`), Phase 1
It is **designed with the owner, section by section.**

**Fixed constraints:**
- it uses the same tokens and fonts;
- it is fully responsive and fast (aiming for "good" in SiteLens's own audit);
- its main button says **"Sign in"** until the demo exists. From Phase 3 the buttons are **"Explore demo"** and **"Start your free audit"**.

### 6.15 Auth screens
- **Sign in:** centered card, SiteLens wordmark, "Continue with Google". Email/password arrives in Phase 3 with a link to sign up.
- **Errors:** shown inline.
- **Not on the allowlist (Phases 1–2):** the Google sign-in completes, the user is signed out again, and the sign-in card shows the `EMAIL_NOT_ALLOWED` message (§9.4) inline.
- **After email sign-up:** a "Check your inbox" state.

---

## 7. Components and patterns

The names below refer to shadcn components from the installed preset. They are confirmed through the shadcn MCP (§15).

### 7.1 ScoreGauge
- **Shape:** a ring from 0 to 100, filled in the band color, with the number in the center (Oxanium, tabular) and the **band label** underneath.
- **Sizes:** sm (40 px), md (96 px), lg (160 px).
- **No score:** an empty ring with "—" and the label **"Insufficient data"**.
- **Markers:** "Provisional" and "Capped" appear as chips below it.
- **Accessibility:** `role="img"` with an accessible name such as "Overall score 82 of 100, needs improvement".
- **Motion:** none when `prefers-reduced-motion` is set.

### 7.2 ScorePill
For table cells and lists: the number plus a small band dot, plus a tooltip with the band name. In narrow cells, the visible band text may be hidden, but the accessible name must include it.

### 7.3 Badges
- **SeverityBadge:** icon + label (Critical, High, Medium, Low), using the §3.3 tokens.
- **ResultBadge:** Passed, Warning, Failed, Not applicable, Unable to verify.
- **AuditStatusBadge:**

  | Status | Style |
  |---|---|
  | Queued | neutral, clock icon |
  | Running | info, spinner |
  | Completed | good, check icon |
  | Partially completed | average, half-circle icon |
  | Failed | poor, cross icon |
  | Cancelled | muted, slash icon |

- **IssueStatusBadge:** Open (outline), In progress (info), Resolved (good), Ignored (muted, eye-off icon).
- **LevelBadge:** Failure, Warning, Recommendation, Info (§3.3). Recommendation and Info add a tooltip: "Doesn't affect the score."
- **ConfidenceBadge:** High, Medium, Low confidence, in neutral styling. Low adds a tooltip: "Shown for information; doesn't affect scores."
- **Chips:** "AI-generated" (with a sparkle icon) on every piece of AI content, and "New" or "Regression" on issues.

### 7.4 Cards
- Category score card, website card, summary card, limitation card.
- **Each card has one clear purpose.** The title is in the card header, and a primary action, if any, sits in the footer or header right.

### 7.5 Data tables
- Built on shadcn Table with TanStack Table: sorting, filtering and pagination (25 rows a page), and a sticky header.
- **Filters:** a toolbar above the table with faceted select menus. The URL query string reflects the filters, so links can be shared and the back button works.
- **Rows:** a row is clickable when it leads to detail. Its primary cell is a real link, for keyboard and screen-reader users.
- **Below `md`:** rows become stacked cards with the key fields.
- **No results:** "No issues match these filters", with a **Clear filters** button.

### 7.6 Charts
- **Library:** shadcn Chart (Recharts).
  - **Trends:** a line chart, with category lines from §3.4 and the overall score as a thicker `--foreground` line.
  - **Severity distribution:** a stacked bar.
- **Every chart has:** a title, a legend with direct labels, keyboard-reachable tooltips, and a **text alternative**. That is a visually hidden summary ("Overall score rose from 64 to 82 over 5 audits") plus a "View as table" toggle.
- **Score axes** run 0–100 with band guide lines at 50 and 90.
- **Reduced motion:** Recharts animates in JavaScript, which the global `prefers-reduced-motion` CSS rule doesn't reach. Charts turn their animation off (`isAnimationActive={false}`) when the user prefers reduced motion.

### 7.7 Forms
- **Labels** always sit above the input; placeholders are never the only label. Helper text goes below.
- **Validation** happens on submit, then on change. Errors appear inline, linked with `aria-describedby`, and are summarized at the top of long forms.
- **While submitting,** the button shows a spinner and is disabled; the rest of the form stays readable.
- **Server errors** appear as an Alert at the top, using the copy from §9.

### 7.8 Dialogs and destructive actions
- **Dialogs** trap focus, close on Esc, and return focus to the element that opened them.
- **Typed confirmation** is required for deleting a website, an audit or the account: "Type **example.com** to confirm".
- **Destructive buttons** use `--destructive`, and their labels name the action ("Delete website"), never just "OK".

### 7.9 Screenshot viewer
- **Layout:** a desktop/mobile toggle, a scrollable full-page image (lazy-loaded at decreasing resolution), zoom (fit width or 100%), and numbered markers for AI section references.
- **Messages:** "Screenshot truncated at 16,000 px" when it was cut off, and "Screenshot no longer available (retention ended)" when it was deleted.
- **Alt text:** "Screenshot of {url} on {device}, captured {date}".

### 7.10 Evidence blocks
- **Measured value against the threshold,** e.g. "Title length: **72 characters** (recommended 30–60)".
- **Element:** the selector in mono font, plus an HTML snippet (escaped, at most 10 lines, with an Expand button) and a copy button.
- **Resource:** the URL in mono font, its status code, and the page it was found on.
- **Device tags:** Desktop, Mobile, or Both.
- **The code is never rendered as live HTML.**

### 7.11 Progress tracker
The stage list from §6.4. Each stage row has:
- an icon and the stage name, in plain words, e.g. "Checking accessibility";
- its own progress ("6 of 10");
- a duration once it's done;
- the error summary if it failed.

### 7.12 Toasts and notifications
- **Toasts** (`sonner`) are for short confirmations ("Link copied", "Status updated"). **Errors that need action never appear only as a toast.**
- **The notification bell** shows unread in-app notifications ("Audit of example.com completed — score 82"). Clicking one opens the audit and marks it read.

### 7.13 Empty states
An icon, one sentence and one primary action.

| Screen | Text | Action |
|---|---|---|
| Overview with no websites | "Run your first audit to see scores, issues and AI insights here." | Start audit |
| Websites | "No websites yet. Start an audit and we'll add the website for you." | New audit |
| Issues | "No open issues. Nice work." | Show resolved issues |
| Reports | "No shared reports yet. Open an audit and choose Share." | — |
| Audit history | "No audits yet for this website." | Start audit |

---

## 8. States

**Loading**
- Skeletons match the final layout (gauge circles, card blocks, table rows). Don't use a spinner for a whole page.
- **Slow requests:** if loading takes more than 10 s, show "Still loading…" with a Retry button.

**Errors**
- **Page-level:** the error boundary says what failed and offers **Try again** and **Go to Overview**. The technical code is shown in small mono text for support.
- **Sections:** fail on their own. One failed card doesn't blank the page.

**Partial and missing data**

| State | How it appears |
|---|---|
| `partially_completed` audit | An average-colored banner: "Some results are missing" with a list, e.g. "2 pages failed (timeout) · Desktop performance missing on 1 page · UX & Conversion: insufficient data" |
| Unable to verify | ResultBadge plus the reason, e.g. "Unable to verify — login required" or "Blocked by bot protection" |
| Not applicable | ResultBadge plus the reason, e.g. "Not applicable — readability is only measured for English" |
| Insufficient data | "Insufficient data: less than 60% of this category's checks could be verified" |
| Provisional overall score | "Provisional — calculated without: Performance" |
| Capped score | "Capped at 30 by: Homepage is noindex" |
| Partial performance result | "Partial: desktop test failed" |
| No real-user data | "No real-user data available for this page or site." |
| Noindex that may be intended | Info badge: "This page is noindex. Check that this is intended.", with the action **Mark as intentional** |
| Cross-domain canonical | Info badge: "Cross-domain canonical. Check that this is intended." |
| Advisory check | "Advisory: shown for guidance; doesn't affect the score." |

**AI unavailable:** a banner on the Overview tab: "AI insights are unavailable for this audit. Scores and findings are complete." with a **Retry AI** button that can be used once. After that retry fails: "AI insights couldn't be generated."

**Low-confidence AI content:** shown in a separate "Lower-confidence observations" group, with the note "Shown for information; doesn't affect scores."

**Method change:** when comparing audits or viewing trends: "These audits use different scoring methods (2026.1 vs 2026.2), so score changes may partly come from the method."

**Queue:** "Waiting to start — 2nd in line · about 10 minutes". When the worker is offline for a while: "Waiting for an available auditor. Your audit will start automatically."

---

## 9. Messages and error copy

The wording below is exact. `[date]` uses the date format in §14; `[time]` adds the time.

### 9.1 Limit messages (PRD §12, DB.md §6.1)

| Error code | Message | Action shown |
|---|---|---|
| `FREE_AUDIT_USED` | You've used your free audit. Upgrade to Pro to run more audits. | Upgrade |
| `FREE_EMAIL_USED` | This email address has already used its free audit. | Upgrade |
| `DISPOSABLE_EMAIL` | Please use a permanent email address. | — |
| `FREE_NETWORK_LIMIT` | Free audits aren't available from this network right now. Try again after [date]. | — |
| `TURNSTILE_FAILED` | We couldn't verify you're human. Please try again. | Retry |
| **`FREE_SITE_LIMIT`** | **This site can't be audited on the free plan right now. Try again after [date].** | Upgrade |
| `SITE_HOURLY_LIMIT` | This site can't be audited right now. Try again after [time]. | — |
| `FREE_AUDITS_PAUSED` | Free audits are paused until [date]. You can still explore the demo. | Explore demo |
| `AUDIT_ALREADY_RUNNING` | You already have an audit running. Wait for it to finish or cancel it. | View audit |
| `PRO_QUOTA_EXHAUSTED` | You've used this month's audits. They reset on [date]. | — |
| `WEBSITE_LIMIT` | Free plan: "The free plan includes one website. Upgrade to Pro to add more." · Pro: "You've reached your plan's limit of 10 websites." | Upgrade (free) |
| `SITE_BLOCKED` | This site has asked not to be audited by SiteLens. | — |
| `EMAIL_NOT_VERIFIED` | Verify your email address to start your first audit. | Resend email |

**No message ever mentions other users,** or whether anyone else audited a site.

### 9.2 Input and audit failure messages

| Code | Message |
|---|---|
| `INVALID_URL` | Enter a full website address, like https://example.com. |
| `UNSAFE_URL` | This address can't be audited. SiteLens only audits public websites. |
| `DNS_NOT_FOUND` | We couldn't find this website. Check the address and try again. |
| `CONNECTION_FAILED` / `TIMEOUT` | The website didn't respond in time. It may be down or very slow. |
| `BOT_PROTECTION` | The website blocked our crawler with bot protection, so we couldn't check it. We never bypass these protections. |
| `LOGIN_REQUIRED` | This page requires a login, so it couldn't be checked. |
| `TOO_LARGE` | This page is larger than 10 MB, so it wasn't checked. |
| `AUDIT_TIME_LIMIT` | The audit reached its 15-minute limit. Results collected so far are shown. |
| `WORKER_INTERRUPTED` / `INTERNAL_ERROR` | Something went wrong on our side. Your audit credit has been returned. *(Only when a credit was actually returned. Otherwise: "Something went wrong on our side. Please try again.")* |

### 9.3 Fixed disclaimers
- **Accessibility:** "Automated testing finds some accessibility barriers, not all. It does not prove WCAG compliance."
- **Security:** "These are passive checks of publicly visible configuration. Missing headers are hardening opportunities, not confirmed vulnerabilities. Cookies were observed during page loading only."
- **AI:** "AI-generated. Based on the page content and screenshots captured during this audit. It may be wrong — verify before acting." Visual analysis adds: "Doesn't predict conversion rates."
- **Public report footer:** "Automated assessment by SiteLens. Not affiliated with or endorsed by the site owner." followed by "Request removal: [contact]".

### 9.4 Sign-in messages

| Code | Message | Phase |
|---|---|---|
| `EMAIL_NOT_ALLOWED` | This account doesn't have access to SiteLens yet. | 1–2 (removed with the allowlist in Phase 3) |

---

## 10. Reports and PDF

**Public report (`/r/[token]`)**
- **Layout:** standalone, with no app navigation, and fully responsive: a single column on phones, max width 960 px.
- **Header:** the SiteLens wordmark, plus the user's logo and company name on Pro and admin accounts.
- **Sections, in order:**
  1. the website and date;
  2. the overall gauge and category cards;
  3. the summary;
  4. findings by category, collapsible, with evidence;
  5. screenshots;
  6. scanned pages;
  7. limitations and coverage;
  8. methodology (a short version of PRD §8);
  9. the footer disclaimer (§9.3).
- **Ignored issues** are hidden unless the link includes them.
- **Expired or revoked links** show "This report link has expired or was revoked." No other details are revealed.

**PDF** (A4 portrait, 15 mm margins, always the light theme)
1. **Cover:** SiteLens wordmark, optional user logo and company name, website, audit date, a large overall score gauge with its band, and the category scores.
2. **Executive summary** (AI-generated label) and priorities.
3. **Category score overview** with coverage and caps.
4. **Top issues**, then **all findings by category.** Each finding shows severity, pages affected, recommendation and the key evidence. Finding blocks don't break across pages.
5. **Pages scanned** (a table), **methodology**, **limitations**, disclaimers.

Every page has the footer "SiteLens · example.com · 22 Nov 2026 · Page 3 of 12". Screenshots are scaled to the column width, with truncation notes.

---

## 11. Demo (`/demo`), Phase 3

- **The same screens and components as the app,** reading the published demo data. It opens on the demo audit's **Overview tab**. Settings and Admin are hidden.
- **The banner** sticks to the top of every demo page:
  - text: "You're exploring a demo audit. Create a free account — your first full audit is free.";
  - a primary **Create free account** button;
  - the banner background is neutral `--muted`; the button is brand orange.
- **Blocked actions stay visible and focusable,** not disabled, so keyboard and screen-reader users still find them. Activating one opens a dialog: "Create a free account to do this", with **Create free account** and **Keep exploring**. This covers:
  - run, re-run and visual analysis;
  - adding websites;
  - creating public links.
- **Status changes and ignoring work in the browser only.** The first time, a toast says "Demo only — changes reset when you reload."
- **The PDF** can be previewed and downloaded; it is pre-generated.

---

## 12. Accessibility of SiteLens itself (WCAG 2.2 AA)

**Page structure**
- A **skip link** ("Skip to content") is the first focusable element.
- Landmarks are `header`, `nav` and `main`, with one `h1` per page and headings in order.
- **Language:** `lang="en"`. AI quotes in other languages are wrapped with their own `lang` attribute.

**Keyboard and focus**
- **Everything works with the keyboard:** tabs, tables (sort buttons), filters, dialogs, the screenshot viewer, and the chart tooltips and tables.
- **Focus is always visible,** using the preset's `--ring` focus style (`outline-ring/50` plus the component focus rings). Focus is never hidden.

**Size and color**
- **Target size:** at least 24×24 CSS px (2.5.8), and 40 px for touch targets in the main flows.
- **Contrast:** text is 4.5:1 or better, and large text and UI parts 3:1 or better, in both themes. This is checked by the token test (§3.3).
- **Color is never the only signal** (§3.5).

**Live updates and forms**
- **Announcements:** progress, toasts and filter result counts are announced politely, and errors assertively.
- **Forms:** every field has a label; errors are linked to their field and announced.
- **Status messages** use `role="status"`.

**Media and motion**
- **Charts and gauges** have text alternatives (§7.1, §7.6).
- **Screenshots** have descriptive alt text.
- **No content flashes;** `prefers-reduced-motion` turns off animations.

**Testing:** axe runs in Playwright end-to-end tests on the main screens (Phases 2–3), plus a manual keyboard pass before each phase ends.

---

## 13. Responsive behavior

| Breakpoint | Layout |
|---|---|
| < 640 px (`sm`) | One column. Sidebar becomes a sheet. Tables become stacked cards. Tabs scroll horizontally. Score gauges are md size. The quick audit dialog is full-screen |
| 640–1023 px | Two-column card grids. Sidebar still a sheet. Tables show their key columns, the rest in a row expander |
| ≥ 1024 px (`lg`) | Fixed sidebar (collapsible to icons), full tables, side-by-side panels on detail pages |
| ≥ 1280 px (`xl`) | 3–4 column card grids on Overview and Websites |

- **The app is designed for desktop first,** but every screen must be usable at **390 px** without horizontal scrolling.
- **Public reports** are designed for mobile and desktop equally.
- **The PDF** has its own print layout (§10).

---

## 14. Tone and formats

**Tone**
- **Voice:** plain, specific and calm. Say what was measured, why it matters and what to do: "3 images are missing alt text. Screen readers can't describe them. Add a short description of each image."
- **No blame or hype:** never "Your site is terrible" or "Guaranteed to boost conversions".
- **No absolute claims:** never "compliant", "secure" or "fully tested". Say "No automated violations found" or "No issues found in the checks we ran".
- **"We"** means SiteLens, as in "We couldn't reach this page".
- **AI content is always labelled** as AI-generated, with its confidence.
- **Button labels are verbs:** Start audit, Cancel audit, Copy link, Revoke link, Delete website.

**Formats**
- **Dates and times:** `Intl` with the browser locale, defaulting to the en-GB style "22 Nov 2026" and the 24-hour "14:05". Lists show relative time ("3 hours ago") with the exact date in a tooltip.
- **Durations:** "3 min 20 s".
- **Metrics:** LCP "2.4 s", TBT "180 ms", CLS "0.08", INP "190 ms". Sizes are "1.2 MB" or "340 KB".
- **Numbers:** scores and percentages are whole numbers. Large numbers use the locale's thousands separator. Score changes are "+6" and "−4", with a true minus sign and an arrow icon.
- **URLs** are shown without the scheme in tight spaces ("example.com/pricing"), and in full in evidence and tooltips.

---

## 15. Component set (`base-lyra`)

- **Installed in T02** from the `base-lyra` registry with the shadcn CLI, unchanged except where noted in the T02 PR:
  - layout and navigation: Sidebar, Breadcrumb, Tabs, Sheet, Dialog, Alert Dialog
  - data: Table, Chart, Progress, Skeleton, Accordion
  - controls: Dropdown Menu, Select, Toggle Group, Badge, Tooltip, Popover
  - feedback: Sonner, Alert, Spinner, Empty
  - surfaces: Card
  - forms: **Field** and **Label** (Base UI based, used with Server Actions), Input, Switch, Checkbox. The registry's Form component (react-hook-form) is not used
  - identity: Avatar
- **Done in T02:** the §3 tokens in `globals.css` (`:root` and `.dark`), mapped in `@theme inline`, with the contrast test (§3.3).
- **Reference page:** `/dev/ui` shows the logo, every token and every installed component in both themes. It exists only in development and returns "not found" in production.
- Choose the specific Hugeicons for each badge and stage (T33 and the progress view).
- Use any preset blocks the owner provides (for example the dashboard shell and data table) instead of hand-built versions.

---

## Change log

| Version | Date | Changes |
|---|---|---|
| v1 | 22 Nov 2026 | Approved by the owner |
| v1.1 | 23 Nov 2026 | §6.15 and §9.4: the `EMAIL_NOT_ALLOWED` sign-in message for the Phase 1–2 allowlist |
| v1.2 | 23 Nov 2026 | T02. §2: light/dark only, following the system until the user picks one (`next-themes`). §3.1: light `--muted-foreground` 0.553 → 0.54 and the new `--link` token, from the contrast test. §3.2: light `--score-average` 0.76 → 0.66. §3.3: token names, no solid high/medium/low yet, the contrast test. §3.4: category token names. §3.5: links use `--link`. §7.6: charts turn off animation for reduced motion. §15: the installed component set (Field + Label instead of Form; Card, Spinner and Empty added) and `/dev/ui` |
