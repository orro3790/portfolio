---
title: Initialize SvelteKit art portfolio (TS + ESLint flat + Prettier + Zod)
intent: Step-by-step plan to bootstrap the project consistently
---

## 1. Create the SvelteKit project with TypeScript

- **Scaffold the app**:
  - Run:

```bash
pnpm create svelte@latest .
```

- **Choose options when prompted**:

  - Template: **Skeleton project**.
  - Type checking: **TypeScript**.
  - ESLint: **Yes** (we will replace with our flat config).
  - Prettier: **Yes**.
  - Playwright / Vitest: optional; can be added later if needed.

- **Install dependencies**:

```bash
pnpm install
```

## 2. Configure SvelteKit for static site generation

- Install the static adapter:

```bash
pnpm add -D @sveltejs/adapter-static
```

- Update `svelte.config.js` to use the static adapter and keep Vite as the bundler:
  - Import `adapter` from `@sveltejs/adapter-static`.
  - Set `kit.adapter = adapter()` and ensure `prerender` is enabled where appropriate (we can refine this later when routes exist).

## 3. Set up ESLint (flat config) + Prettier

### 3.1 Install linting-related dependencies

- Add ESLint, TypeScript ESLint, Svelte ESLint plugin, globals, and Prettier compat:

```bash
pnpm add -D eslint @eslint/js @eslint/compat eslint-plugin-svelte eslint-config-prettier globals typescript-eslint
```

> Note: SvelteKit may already install some lint dependencies; keep versions aligned when possible.

### 3.2 Replace legacy ESLint config with flat config

- Remove the generated ESLint config file (e.g. `.eslintrc.cjs` or similar) if present.
- Create `eslint.config.mjs` at the project root with a configuration derived from the previous project but **without server-only import restrictions**:

```js
import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    // Ignore build artifacts
    ignores: ["build/**", ".svelte-kit/**"],
  },
  {
    files: ["src/**/*.{ts,js,svelte}"],
    rules: {
      "object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 1,
            consistent: true,
          },
          ObjectPattern: {
            multiline: true,
            consistent: true,
          },
          ImportDeclaration: {
            multiline: true,
            consistent: true,
          },
          ExportDeclaration: {
            multiline: true,
            consistent: true,
          },
        },
      ],
    },
  }
);
```

### 3.3 Wire ESLint into package scripts

- Update `package.json` scripts to include linting, for example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "format": "prettier --write ."
  }
}
```

> Keep `svelte-check` configured via the default SvelteKit setup for type and component checks.

## 4. Ensure TypeScript is strict and aligned with SvelteKit

- Verify `tsconfig.json` (and `tsconfig.app.json` if generated) has:
  - `"strict": true`.
  - Svelte-specific `types` and `paths` as per the SvelteKit template.
- Avoid manual path alias hacks beyond the standard `$lib`/`$routes` conventions.

## 5. Introduce Zod for schemas and type inference

- Install Zod:

```bash
pnpm add zod
```

- Create a `src/lib/schemas/` directory to hold shared schemas, starting with content-related ones, e.g.:

  - `src/lib/schemas/project.ts` (project metadata, images, slug, layout type, etc.).
  - `src/lib/schemas/navigation.ts` if needed later.

- Pattern for usage:
  - Define Zod schemas (e.g. `projectSchema`).
  - Export inferred types (`export type Project = z.infer<typeof projectSchema>`).
  - Use these types across stores, load functions, and components to keep data contracts consistent.

## 6. Verify basic dev workflow

- Run the dev server:

```bash
pnpm dev
```

- Run linting and type checks:

```bash
pnpm lint
pnpm check
```

- Ensure:
  - No ESLint or TypeScript errors.
  - SvelteKit dev server runs cleanly.

## 7. Prepare for Vercel deployment

- Add a minimal `vercel.json` if needed later for static exports, but SvelteKit + adapter-static normally only requires:

  - Building the project (`pnpm build`).
  - Connecting the Git repo to Vercel and choosing the SvelteKit preset.

- Confirm that:
  - The output is static (no serverless functions created).
  - Environment variables are not required for v1.

Once these steps are complete, the project is ready for building actual routes/components for the portfolio (home, projects listing, project detail layouts, about, contact) within the constraints defined in `.cursor/rules/project-overview.mdc` and `.cursor/rules/tech-stack.mdc`.
