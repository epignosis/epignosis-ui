# Button Pulse Loader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rotating-ring spinner shown in `<Button isLoading>` with a 3-dot pulse animation that matches gnosis's `react-spinners` `PulseLoader` behaviour, reproduced inline in Emotion.

**Architecture:** Two coordinated edits inside `packages/react/src/Button/`. `Button.tsx` gains three child `<span />` elements inside the existing `eg-button__spinner` wrapper. `styles.ts` swaps the `spin` keyframes + ring-shaped `.eg-button__spinner` block for `pulse` keyframes + 3-dot styles. No new files, no new component, no new dependency. The existing `loadingButton()` slot in the `btnContainer` composition stays in place; only its body changes.

**Tech Stack:** React 19, TypeScript, `@emotion/react` (`css` + `keyframes`), Vite + Storybook 10. Package manager: `pnpm` workspaces.

**Reference spec:** `docs/superpowers/specs/2026-05-03-button-pulse-loader-design.md`

---

## File Structure

| File                                   | Change                | Responsibility                                                             |
| -------------------------------------- | --------------------- | -------------------------------------------------------------------------- |
| `packages/react/src/Button/Button.tsx` | Modify line 109       | Render the spinner wrapper with three child dot spans when `isLoading`     |
| `packages/react/src/Button/styles.ts`  | Replace lines 175–190 | Define `pulse` keyframes and the 3-dot `.eg-button__spinner > span` styles |

No tests exist for Button (`packages/react/src/Button/` contains no `*.test.*`); none added by this plan. Verification is via TypeScript build + Storybook visual check.

---

## Task 1: Replace ring spinner with 3-dot pulse animation

**Files:**

- Modify: `packages/react/src/Button/Button.tsx:109`
- Modify: `packages/react/src/Button/styles.ts:175-190`

These two edits land together. Splitting them would leave one commit with stale CSS targeting an empty span (no visible loader) or the reverse (3 dots styled as a ring). Single commit.

- [ ] **Step 1: Update the spinner markup in `Button.tsx`**

In `packages/react/src/Button/Button.tsx`, find this line (currently line 109):

```tsx
{
  isLoading && <span className={`${BLOCK}__spinner`} aria-hidden="true" />;
}
```

Replace with:

```tsx
{
  isLoading && (
    <span className={`${BLOCK}__spinner`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}
```

The wrapper span keeps the same `${BLOCK}__spinner` class so the layout slot (margin-inline-end, flex-shrink) stays intact. The three child spans become the dots.

- [ ] **Step 2: Replace the spinner keyframes and styles in `styles.ts`**

In `packages/react/src/Button/styles.ts`, find this block (currently lines 175–190):

```ts
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const loadingButton = (): SerializedStyles => css`
  .eg-button__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin-inline-end: 0.5rem;
    flex-shrink: 0;
  }
`;
```

Replace the entire block with:

```ts
const pulse = keyframes`
  0%   { transform: scale(1);   opacity: 1; }
  45%  { transform: scale(0.1); opacity: 0.7; }
  80%  { transform: scale(1);   opacity: 1; }
`;

const loadingButton = (): SerializedStyles => css`
  .eg-button__spinner {
    display: inline-flex;
    align-items: center;
    margin-inline-end: 0.5rem;
    flex-shrink: 0;

    > span {
      width: 0.375em;
      height: 0.375em;
      margin: 0 0.0625em;
      border-radius: 50%;
      background-color: currentColor;
      display: inline-block;
      animation: ${pulse} 0.75s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08);
      animation-fill-mode: both;
    }
    > span:nth-of-type(1) {
      animation-delay: 0.12s;
    }
    > span:nth-of-type(2) {
      animation-delay: 0.24s;
    }
    > span:nth-of-type(3) {
      animation-delay: 0.36s;
    }
  }
`;
```

Notes:

- The local binding renames from `spin` to `pulse`. `spin` had no other references in this file (verified: only used inside `loadingButton`). No other occurrence to update.
- The `keyframes` import on line 1 is already present and reused: `import { css, keyframes, type SerializedStyles, type Theme } from "@emotion/react";`. Do not change it.
- The `loadingButton()` function signature is unchanged, so its caller in `btnContainer` (line 245: `${isLoading ? loadingButton() : ""};`) needs no edit.

- [ ] **Step 3: Typecheck and build the React package**

Run from the repo root:

```bash
pnpm --filter @epignosis-ui/react build
```

Expected: command exits 0 with Vite build output and no TypeScript errors. (`build` runs `vite build && tsc -p tsconfig.build.json` — the `tsc` step is the typecheck.)

If TS reports an unused-import error for `keyframes`, that means `keyframes` is no longer referenced — re-check Step 2 (the new code uses `keyframes` for the `pulse` template tag, so this should not happen).

- [ ] **Step 4: Visually verify in Storybook**

Run from the repo root:

```bash
pnpm --filter @epignosis-ui/react storybook
```

Storybook starts on port 6006 (per `package.json`). Open `http://localhost:6006`.

Navigate to the Button stories. Toggle the `isLoading` control on. Confirm:

1. **Three circular dots** are visible in the leading position (where the ring used to be).
2. The dots **pulse** — they shrink to near-zero, fade slightly, and return — staggered so each starts ~0.12s after the previous one.
3. **Color** matches the button text (white on solid primary, blue on ghost/outline, etc.) — the dots use `currentColor`.
4. The animation **loops smoothly** with no visible jump.
5. Check at all three sizes (`sm`, `md`, `lg`) and at least two variants (`solid` + `ghost`) — dots scale with text size and inherit each variant's text color.
6. Check `rounded` + `isLoading` — the dots fit inside the circular button without overflowing.

If any of those fail, the spec/plan needs revisiting before you commit.

Stop the Storybook process (Ctrl-C) when done.

- [ ] **Step 5: Commit**

Stage only the two modified files (the working tree contains other unstaged work that must NOT be bundled in):

```bash
git add packages/react/src/Button/Button.tsx packages/react/src/Button/styles.ts
git status
```

Verify `git status` shows ONLY those two files in "Changes to be committed". If anything else is staged, unstage it with `git reset HEAD -- <path>` before continuing.

Then commit:

```bash
git commit -m "$(cat <<'EOF'
Replace Button ring spinner with 3-dot pulse loader

Matches gnosis's react-spinners PulseLoader behaviour (3 dots, 0.75s
cubic-bezier pulse, 0.12s stagger), reproduced inline in Emotion. Color
inherits via currentColor; size scales with button text.

Spec: docs/superpowers/specs/2026-05-03-button-pulse-loader-design.md
EOF
)"
```

Confirm with:

```bash
git log --oneline -1
```

Expected: latest commit subject is "Replace Button ring spinner with 3-dot pulse loader".

---

## Done criteria

- [ ] `pnpm --filter @epignosis-ui/react build` exits 0
- [ ] Storybook shows 3 staggered pulsing dots in `<Button isLoading>` at all sizes
- [ ] Dots inherit button text color (verified on solid + ghost)
- [ ] Single commit on top of the spec commit, touching only `Button.tsx` and `styles.ts`
