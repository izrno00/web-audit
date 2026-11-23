import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/coverage/**",
    "**/.tsbuild/**",
    "**/next-env.d.ts",
  ]),

  // Next.js rules: the web app only.
  {
    files: ["apps/web/**/*.{js,jsx,mjs,ts,tsx}"],
    extends: [nextVitals],
    settings: { next: { rootDir: "apps/web/" } },
  },

  // TypeScript rules: every package.
  ...nextTs,

  // packages/core stays framework-free (Tech §3).
  {
    files: ["packages/core/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next",
                "next/*",
                "playwright",
                "playwright/*",
                "playwright-core",
                "playwright-core/*",
                "@playwright/*",
                "@axe-core/playwright",
                "react",
                "react/*",
                "react-dom",
                "react-dom/*",
                "@base-ui/*",
                "@hugeicons/*",
                "@supabase/*",
                "web",
                "web/*",
                "worker",
                "worker/*",
                "**/apps/**",
              ],
              message: "packages/core must stay framework-free (Tech §3).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
