import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local Claude Code tooling. Untracked and gitignored, so it is absent
    // from a fresh clone — named here anyway because on a machine that has
    // it, its CommonJS helper scripts fail the TypeScript rules meant for
    // the app and make `npm run lint` exit non-zero on files that are not
    // part of the application.
    ".claude/**",
  ]),
]);

export default eslintConfig;
