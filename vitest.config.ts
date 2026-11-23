import { defineConfig } from "vitest/config";

// One config for the whole workspace: each package is a Vitest project.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "core",
          root: "./packages/core",
          include: ["src/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        test: {
          name: "worker",
          root: "./apps/worker",
          include: ["src/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        test: {
          name: "web",
          root: "./apps/web",
          include: ["**/*.test.{ts,tsx}"],
          exclude: ["node_modules/**", ".next/**"],
          environment: "node",
        },
      },
    ],
  },
});
