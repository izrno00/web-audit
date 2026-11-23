import { describe, expect, test } from "vitest";
import {
  contrastRatio,
  oklchToSrgb,
  parseOklch,
  readThemeTokens,
  relativeLuminance,
} from "./contrast";

const white = parseOklch("oklch(1 0 0)");
const black = parseOklch("oklch(0 0 0)");

describe("parseOklch", () => {
  test("reads lightness, chroma and hue", () => {
    expect(parseOklch("oklch(0.553 0.195 38.402)")).toEqual({ l: 0.553, c: 0.195, h: 38.402, alpha: 1 });
  });

  test("allows extra whitespace, percentages, deg and alpha", () => {
    expect(parseOklch("  oklch( 55%  0.1 40deg / 50% ) ")).toEqual({ l: 0.55, c: 0.1, h: 40, alpha: 0.5 });
    expect(parseOklch("oklch(1 0 0 / 10%)").alpha).toBeCloseTo(0.1);
    expect(parseOklch("oklch(1 0 0 / 0.15)").alpha).toBeCloseTo(0.15);
  });

  test("rejects anything that isn't a literal oklch()", () => {
    expect(() => parseOklch("var(--primary)")).toThrow();
    expect(() => parseOklch("#ffffff")).toThrow();
  });
});

describe("color conversion", () => {
  test("white and black map to the ends of sRGB", () => {
    const w = oklchToSrgb(white);
    expect(w.r).toBeCloseTo(1, 4);
    expect(w.g).toBeCloseTo(1, 4);
    expect(w.b).toBeCloseTo(1, 4);
    expect(oklchToSrgb(black)).toEqual({ r: 0, g: 0, b: 0 });
  });

  test("a neutral grey has luminance L³", () => {
    expect(relativeLuminance(parseOklch("oklch(0.6 0 0)"))).toBeCloseTo(0.216, 4);
  });

  test("CSS red (oklch 62.8% 0.2577 29.23) is #ff0000", () => {
    const red = oklchToSrgb(parseOklch("oklch(0.627955 0.257683 29.2339)"));
    expect(red.r).toBeCloseTo(1, 2);
    expect(red.g).toBeCloseTo(0, 2);
    expect(red.b).toBeCloseTo(0, 2);
  });
});

describe("contrastRatio", () => {
  test("black on white is 21:1", () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
  });

  test("a color against itself is 1:1, in either order", () => {
    const orange = parseOklch("oklch(0.553 0.195 38.402)");
    expect(contrastRatio(orange, orange)).toBe(1);
    expect(contrastRatio(orange, white)).toBe(contrastRatio(white, orange));
  });

  test("red on white matches the WCAG reference (4.00:1, within 0.01)", () => {
    const red = parseOklch("oklch(0.627955 0.257683 29.2339)");
    expect(contrastRatio(red, white)).toBeCloseTo(3.998, 2);
  });
});

describe("readThemeTokens", () => {
  test("reads :root and .dark, skips comments and non-color values", () => {
    const css = `
      @theme inline { --color-x: var(--x); }
      :root {
        /* --ignored: oklch(0 0 0); */
        --radius: 0.625rem;
        --x: oklch(0.5 0.1 200);
      }
      .dark { --x: oklch(0.7 0.1 200); }
    `;
    const tokens = readThemeTokens(css);
    expect(Object.keys(tokens.light)).toEqual(["x"]);
    expect(tokens.light.x.l).toBe(0.5);
    expect(tokens.dark.x.l).toBe(0.7);
  });
});
