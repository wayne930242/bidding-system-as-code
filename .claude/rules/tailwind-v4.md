---
paths: viewer/src/**/*.{tsx,css}
---

# Tailwind CSS v4 Conventions

## Color System
- Use oklch color space for all custom colors
- Define theme colors in `@theme` block in `index.css`
- Dark mode via `.dark` class with CSS variable overrides

## CSS Variables
- Access with `var(--color-name)` or Tailwind's `[--color-name]` syntax
- Bidder colors: `--color-bidder-north`, `--color-bidder-south`, etc.

## Class Naming
- Use `cn()` utility for merging conditional classes
- Prefer semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`
- Component variants via `class-variance-authority`

## Dark Mode
- Support both light and dark themes
- Use CSS variables that auto-switch (defined in `.dark` block)
- Test both themes when modifying colors
