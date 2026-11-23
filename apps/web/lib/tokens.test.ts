// The token contrast test required by UI-rules §3.3 and §12. It reads the real
// app/globals.css, so a token edit that breaks contrast fails CI.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
  contrastRatio,
  readThemeInlineMappings,
  readThemeTokens,
  readThemeValues,
} from "./contrast";

const css = readFileSync(fileURLToPath(new URL("../app/globals.css", import.meta.url)), "utf8");
const tokens = readThemeTokens(css);
const values = readThemeValues(css);
const mappings = readThemeInlineMappings(css);

const themes = ["light", "dark"] as const;

/** The tokens T02 adds (UI-rules §3.1 `--link`, §3.2–§3.4). */
const NEW_TOKENS = [
  "link",
  ...["good", "average", "poor"].flatMap((band) => [
    `score-${band}`,
    `score-${band}-fg`,
    `score-${band}-bg`,
  ]),
  "severity-critical",
  "severity-critical-fg",
  ...["high", "medium", "low"].flatMap((s) => [`severity-${s}-fg`, `severity-${s}-bg`]),
  "unverified-fg",
  "unverified-bg",
  "info-fg",
  "info-bg",
  ...["seo", "performance", "accessibility", "technical", "ux"].map((c) => `category-${c}`),
];

/** Text (fg) on a surface (bg): WCAG 1.4.3, at least 4.5:1. */
const TEXT_PAIRS: [fg: string, bg: string][] = [
  // Preset pairs that carry text (UI-rules §3.1).
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["primary-foreground", "primary"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "card"],
  ["muted-foreground", "background"],
  ["link", "background"],
  ["link", "card"],
  ["link", "muted"],
  // Score bands, results and levels (§3.2, §3.3).
  ["score-good-fg", "score-good-bg"],
  ["score-average-fg", "score-average-bg"],
  ["score-poor-fg", "score-poor-bg"],
  // Severity, unverified and info badges (§3.3).
  ["severity-critical-fg", "severity-critical"],
  ["severity-high-fg", "severity-high-bg"],
  ["severity-medium-fg", "severity-medium-bg"],
  ["severity-low-fg", "severity-low-bg"],
  ["unverified-fg", "unverified-bg"],
  ["info-fg", "info-bg"],
];

/** Solid marks (gauges, the critical badge, chart series): WCAG 1.4.11, at least 3:1. */
const SOLID_MARKS = [
  "score-good",
  "score-average",
  "score-poor",
  "severity-critical",
  "category-seo",
  "category-performance",
  "category-accessibility",
  "category-technical",
  "category-ux",
];
const MARK_SURFACES = ["card", "background"];

const ratio = (theme: (typeof themes)[number], a: string, b: string) => {
  const fg = tokens[theme][a];
  const bg = tokens[theme][b];
  if (!fg || !bg) throw new Error(`${theme}: missing --${!fg ? a : b}`);
  // A translucent color's contrast depends on what's behind it, so it can't be
  // checked from tokens alone. None of the pairs above use one.
  if (fg.alpha < 1 || bg.alpha < 1) throw new Error(`${theme}: --${a} or --${b} has alpha`);
  return contrastRatio(fg, bg);
};

/** The ratio for a test name. Errors surface inside the test, not at collection. */
const label = (theme: (typeof themes)[number], a: string, b: string) => {
  try {
    return `${ratio(theme, a, b).toFixed(2)}:1`;
  } catch {
    return "n/a";
  }
};

describe("token definitions", () => {
  for (const theme of themes) {
    test.each(NEW_TOKENS)(`${theme}: --%s is a literal oklch()`, (name) => {
      expect(values[theme][name], `--${name} is missing`).toBeDefined();
      expect(values[theme][name]).toMatch(/^oklch\(/);
    });
  }

  test.each(NEW_TOKENS)("--color-%s is mapped in @theme inline", (name) => {
    expect(mappings[name]).toBe(`var(--${name})`);
  });
});

for (const theme of themes) {
  describe(`${theme} theme`, () => {
    for (const [fg, bg] of TEXT_PAIRS) {
      test(`${theme}: ${fg} on ${bg} ≥ 4.5 (${label(theme, fg, bg)})`, () => {
        expect(ratio(theme, fg, bg)).toBeGreaterThanOrEqual(4.5);
      });
    }

    for (const mark of SOLID_MARKS) {
      for (const surface of MARK_SURFACES) {
        test(`${theme}: ${mark} on ${surface} ≥ 3 (${label(theme, mark, surface)})`, () => {
          expect(ratio(theme, mark, surface)).toBeGreaterThanOrEqual(3);
        });
      }
    }
  });
}
