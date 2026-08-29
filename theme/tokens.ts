import { Platform, ViewStyle } from 'react-native';

// ─── Colors ──────────────────────────────────────────────────────────────────
// Extracted from Stitch Tailwind configs. Every color used in screens must
// reference this object — no raw hex values in component code.

export const C = {
  surface:              '#FCF8FF',
  surfaceDim:           '#d9d6ff',
  surfaceContainer:     '#EFEBFF',
  surfaceContainerLow:  '#f5f2ff',
  surfaceContainerHigh: '#e9e5ff',
  surfaceContainerHighest: '#e2dfff',
  surfaceContainerLowest: '#ffffff',
  surfaceVariant:       '#e2dfff',
  onSurface:            '#18173c',
  onSurfaceVariant:     '#53424b',
  outline:              '#86727b',
  black:                '#000000',
  white:                '#ffffff',
  pink:                 '#FF85D0',
  mint:                 '#99F5CC',
  cyan:                 '#00C2C2',
  primary:              '#9e357b',
  primaryDark:          '#801a62',
  primaryFixed:         '#ffd8eb',
  primaryFixedDim:      '#ffaedb',
  secondaryContainer:   '#9af1cb',
  secondaryFixed:       '#9df4ce',
  tertiaryContainer:    '#006a6a',
  yellow:               '#FFD700',
  error:                '#ba1a1a',
  errorContainer:       '#ffdad6',
  onErrorContainer:     '#93000a',
} as const;

// ─── Standard Title Bar Dots Sequence ─────────────────────────────────────────
// Fixed color order (Pink, White, Mint) standardized across every screen's title bar
export const STANDARD_TITLE_DOTS: [string, string, string] = [C.pink, C.white, C.mint];

// ─── Spacing ─────────────────────────────────────────────────────────────────
// Base unit: 4px. All spacing derives from this.

export const S = {
  unit: 4,
  xs:   8,
  sm:   12,
  md:   16,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────
// Font families must match the names registered in _layout.tsx via useFonts.

export const Font = {
  anybody:    'Anybody',
  workSans:   'WorkSans',
  mono:       'JetBrainsMono',
} as const;

export const T = {
  headlineLg: {
    fontFamily: Font.anybody,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  headlineMd: {
    fontFamily: Font.anybody,
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '800' as const,
  },
  bodyLg: {
    fontFamily: Font.workSans,
    fontSize: 18,
    lineHeight: 29,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontFamily: Font.workSans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: Font.mono,
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.7,
  },
  labelSm: {
    fontFamily: Font.mono,
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  labelXs: {
    fontFamily: Font.mono,
    fontSize: 10,
    lineHeight: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
  },
} as const;

// ─── Structural constants ────────────────────────────────────────────────────

export const BORDER = 3;
export const BORDER_HEAVY = 4;
export const BORDER_THIN = 2;
export const SHADOW_OFFSET = 4;
export const SHADOW_OFFSET_SM = 2;
export const DOT_SIZE = 12;
export const HEADER_HEIGHT = 32;
export const CARD_MAX_WIDTH = 448;

// ─── Shadow helper ───────────────────────────────────────────────────────────
// Returns platform-specific hard offset shadow styles.

export function hardShadow(offset: number): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: C.black,
      shadowOffset: { width: offset, height: offset },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
    android: {
      elevation: Math.max(offset, 2),
    },
    default: {
      boxShadow: `${offset}px ${offset}px 0px 0px ${C.black}`,
    } as any,
  }) as ViewStyle;
}

// ─── Grid background helper ──────────────────────────────────────────────────

export function gridBgStyle(cellSize: number, opacity: number): ViewStyle {
  return Platform.select({
    web: {
      backgroundImage:
        `linear-gradient(to right, rgba(134,114,123,${opacity}) 1px, transparent 1px), ` +
        `linear-gradient(to bottom, rgba(134,114,123,${opacity}) 1px, transparent 1px)`,
      backgroundSize: `${cellSize}px ${cellSize}px`,
    } as any,
    default: {},
  }) as ViewStyle;
}
