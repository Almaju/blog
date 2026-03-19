# The Unwrap

A programming craftsmanship blog. Next.js + fumadocs-mdx. Articles live in `content/docs/`.

## Writing articles

Use `/write [topic]` — the full style guide and article structure is in `.claude/commands/write.md`.

## Categories

- `content/docs/fundamentals/` — language-agnostic principles (sorting, structs, errors, dependencies, comments, tests)
- `content/docs/infrastructure/` — ops and data (migrations)
- `content/docs/frontend/` — UI patterns (state machines)

## MDX components

`<Principle>`, `<Objection>`, `<Excalidraw>` (wraps mermaid), `<Tabs>/<Tab>`, `<Callout>`, `<RoughSketch>`, `<RoughAnnotation>`

Code blocks always use TypeScript + Rust tabs. Exception: infrastructure articles.

## Commands

- `npm run dev` — local dev server
- `npm run lint` — biome + em-dash checker
- `npm run build` — production build
