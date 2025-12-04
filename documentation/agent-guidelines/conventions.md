# Code Review Standards

This document defines how we write and review code.

## 1. Core Principles

- **Readability**: Clear, concise code with meaningful names.
- **SRP/DRY/Modularity**: Single responsibility, avoid duplication, and maintain clear component boundaries.
- **Idiomatic Usage**: Follow official patterns for Svelte 5/SvelteKit, and Zod; avoid legacy/anti‑patterns.
- **Technical Debt**: Remove bloat and redundancies as you touch code.
- **Error Handling**: Consistent, actionable errors; no swallowed exceptions.
- **Security & Performance**: No new vulnerabilities; no unexpected regressions.
- **Boundary Validation**: All request/response boundaries must use Zod schemas; no type assertions at API edges. Validate with `safeParse` and map errors via `toFieldErrors()`.

## 2. Review Checklist

### 2.1 Functional Correctness

- No regressions; existing behaviors preserved
- Edge cases identified and handled

### 2.2 Maintainability and Design

- Code is easy to read and navigate
- Adheres to Single Responsibility Principle (SRP)
- Eliminates duplication (DRY)
- Eliminates any unused variables
- Decoupled, modular components with clear boundaries
- Uses idiomatic project/library patterns
- Removes legacy code and bloat where feasible
- Consistent, appropriate error handling

### 2.3 Compliance and Security

- Strict adherence to relevant agent guidelines
- No new security flaws; auth and data access patterns respected
- No unexpected performance degradation or resource spikes

### 2.4 Architecture & Patterns Alignment

- Smart Store pattern is followed for feature‑domain stores; see `documentation/agent-guidelines/smart-store-pattern.md`
- Schema‑first types: no ad‑hoc TypeScript interfaces; types are inferred from Zod schemas in `src/lib/schemas/`
- Svelte 5 Runes patterns and accessibility requirements are followed
- Logging follows structured, contextual logging strategy (no PII/secrets)
- Optimistic UI patterns are used for mutations where appropriate

## 3. Agent Code Review Protocol

When conducting a code review as an AI agent, follow this workflow:

### 3.1 Documentation Requirements

- **Always** write a formal code review report to `documentation/code-reviews/MM-DD-HHMM[scope-or-component-name].md`
- Use the current date and a descriptive identifier (e.g., `11-10-1432-class-manager-optimistic-updates.md`)
- Structure the report with these sections:
  1. **Review Summary**: High-level overview of files reviewed and scope
  2. **Findings by Category**: Organize issues according to sections 2.1–2.5 above
  3. **Severity Classification**: Label each finding as Critical, High, Medium, or Low
  4. **Recommended Fixes**: Specific, actionable changes with file paths and line references
  5. **References**: Link to relevant guidelines and patterns from section

### 3.2 Confirmation Before Changes

- **Never apply fixes automatically** during a code review workflow
- After writing the review report, present a summary to the user that includes:
  - Total number of findings by severity
  - Brief description of each recommended fix
- **Always ask for explicit confirmation** before proceeding with any changes:
  - "Would you like me to apply these fixes? (yes/no/selective)"
  - If "selective," ask which specific fixes to apply
- If the user approves, apply fixes one category at a time, providing progress updates

### 3.3 Post-Review Actions

- After applying approved fixes:
  - Run linter and tests to verify that no new issues were introduced
  - Don't assume changes fixed issues; use Chrome DevTools MCP to inspect DOM, network, and console for verification.
  - Update the review report with an "Applied Fixes" section noting what was changed
- If fixes introduce new issues, document them and seek further guidance
