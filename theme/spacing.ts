/**
 * SynKrew — Spacing & Radius Tokens
 * Source of truth: DESIGN (3).md (frontmatter)
 *
 * Base unit: 4px. All spacing must be multiples of this unit.
 * Radius: Blocky "stepped" corners — 0.25rem base (4px). Not true circles.
 */

/** All values in logical pixels (React Native units) */
export const Spacing = {
  // ─── Base Grid ────────────────────────────────────────────────────────────
  /** 4px — base grid unit. All spacing should be multiples of this. */
  unit: 4,
  /** 8px — 2 units */
  xs: 8,
  /** 12px — 3 units */
  sm: 12,
  /** 16px — 4 units — standard gutter between columns */
  gutter: 16,
  /** 20px — 5 units */
  md: 20,
  /** 24px — 6 units — standard screen/card margin */
  margin: 24,
  /** 32px — 8 units */
  lg: 32,
  /** 48px — 12 units */
  xl: 48,
  /** 64px — 16 units */
  xxl: 64,

  // ─── Component-specific ───────────────────────────────────────────────────
  /** Internal padding for OS-window-style cards/containers */
  cardPadding: 20,
  /** Gap between stacked items in a list */
  stackGap: 12,
  /** Touch target minimum (accessibility) */
  touchTargetMin: 48,

  // ─── Layout ───────────────────────────────────────────────────────────────
  /** Max container width for tablet/large screen centering */
  containerMax: 480, // In RN context this is the max content width in dp
} as const;

/**
 * Border radius scale — "Blocky Rounded Corners" per design system.
 * These are NOT soft circles; they mimic pixel-art stepped curves.
 * All values in logical pixels.
 */
export const Radius = {
  /** 2px — minimum rounding, barely perceptible — 0.125rem */
  sm: 2,
  /** 4px — DEFAULT — the signature blocky radius — 0.25rem */
  DEFAULT: 4,
  /** 6px — 0.375rem */
  md: 6,
  /** 8px — 0.5rem */
  lg: 8,
  /** 12px — 0.75rem */
  xl: 12,
  /** 9999 — full pill shape */
  full: 9999,
} as const;

/**
 * Border widths — solid black stroke is the defining structural element.
 * "All elements must be contained within a Solid Black (#000000) 3px border"
 */
export const BorderWidth = {
  /** Standard container/button border — 3px */
  container: 3,
  /** Thin accent border — 2px */
  accent: 2,
  /** Hairline — 1px, e.g. for grid lines */
  hairline: 1,
} as const;
