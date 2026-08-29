/**
 * SynKrew — Arcade Pastel Color Tokens
 * Source of truth: DESIGN (3).md (frontmatter)
 * DO NOT hardcode these values in screen or component files — always import from this module.
 */

export const Colors = {
  // ─── Surface ────────────────────────────────────────────────────────────────
  surface: '#fcf8ff',
  surfaceDim: '#d9d6ff',
  surfaceBright: '#fcf8ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f6f2ff',
  surfaceContainer: '#efebff',
  surfaceContainerHigh: '#e9e5ff',
  surfaceContainerHighest: '#e3dfff',
  onSurface: '#18173c',
  onSurfaceVariant: '#53424b',

  // ─── Background (desktop canvas) ───────────────────────────────────────────
  background: '#fcf8ff',
  backgroundApp: '#C9C6F5', // Soft Lavender desktop surface
  backgroundCard: '#ffffff',
  onBackground: '#18173c',
  surfaceVariant: '#e3dfff',

  // ─── Inverse ────────────────────────────────────────────────────────────────
  inverseSurface: '#2d2c52',
  inverseOnSurface: '#f2efff',

  // ─── Outline ────────────────────────────────────────────────────────────────
  outline: '#86727b',
  outlineVariant: '#d8c0cb',

  // ─── Primary (Bubblegum Pink) ────────────────────────────────────────────────
  surfaceTint: '#9e357b',
  primary: '#9e357b',
  onPrimary: '#ffffff',
  primaryContainer: '#ff85d0',
  onPrimaryContainer: '#7a135d',
  inversePrimary: '#ffaedb',
  primaryFixed: '#ffd8eb',
  primaryFixedDim: '#ffaedb',
  onPrimaryFixed: '#3c002b',
  onPrimaryFixedVariant: '#811962',

  // ─── Secondary (Mint Green) ──────────────────────────────────────────────────
  secondary: '#006c4e',
  onSecondary: '#ffffff',
  secondaryContainer: '#99f5cc',
  onSecondaryContainer: '#007353',
  secondaryFixed: '#99f5cc',
  secondaryFixedDim: '#7dd8b1',
  onSecondaryFixed: '#002115',
  onSecondaryFixedVariant: '#00513a',

  // ─── Tertiary (Cyan) ─────────────────────────────────────────────────────────
  tertiary: '#006a6a',
  onTertiary: '#ffffff',
  tertiaryContainer: '#00c2c2',
  onTertiaryContainer: '#004a4a',
  tertiaryFixed: '#00fbfb',
  tertiaryFixedDim: '#00dddd',
  onTertiaryFixed: '#002020',
  onTertiaryFixedVariant: '#004f4f',

  // ─── Error ───────────────────────────────────────────────────────────────────
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // ─── Structural / Design System ─────────────────────────────────────────────
  strokeObsidian: '#000000',  // All borders must use this
  textMain: '#000000',

  // ─── Status ──────────────────────────────────────────────────────────────────
  statusSuccess: '#00FF00',
  statusError: '#FF0000',

  // ─── Semantic aliases used across screens ────────────────────────────────────
  /** Bubblegum pink — Primary button bg, window chrome, CTAs */
  pink: '#ff85d0',
  /** Mint green — Secondary button bg, verified/pass states, title bars */
  mint: '#99f5cc',
  /** Cyan — Tertiary, focus states, active inputs */
  cyan: '#00c2c2',
  /** Sunshine yellow — Attention, "New" badges, rewards */
  yellow: '#FFD700',
  /** Deep navy — inverse surface, text on light, used for prominent labels */
  navy: '#18173c',
} as const;

export type ColorKey = keyof typeof Colors;
