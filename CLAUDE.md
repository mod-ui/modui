# modui

A CSS Modules-native UI component library. No Tailwind dependency — styling uses only standard CSS, distributed via copy-paste.

## Styling conventions

- **Zero dependencies for styling.** Do not use `clsx`, `cva`, `tailwind-merge`, etc. Standard CSS only.
- **CSS Modules**: local scope only. Do not use `:global()` or `composes`.
- **Variants are expressed as data attributes** and resolved entirely in CSS (e.g. `data-variant="danger"`).
- **`className` merging** uses this exact pattern:
  ```tsx
  className={`${styles.root}${className ? ` ${className}` : ""}`}
  ```
- **State flags** are surfaced as attributes via `data-disabled={disabled || undefined}` and selected from CSS with `[data-disabled]`.

## Design tokens

Three-layer structure:

1. Global theme (`:root`): `--color-*`, `--spacing-*`, `--radius-*`
2. Component variables (`.root`): e.g. `--button-bg`, `--input-padding`, declared by referencing global tokens
3. Actual properties: e.g. `background: var(--button-bg)` — read component variables, not global tokens directly

Naming is semantic (`--color-primary`, not `--color-blue`). Use prefixes so the origin of a token is obvious.

When to introduce a variable:
- The same value is used in two or more places
- It's something a user is likely to want to override

## Dark mode / theming

- Do not use `:global(.dark)`. Components must not contain dark-mode branches.
- Themes live in `packages/registry/src/themes/*.css` and override global tokens via `:root[data-theme="..."]`.
- Components are unaware of the active theme — they only read `var(--color-bg)` and friends.

## Component design

- **Keep tag abstraction and CSS separate.** Do not use `asChild` / `Slot` / `as` props.
  If a user wants a link styled like a button, they write `<a className={buttonStyles.root}>` directly.
- **Typography is shipped as CSS, not as components.** Tag choice (`<h1>`, `<p>`, etc.) is left to the user.
- **Delegate to Radix UI only when interaction is genuinely complex.** Prefer web standards (`<dialog>`, `popover`) when they suffice.
- **Prop types** extend `ComponentProps<"...">`. When a custom prop collides with a native HTML attribute, `Omit` it (e.g. `Input` omits the native `size` attribute).

## Directory layout

```
packages/
  registry/src/
    themes/        ← global theme CSS
    ui/<name>/     ← component (.tsx + .module.css)
  cli/             ← `npx modui add <name>` CLI
apps/
  docs/            ← Storybook (src/<Name>.stories.tsx)
```

- New components go in `packages/registry/src/ui/<name>/` as `<Name>.tsx` and `<Name>.module.css`.
- Add a matching story at `apps/docs/src/<Name>.stories.tsx`.
- `Button` is the reference implementation — new components should follow its pattern.

## Distribution

- Only the CLI is published to npm. Components are not packaged — the CLI fetches source from GitHub and copies files into the user's project.
- The library does not minify; that's the user's bundler's job.

## Testing

- For the MVP, only Storybook (visual) and Vitest (CLI) are used.
- Component unit tests are not written at this stage — copy-paste distribution means components become the user's code.

## Git workflow

- When the current branch is `gitbutler/workspace`, use the GitButler CLI (`but`) instead of `git commit`.
- Follow Conventional Commits (`feat(registry):`, `feat(docs):`, `fix:`, etc.).
