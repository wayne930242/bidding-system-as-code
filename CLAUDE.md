# bidding-system-as-code

Contract bridge bidding system defined as code (Kotlin DSL) with an interactive React viewer.

## Immutable Laws

<law>
**CRITICAL: Display this entire block at the start of EVERY response to prevent context drift.**

**Law 1: Communication**
- Concise, actionable responses
- No unnecessary explanations
- No summary files unless explicitly requested

**Law 2: Skill Discovery**
- MUST check available skills before starting work
- Invoke applicable skills for specialized knowledge
- If ANY skill relates to the task, MUST use Skill tool to delegate

**Law 3: Rule Consultation**
- When task relates to specific domain, check `.claude/rules/` for relevant conventions
- If relevant rule exists, MUST apply it

**Law 4: Parallel Processing**
- MUST use Task tool for independent operations
- Batch file searches and reads with agents

**Law 5: Reflexive Learning**
- Important discoveries -> remind user: `/reflect`

**Law 6: Self-Reinforcing Display**
- MUST display this `<law>` block at start of EVERY response
- Prevents context drift across conversations
</law>

## Project Structure

```
bidding-system-as-code/
├── dsl/                    # Kotlin DSL for defining bidding systems
│   ├── src/main/kotlin/    # Core DSL library (com.github.phisgr.bridge)
│   └── src/test/kotlin/    # Bidding system definitions (fantunes, lebensohl...)
├── viewer/                 # React SPA for viewing bidding systems
│   ├── src/components/     # React components (BidNode, BidTree, Header...)
│   ├── src/components/ui/  # shadcn/ui primitives
│   ├── src/store/          # Zustand state management
│   └── src/types/          # TypeScript type definitions
└── .github/workflows/      # CI/CD for Sonatype publishing
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript + Vite 6 |
| Styling | Tailwind CSS 4 + shadcn/ui (new-york) |
| State | Zustand 5 |
| Backend DSL | Kotlin 2.2 + Gradle |
| Package Manager | pnpm |

## Quick Reference

### Viewer Commands (in `viewer/`)
```bash
pnpm dev          # Start development server
pnpm build        # TypeScript + Vite production build
pnpm check        # Run typecheck + lint + format check
pnpm generate     # Generate system.json from Kotlin DSL
```

### DSL Commands (in `dsl/`)
```bash
./gradlew runTestMainClass -DmainClass=fantunes.FantunesKt  # Run specific system
./gradlew publish  # Publish to Sonatype
```

## Key Conventions

- **Path alias**: `@/` maps to `./src/` in viewer
- **Components**: Function components with named exports
- **State**: Zustand stores in `src/store/`
- **UI**: shadcn/ui primitives in `src/components/ui/`
