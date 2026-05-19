# 002 Persistent Collapsible Sidebar

You are editing the Propelt repo.

## Context

Propelt is an AI-powered graduate job application assistant for students, fresh graduates, and early-career candidates in Singapore.

The app should feel like a real professional SaaS workspace, not separate disconnected pages.

The current issue:

- `/dashboard` has a sidebar.
- When the user clicks `Resumes`, the sidebar disappears because `/resumes` still uses the older standalone page layout.
- The sidebar does not yet have icons.
- The user wants the sidebar to be collapsible/compressible, similar to modern dashboards.

## Goal

Create a persistent authenticated app shell so the sidebar remains visible across the main workspace pages.

The sidebar should:

- stay visible on `/dashboard`
- stay visible on `/resumes`
- stay visible on `/applications/new`
- stay visible on `/applications/[id]` if practical
- stay visible on `/onboarding` only if it does not make that page awkward
- be collapsible/compressible
- use suitable icons for each nav item
- feel calm, premium, and useful

## Important Product Direction

This is a UX polish pass, not a functionality rebuild.

Do not redesign the whole product.
Do not change backend logic.
Do not remove existing working flows.
Do not add fake features.

The aim is:

> When users move around the app, they should feel they are still inside the same Propelt workspace.

Not:

> Each route feels like a different website.

## Current Relevant Files

Inspect these first:

- `frontend/src/app/dashboard/page.tsx`
- `frontend/src/app/resumes/page.tsx`
- `frontend/src/app/applications/new/page.tsx`
- `frontend/src/app/applications/[id]/page.tsx`
- `frontend/src/app/onboarding/page.tsx`
- `frontend/src/app/globals.css`
- `frontend/src/lib/use-session.ts`

There is already an app shell/sidebar style in `globals.css` around the authenticated workspace styles.

## Recommended Implementation

### 1. Create A Reusable App Shell Component

Create a reusable client component, for example:

- `frontend/src/app/app-shell.tsx`

or, if you prefer a folder:

- `frontend/src/components/app-shell.tsx`

Use whichever structure best matches the current repo.

The component should handle:

- sidebar markup
- sidebar nav links
- active route detection using `usePathname`
- sign out
- collapsed/expanded state
- main content wrapper

Example API:

```tsx
<AppShell>
  {children}
</AppShell>
```

Then use it in authenticated pages instead of duplicating sidebar code.

### 2. Sidebar Navigation

Use these nav items for now:

- Home → `/dashboard`
- Resumes → `/resumes`
- New Application → `/applications/new`
- Applications → if no list page exists yet, either omit it or point to `/dashboard` with a disabled/future style
- Full Onboarding → `/onboarding`

Include sign out near the bottom.

Use active states:

- `/dashboard` active on dashboard
- `/resumes` active on resumes
- `/applications/new` and `/applications/[id]` active under application-related nav
- `/onboarding` active on onboarding

### 3. Icons

Add suitable icons to sidebar nav items.

Do not install a new icon dependency.

Use simple inline SVG icons or CSS-friendly minimal icons.

Recommended icon meanings:

- Home: house/dashboard icon
- Resumes: document/file icon
- New Application: plus inside document or sparkle/document icon
- Applications: folder/list/checklist icon
- Onboarding/Profile: user/profile icon
- Collapse: chevron/side-panel icon
- Sign out: logout/arrow icon

Icons should be:

- consistent stroke width
- 18-20px
- accessible via `aria-hidden="true"` if label text exists
- visible in collapsed mode

### 4. Collapsible Sidebar

Add a collapse/expand control near the top or lower sidebar.

Expanded state:

- shows logo mark + Propelt text
- shows icon + label
- normal width, roughly 240px-280px

Collapsed state:

- sidebar narrows, roughly 72px-84px
- shows logo mark only
- shows icons only
- labels visually hidden or removed
- nav items remain clickable
- active state still clear
- hover/focus can show a small tooltip/title if simple

Persist collapsed state in `localStorage` if straightforward.
If that adds too much complexity, keep it state-only for now.

Keyboard/accessibility:

- collapse button must be a real `button`
- include `aria-label`
- include `aria-expanded`
- nav links remain focusable

### 5. Apply App Shell To Existing Pages

Move `/dashboard` to use the reusable `AppShell`.

Then wrap these pages too:

- `frontend/src/app/resumes/page.tsx`
- `frontend/src/app/applications/new/page.tsx`
- `frontend/src/app/applications/[id]/page.tsx`

Do not destroy the existing page content. Convert the outer layout only.

For example, replace:

```tsx
return (
  <main className="page">
    <section className="workspace stack">
      ...
    </section>
  </main>
);
```

with:

```tsx
return (
  <AppShell>
    <section className="workspace stack">
      ...
    </section>
  </AppShell>
);
```

or a cleaner route-specific wrapper if you create one.

### 6. Design Requirements

Keep the dashboard/app UI:

- professional
- calm
- compact
- premium
- student-friendly
- easy to scan

Use existing palette:

- `#edede9`
- `#d6ccc2`
- `#f5ebe0`
- `#e3d5ca`
- `#d5bdaf`
- dark ink / muted ink / green accents already in CSS

Avoid:

- oversized marketing sections inside the app
- decorative blobs/orbs
- loud animations
- fake stats
- nested cards inside cards
- sidebar that feels like a toy

Use subtle transitions only:

- sidebar width transition
- nav hover background
- active indicator
- icon/label fade or layout shift

### 7. Mobile Behavior

On mobile/tablet:

- sidebar should not break the page
- either collapse by default or become a top/header style nav
- keep implementation simple
- do not create a complex drawer unless necessary

### 8. Technical Constraints

- TypeScript only.
- Do not add dependencies.
- Do not change backend.
- Do not change database schema.
- Keep the app routes working.
- Keep auth protection using existing `useSession`.
- Do not remove `/onboarding` yet.

### 9. Validation

After editing, run:

```bash
npm run build:frontend
```

Fix all TypeScript/build issues.

## Acceptance Criteria

This is done when:

- Dashboard sidebar can collapse and expand.
- Sidebar has suitable icons.
- Clicking `Resumes` keeps the same sidebar visible.
- Clicking `New application` keeps the same sidebar visible.
- App pages feel like one coherent workspace.
- Build passes.

## Notes

Do not over-polish the individual page content yet. This pass is about the global workspace navigation and shell.
