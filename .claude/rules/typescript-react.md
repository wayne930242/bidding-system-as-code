---
paths: viewer/src/**/*.{ts,tsx}
---

# TypeScript/React Conventions

## Imports
- Use path alias `@/` for all internal imports (maps to `./src/`)
- Group: external → internal → types

## Components
- Function components with named exports
- Props interface defined above component
- Use `cn()` from `@/lib/utils` for conditional classes

## State Management
- Zustand stores in `src/store/`
- Select specific state slices: `useBidStore((state) => state.field)`
- Actions defined within store, not components

## UI Components
- shadcn/ui primitives in `src/components/ui/`
- Compose with Radix UI patterns
- Use lucide-react for icons

## TypeScript
- Strict mode enabled
- Prefix unused params with `_`
- Use `type` imports for type-only imports
