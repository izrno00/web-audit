# SiteLens — Product Requirements (PRD)

**Status:** v1.1 · approved by the product owner 22 Nov 2026, updated 23 Nov 2026 (see the change log at the end)
**Companion documents:** [DB.md](DB.md) (data model) · [Tech.md](Tech.md) (architecture) · [UI-rules.md](UI-rules.md) (interface)

Markers used in this document:
- **Proposed — review:** a default chosen by the coding agent (thresholds, weights, lists). The owner should confirm or change it before implementation.
- **OPEN:** not decided yet. Listed in §17.

The owner approved all four documents on 22 Nov 2026. Implementation follows the phases in §2.

---

## 1. Vision, audiences and goals

SiteLens audits websites in five categories: **SEO, Performance, Accessibility, Technical & Security, and UX & Conversion**.

- It finds problems with automated checks and explains them in plain language with AI.
- Every finding comes with evidence and a recommendation.
- Scores are transparent: each one can be traced back to the checks and the formula that produced it.
- Every audit is saved as an unchangeable snapshot. Users can follow issues from one audit to the next.

**Audiences**
1. **Freelancers and agencies (primary).** They audit client and prospect websites and share professional reports.
2. **Business owners.** They use the same flows; summaries are written in plain language.
3. **The owner.** Uses SiteLens personally. It is also a portfolio project.

**Product goals**
- Reliable findings and correct measurements: a check never claims something it did not verify.
- Scores that can be explained and that stay consistent over time.
- Crawling that is safe for our infrastructure and polite to the websites being audited.
- AI insights that are useful, grounded in evidence and limited in cost.
- One coherent interface, shared by the app, the public demo, public reports and PDFs.

**Non-goals.** These are the exclusions from the brief. None of them may be added without the owner's approval.
- Scheduled audits
- Team collaboration
- Competitor or backlink analysis
- Keyword ranking tracking
- An AI conversational assistant
- Automatic website changes or deployment
- Active penetration testing
- Advanced white-labeling
- Auditing pages that require a login

---

## 2. Scope by phase

The documents describe the full product. Delivery happens in three phases, and each phase ends with the acceptance criteria in §16.

| Phase | Goal | Contents |
|---|---|---|
| **Phase 1 — Core** (target: about 5 days, plus the landing page) | The owner can audit real websites end to end | Monorepo, database and Google sign-in, **limited to a sign-in allowlist** (`ALLOWED_EMAILS`, kept through Phase 2) · websites and clients · quick audit box · the worker pipeline (discovery, rendering, all five categories with automated UX checks, page classification) · PageSpeed and CrUX data · scoring · AI executive summary, per-page content analysis and advice for the top 15 findings · live progress and cancellation · results UI with 5 tabs · issue grouping with automatic lifecycle (no manual statuses yet) · atomic audit-start function with the per-account limit and the hourly per-site limit · AI cost logging · a basic crawler info page · **landing page, designed with the owner section by section** · deployment to Vercel and hosted Supabase Free, with the worker running on the owner's PC |
| **Phase 2 — Completeness** | All features of the full MVP | On-demand AI visual analysis and UX score revisions · manual issue statuses and status history · history, trends and comparing any two audits · public interactive reports · PDF reports with an optional user logo and company name |
| **Phase 3 — Public launch** | Safe for strangers to use | Open sign-up: **the sign-in allowlist is removed** · `/demo` · the free plan with every abuse protection (§12) · Stripe Pro subscriptions · admin page · own domain, Resend, email/password sign-in and the "audit ready" email · Supabase Pro (and Vercel Pro if required, O9) · worker moved to a container host · Turnstile · Sentry · privacy policy and terms · GDPR export and deletion flows |

Phase 1 delivers the main features; polish comes after. The data model is built for the full product from day one, so later phases add features without migrating existing data.

**Sign-in allowlist (Phases 1–2).** Only the email addresses listed in `ALLOWED_EMAILS` can sign in. Everyone else sees the `EMAIL_NOT_ALLOWED` message (UI-rules §9.4). The allowlist is removed in Phase 3, when the free plan and every abuse protection go live.
- **Accepted risk:** in Phases 1–2, `start_audit` enforces only L7, L10, L12 and the website limit (DB.md §6.1). A free-plan account on the allowlist can therefore run more than one audit, because L1 arrives in Phase 3. This is accepted because only people the owner trusts are on the allowlist.

---

## 3. Access levels and plans

| | **Admin** (the owner) | **Free** | **Pro** (Stripe, Phase 3) | **Demo visitor** |
|---|---|---|---|---|
| How you get it | `role = admin`, set by hand in the database; there is no sign-up path for it | Sign up with a verified email. Google sign-in counts as verified | Stripe subscription, or granted by the admin | Open `/demo`, no account needed |
| Audits | Unlimited | **1 per account, ever** | 30 per billing period | None |
| Visual analyses | Unlimited | 1, on a page of the free audit | 20 per billing period | None (views the pre-generated ones) |
| Websites | Unlimited | 1 | 10 | — |
| Audits running at once | Own queue priority | 1 | 1 | — |
| PDF branding | SiteLens plus own logo and company name | SiteLens only | SiteLens plus own logo and company name | Demo PDF |
| Limits from §12 | Bypasses rate and plan limits; every bypass is logged | All apply | Hourly per-site limit and plan quotas | — |
| Price | — | — | **OPEN** (§17) | — |

**Rules**
- The free audit can be single-page or whole-site. The form suggests whole-site.
- **A returned credit gives the user another attempt.** The credit comes back automatically when an audit ends as `failed`, or is `cancelled` before any page finishes. An audit that ends `partially_completed` or `completed` uses up its credit.
  - Free plan: at most 3 returns per account.
  - Pro plan: the same rule applies, with no return limit. **Proposed — review.**
- **What a free user keeps after the free audit,** for as long as the account exists:
  - full access to that audit: viewing, filters, issue statuses, the PDF (SiteLens branding) and public links.
  - They cannot run new audits, re-runs or visual analyses. Those actions lead to the Upgrade page.
- **When a Pro subscription ends** (cancelled or unpaid):
  - the account reverts to `free` with its free credit already counted;
  - all data stays readable, and websites above the free limit stay but no new ones can be added.

  **Proposed — review.**
- **Pro usage resets** at the start of each Stripe billing period.
- **Before a free audit can start, all of these must hold:** the email is verified, the Turnstile check has passed (Phase 3), and every rule in §12 is satisfied.

---

## 4. User journeys

1. **First visit (Phase 3).** Landing page → "Explore demo" opens the demo audit → "Create a free account" → Google sign-in, or email and password with verification → the quick audit box is pre-focused → the free audit starts.
   - Until Phase 3, the landing page's main button is "Sign in" (§17).
2. **Quick audit.** The user enters a URL and picks a mode (Single page or Whole site), then clicks Start.
   - The URL is checked: valid syntax, `http` or `https`, not an unsafe address.
   - The website record is found by its site key (§12.2) or created automatically.
   - `start_audit` reserves the limits in a single atomic step, then the user lands on the progress view.
3. **Progress.** A list of stages, "pages done: x of 10", the queue position while waiting, and a Cancel button. The user can leave and come back. An in-app notification appears when the audit ends. Results appear only when the audit finishes.
4. **Reading results.** The audit opens on its Overview tab: scores, coverage, AI summary and top issues. From there the user can go to the Issues, Pages, Performance and Technical tabs, then into issue detail or page detail.
5. **Working through issues (Phase 2).** The user filters issues by category, severity, status, page, date or website, then sets a status (In progress, Resolved, Ignored) with an optional private note. The next audit verifies the change.
6. **Comparing audits (Phase 2).** The user picks any two whole-site audits of a website and sees:
   - the score changes;
   - new, resolved and recurring issues;
   - page-level changes;
   - a notice if the two audits used different scoring methods.
7. **Sharing (Phase 2).** The user creates a public link (optional expiry; ignored issues hidden by default, with a toggle), can copy and revoke it, and can download the PDF.
8. **Visual analysis (Phase 2).** The user picks one page from an audit and starts the analysis, which uses quota. They see its progress, then strengths, issues, recommendations and the UX score revision.
9. **Upgrading (Phase 3).** The free credit is used up, so the action leads to the Upgrade page → Stripe Checkout → back in the app with Pro. Billing is managed in the Stripe Customer Portal.
10. **Exploring the demo (Phase 3).** `/demo` opens directly on the Overview tab of the demo audit. Everything can be explored except running anything (§11.4).

---

## 5. Websites and clients

**Website fields:**
- name (defaults to the hostname)
- the URL as entered, and the hostname as entered
- the final hostname, reached after the first redirect (both hostnames are stored)
- site key (§12.2)
- optional description and optional client
- indexing intent: indexed (default) or not meant to be indexed
- created date, last audit date
- latest score, from the latest whole-site audit, using its latest score revision
- audit history

**Rules**
- **Users can** add, edit, delete, audit and compare websites.
- **What can be edited:** name, description and client can always be edited. **The URL is locked once the first audit has run.** A different URL is added as a new website.
- **One website per site key per user.** The quick audit box reuses an existing website when the site key matches.
- **Clients** have a name and notes. A website belongs to at most one client. The Websites and Audits lists can be filtered by client.
- **Deleting a website or an audit is permanent.** The user must type the hostname to confirm. Its audits, files, issues and public links are removed immediately. There is no trash and no undo.
- **Page-type corrections:** the user can correct the type of a page (by URL path) on the website. The correction applies from the next audit; past audits are never rescored.
- **Indexing intent.** A user can mark:
  - a whole website as **not meant to be indexed**, for example a staging site;
  - a single page (by URL path) as **intentionally noindex**.

  Like page-type corrections, this applies from the next audit:
  - `seo.indexable` passes for those pages;
  - for websites marked "not meant to be indexed", `seo.robots_allowed` and a robots.txt that disallows everything become informational;
  - the SEO caps for noindex and robots.txt don't apply (§7.1, §8.3).

---

## 6. Crawling and scanning

### 6.1 Modes
- **Single page:** only the entered URL is analyzed. Site-level checks also run: robots.txt, sitemap, HTTPS, TLS, security headers, favicon, redirects and host consistency.
- **Whole site:** up to **10 unique internal pages**. Users cannot pick pages by hand. **The crawl always starts at the homepage, and the entered URL is always one of the 10.**

### 6.2 Discovery order (whole site)
1. Homepage, then the entered URL if it's a different page
2. Main navigation links (header, `nav` landmarks)
3. Important homepage links (links in the homepage's main content)
4. Other internal links found on crawled pages, breadth-first
5. Extra pages from the sitemap

The audit lists **every URL it discovered**, with its outcome:

| Outcome | Meaning |
|---|---|
| `scanned` | The page was audited |
| `excluded` | Not audited, with a reason (below) |
| `failed` | Could not be audited, with a reason |
| `not_scanned_limit` | Discovered, but the 10-page limit was already reached |

### 6.3 URL rules
- **Scheme and host:** only `http` and `https` are allowed. The crawl stays on the **exact hostname** reached after the first redirect; subdomains count as external.
- **Normalization:**
  - fragments are dropped;
  - tracking parameters (`utm_*`, `gclid`, `fbclid`, `msclkid`, `mc_*`, `ref`) are removed;
  - the remaining parameters are sorted, and the scheme and host are lowercased.
  - A URL that differs from another only in its parameters gets low priority, with at most one variant per path.
- **Canonical:** if page A declares page B as its canonical, A is excluded as `canonicalized` and B is queued. An excluded page does not use one of the 10 slots.
- **robots.txt:**
  - for **discovered** pages it is followed strictly (rules for `SiteLensBot` first, then `*`); a blocked page is excluded as `robots_disallowed`;
  - the **entered** URL is audited even when robots.txt blocks it. A notice is shown, and `seo.robots_allowed` reports it as a failure (§7.1).
  - `Crawl-delay` is respected: one page at a time, waiting the delay (at most 10 s). **Proposed — review.**
- **Paths that are skipped,** each listed with its reason:
  - non-HTML files (by extension or content type);
  - login, account, admin, cart and checkout paths, and `wp-admin`;
  - search result pages, feeds, tag and category archives, and pagination beyond page 2.

  The pattern list lives in code and comes with **Proposed — review** defaults.
- **Login walls:** a page that redirects to a login form or shows one is marked `failed` with the reason `login_required`. It appears as "Unable to verify — login required".
- **Bot protection:** challenges and blocks (Cloudflare, Akamai, DataDome, PerimeterX, CAPTCHA pages) are detected and reported as "Blocked by bot protection". **They are never bypassed.**

### 6.4 Limits

| Limit | Value |
|---|---|
| Page load timeout | 30 s |
| HTML size cap | 10 MB |
| Audit time cap | 15 min (partial results are kept) |
| Retries | 1, only for temporary failures |
| Pages loading at once, per site | 2 |
| Internal URLs checked for status | 300 unique URLs (**Proposed — review**) |
| External links checked | 200 unique URLs |
| Timeout per link check | 10 s |
| Redirects followed | 5 |

**Link results**

| Result | Internal links | External links |
|---|---|---|
| Broken | 404, 410 after one retry | 404, 410, DNS failure |
| Server error | 5xx after one retry, reported by `tech.server_errors` | — |
| Unable to verify | Other 4xx (e.g. 401, 403, 429), bot challenge, timeout | 401, 403, 429, bot challenge, timeout, 5xx (**Proposed — review**) |

### 6.5 Crawler identity
- **User agent:** a current Chrome user agent with `SiteLensBot/1.0 (+https://<app-domain>/bot)` appended.
- **The `/bot` info page explains** what the crawler does, that it only reads pages, how robots.txt is handled, and how a site owner can ask to be excluded. Excluded sites go on the blocked-sites list, which applies to every account, admin included.
- **PageSpeed exception:** PageSpeed tests run from Google's servers with Google's own user agent.

---

## 7. Check catalog

Every check has:
- a key, used in the database as `check_key`;
- a scope: page-level or site-level;
- an importance tier: 1, 2, 3 or 5;
- a severity (§8.6);
- an evaluation rule, which gives each outcome a **level** (below);
- the page types it applies to;
- a written-once explanation: title, description, impact and recommendation (stored in `packages/core`).

**How to read the tables below**
- **Results:** `passed`, `warning`, `failed`, `not_applicable` or `unable_to_verify`.
- **Warning credit:** a scored warning keeps 50% of the points.
- **Applies to:**
  - **All:** every page type.
  - **C (commercial):** homepage, service, product, pricing, landing.
  - **Content:** homepage, service, product, blog_post, about, landing.
  - **F:** pages with forms.

**Finding levels.** Every result that isn't a pass also has a **level**. It says how certain the problem is and whether it affects the score.

| Level | Meaning | Stored result | Affects the score? |
|---|---|---|---|
| **Failure** | A confirmed, objectively verifiable technical problem that affects crawling, indexing or how the site works | `failed` | Yes: no points |
| **Warning (scored)** | An objectively detectable problem that deserves attention | `warning` | Yes: keeps 50% of the points |
| **Warning** | Possibly a problem; whether it is depends on context | `warning` | No |
| **Recommendation** | An optional best practice or optimization | `warning` | No |
| **Informational** | A heuristic or extra context; it doesn't establish a problem | `warning` | No |

- **Levels are defined for every category, but only SEO (§7.1) uses them all for now.** In the other categories, `failed` is a failure and `warning` is a scored warning, as before.
- **Advisory checks:** a check with no scored outcome is advisory. It never affects the score or coverage (§8.1).

**All thresholds and tiers in §7 are Proposed — review.**

**Page types:** `homepage`, `service`, `product`, `product_listing`, `pricing`, `contact`, `about`, `blog_index`, `blog_post`, `landing`, `legal`, `other`.

**How page types are assigned:**
1. Rules first: URL patterns, schema.org types, content signals (prices, add-to-cart buttons, article markup) and the root path for the homepage.
2. When the rules aren't confident, Haiku decides.
3. A user correction always wins from the next audit on.

### 7.1 SEO (25%)

- **Only deterministic checks affect the score.** AI content analysis is extra information and never changes the SEO score.
- **10 of the 36 checks are scored** (Scored = Yes). The other 26 are advisory: they appear in the audit but never change the score.
- **Inside a scored check,** an unscored warning, recommendation or informational outcome counts as a pass. Fixing one therefore never changes the score (§8.1).
- **Severity** is the severity of the check's most serious outcome (§8.6). "—" means the check only produces informational findings.
- **Thresholds marked *SiteLens heuristic*** are our defaults. They are not Google limits.
- **Basis** says where a rule comes from:
  - **Google req.:** needed for crawling or indexing.
  - **Google rec.:** Google's best-practice guidance.
  - **Common practice:** widely used, but not from Google.

  The [G] references are listed after the table. They were checked on 22 Nov 2026.

**Outcome labels in the Rule column:** **Fail** = failure · **Warn+** = scored warning · **Warn** = unscored warning · **Rec** = recommendation · **Info** = informational.

| Key | Check | Scope | Tier | Severity | Rule | Scored | Basis | Applies to |
|---|---|---|---|---|---|---|---|---|
| `seo.title_present` | Title present | page | 5 | high | Pass: a non-empty `<title>` · **Fail:** missing or empty | Yes | Google rec. [G2] | All |
| `seo.title_length` | Title length | page | 2 | low | Pass: 30–60 characters · **Rec:** 15–29 or 61–70 (slightly outside), or under 15 or over 70 (far outside). *SiteLens heuristic: Google sets no length limit and shortens titles to fit the device [G2]* | No | Common practice | All |
| `seo.title_unique` | Title unique | page | 3 | medium | Pass: no other scanned page has the same title · **Warn+:** shares its title with another scanned page · `not_applicable` in single-page mode | Yes | Google rec. [G2] | All |
| `seo.description_present` | Meta description present | page | 3 | low | Pass: a non-empty meta description · **Rec:** missing or empty. Not required; Google suggests prioritizing the most important pages [G3] | No | Google rec. [G3] | All except legal |
| `seo.description_length` | Meta description length | page | 1 | low | Pass: 70–160 characters · **Rec:** 50–69 or 161–200 (slightly outside), or anything else (far outside). *SiteLens heuristic: Google sets no length limit [G3]* | No | Common practice | All except legal |
| `seo.description_unique` | Meta description unique | page | 2 | low | Pass: unique among scanned pages · **Warn:** same as another scanned page · `not_applicable` in single-page mode | No | Google rec. [G3] | All except legal |
| `seo.canonical_present` | Canonical present | page | 2 | low | Pass: exactly one valid canonical (link tag or HTTP header) · **Warn+:** several canonicals that point to different URLs, or one that isn't a valid URL · **Rec:** none declared. It's optional; Google picks a canonical itself [G4] | Yes | Google rec. [G4] | All |
| `seo.canonical_valid` | Canonical target valid | page | 3 | high | `not_applicable` when no canonical is declared · Pass: target returns 200, is indexable and doesn't redirect · **Fail:** target returns 4xx, or is noindex · **Warn+:** target redirects · **Warn:** target differs from the page only by protocol or trailing slash · **Info:** target is on another host ("Cross-domain canonical. Check that this is intended.") · target returns 5xx after one retry: `unable_to_verify` | Yes | Google rec. [G4]. The cited pages don't cover cross-domain canonicals | All |
| `seo.canonical_consistency` | Canonical, og:url and final URL agree | page | 2 | medium | Pass: they agree · **Warn:** they disagree. `og:url` isn't a Google signal; Google recommends consistent canonical signals [G4] | No | Google rec. [G4] | All |
| `seo.open_graph` | Open Graph title, description and image | page | 1 | low | Pass: all three present and the image loads · **Rec:** one or more missing · **Warn:** `og:image` doesn't load | No | Not a Google Search factor (social sharing) | Content |
| `seo.h1_single` | One H1 | page | 3 | medium | Pass: exactly one non-empty H1 · **Warn:** no H1 · **Info:** several H1s. These are common in templates; Google says there's no ideal number of headings [G5] | No | Common practice | All |
| `seo.headings_empty` | No empty headings | page | 1 | low | Pass: every heading has text · **Warn:** an h1–h6 with no text | No | Common practice (accessibility) | All |
| `seo.heading_hierarchy` | Heading levels in order | page | 1 | low | Pass: no skipped levels · **Rec:** a level is skipped (e.g. h2 → h4). This helps screen readers; Google says the order doesn't matter for Search [G5] | No | Common practice (accessibility) | All |
| `seo.heading_length` | Heading length | page | 1 | low | Pass: H1 up to 70 characters, other headings up to 120 · **Rec:** longer. *SiteLens heuristic* | No | Common practice | All |
| `seo.indexable` | Page indexable | page | 5 | high | Pass: no `noindex` in meta robots or `X-Robots-Tag` (for all crawlers or Googlebot), or the page or website is marked as intentionally not indexed (§5) · **Fail:** `noindex` on the homepage or the entered URL · **Warn+:** `noindex` on a page that the sitemap lists or the main navigation links to; these signals conflict [G9] · **Info:** `noindex` on any other page ("This page is noindex. Check that this is intended.") | Yes | Google req.: noindex keeps a page out of Search [G12] | All |
| `seo.robots_allowed` | Entered URL allowed by robots.txt | page | 5 | high | Pass: robots.txt allows the entered URL for Googlebot (Googlebot rules first, then `*`) · **Fail:** the entered URL is disallowed · **Info** instead of Fail when the website is marked "not meant to be indexed". Discovered pages that are disallowed are excluded, not checked here | Yes | Google req.: Googlebot isn't blocked [G1] | Entered URL |
| `seo.robots_txt` | robots.txt healthy | site | 2 | medium | Pass: 200 with valid rules that don't block the whole site · **Fail:** 5xx after one retry, because Google pauses crawling [G7]; or a non-empty file with no valid rules, e.g. an HTML page. Google ignores invalid lines, so none of the rules apply [G7]; or it disallows the whole site for all crawlers (**Info** instead when the website is marked "not meant to be indexed") · **Warn:** larger than 500 KiB; Google ignores everything after that [G7] · **Rec:** missing (4xx); Google then crawls without restrictions [G6][G7] · 429: `unable_to_verify` | Yes | Google req. (crawling) [G7] | — |
| `seo.sitemap_available` | Sitemap available | site | 2 | low | Pass: found via robots.txt `Sitemap:` or `/sitemap.xml` (index files are followed) · **Rec:** none found. Most sites benefit from one; sites of about 500 pages or fewer may not need one [G8] | No | Google rec. [G8] | — |
| `seo.sitemap_valid` | Sitemap valid | site | 2 | medium | `not_applicable` when there's no sitemap · Pass: readable and follows the sitemap protocol · **Fail:** a sitemap listed in robots.txt returns 4xx; the XML can't be parsed; or a file has more than 50,000 URLs, is over 50 MB uncompressed, or uses URLs that aren't absolute [G9] · **Warn:** it lists URLs that redirect, are noindex, return 4xx, or are on another host (allowed only for verified sites [G9]) · 5xx after one retry: `unable_to_verify` | Yes | Google req. (sitemap format) [G9] | — |
| `seo.in_sitemap` | Scanned page listed in sitemap | page | 1 | low | `not_applicable` without a sitemap, and for noindex or canonicalized pages · Pass: listed · **Warn:** not listed. Google: list the URLs you want in Search [G9] | No | Google rec. [G9] | All |
| `seo.internal_links_broken` | Broken internal links | page | 5 | high | Pass: no confirmed broken internal links · **Fail:** an internal link returns 404 or 410 after one retry. Other 4xx (e.g. 401, 403, 429), timeouts and bot challenges make that link `unable_to_verify`, and it isn't counted. 5xx is reported by `tech.server_errors` (§6.4) | Yes | Google req.: only pages that return 200 are indexed [G1] | All |
| `seo.external_links_broken` | Broken external links | page | 2 | medium | Pass: no broken external links · **Warn:** an external link is broken (404, 410 or DNS failure). Links that can't be verified are listed but not counted (§6.4) | No | Common practice | All |
| `seo.internal_links_redirect` | Internal links pointing at redirects | page | 1 | low | Pass: no internal links to redirects · **Warn:** an internal link points to a URL that redirects. Google recommends linking to the canonical URL [G4] | No | Google rec. [G4] | All |
| `seo.links_crawlable` | Links have crawlable URLs | page | 1 | low | Pass: every link with visible text has a crawlable `href` · **Warn+:** an `<a>` with visible text whose `href` is missing, empty or `javascript:`. Google can't reliably follow these [G10]. `href="#"` and `role="button"` are ignored, because they're usually in-page controls | Yes | Google req. for link discovery [G10] | All |
| `seo.anchor_text` | Descriptive link text | page | 1 | low | Pass: fewer than 3 generic links · **Rec:** 3 or more links with generic text ("click here", "read more", "here", "more", "learn more") [G10]. *The count of 3 is a SiteLens heuristic* | No | Google rec. [G10] | All |
| `seo.orphan_pages` | Page has incoming internal links | page | 2 | medium | `not_applicable` in single-page mode · Pass: another scanned page links to it · **Warn:** no scanned page links to it. This is only a hint: the crawler sees links on the pages it scanned, not the whole site | No | Common practice | All |
| `seo.img_alt_missing` | Images have an alt attribute | page | 3 | medium | Pass: every `<img>` has an `alt` attribute (`alt=""` is valid for decorative images) · **Warn:** an `<img>` has no `alt`. It's scored under Accessibility (axe `image-alt`), so it isn't scored again here | No | Google rec. [G11] | All |
| `seo.img_alt_quality` | Alt text looks meaningful | page | 1 | — | Pass: no suspicious alt text · **Info:** alt text that looks like a file name or a generic word, is over 125 characters, or repeats on different images. *SiteLens heuristics; Google warns against keyword-stuffed alt text [G11]* | No | Google rec. [G11] | All |
| `seo.img_dimensions` | Images declare their size | page | 1 | low | Pass: every `<img>` declares its size · **Rec:** an `<img>` without width/height or a CSS aspect-ratio. *Performance-related (layout stability)* | No | Common practice (performance) | All |
| `seo.img_oversized` | Image file sizes | page | 2 | medium | Pass: no oversized images · **Warn:** an image transfers more than 200 KB, or its natural width is over 1,000 px and more than twice its displayed width. *Performance-related, and already reflected in the Performance score. SiteLens heuristic* | No | Common practice (performance) | All |
| `seo.img_format` | Modern image formats | page | 1 | low | Pass: no large JPEG or PNG images · **Rec:** JPEG or PNG images over 100 KB not served as WebP or AVIF. *Performance-related; Google Images supports JPEG, PNG, WebP and AVIF alike [G11]* | No | Common practice (performance) | All |
| `seo.content_thin` | Enough content | page | 3 | — | Pass: 300 words or more of main content · **Info:** under 100 words ("very little text") or 100–299 words ("little text"). *SiteLens heuristic: Google has no preferred word count [G13]* | No | Common practice | Content |
| `seo.content_duplicate` | Unique content | page | 3 | medium | `not_applicable` in single-page mode · Pass: under 80% similar to every other scanned page · **Warn:** ≥90% similar to another scanned page · **Info:** 80–89% similar. Duplicate content isn't a spam-policy violation [G5]; consider consolidating duplicates [G4]. *SiteLens heuristic* | No | Google rec. [G4][G5] | All |
| `seo.content_repetition` | No keyword stuffing | page | 1 | low | Pass: no repetition pattern found · **Warn:** one non-stopword makes up over 4% of words (pages with 300+ words), or the same sentence appears 3 or more times. This is only a hint: density doesn't prove keyword stuffing, which Google defines by intent to manipulate rankings [G14]. *SiteLens heuristic* | No | Google spam policy [G14] | Content |
| `seo.content_structure` | Long text has subheadings | page | 1 | low | Pass: long text is broken up by H2 or H3 headings · **Rec:** over 300 words of body text with no H2 or H3. Google suggests splitting long content into sections with headings [G5]. *SiteLens heuristic* | No | Google rec. [G5] | Content |
| `seo.readability` | Readability (English only) | page | 1 | — | `not_applicable` for other languages · Pass: Flesch Reading Ease 50 or higher · **Info:** 30–49 ("fairly difficult") or under 30 ("difficult"). Google asks for easy-to-read text but uses no readability score [G5]. *SiteLens heuristic* | No | Common practice | Content |

**The 10 scored checks:** `seo.title_present`, `seo.title_unique`, `seo.canonical_present`, `seo.canonical_valid`, `seo.indexable`, `seo.robots_allowed`, `seo.robots_txt`, `seo.sitemap_valid`, `seo.internal_links_broken`, `seo.links_crawlable`.

**Google Search Central references** (checked 22 Nov 2026)

| Ref | Page |
|---|---|
| [G1] | Technical requirements — https://developers.google.com/search/docs/essentials/technical |
| [G2] | Title links — https://developers.google.com/search/docs/appearance/title-link |
| [G3] | Snippets and meta descriptions — https://developers.google.com/search/docs/appearance/snippet |
| [G4] | Consolidate duplicate URLs — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls |
| [G5] | SEO Starter Guide — https://developers.google.com/search/docs/fundamentals/seo-starter-guide |
| [G6] | Introduction to robots.txt — https://developers.google.com/search/docs/crawling-indexing/robots/intro |
| [G7] | How Google interprets robots.txt — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt |
| [G8] | Sitemaps overview — https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview |
| [G9] | Build and submit a sitemap — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap |
| [G10] | Crawlable links and anchor text — https://developers.google.com/search/docs/crawling-indexing/links-crawlable |
| [G11] | Google Images best practices — https://developers.google.com/search/docs/appearance/google-images |
| [G12] | Block indexing with noindex — https://developers.google.com/search/docs/crawling-indexing/block-indexing |
| [G13] | Creating helpful content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content |
| [G14] | Spam policies — https://developers.google.com/search/docs/essentials/spam-policies |

These all belong to Google Search Essentials (https://developers.google.com/search/docs/essentials).

### 7.2 Performance (25%)

**Where the data comes from**
- **Lab data:** the PageSpeed Insights API, which runs Lighthouse on Google's servers. Only the Performance category is requested; Lighthouse's own SEO and Best Practices scores aren't used. There is **one mobile and one desktop run per scanned page** (at most 20 runs for 10 pages).
- **Field data:** the **CrUX API**, queried directly, for each page URL and for the whole site, on phone and desktop. It is extra information and **never affects the score**. INP comes only from CrUX and is never calculated from lab data. When there's no field data, the app says so: "No real-user data available".

**Scoring**
- Each page's score is **0.6 × the mobile Lighthouse score + 0.4 × the desktop score**. The site score is the average over all pages that have a score.
- If one device fails on a page, the page uses the device that worked and is flagged "Partial: desktop failed" (or mobile).
- A page whose two devices both failed is left out of the average.
- The individual device results are always kept.

**Findings.** These are shown as issues but **earn no extra points**, because the Lighthouse score already includes them.

| Key | Metric (lab, per device) | Pass | Warning | Fail | Base severity |
|---|---|---|---|---|---|
| `perf.lcp` | Largest Contentful Paint | ≤2.5 s | ≤4.0 s | >4.0 s | medium |
| `perf.cls` | Cumulative Layout Shift | ≤0.1 | ≤0.25 | >0.25 | medium |
| `perf.tbt` | Total Blocking Time | ≤200 ms | ≤600 ms | >600 ms | medium |
| `perf.fcp` | First Contentful Paint | ≤1.8 s | ≤3.0 s | >3.0 s | low |
| `perf.speed_index` | Speed Index | ≤3.4 s | ≤5.8 s | >5.8 s | low |
| `perf.ttfb` | Server response time | ≤0.8 s | ≤1.8 s | >1.8 s | medium |
| `perf.opportunity` (one variant per Lighthouse diagnostic) | Optimization opportunities from Lighthouse | Lighthouse passes it | — | Lighthouse flags it | Set by estimated savings: high if ≥1 s or ≥500 KB · medium if ≥300 ms or ≥100 KB · otherwise low |

- **What the opportunities cover:** images, unused JavaScript and CSS, script execution, render-blocking resources, caching, fonts, requests and resource sizes, and long main-thread tasks.
- **How they're mapped:** the mapping from Lighthouse diagnostics to findings lives in `packages/core` and records which Lighthouse version it applies to.
- **CrUX thresholds at the 75th percentile:**

  | Metric | Good | Needs improvement |
  |---|---|---|
  | LCP | ≤2.5 s | ≤4 s |
  | INP | ≤200 ms | ≤500 ms |
  | CLS | ≤0.1 | ≤0.25 |
  | FCP | ≤1.8 s | ≤3 s |
  | TTFB | ≤0.8 s | ≤1.8 s |

### 7.3 Accessibility (15%)

**Tools and standard.** axe-core runs in the browser on **desktop and mobile** for every scanned page, measured against **WCAG 2.2 AA**.

**Three kinds of finding:**
1. **Automated violations: these are the only ones that are scored.** Only axe rules tagged `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` or `wcag22aa` count, using the axe version pinned in code. Each rule is weighted by its axe impact:

   | axe impact | Tier | Base severity |
   |---|---|---|
   | critical | 5 | high |
   | serious | 3 | medium |
   | moderate | 2 | medium |
   | minor | 1 | low |

   Context can raise severity (§8.6), but never above high. **Proposed — review.**
2. **Manual-review findings, not scored:**
   - axe `best-practice` rules (landmarks, `region`, `heading-order`, `page-has-heading-one`, skip links);
   - axe `incomplete` results, such as contrast over images or gradients;
   - extra browser checks:
     - `a11y.focus_visible`: no visible focus indicator on the first 20 focusable elements;
     - `a11y.reflow`: horizontal scrolling at 320 CSS px wide;
     - `a11y.required_indication`: a required field has no visible marker;
     - `a11y.media_captions`: a `<video>` has no captions track.
3. **AI observations (Phase 2, visual analysis), not scored.**

**How the brief's checklist maps to axe rules** (examples):

| Area | axe rules |
|---|---|
| Images and media | `image-alt`, `input-image-alt`, `role-img-alt`, `svg-img-alt`, `object-alt`, `area-alt` |
| Forms | `label`, `select-name`, `form-field-multiple-labels`, `input-button-name`, `autocomplete-valid`, `aria-input-field-name`, `aria-toggle-field-name` |
| Names of links and buttons | `link-name`, `button-name`, `frame-title`, `aria-command-name` |
| Structure | `html-has-lang`, `html-lang-valid`, `valid-lang`, `document-title`, `list`, `listitem`, `definition-list`, `dlitem`, the `aria-*` validity rules, `aria-hidden-body` |
| Visual | `color-contrast`, `meta-viewport`, `link-in-text-block` |
| Interactive elements | `nested-interactive`, `aria-hidden-focus`, `scrollable-region-focusable`, `target-size` |

**Check keys** are `a11y.<axe-rule-id>`, for example `a11y.image-alt`.

**Combining desktop and mobile**
- A rule fails on a page if it fails on either device.
- The same element failing on both devices counts **once** and is tagged with both devices.
- A rule passes when axe reports it as passing on both devices, and is `not_applicable` when it doesn't apply on either.

**The disclaimer is always shown:** *"Automated testing finds some accessibility barriers, not all. It does not prove WCAG compliance."*

### 7.4 Technical & Security (20%)

**These checks are passive.** They only observe responses and configuration:
- no injection or attack payloads
- no attempts to bypass authentication
- no password guessing
- no vulnerability scanning beyond reading what normal page loads return.

**Header and cookie sources**
- **Headers:** taken from the homepage response, or from the entered URL in single-page mode. Pages whose headers differ are listed in the evidence.
- **Cookies:** only the ones **observed while loading pages**. The UI never claims that every cookie or login session was tested.

**Critical severity** is reserved for four checks: `tech.availability`, `tech.https`, `tech.certificate_valid`, and **active** mixed content.

| Key | Check | Scope | Tier | Base severity | Rule |
|---|---|---|---|---|---|
| `tech.availability` | Site reachable | site | 5 | critical | fail: the homepage or entered URL can't be reached (DNS failure, timeout, 5xx). If no page loads at all, the audit ends as `failed` |
| `tech.server_errors` | No server errors | site | 3 | high | fail: any internal URL returns 5xx after one retry |
| `tech.redirect_chains` | Redirect chains and loops | site | 2 | medium | warning: a chain of more than 1 hop · fail: a loop, or more than 3 hops |
| `tech.https_redirect` | HTTP redirects to HTTPS | site | 3 | high | pass: one 301 or 308 hop to `https` · warning: 302/307, or several hops · fail: `http` serves content, or doesn't redirect |
| `tech.host_consistency` | www and non-www agree | site | 1 | low | warning: both variants serve 200 without redirecting to one host |
| `tech.https` | Site uses HTTPS | site | 5 | critical | fail: not served over HTTPS |
| `tech.certificate_valid` | Certificate valid | site | 5 | critical | fail: expired, untrusted chain, or hostname mismatch |
| `tech.certificate_expiry` | Certificate expiry | site | 2 | medium | warning: expires within 21 days (high if within 7) |
| `tech.mixed_content` | No mixed content | page | 5 | critical (active) / medium (passive) | fail: scripts, iframes or stylesheets loaded over `http` · warning: images or media loaded over `http` |
| `tech.viewport` | Viewport meta tag | page | 3 | medium | pass: present with `width=device-width` · fail: missing. Zoom blocking is covered by the axe `meta-viewport` rule |
| `tech.favicon` | Favicon | site | 1 | low | fail: missing, or doesn't load |
| `tech.broken_resources` | Referenced resources load | page | 3 | medium | fail: an image, CSS or JS file returns 4xx/5xx or doesn't load. First-party files are medium severity, third-party low |
| `tech.doctype` | Doctype declared | page | 1 | low | fail: no `<!DOCTYPE html>` (the page renders in quirks mode) |
| `tech.charset` | Character encoding declared | page | 1 | low | fail: no charset in a meta tag or header · warning: a charset other than UTF-8 |
| `tech.duplicate_ids` | Unique element IDs | page | 1 | low | warning: any `id` value is used more than once |
| `tech.html_structure` | Basic HTML structure | page | 1 | low | warning: several `<title>` elements, content outside the `head`/`body` structure, or more than 20 HTML parse errors |
| `tech.document_size` | Document size | page | 2 | low | warning: HTML over 500 KB or more than 1,500 DOM elements · fail: HTML over 2 MB or more than 3,000 elements |
| `tech.hsts` | HSTS | site | 2 | medium | pass: `max-age` ≥15,552,000 (180 days) · warning: a shorter max-age · fail: missing · `not_applicable` without HTTPS |
| `tech.csp` | Content Security Policy | site | 2 | medium | pass: an enforced CSP that restricts scripts (no `unsafe-inline` without a nonce or hash) · warning: report-only, or permissive · fail: missing |
| `tech.content_type_options` | X-Content-Type-Options | site | 1 | low | fail: `nosniff` missing |
| `tech.clickjacking` | Clickjacking protection | site | 2 | medium | pass: `X-Frame-Options` DENY or SAMEORIGIN, **or** CSP `frame-ancestors` · fail: neither |
| `tech.referrer_policy` | Referrer-Policy | site | 1 | low | pass: a safe value · warning: missing (browsers default to `strict-origin-when-cross-origin`) · fail: `unsafe-url` |
| `tech.permissions_policy` | Permissions-Policy | site | 1 | low | warning: missing |
| `tech.cookie_secure` | Cookies marked Secure | site | 2 | medium | fail: a cookie set over HTTPS without `Secure` |
| `tech.cookie_httponly` | Session cookies marked HttpOnly | site | 1 | low | warning: a session-like cookie (name matches session, sid, auth or token patterns) without `HttpOnly` |
| `tech.cookie_samesite` | Cookies declare SameSite | site | 1 | low | warning: a cookie without an explicit `SameSite` |
| `tech.server_disclosure` | No version disclosure | site | 1 | low | warning: version numbers in `Server`, `X-Powered-By`, `X-AspNet-Version` or similar headers |

Missing security headers are reported as hardening gaps, **never as confirmed vulnerabilities**.

**Technology detection** is informational only: it has no score impact and creates no issues.
- **List:** about 50 technologies, covering CMSs (WordPress, Shopify, Wix, Squarespace, Webflow…), frameworks (Next.js, Nuxt, React, Vue, Angular…), servers (Nginx, Apache, LiteSpeed, IIS), languages (PHP, ASP.NET), CDNs, analytics and tag managers.
- **Detection signals:** headers, cookies, meta generator tags, script URLs and global JavaScript variables.
- **Each result shows:** name, version (when visible), confidence and evidence.

### 7.5 UX & Conversion (15%)

**A. Automated checks** run on every scanned page, on desktop and mobile.
- **Confidence:** each check has a fixed confidence level. **Only High and Medium checks affect the score**; Low checks are shown without changing it.
- **Combining devices:** for checks that run on both devices, the page result is the worse of the two, and the evidence shows both.
- **Site-level checks** count toward every page's automated score.

| Key | Check | Scope | Tier | Base severity | Confidence | Rule | Applies to |
|---|---|---|---|---|---|---|---|
| `ux.cta_above_fold` | Main call to action visible on first screen | page, both devices | 5 | high | medium | fail: no button or link with action text visible in the first viewport | C |
| `ux.cta_clarity` | Clear call-to-action text | page | 2 | medium | medium | warning: the main CTA uses generic text ("Submit", "Click here", "Send", "Go") | C |
| `ux.competing_ctas` | Competing actions | page | 1 | low | low | warning: more than 3 equally prominent buttons in the first viewport | C |
| `ux.headline` | Headline on first screen | page, both devices | 3 | medium | high | fail: no visible H1 or headline in the first viewport | homepage, service, product, landing |
| `ux.value_proposition` | Supporting value statement | page | 2 | medium | medium | warning: fewer than 8 words of supporting text next to the headline in the first viewport | homepage, service, product, landing |
| `ux.contact_visible` | Contact options reachable | page | 3 | medium | high | fail: no phone number, email, contact link or form in the header or footer | All |
| `ux.trust_signals` | Trust signals present | page | 2 | low | medium | warning: no testimonials, reviews, ratings, client logos or certifications detected. Only presence is checked, not authenticity | C |
| `ux.business_info` | Business details | site | 1 | low | medium | warning: no address or company details found on the scanned pages | — |
| `ux.privacy_link` | Privacy policy linked | site | 2 | medium | high | fail: no link to a privacy policy found | — |
| `ux.form_length` | Form length | page | 2 | medium | high | pass: 7 fields or fewer · warning: 8–12 · fail: more than 12 (enquiry and contact forms) | F |
| `ux.form_labels` | Visible form labels | page | 2 | medium | high | fail: a field labelled only by its placeholder | F |
| `ux.conversion_path` | Way to convert | page | 3 | medium | medium | fail: no form, booking, purchase or enquiry element, and no link to a contact page | C |
| `ux.navigation` | Main navigation | site | 2 | medium | medium | pass: a main navigation with 3–8 top-level items · warning: more than 10 items · fail: no navigation found | — |
| `ux.mobile_nav` | Mobile navigation works | site | 3 | high | medium | fail: the menu toggle doesn't open, or the navigation can't be reached at 390 px | — |
| `ux.horizontal_scroll` | No sideways scrolling on mobile | page | 5 | high | high | fail: content wider than a 390 px viewport | All |
| `ux.overlap` | No overlapping elements | page | 2 | medium | medium | warning: interactive elements overlap, or fixed elements cover over 30% of the mobile viewport | All |
| `ux.font_size_mobile` | Readable text size on mobile | page | 2 | medium | high | pass: body text ≥16 px · warning: 14–15 px · fail: under 14 px | All |
| `ux.paragraph_length` | Paragraph length | page | 1 | low | high | warning: a paragraph over 120 words | Content |
| `ux.line_length` | Line length on desktop | page | 1 | low | medium | warning: main text lines over 100 characters | Content |
| `ux.interstitial` | No intrusive pop-ups | page | 3 | high | medium | fail: an overlay covers more than half of the mobile viewport on load | All |

**B. Page classification** adapts the checks (§7, "Page types"). For example, a blog post is never penalized for lacking a purchase button.

**C. AI visual analysis (Phase 2).** It is only run when the user asks for it, one page at a time (§9.3). The AI rates a **fixed list of criteria** as `passed`, `warning` or `failed`, each with a confidence level and evidence. **The AI never outputs a number.**
- **Tiers:** listed below. **Proposed — review.**
- **Severity of a failed criterion:** medium, or high for tier 5. A warning is low.

| Key | Criterion | Tier |
|---|---|---|
| `ux.ai.visual_hierarchy` | Clear visual hierarchy | 3 |
| `ux.ai.headline_clarity` | Headline says what the business offers | 3 |
| `ux.ai.target_audience` | The target audience is evident | 2 |
| `ux.ai.value_proposition` | The value proposition is specific | 3 |
| `ux.ai.cta_prominence` | The main CTA stands out and its next step is clear | 5 |
| `ux.ai.navigation_clarity` | Navigation is understandable | 2 |
| `ux.ai.trust_credibility` | Trust is visibly supported | 2 |
| `ux.ai.scannability` | Layout and typography make the page easy to scan | 2 |
| `ux.ai.mobile_usability` | Mobile layout is usable (tap targets, spacing, order) | 3 |
| `ux.ai.friction` | No obstacles to converting (pop-ups, long forms, distractions) | 3 |
| `ux.ai.visual_readability` | Contrast, text over images, density | 2 |
| `ux.ai.visual_polish` | Consistent styling, no broken visuals | 1 |

---

## 8. Scoring methodology

### 8.1 Points per check

| Outcome | Credit |
|---|---|
| `passed` | 1 |
| Failure (`failed`) | 0 |
| Scored warning | 0.5 by default |
| Unscored warning, recommendation or informational | 1. These are scored as passed and never lower the score |
| `not_applicable` | Excluded |
| `unable_to_verify` | Excluded, but counts as unverified weight for coverage (§8.4) |

- **Levels (§7).** In categories that don't use levels yet (everything except SEO), `failed` is a failure and `warning` is a scored warning.
- **Advisory checks** (Scored = No in §7.1) are left out of the score and of coverage entirely, even when they pass, so passing an optional check earns no free points.
- **Guarantee:** fixing a recommendation or an informational finding never changes a score.
- **Site-level check:** earned = tier × credit; possible = tier.
- **Page-level check (pass ratio):**

  ```
  earned   = tier × (sum of credits on verified pages ÷ number of verified pages)
  possible = tier
  ```

  Pages where the check is `not_applicable` or `unable_to_verify` are left out. **For example,** 7 of 10 pages passing earns 70% of the points.

### 8.2 Category scores

| Category | Formula |
|---|---|
| SEO, Technical & Security, Accessibility | round(100 × Σ earned ÷ Σ possible) over the applicable checks. SEO counts only its 10 scored checks (§7.1). Accessibility counts only WCAG A/AA axe rules (§7.3) |
| Performance | The average of page scores, where each page is 0.6 × mobile + 0.4 × desktop Lighthouse score (§7.2) |
| UX & Conversion | Each page gets an automated score using only High/Medium-confidence checks. The site score is the **arithmetic average of page scores**. When a page has a visual analysis, its score is 0.7 × automated + 0.3 × AI criteria score (High/Medium confidence only). The AI part counts only if at least 60% of the criteria weight has High or Medium confidence; otherwise that page stays automated-only and is marked as such |

**Rounding:** whole numbers 0–100, rounded half up.

**Bands:**

| Score | Band |
|---|---|
| 0–49 | poor |
| 50–89 | needs improvement |
| 90–100 | good |

There are no letter grades.

### 8.3 Score caps

A weighted average can hide a disaster, so these conditions cap a category's score. **Proposed — review.**

| Condition | Cap |
|---|---|
| The homepage is noindex | SEO ≤ 30 |
| robots.txt disallows the whole site for all crawlers | SEO ≤ 30 |
| The homepage is blocked by robots.txt | SEO ≤ 40 |
| No HTTPS | Technical & Security ≤ 40 |
| Invalid or expired certificate | Technical & Security ≤ 40 |
| Active mixed content on any page | Technical & Security ≤ 60 |
| Horizontal scrolling on mobile on ≥50% of pages | UX & Conversion ≤ 60 |

- **The SEO caps don't apply** when the website is marked "not meant to be indexed" (§5). The noindex cap also doesn't apply when the homepage is marked as intentionally noindex.
- **There is no cap for many noindex pages,** because noindex is often intentional (§7.1, `seo.indexable`).
- **Display:** the UI shows a capped score as "Capped at 30 by: Homepage is noindex".

### 8.4 Coverage and minimum data

- **What coverage is:** verified weight ÷ (verified weight + unverified weight). For Performance, it's pages with at least one device result ÷ scanned pages. Advisory checks don't count toward coverage.
- **When a category gets a score:** only if its coverage is **at least 60%**. Otherwise it shows "Insufficient data".
- **When the audit gets an overall score:** **at least 3 categories have scores, and SEO or Performance is one of them.** Otherwise it shows "Insufficient data".
- **When a category has no score:**
  - it is **not counted as zero**;
  - the overall score is calculated from the categories that do have scores, with their weights re-normalized;
  - the audit is marked `partially_completed`, the overall score is labelled **Provisional**, and the missing categories and coverage are shown.

### 8.5 Overall score and worked example

```
overall = round( Σ(category_score × weight) ÷ Σ(weights of scored categories) )
weights: seo 25 · performance 25 · accessibility 15 · technical_security 20 · ux_conversion 15
```

**Example: the SEO category on a 4-page audit.** To keep it short, assume these are the only applicable checks.

| Check | Tier | Result | Earned / possible |
|---|---|---|---|
| `seo.title_present` | 5 | 4 of 4 pages pass | 5 / 5 |
| `seo.title_unique` | 3 | 2 pages share a title (scored warning, 0.5 each), 2 pass → (1 + 1 + 0.5 + 0.5) ÷ 4 = 0.75 | 2.25 / 3 |
| `seo.canonical_valid` | 3 | 1 page's canonical target returns 404 (failure), 2 pass, 1 page has no canonical (`not_applicable`) → (0 + 1 + 1) ÷ 3 | 2 / 3 |
| `seo.robots_txt` | 2 | robots.txt is missing: a recommendation, scored as passed | 2 / 2 |
| `seo.title_length` | 2 | 2 titles longer than 60 characters (recommendations). The check is advisory | excluded |
| `seo.readability` | 1 | `not_applicable` (German site). The check is also advisory | excluded |

SEO = round(100 × 11.25 ÷ 13) = round(86.54) = **87** (needs improvement).

If Performance failed completely, the overall score would be calculated from the other four categories with weights 25 + 15 + 20 + 15 = 75, and labelled Provisional.

### 8.6 Severity

- **Severity is decided by the application,** never set by hand.
- **Base severity** comes from the catalog.
  - **SEO (§7.1):** the Severity column is the severity of the check's most serious outcome. Any less serious warning outcome of the same check is one level lower.
  - **Categories without levels:** warnings are one level lower than the check's failed severity (never below low).
- **It goes up by one level (capped at high)** for failures and warnings when any of these is true:
  - the occurrence is on the **homepage**;
  - the check is flagged (failure or warning) on **≥50% of scanned pages** (sitewide);
  - it is a UX check on a **conversion page** (pricing, contact, product or landing).
- **Recommendations** are always **low** and never go up. **Informational** findings have no severity.
- **Critical** only comes from checks whose base severity is critical.
- **An issue's severity** is the highest severity of its occurrences in the latest audit. It is recalculated every audit, so it can change when the evidence changes.

**Example:** a missing H1 (`seo.h1_single`) is a warning with severity medium, so it is **high on the homepage** and **medium on a blog post**.

### 8.7 Historical consistency

- **Method version:** every audit stores its scoring **method version** (e.g. `2026.1`), the Lighthouse version, the axe version and the crawler version.
- **Old audits are never recalculated.**
- **Comparing across method versions** shows a notice: "These audits use different scoring methods (2026.1 vs 2026.2), so score changes may partly come from the method."
- **Score revisions (Phase 2):** an audit's scores live in **score revisions**.
  - Revision 0 is the original audit and never changes.
  - Each successful visual analysis adds a new revision with the recalculated UX and overall scores, and the date and the page that triggered it.
  - The "latest score" and trend charts use each audit's latest revision, and show the AI coverage (e.g. "AI coverage: 3/10 pages").

---

## 9. AI

### 9.1 Tasks and models

Every task's model is a setting (`settings.ai.models`), so the admin can change it without redeploying. Every AI run records its model, tokens and cost.

| Task | When it runs | Model (initial) | Output |
|---|---|---|---|
| `page_type_classification` | During the audit, only when the rules aren't confident | Haiku 5.5 (`claude-haiku-5-5`) | Page type and confidence |
| `page_content_analysis` | During the audit, for every scanned page | Sonnet 5.5 (`claude-sonnet-5-5`) | Content findings (clarity, readability, whether headings match the content, weak content) plus rewrite suggestions |
| `executive_summary` | During the audit, after scoring | Opus 5.5 (`claude-opus-5-5`) | Plain-language summary, ready to forward to a client: 3–5 priorities and strengths |
| `finding_advice` | During the audit, for the **top 15 findings** (ordered by severity, then tier, then number of pages affected) | Sonnet 5.5 | Advice specific to the page, on top of the fixed explanation |
| `visual_analysis` (Phase 2) | When the user asks | Opus 5.5 | Criteria ratings, strengths, issues, recommendations, suggested copy |

**Choosing models.** Before the models are final, the same 3 real pages run through Sonnet and Opus for the `executive_summary` and `visual_analysis` tasks. The owner sees the outputs and costs side by side and picks.

### 9.2 Evidence and output rules

- **Required fields for every AI finding:**
  - title, description, impact and recommendation
  - the affected page
  - evidence: a quote or a described visual observation
  - detection method: AI content analysis or AI visual analysis
  - confidence: `high`, `medium` or `low`
  - a screenshot section reference, where one applies
- **How confidence is set:**
  - `high`: based on a direct quote or a clearly visible element;
  - `medium`: a reasonable inference from evidence;
  - `low`: a subjective impression.
- **The AI must never:**
  - invent a measurement;
  - claim it verified something it didn't;
  - present a subjective observation as a confirmed technical violation;
  - claim an effect on conversion rates.
- **Checks on AI output:**
  - quotes must appear word for word in the page text; findings whose quotes don't match are dropped;
  - every number in a summary must exist in the audit's data, or the output is regenerated once and then the number is removed;
  - screenshot references must exist.
- **AI findings have no severity of their own.** They are shown with their confidence. Visual-analysis criteria use the fixed severities in §7.5.
- **AI findings stay attached to their audit and page.** They aren't tracked as issues across audits, because AI output varies between runs. **Proposed — review.** If an AI finding repeats a deterministic finding (same page, same topic), it is suppressed.
- **Rewrite suggestions** (title, meta description, headings, content, alt text) are made **only where the related check didn't pass** (a failure, warning or recommendation), and are based on the page's actual content.
  - Alt-text suggestions from per-page analysis use only the file name and the surrounding text, and say so.
  - Visual analysis can suggest alt text from the screenshots.
  - The AI never changes a website.
- **Language:** output is in English, and quotes keep the page's original language. Page language is detected (from `lang` and the text).
- **Raw files:** prompts and raw responses are kept for 90 days. The structured results are kept with the audit.

### 9.3 Visual analysis (Phase 2)

1. **Choosing a page.** The user picks one scanned page of any audit whose screenshots are still stored.
2. **Quota.** The analysis uses quota (§3). Re-runs are allowed and use quota too. The latest successful run counts, and earlier runs are kept.
3. **Input.** The audit's **stored screenshots** are sent to the AI, together with extracted content and the relevant HTML (headings, calls to action, navigation, forms).
   - **Desktop:** 1440 px wide, in sections of about 1,600 px.
   - **Mobile:** 390 CSS px wide at 2× resolution, in sections of about 844 CSS px.
   - **At most 8 sections per device.** Longer pages are marked "Partially analyzed (top 12,800 px)".
4. **Output:**
   - criteria ratings (§7.5 C)
   - strengths, issues and recommendations
   - suggested headlines, CTA text, messaging and structure
   - visual accessibility observations (not scored)
5. **Results.** Each result is stored against its website, audit and page, and adds a UX score revision (§8.7).
6. **Inspecting a single section** (hero, pricing) **comes after the MVP**.

### 9.4 Failures, cost and caching

**When an AI call fails**
- **Retries:** temporary errors (429, 5xx, timeouts) are retried once with backoff. Output that doesn't match the expected format gets one repair attempt.
- **If an AI stage still fails:**
  - the audit still ends as **`completed`**, because no score depends on it;
  - an "AI unavailable" banner appears with **one** retry button;
  - once the output succeeds, it is frozen.
- **A failed visual analysis** doesn't use up quota.

**Cost**
- The cost of every AI run is logged in `ai_runs`.
- The free tier has a **budget** (§12).
- AI requests for one audit run 3 at a time.

**Caching**
- Shared instructions use prompt caching.
- Results are never reused between users. The only exception is the demo, which shows published audits.

---

## 10. Findings, issues and history

### 10.1 What a finding contains

- **Description:**
  - title, primary category, severity
  - level: failure, warning, recommendation or informational (§7)
  - description, impact and recommendation (fixed text, plus AI advice for the top 15)
- **Where and how it was found:**
  - affected URLs, with evidence for each page: the element selector, a code snippet, the resource URL, the measured value against the threshold, and a screenshot reference
  - detection method: `automated`, `manual_review` or `ai`
  - confidence, where it applies
- **Tracking:** first and last detected dates, and status.

### 10.2 Identity and grouping

- **An issue** is one website + one check key + one variant. Examples of variants: the header name, the axe rule, the Lighthouse diagnostic.
- **An occurrence** is that issue on one page (or the site, for site-level checks) and one element: a selector, a resource URL, or nothing.
- **Grouping:** identical issues across pages are grouped into one issue that keeps every page-level occurrence and its evidence.
- **The same element reported by two categories** (for example `seo.img_alt_missing` and `a11y.image-alt`) creates two issues that link to each other: "Also reported under Accessibility".
- **Manual-review findings** are issues too, marked `manual_review`.
- **Recommendations** are issues too, carrying their level, so users can mark them resolved or ignored.
- **Informational findings aren't issues.** They appear only on the audit and page views, and have no lifecycle.

### 10.3 Lifecycle

**Statuses:** `open`, `in_progress`, `resolved`, `ignored`.

- **When a check passes again** on a page this audit scanned, that page's occurrence is **resolved automatically**.
- **An issue stays open** while any of its occurrences is open. When all occurrences are resolved, the system sets the issue to `resolved`.
- **Nothing is assumed fixed** on a page this audit didn't scan, or where the check was `unable_to_verify`.
- **"Resolved" by hand is not proof (Phase 2).** The next audit checks it:
  - if the issue is still detected, it is **reopened** as "Reopened: still detected in the audit of 3 Dec";
  - if it isn't detected on the scanned pages, it is marked **verified**.
- **Ignored issues** stay `ignored` while they persist, take new occurrences, can be filtered, and can be reopened by hand. When an ignored issue is fully resolved it becomes `resolved`. If it comes back later, it returns as `open`, marked "Regression".
- **"In progress"** is set by hand, with an optional private note. There are no assignees.
- **Status history:** every status change (by the user or the system) is kept, with its reason and the audit that triggered it.
- **Single-page audits** update only the occurrences on their own page, plus site-level checks, which they verify too. **The site-level part is proposed — review.**
- **Cancelled audits:**
  - their collected results stay visible;
  - they get **no scores**;
  - they don't change issues or trends.

  **Proposed — review.**

### 10.4 Snapshots and history

- **Every finished audit is an unchangeable snapshot:** its pages, check results, findings with their severity at that time, AI output and score revision 0.
- **Issues and their statuses** are the only state that changes across audits.
- **Two history tracks per website:**
  - **whole-site audits**, which feed the "latest score" and trend charts;
  - **single-page audits**, which have their own track.
- **Comparison (Phase 2): any two whole-site audits of the same website.** It shows:
  - the change in overall and category scores;
  - **new** issues (in B, not in A);
  - **resolved** issues (in A, not in B, on pages scanned in both);
  - **recurring** issues (in both);
  - page changes: pages added or removed, and page score changes;
  - a notice when the two audits used different methods.

---

## 11. Dashboard, reports and demo

### 11.1 Dashboard and results
- **Overview, across all websites:**
  - each website's latest score and its trend;
  - recent audits and their statuses;
  - open critical and high issues.
- **The audit results page has 5 tabs:**

  | Tab | Contents |
  |---|---|
  | **Overview** | Scores, coverage, findings by severity, passed checks, AI insights and summary, pages scanned, date, status, top issues |
  | **Issues** | Grouped findings with filters and sorting. Failures and warnings are shown by default; recommendations are added with a filter |
  | **Pages** | One entry per page: scores, checks, screenshots, content analysis, page type |
  | **Performance** | Lab results per device, real-user data, opportunities |
  | **Technical** | robots.txt, sitemap, SSL, headers, cookies, detected technologies |

- **Findings can be filtered** by category, severity, status, page, date and website.

### 11.2 Public interactive reports (Phase 2)
- **What a link points to:** one specific audit, via a non-guessable token. The link can be given an expiry (7, 30 or 90 days, or none) and can be revoked. The admin can turn off any link.
- **Contents:**
  - website, date, scores (latest revision), summary
  - findings, recommendations and evidence, including screenshots and AI output
  - scanned pages, limitations and coverage
- **Ignored issues** are hidden by default; there's a toggle when the link is created.
- **Hidden from search engines:** the page carries both a `noindex` header and a meta tag. It never exposes private notes, the account email or other audits.
- **Fixed footer:** "Automated assessment by SiteLens. Not affiliated with or endorsed by the site owner." It also shows a contact address for removal requests.
- **Branding** follows the same rules as the PDF (§3).

### 11.3 PDF reports (Phase 2)
- **Generation:** made on request from the report layout and stored for 90 days. It is regenerated if the audit's latest revision has changed.
- **Cover:** SiteLens branding, plus the optional user logo and company name on Pro and admin accounts. Then the website, date and overall score.
- **Contents:** summary, category scores, top issues, findings by category, pages scanned, methodology and limitations.
- **Out of scope:** advanced white-labeling, such as removing SiteLens branding or custom themes.

### 11.4 Demo (Phase 3)
- **Entry point:** "Explore demo" goes to **`/demo`**, which opens directly on the **Overview tab of the demo audit**.
- **What it is:** the real interface, showing **pre-generated audits** of the owner's own websites. The sidebar works, and the small workspace has at least one website with 2 or more audits, so trends and comparisons exist. Settings is hidden.
- **What visitors can do:**
  - explore everything: scores, pages, findings, severities, explanations, AI summaries and recommendations, screenshots and evidence, filters and sorting, issue details, the report, and the PDF preview and download.
  - **They can never run anything:** audits, re-runs, visual analysis, adding websites, public links and settings all show "Create a free account to do this".
  - Status changes and ignoring work **only in the browser** and reset on reload.
- **Banner on every demo page:** "You're exploring a demo audit. Create a free account — your first full audit is free." with a sign-up button.
- **How demo data is made:**
  - The admin runs real audits with the real pipeline and models, then publishes them as the demo with one action (`demo_publications`).
  - The admin republishes when checks or scoring change.
  - Demo audits are never deleted by retention.
- **Cost:** visiting the demo costs nothing.

---

## 12. Limits and abuse protection

### 12.1 Principles
- **Everything is enforced on the backend,** never only in the browser.
- **Limits are reserved atomically.** The account is locked and an advisory lock is taken per site key, so simultaneous requests can't bypass a limit (DB.md, `start_audit`).
- **Each limit is separate.** The site limits add protection on top of the per-account allowances and the AI budget; they don't replace them.
- **The admin bypasses rate and plan limits.** Every bypass (a rule that would have blocked the request) is logged in `admin_actions`.
- **Messages never reveal** whether another user audited a site, and never show anyone else's information.

### 12.2 Site key: when two addresses count as the same site

The site key is the hostname with these changes:
- scheme removed and port removed;
- lowercased;
- trailing dot removed;
- internationalized names converted to punycode (IDNA);
- a leading `www.` removed.

**Examples:**
- `http://WWW.Example.com:443/` and `https://example.com/blog` → `example.com`
- `blog.example.com` → `blog.example.com`

**Subdomains are separate sites,** consistent with the crawler, which stays on one exact hostname and treats subdomains as external. Only `www.` is stripped, because it almost always serves the same site.

**Redirects:**
- Limits are checked against the site key of the **entered** URL when the audit starts.
- After the first redirect, they are checked again against the **final** hostname's key.
- If the final key is blocked, the audit stops before scanning: it ends as `failed` with the same generic message.
  - The account credit comes back.
  - The entered key's reservations are released, because only a redirect lookup happened.

### 12.3 The limits

| # | Limit | Applies to | Rule | Message |
|---|---|---|---|---|
| L1 | Free audit per account | free | 1 for the life of the account; up to 3 returns (§3) | "You've used your free audit. Upgrade to Pro to run more audits." |
| L2 | Free audit per email | free | 1 per **normalized email**: lowercase, and for Gmail/Googlemail dots and `+tag` removed. An HMAC hash of it is kept **after the account is deleted** | "This email address has already used its free audit." |
| L3 | Disposable emails | sign-up (email/password, Phase 3) | Blocked by a maintained domain list | "Please use a permanent email address." |
| L4 | Free audits per network | free | At most 2 per IP address per rolling 30 days. The IP is stored only as an HMAC hash and deleted after 30 days | "Free audits aren't available from this network right now. Try again after [date]." |
| L5 | Bot check | free audit start | Cloudflare Turnstile must pass (Phase 3) | "We couldn't verify you're human. Please try again." |
| **L6** | **Free audits per site** | **all free accounts together** | **At most 1 free-plan audit per site key per rolling 7 days** | **"This site can't be audited on the free plan right now. Try again after [date]."** |
| **L7** | **Audit runs per site** | **all normal accounts, Pro included** | **At most 3 audit runs per site key per rolling hour** | "This site can't be audited right now. Try again after [time]." |
| L8 | Free-tier AI budget | free (audits and visual analyses) | **$10 per calendar month (UTC)**, counting actual spend plus estimates for free audits still running | "Free audits are paused until [date]. You can still explore the demo." |
| L9 | Free audits per day | free | At most 5 free audits per UTC day | Same as L8, with tomorrow's date |
| L10 | Running audits | free, Pro | 1 queued or running audit per account | "You already have an audit running. Wait for it to finish or cancel it." |
| L11 | Pro quotas | Pro | 30 audits, 20 visual analyses and 10 websites per period | "You've used this month's audits. They reset on [date]." |
| L12 | Blocked sites | everyone, **admin included** | Site owners who asked to be excluded | "This site has asked not to be audited by SiteLens." |
| L13 | Global concurrency | system | 2 audits run at once. The rest wait in a queue; the admin's audits go first | Queue position shown (UI-rules.md) |

**Notes on the limits**
- When L8 or L9 is reached, the user keeps their credit.
- Every number above is a setting the admin can change.
- **A request that fails before the crawler accesses the website doesn't use the L6 or L7 allowance.** This covers invalid or unsafe URLs, DNS resolving to a private address, blocked sites, failures while queued, and cancellation while queued. Its reservations are released.
- The terms of use forbid creating multiple accounts to get extra free audits. The owner may delete accounts that do.

---

## 13. Privacy, GDPR and retention

**Hosting and processors**
- **Hosting:** in the EU. Supabase and the Vercel functions run in Frankfurt.
- **Services that process data,** all listed in the privacy policy:

  | Service | What it handles |
  |---|---|
  | Supabase | Database, sign-in and file storage (EU) |
  | Vercel | Hosting and Web Analytics |
  | Anthropic | AI processing. This **may happen outside the EU**, and only public page content and screenshots are sent, never account data |
  | Google | PageSpeed Insights and CrUX; receives audited URLs only |
  | Stripe | Payments |
  | Resend | Email |
  | Sentry | Error reports |
  | Cloudflare | Turnstile bot check |

- **Cookies:** only the cookies needed for sign-in, plus Vercel Web Analytics, which uses no cookies. If Turnstile needs a consent notice, that is checked before launch.

**Retention**

| Data | Kept for |
|---|---|
| Structured results (audits, pages, findings, scores, AI outputs) | As long as the account exists |
| Raw files (Lighthouse JSON, HTML snapshots, AI prompts and responses) | 90 days |
| Screenshots | As long as their audit exists, if a public report, PDF or visual analysis uses them; otherwise 90 days |
| IP hashes | 30 days |
| Limit reservations | 30 days |
| Demo audits | As long as they're published |

Visual analysis is possible on any audit whose screenshots are still stored.

**Rights and legal pages**
- **Data export (Phase 3):** a JSON archive of the account's data, with download links for its files.
- **Account deletion:**
  - access ends immediately and everything is erased within 30 days;
  - the email hash used for L2 is kept as an anti-abuse measure (legitimate interest, stated in the privacy policy);
  - entries in the admin log that point to the deleted user are anonymized.
- **Privacy policy and terms pages** are published before the public launch (Phase 3).

---

## 14. Non-functional requirements

- **Security:**
  - SSRF protection in several layers: only `http(s)` and ports 80 and 443; DNS checks block private, reserved and loopback IPv4 and IPv6 addresses, and every redirect and browser request is checked again.
  - Passive checks only.
  - Row-level security (RLS) on every table.
  - The service-role key is used only on the server and in the worker.
  - Public tokens are random, 256-bit, and stored only as a hash.
  - Webhooks are verified by signature.
  - Secrets live only in environment variables; the repo is public.
- **Reliability:**
  - stage-level retries, a 15-minute cap and partial completion;
  - the worker sends a heartbeat, and stuck audits are closed after 3 minutes without one;
  - an audit never stays `running` forever.
- **Performance:**
  - app pages render in under 2 s on broadband;
  - a typical whole-site audit takes ≤10 min and a single-page audit ≤3 min, with a hard cap of 15 min.
- **Accessibility of SiteLens itself:** WCAG 2.2 AA. SiteLens should score in the "good" band on its own audit.
- **Cost visibility:** the AI cost of every audit is logged from the first audit. The admin page shows the cost per audit and monthly totals by budget bucket (free, Pro, admin).
- **Honesty:** the app never claims a check it didn't run, never presents automated accessibility results as proof of compliance, and clearly labels "Unable to verify", "Not applicable" and "Insufficient data".

---

## 15. Audit processing

**Stages, in order:**
`initialization`, `discovery`, `crawling`, `seo`, `performance`, `accessibility`, `technical_security`, `ux_automated`, `ai_content`, `ai_explanations`, `scoring`, `finalization`

**Audit statuses**

| Status | Meaning |
|---|---|
| `queued` | Waiting for the worker. The queue position is shown |
| `running` | Being processed |
| `completed` | All scanned pages were processed and all five categories have scores. An AI failure alone doesn't change this |
| `partially_completed` | Useful results exist, but something is missing: some pages failed, a category has no score, a device run or another data source failed, or the 15-minute cap was hit |
| `failed` | No useful results. Examples: the site is unreachable, blocked, unsafe or behind bot protection, a limit blocked it at the final hostname, or an internal error happened before any page was scanned |
| `cancelled` | The user cancelled. Completed results are kept, unfinished work stops, and there are no scores (§10.3) |

**Behavior**
- **Audits run as background jobs.** Progress is saved, so the user can leave and come back.
- **Retries:** temporary errors are retried once. Permanent errors aren't retried, and their details are saved. Anything that couldn't be checked is marked `unable_to_verify`.
- **Rate limits and concurrency protect everyone involved:** the app, the audited sites, browser resources, the third-party APIs and the AI budget.

---

## 16. Acceptance criteria

### 16.1 By module

**Websites and clients**
- [ ] Websites can be created, edited and deleted. The URL is locked after the first audit. Deleting requires typing the hostname.
- [ ] The quick audit box creates the website when it's new, and reuses an existing one with the same site key.
- [ ] Clients can be created and edited. Websites and audits can be filtered by client.

**Crawling**
- [ ] Whole-site audits find at most 10 pages in the brief's order, starting at the homepage and always including the entered URL.
- [ ] Every discovered URL is listed with its outcome and reason, including when the 10-page limit is reached.
- [ ] URL normalization, canonical exclusion, robots.txt rules, skipped paths and the limits in §6.4 behave as specified, and are covered by unit tests.
- [ ] Private, loopback and reserved addresses are refused, including when a redirect or a browser request leads to them. Covered by unit tests.
- [ ] Bot protection and login walls are detected and reported, never bypassed.

**Checks and scoring**
- [ ] Every check in §7 is implemented with its key, tier, levels, severity rules, evidence and fixed explanation.
- [ ] Scoring matches §8 exactly, including the worked example as a unit test, the caps, coverage, re-normalization and rounding.
- [ ] SEO levels and scored/advisory status match §7.1. A unit test confirms that fixing a recommendation or an informational finding leaves the score unchanged, and that advisory checks count toward neither the score nor coverage.
- [ ] Indexing-intent marks (§5) apply from the next audit, and SEO caps skip websites marked "not meant to be indexed".
- [ ] Every audit stores its method, Lighthouse, axe and crawler versions. Old audits are never recalculated.
- [ ] Performance uses PageSpeed, one run per device, weighted 60/40. A device failure is flagged. CrUX data is shown but never scored. INP is never shown from lab data.
- [ ] Only WCAG A/AA axe violations affect the Accessibility score. The disclaimer is always shown.

**AI**
- [ ] AI outputs pass schema validation and the quote and number checks. Every run records model, tokens and cost.
- [ ] If AI fails, the audit is still `completed`, with the banner and one retry.
- [ ] Rewrites appear only for checks that didn't pass.

**Issues**
- [ ] Issues are grouped by website, check and variant, with occurrences for each page and element.
- [ ] The lifecycle rules in §10.3 hold across consecutive audits, tested with fixture audits.
- [ ] Single-page audits update only their own page's occurrences and site-level occurrences.

**Processing**
- [ ] Progress updates live, with polling as a fallback.
- [ ] Cancelling keeps completed results and stops within 10 s.
- [ ] The 15-minute cap produces `partially_completed`.
- [ ] A worker crash is detected by the heartbeat sweeper.

**Limits**
- [ ] Each of L1–L13 is enforced in the database. Concurrent requests (tested with parallel calls) can't go over any limit.
- [ ] Admin bypasses are logged.
- [ ] The L6 and L7 allowances are released for requests that fail before the crawler touches the site.
- [ ] No message reveals another user's activity.

**Reports (Phase 2)**
- [ ] Public links work only with a valid, unexpired, unrevoked token. They are noindex and hide ignored issues by default.
- [ ] The PDF renders with the correct branding for the account's plan.

**Visual analysis (Phase 2)**
- [ ] It uses the stored screenshots, at most 8 sections per device, and creates a new score revision while revision 0 stays unchanged.
- [ ] Re-runs are kept and the latest successful run counts.

**Demo (Phase 3)**
- [ ] `/demo` shows the published audits with every read-only feature.
- [ ] No server action can write or start anything from the demo.
- [ ] Browser-only status changes reset on reload.

**Billing (Phase 3)**
- [ ] Checkout creates an active Pro subscription through the webhook. Cancelling reverts the account to free when the period ends.
- [ ] Webhooks are handled idempotently.

**Privacy (Phase 3)**
- [ ] Export produces a full archive.
- [ ] Deletion removes all user data within 30 days and keeps only the L2 email hash.
- [ ] Retention jobs delete expired files.

### 16.2 Phase exit criteria

- **Phase 1:** the owner can sign in, add a client and a website, and run single-page and whole-site audits of real sites from the deployed app, with the worker on the PC. Phase 1 is done when:
  - progress updates live and cancelling works;
  - all five category scores and the overall score appear, plus findings, grouped issues and the AI summary, page analyses and advice;
  - a second audit resolves fixed occurrences automatically;
  - the cost of every audit is visible in the database;
  - CI is green: lint, type check, unit tests and the fixture-site integration test;
  - the landing page is approved by the owner.
- **Phase 2:** visual analysis with score revisions, manual issue statuses with verification by the next audit, comparisons and trends, and public and PDF reports all work end to end.
- **Phase 3:** the demo, the free plan with L1–L13, Stripe Pro, the admin page, email sign-in on the owner's domain, Turnstile, Sentry, the legal pages and the GDPR flows are live on Supabase Pro, with the worker on a container host.

---

## 17. Open items

| # | Item | Resolve by |
|---|---|---|
| O1 | Pro price, set from the real costs measured in Phases 1–2 (at full use, AI costs about $20 per Pro user per month) | Phase 3 |
| O2 | EU VAT on subscriptions: Stripe Tax setup, and whether a merchant-of-record service would be simpler | Phase 3 |
| O3 | The landing page arrives in Phase 1 but the demo in Phase 3, so its main button reads "Sign in" until then | Phase 3 |
| O4 | The PageSpeed API quota, to be checked in Google Cloud Console | Phase 1 setup |
| O5 | The worker's container host (Railway, Fly.io or Render, in an EU region) and its current price | Phase 3 |
| O6 | Domain name; the `/bot` URL in the user agent uses the Vercel domain until then | Before Phase 3 |
| O7 | Final model per AI task, after the side-by-side test (§9.1) | End of Phase 1 |
| O8 | Review of every **Proposed — review** default in this document. **Accepted for Phase 1 (23 Nov 2026); revisit with real audit data.** The markers stay in the text to show which values to revisit | Revisit after Phase 1 |
| O9 | Vercel Hobby is for non-commercial use, so taking payments probably requires **Vercel Pro**. Check the current terms | Before Stripe goes live (Phase 3) |

---

## Change log

| Version | Date | Changes |
|---|---|---|
| v1 | 22 Nov 2026 | Approved by the owner |
| v1.1 | 23 Nov 2026 | §2: the Phase 1–2 sign-in allowlist (`ALLOWED_EMAILS`) and its accepted risk; removed in Phase 3. §17: O8 accepted for Phase 1 |
