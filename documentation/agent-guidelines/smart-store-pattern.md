Last updated: 2025-08-05T00:59:52Z

# The Smart Store Architectural Pattern

## 1. Overview

The "Smart Store" is the standard architectural pattern for managing state for all major, self-contained feature domains within the project. This pattern centralizes all logic, data, and related UI state for a given feature into a single, cohesive store, promoting high cohesion and low coupling.

This document serves as the canonical guideline for this pattern. All new feature development of this type MUST adhere to these principles.

## 2. Core Principles

The Smart Store pattern is defined by three core principles:

### 2.1. Single, Unified State Object

All state for the domain, including both persistent data and transient UI state, MUST be consolidated into a single, top-level `$state` object within the store file.

**Rationale:** This creates an atomic and predictable state container. It leverages Svelte 5's reactivity system in the most robust way, preventing bugs that can arise from mutating multiple independent `$state` variables.

**Example (Do this):**

```typescript
// src/lib/stores/documentStore.svelte.ts

const documentState = $state({
	// Data state
	documents: [] as Document[],
	selectedDocument: null as Document | null,

	// UI state
	isLoading: false,
	showFilters: false,
	viewMode: 'list' as 'list' | 'details'
});
```

**Anti-Pattern (Do NOT do this):**

```typescript
// AVOID: Multiple, disconnected state variables
let documents = $state<Document[]>([]);
let selectedDocument = $state<Document | null>(null);
let isLoading = $state(false);
let showFilters = $state(false);
```

### 2.2. Co-located Logic (Thin Index + Modules)

All business logic, API calls, state mutations, and UI state manipulations for the domain MUST be owned by the store and may be organized into cohesive modules imported by the store. The single `$state` object remains in the store index; modules receive dependencies via explicit DI.

**Rationale:** Keeps a single source of truth for state while allowing separation of concerns and testability. The store remains the façade that exposes the public API; components stay dumb.

### 2.3. "Dumb" Components

Svelte components that use a Smart Store MUST remain "dumb." They should not contain complex business logic. Their responsibilities are limited to:

1.  Deriving state from the store's getters.
2.  Displaying that state.
3.  Calling methods on the store to dispatch actions.

**Rationale:** This creates a clear separation of concerns. The component is responsible for the "view," and the store is responsible for the "controller" and "model." This makes components highly reusable and easy to test.

## 3. Naming Convention

To ensure clarity and consistency, all store files MUST adhere to the following naming convention. The casing and naming structure provide valuable information about the store's role in the architecture.

### 3.1. File Casing and Extension

- camelCase: The main filename MUST use `camelCase`.
- `.svelte.ts` Extension: All stores that use Svelte Runes (`$state`, `$derived`, etc.) MUST use the `.svelte.ts` extension.

### 3.2. Store Categories

#### 1. Feature Stores

- Purpose: The primary "Smart Store" for a major, self-contained feature domain. Manages all data, business logic, and UI state for that feature.
- Convention: `<featureName>Store.svelte.ts`

#### 2. UI State Stores

- Purpose: Manages the UI state (e.g., visibility, dimensions) for a specific, often cross-cutting, component or group of components.
- Convention: `<componentName>Store.svelte.ts`

### 3.3. Placement

- All stores live under `src/lib/stores/**`. Use feature subfolders to group domain stores.
- Do not place stores under `src/lib/modules/**` to keep active state management discoverable in one location.

## 4. Implementation Mandate

All new and existing stores must adhere to this pattern and naming convention.
