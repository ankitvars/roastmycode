# RoastMyCode — Claude Code Instructions

## Explore First, Always

Before touching any UI file, run the following and read the output:

```bash
find app components -type f | sort
cat app/globals.css
cat app/layout.tsx
```

Then read every component that will be affected. Never edit blind. If a task touches
more than one component, build a mental map of shared primitives (color classes,
border styles, spacing patterns) before writing a single line.

---

## Project Identity

**RoastMyCode** is a brutally honest AI code review tool. The brand is:
- Dark, dense, terminal-adjacent — not playful, not corporate
- Confident and slightly savage — like a senior engineer who has seen everything
- High contrast and legible — code is the content; nothing should fight it for attention

The tone of the UI must match the tone of the roasts: no softness, no gradients that
look like a SaaS landing page, no rounded-everything. Sharp where it matters.

---

## Design System

All visual decisions flow from this token set. When implementing any UI change,
map every value to a token. Never hardcode a one-off color or size.

### Color Tokens

```
Background layers (darkest → lightest surface):
  --bg-base      #030712   (body, outermost shell)
  --bg-surface   #0f1117   (cards, panels)
  --bg-elevated  #161b22   (inputs, code blocks, dropdowns)
  --bg-overlay   #1c2128   (hover states, selected rows)

Borders:
  --border-subtle  #21262d   (most borders)
  --border-default #30363d   (interactive element outlines)
  --border-strong  #484f58   (focus rings baseline, dividers)

Text:
  --text-primary   #e6edf3   (headings, body)
  --text-secondary #8b949e   (labels, secondary copy)
  --text-muted     #484f58   (placeholders, disabled)
  --text-inverse   #0d1117   (text on light backgrounds)

Brand / Accent:
  --accent-fire    #f97316   (orange — primary CTA, roast line highlights)
  --accent-ember   #ef4444   (red — REJECT verdict, critical severity)
  --accent-glow    #fb923c   (orange-light — gradient endpoint)

Semantic:
  --verdict-merge   #22c55e   (MERGE verdict)
  --verdict-changes #eab308   (REQUEST_CHANGES verdict)
  --verdict-reject  #ef4444   (REJECT verdict)

  --severity-critical  #ef4444
  --severity-high      #f97316
  --severity-medium    #eab308
  --severity-low       #3b82f6
  --severity-nitpick   #8b949e

Provider:
  --provider-gemini     #4285f4
  --provider-anthropic  #d4a843
  --provider-openai     #10a37f
  --provider-qwen       #6366f1
```

### Typography Scale

```
Font stack: Inter (already loaded via next/font) — fallback system-ui, sans-serif
Mono stack: ui-monospace, 'Cascadia Code', 'Fira Code', monospace

Scale (rem):
  --text-xs    0.6875rem  / 11px   — badges, meta labels
  --text-sm    0.8125rem  / 13px   — secondary body, table cells
  --text-base  0.9375rem  / 15px   — primary body
  --text-lg    1.0625rem  / 17px   — card titles, nav items
  --text-xl    1.25rem    / 20px   — section labels
  --text-2xl   1.5rem     / 24px   — sub-headings
  --text-3xl   2rem       / 32px   — page headings
  --text-hero  3.5rem     / 56px   — hero H1 (clamp to 2.5rem on mobile)

Weight: 400 (body), 500 (labels), 600 (sub-headings), 700 (headings), 900 (hero / scores)
Line-height: 1.7 (body), 1.3 (headings), 1.4 (code)
Letter-spacing: -0.02em (headings ≥ 2xl), 0.06em (uppercase labels/badges)
```

### Spacing & Layout

```
Base unit: 4px (0.25rem)
Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

Max content widths:
  --max-prose  48rem    (review result text)
  --max-form   36rem    (ReviewForm card)
  --max-page   64rem    (page containers)

Border radii:
  --radius-sm   4px   (badges, chips)
  --radius-md   8px   (buttons, inputs)
  --radius-lg   12px  (cards, panels)
  --radius-xl   16px  (large modals, share cards)
  --radius-full 9999px (pill badges, avatar)
```

### Shadows & Depth

```
--shadow-card    0 0 0 1px var(--border-subtle), 0 2px 8px rgba(0,0,0,0.4)
--shadow-focus   0 0 0 3px rgba(249,115,22,0.4)   (fire-orange focus ring)
--shadow-glow    0 0 24px rgba(249,115,22,0.15)    (hero accent glow)
--shadow-inset   inset 0 1px 0 rgba(255,255,255,0.04)  (card top highlight)
```

### Motion

```
--duration-fast    100ms
--duration-base    160ms
--duration-slow    280ms
--ease-out         cubic-bezier(0.16, 1, 0.3, 1)
--ease-spring      cubic-bezier(0.34, 1.56, 0.64, 1)

All transitions: honor prefers-reduced-motion.
Wrap animated elements:
  @media (prefers-reduced-motion: reduce) { transition: none; animation: none; }
```

---

## Accessibility Quality Gates

Every UI change must pass all of the following before being considered done.
These are not optional. They are part of the definition of done.

### Contrast (WCAG 2.1 AA minimum, AAA preferred for body text)

| Use | Minimum ratio |
|---|---|
| Body text on --bg-surface | 4.5 : 1 |
| Large text (≥ 18px bold) | 3 : 1 |
| UI components (borders, icons) | 3 : 1 |
| Disabled states | no minimum — must look visibly disabled |

Check ratios with: https://webaim.org/resources/contrastchecker/
Never use `text-gray-500` on `bg-gray-900` without verifying ratio. It often fails.

### Focus Management

- Every interactive element must have a visible focus indicator.
- Focus ring: `outline: 3px solid var(--accent-fire); outline-offset: 2px;`
- Never use `outline: none` without providing an equivalent custom ring.
- Tab order must be logical (top → bottom, left → right in LTR).
- Modal / drawer open → focus moves to first focusable element inside.
- Modal close → focus returns to trigger element.

### Keyboard Navigation

- All buttons and links: operable by Enter and Space.
- Select / dropdown: navigable with arrow keys.
- Escape closes any overlay.
- No keyboard trap (except modals, which must have explicit close paths).

### Semantic HTML

- One `<h1>` per page. Heading levels never skip.
- Buttons that perform actions: `<button>`. Links that navigate: `<a>`.
- Never use `<div onClick>` without `role="button"` + `tabIndex={0}` + keyboard handler.
- Form inputs: always have an associated `<label>` (visible or `aria-label`).
- Icon-only buttons: `aria-label` required.
- Status regions that update: `role="status"` or `aria-live="polite"`.

### Color Independence

- Never convey information by color alone. Always pair with text, icon, or pattern.
- Verdict badges: color + text label (MERGE / REQUEST_CHANGES / REJECT).
- Severity dots: color + text label.
- Score numbers: color + accessible label explaining the range.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
Add to `globals.css`. Pulse animations (`animate-pulse`) must be wrapped.

### Touch Targets

- Minimum 44×44px touch target for all interactive elements (WCAG 2.5.5).
- Use padding to expand small visual targets without changing appearance.

---

## UX Quality Gates

These are enforced on every UI implementation task alongside accessibility gates.

### Loading States

- Every async action (review submit, PR fetch, sign in) must have a loading state.
- Loading state must be visible within 100ms of action start.
- Never show a spinner for < 300ms (it looks like a flash). Use a minimum display time.
- Skeleton screens preferred over spinners for content that has known structure.

### Error States

- Every fetch/API call must handle: network error, 4xx, 5xx, timeout.
- Error messages must say what happened and what to do next — not just "Error".
- Form validation: inline errors adjacent to the field, not in a toast.
- Critical errors: `role="alert"` so screen readers announce immediately.

### Empty States

- Every list or result area must have a defined empty state.
- Empty state: short explanation + a clear next action.

### Optimistic UI

- For low-risk actions (copy, toggle), update immediately and revert on failure.
- For high-risk actions (delete, submit), show explicit confirmation.

### Consistency

- Identical interactive patterns across pages: buttons, inputs, cards.
- Same border style on all cards (`1px solid var(--border-subtle)`).
- Same hover behavior on all clickable cards (`border-color` → `--border-default`).
- Same transition duration (`var(--duration-base)`) across all interactive elements.

### Responsive Breakpoints

```
Mobile first. Breakpoints:
  sm  640px   (two-column grids unlock)
  md  768px   (sidebar patterns unlock)
  lg  1024px  (full desktop layouts)

Never build desktop-first. Never use px-based media queries directly — use Tailwind's
sm:, md:, lg: prefixes so breakpoints are consistent.
```

### Typography Legibility

- No text below `--text-xs` (11px) except for truly decorative metadata.
- Line length: 45–75 characters for prose. Use `max-w-prose` or equivalent.
- Never justify text (`text-justify` is banned).
- Code snippets: monospace font, `--bg-elevated` background, `--border-subtle` border.

---

## Implementation Workflow for Theme Overhaul Tasks

When asked to perform a theme overhaul or design-system change, follow this exact order:

1. **Explore** — run `find app components -type f | sort`, read every file that will be touched
2. **Audit** — identify all hardcoded color values, one-off font sizes, inconsistent spacing
3. **Define tokens in globals.css** — write CSS custom properties under `:root` before touching components
4. **Update layout.tsx** — apply base background, text color, font from tokens
5. **Update globals.css utilities** — any repeated patterns become utility classes (`@layer components`)
6. **Update components bottom-up** — leaf components first (badges, buttons), then cards, then pages
7. **Verify each component** — contrast check, keyboard test, mobile resize test
8. **Check globals last** — confirm no Tailwind overrides conflict with custom properties

Never do step 6 before step 3. Never skip step 7.

---

## File Conventions

- Component files: PascalCase, one component per file
- No inline `style={{}}` except for truly dynamic values (e.g. width from a percentage)
- CSS custom properties in `globals.css :root` for all design tokens
- Tailwind utilities for layout, spacing, flex/grid — custom properties for color/type/shadow
- No `!important` except inside `@media (prefers-reduced-motion: reduce)` overrides

---

## What Not to Do

- Do not use `text-gray-*` classes without checking contrast against the actual background
- Do not add `outline: none` to any element
- Do not use color as the sole differentiator for status/severity
- Do not ship a loading state as "coming soon" — implement it or don't merge
- Do not add animations without a `prefers-reduced-motion` fallback
- Do not create new one-off colors — extend the token set or use an existing token
- Do not use `<div>` for buttons or `<span>` for links
- Do not use `text-justify`
- Do not hardcode breakpoints in px inside component files
