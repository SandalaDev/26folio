import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      // OS / docs / non-app dirs
      ".agents/", ".claude/", "scripts/", "backlog/", "project-state/", "project-spine/",
      // generated build output + Next.js-authored type shims (flat config does not
      // inherit eslint-config-next's legacy ignores, so declare them explicitly).
      ".next/", "out/", "build/", "dist/", "node_modules/", "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

export default eslintConfig;
