// WCAG contrast for the OKLCH color tokens in app/globals.css (UI-rules §3).
// Pure and dependency-free, so the token test can run in Node.

export type Oklch = {
  /** Lightness, 0–1. */
  l: number;
  /** Chroma, 0 and up. */
  c: number;
  /** Hue in degrees. */
  h: number;
  /** Alpha, 0–1. */
  alpha: number;
};

export type Rgb = { r: number; g: number; b: number };

export type ThemeTokens = {
  light: Record<string, Oklch>;
  dark: Record<string, Oklch>;
};

const OKLCH_PATTERN =
  /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/i;

/** Parses `oklch(L C H)` or `oklch(L C H / A)`. Lightness and alpha may be percentages. */
export function parseOklch(value: string): Oklch {
  const match = OKLCH_PATTERN.exec(value.trim());
  if (!match) throw new Error(`Not a literal oklch() color: ${value}`);
  const [, l, lPercent, c, h, alpha, alphaPercent] = match;
  return {
    l: Number(l) / (lPercent ? 100 : 1),
    c: Number(c),
    h: Number(h),
    alpha: alpha === undefined ? 1 : Number(alpha) / (alphaPercent ? 100 : 1),
  };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * OKLCH → OKLab → linear sRGB (Björn Ottosson's matrices). Out-of-gamut values
 * are clipped to [0, 1]. Returns **linear** sRGB, which is what luminance needs.
 */
export function oklchToLinearSrgb({ l, c, h }: Oklch): Rgb {
  const hue = (h * Math.PI) / 180;
  const a = c * Math.cos(hue);
  const b = c * Math.sin(hue);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;

  return {
    r: clamp01(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    g: clamp01(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    b: clamp01(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
  };
}

/** Gamma-encoded sRGB (0–1), as a browser would display it. */
export function oklchToSrgb(color: Oklch): Rgb {
  const encode = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  const { r, g, b } = oklchToLinearSrgb(color);
  return { r: encode(r), g: encode(g), b: encode(b) };
}

/** WCAG 2.x relative luminance. */
export function relativeLuminance(color: Oklch): number {
  const { r, g, b } = oklchToLinearSrgb(color);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio, from 1 to 21. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Reads the custom properties of the first `selector { … }` block. */
function readBlock(css: string, selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const start = css.search(new RegExp(`(^|[\\n}])\\s*${escaped}\\s*\\{`));
  if (start === -1) throw new Error(`No ${selector} block found`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const body = css.slice(open + 1, close);
  const props: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    props[name] = value.trim();
  }
  return props;
}

/** Strips CSS comments. */
export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * Reads every oklch() custom property in the `:root` (light) and `.dark` blocks.
 * Properties with other values (such as `--radius`) are left out.
 */
export function readThemeTokens(css: string): ThemeTokens {
  const clean = stripComments(css);
  const pick = (props: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(props)
        .filter(([, value]) => value.toLowerCase().startsWith("oklch("))
        .map(([name, value]) => [name, parseOklch(value)]),
    );
  return { light: pick(readBlock(clean, ":root")), dark: pick(readBlock(clean, ".dark")) };
}

/** Raw custom-property values of `:root` and `.dark`, for checking that tokens are literals. */
export function readThemeValues(css: string): { light: Record<string, string>; dark: Record<string, string> } {
  const clean = stripComments(css);
  return { light: readBlock(clean, ":root"), dark: readBlock(clean, ".dark") };
}

/** The `--color-*` names mapped in `@theme inline`, mapped to what they point at. */
export function readThemeInlineMappings(css: string): Record<string, string> {
  const clean = stripComments(css);
  const start = clean.indexOf("@theme inline");
  if (start === -1) throw new Error("No @theme inline block found");
  const open = clean.indexOf("{", start);
  const close = clean.indexOf("}", open);
  const mappings: Record<string, string> = {};
  for (const [, name, value] of clean.slice(open + 1, close).matchAll(/--color-([\w-]+)\s*:\s*([^;]+);/g)) {
    mappings[name] = value.trim();
  }
  return mappings;
}
