import {
  GlobalSearchIcon,
  Search01Icon,
  SearchFocusIcon,
  SearchVisualIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentDemos } from "./demos";

// Dev-only reference for the UI-rules tokens and components (UI-rules §15).
// It is not a product screen and returns 404 in production builds.

export const metadata: Metadata = { title: "UI reference" };

/** Literal class strings, so Tailwind generates them and every mapping is exercised. */
const TEXT_PAIRS = [
  { name: "score-good-fg / -bg", className: "bg-score-good-bg text-score-good-fg" },
  { name: "score-average-fg / -bg", className: "bg-score-average-bg text-score-average-fg" },
  { name: "score-poor-fg / -bg", className: "bg-score-poor-bg text-score-poor-fg" },
  { name: "severity-critical-fg / solid", className: "bg-severity-critical text-severity-critical-fg" },
  { name: "severity-high-fg / -bg", className: "bg-severity-high-bg text-severity-high-fg" },
  { name: "severity-medium-fg / -bg", className: "bg-severity-medium-bg text-severity-medium-fg" },
  { name: "severity-low-fg / -bg", className: "bg-severity-low-bg text-severity-low-fg" },
  { name: "unverified-fg / -bg", className: "bg-unverified-bg text-unverified-fg" },
  { name: "info-fg / -bg", className: "bg-info-bg text-info-fg" },
  { name: "muted-foreground / muted", className: "bg-muted text-muted-foreground" },
  { name: "link / background", className: "bg-background text-link" },
  { name: "link / muted", className: "bg-muted text-link" },
];

const SOLID_MARKS = [
  { name: "score-good", className: "bg-score-good" },
  { name: "score-average", className: "bg-score-average" },
  { name: "score-poor", className: "bg-score-poor" },
  { name: "severity-critical", className: "bg-severity-critical" },
  { name: "category-seo", className: "bg-category-seo" },
  { name: "category-performance", className: "bg-category-performance" },
  { name: "category-accessibility", className: "bg-category-accessibility" },
  { name: "category-technical", className: "bg-category-technical" },
  { name: "category-ux", className: "bg-category-ux" },
];

const LOGO_CANDIDATES = [
  { name: "Search01Icon (current default)", icon: Search01Icon },
  { name: "SearchFocusIcon", icon: SearchFocusIcon },
  { name: "GlobalSearchIcon", icon: GlobalSearchIcon },
  { name: "SearchVisualIcon", icon: SearchVisualIcon },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-heading text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 py-6 lg:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold md:text-3xl">UI reference</h1>
          <p className="text-sm text-muted-foreground">
            Tokens and base components from UI-rules §3 and §15. Development only.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section title="Logo">
        <div className="flex flex-wrap items-center gap-6">
          <Logo />
          <Logo variant="icon" />
        </div>
        <p className="text-xs text-muted-foreground">Icon candidates (the owner picks one in the T02 PR):</p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {LOGO_CANDIDATES.map(({ name, icon }) => (
            <li key={name} className="flex flex-col gap-2 border bg-card p-4">
              <Logo icon={icon} />
              <span className="font-mono text-xs text-muted-foreground">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Text on background pairs (≥ 4.5:1)">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {TEXT_PAIRS.map(({ name, className }) => (
            <li key={name} className={`flex flex-col gap-1 border p-3 ${className}`}>
              <span className="text-sm font-medium">Sample text 123</span>
              <span className="font-mono text-xs">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Solid marks (≥ 3:1 on card and background)">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(["bg-card", "bg-background"] as const).map((surface) => (
            <ul key={surface} className={`flex flex-col gap-2 border p-4 ${surface}`}>
              <li className="font-mono text-xs text-muted-foreground">on {surface.replace("bg-", "--")}</li>
              {SOLID_MARKS.map(({ name, className }) => (
                <li key={name} className="flex items-center gap-3">
                  <span aria-hidden className={`h-3 w-24 shrink-0 ${className}`} />
                  <span className="font-mono text-xs">{name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Section>

      <Section title="Type scale (UI-rules §4)">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-4">
            <p className="font-heading text-2xl font-semibold md:text-3xl">Page title (h1)</p>
            <p className="font-heading text-xl font-semibold">Section (h2)</p>
            <p className="font-heading text-base font-semibold">Card title (h3)</p>
            <p className="text-sm">App body, 14 px. Dense screens use this size.</p>
            <p className="max-w-[72ch] text-base">
              Reading text, 16 px, for summaries and long explanations. Reading columns stay under 72
              characters per line.
            </p>
            <p className="text-xs text-muted-foreground">Meta and captions, 12 px.</p>
            <p className="font-heading text-5xl tabular-nums">87</p>
            <p className="font-mono text-xs break-all">example.com/pricing?plan=pro · main &gt; div.hero h1</p>
          </CardContent>
        </Card>
      </Section>

      <Section title="Cards and badges">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Cards use --card with a 1 px border.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </CardContent>
          </Card>
        </div>
      </Section>

      <ComponentDemos />
    </main>
  );
}
