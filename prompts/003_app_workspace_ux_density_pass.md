# 003 App Workspace UX Density Pass

You are editing the Propelt repo.

## Context

Propelt now has a persistent authenticated app shell with a collapsible sidebar.

The current issue:

- The app workspace pages still feel too large and page-like.
- Headings are too big inside the authenticated app.
- Some pages still feel like old standalone pages placed inside the shell.
- There are redundant navigation buttons like `Dashboard` inside pages even though the sidebar already handles navigation.

This pass is about UX density and polish inside the authenticated app.

Do not redesign the marketing landing page.

## Product Direction

The authenticated app should feel like a calm professional workspace.

It should feel:

- focused
- compact
- easy to scan
- premium
- practical
- student-friendly
- not like a landing page

Think operational SaaS / workspace UI, not marketing website.

## Files To Inspect

Start by inspecting:

- `frontend/src/components/app-shell.tsx`
- `frontend/src/app/dashboard/page.tsx`
- `frontend/src/app/resumes/page.tsx`
- `frontend/src/app/applications/new/page.tsx`
- `frontend/src/app/applications/[id]/page.tsx`
- `frontend/src/app/onboarding/page.tsx`
- `frontend/src/app/globals.css`

## Main Goals

### 1. Reduce Heading Sizes Inside App Shell

Authenticated app headings should not use huge marketing scale.

Inside `.app-shell`:

- Page `h1` should feel like a workspace title, not a hero headline.
- Card `h2` should be compact.
- Form section headings should be smaller and tighter.

Suggested direction:

- App page `h1`: around `1.75rem` to `2.1rem`
- Card `h2`: around `1rem` to `1.2rem`
- Section labels/eyebrows: compact and muted
- Body copy: readable but not oversized

Do not change the landing page hero typography.

### 2. Make Workspace Pages More Compact

Reduce excessive vertical space in authenticated pages.

Improve:

- topbar spacing
- card padding
- form gaps
- grid gaps
- section margins
- textarea heights where too large

The app should fit more useful information on screen without feeling cramped.

### 3. Remove Redundant Page Navigation Buttons

Since the sidebar is persistent, remove or reduce duplicate buttons like:

- `Dashboard` button on `/resumes`
- `Dashboard` button on `/applications/new`
- `Dashboard` button on `/applications/[id]`

Keep meaningful primary actions:

- `New application`
- `Save resume`
- `Generate tailored application`
- `Copy section`
- `Save edits`

Do not remove actions the user needs.

### 4. Improve Page Header Pattern

Make authenticated page headers consistent.

Preferred pattern:

```tsx
<div className="app-page-header">
  <div>
    <p className="eyebrow">...</p>
    <h1>...</h1>
    <p className="muted">...</p>
  </div>
  optional primary action
</div>
```

Use this across:

- Dashboard
- Resumes
- New application
- Application detail
- Onboarding

Do not make big hero sections.

### 5. Improve Forms For Scannability

Forms should feel clearer.

Adjust:

- labels
- input heights
- textarea sizes
- button placement
- helper copy

The user should immediately understand:

- what to fill first
- what is optional
- what button to click next

### 6. Keep Sidebar Design

Do not heavily redesign the sidebar.

Only adjust sidebar spacing/type if necessary to match the denser workspace.

Keep:

- collapsible behavior
- icons
- active state
- persistence

### 7. Keep Current Functionality

Do not change backend.
Do not change database.
Do not change auth logic.
Do not change application generation logic.

This is a UX polish pass only.

## Specific Pages

### Dashboard

The dashboard should still guide first-time users, but make it less huge.

Tighten:

- main heading
- card spacing
- step headings
- right rail cards

Make the guided setup feel like a workspace checklist, not onboarding marketing.

### Resumes

Make the page feel like a resume library.

Improve:

- page header
- add resume form
- saved resume list

Remove redundant `Dashboard` button.

### New Application

Make it feel like a focused form workflow.

Improve:

- page header
- role/company/JD fields
- candidate questions card
- final generate button placement

Remove redundant `Dashboard` button.

### Application Detail

Make result review page feel denser and easier to work in.

Improve:

- page header
- tab spacing
- copy/save actions
- editable section textarea

Keep copy and save functionality.

### Onboarding

Since the sidebar now persists, make the old onboarding page visually consistent too.

Do not remove it yet.

## Visual Constraints

Use existing Propelt palette.

Avoid:

- decorative blobs/orbs
- fake stats
- fake testimonials
- huge hero type
- nested cards inside cards
- flashy animation

Do not add new dependencies.

## Validation

Run:

```bash
npm run build:frontend
```

Fix all build/type errors.

## Acceptance Criteria

This pass is done when:

- Authenticated page headings feel appropriately sized.
- App pages feel more compact and professional.
- Sidebar still works and collapses.
- Sidebar remains visible across app pages.
- Redundant dashboard buttons are removed or reduced.
- The app feels more like a coherent workspace.
- Frontend build passes.
