/**
 * SynKrew — Typography Tokens
 * Source of truth: DESIGN (3).md (frontmatter)
 * Fonts: Anybody (headlines), Work Sans (body), JetBrains Mono (labels/meta)
 *
 * NOTE: Font loading must be handled in the app's root layout using expo-google-fonts.
 */

export const FontFamily = {
  anybody: 'Anybody',
  workSans: 'WorkSans',
  jetbrainsMono: 'JetBrainsMono',
} as const;

/**
 * Typography scale — matches DESIGN (3).md exactly.
 * fontSize/lineHeight are in logical pixels (React Native px).
 * lineHeight values derived from multipliers in the design spec.
 */
export const Typography = {
  /**
   * headline-lg: 40px / Anybody 800 / lh 1.1 / ls -0.02em
   * Use for hero text on splash/welcome. Scale to headline-lg-mobile on small screens.
   */
  headlineLg: {
    fontFamily: FontFamily.anybody,
    fontSize: 40,
    fontWeight: '800' as const,
    lineHeight: 44, // 40 × 1.1
    letterSpacing: -0.8, // -0.02em of 40px
  },

  /**
   * headline-lg-mobile: 32px / Anybody 800 / lh 1.1
   * Use this variant on smaller phone widths (< 380pt) or as the standard mobile headline.
   */
  headlineLgMobile: {
    fontFamily: FontFamily.anybody,
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 35, // 32 × 1.1
    letterSpacing: -0.64, // -0.02em of 32px
  },

  /**
   * headline-md: 28px / Anybody 800 / lh 1.2
   */
  headlineMd: {
    fontFamily: FontFamily.anybody,
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34, // 28 × 1.2
  },

  /**
   * body-lg: 18px / Work Sans 400 / lh 1.6
   */
  bodyLg: {
    fontFamily: FontFamily.workSans,
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 29, // 18 × 1.6
  },

  /**
   * body-md: 16px / Work Sans 400 / lh 1.5
   */
  bodyMd: {
    fontFamily: FontFamily.workSans,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24, // 16 × 1.5
  },

  /**
   * label-md: 14px / JetBrains Mono 700 / lh 1 / ls 0.05em
   * Use for UI labels, metadata, status chips, monospace accents.
   */
  labelMd: {
    fontFamily: FontFamily.jetbrainsMono,
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 14, // 14 × 1
    letterSpacing: 0.7, // 0.05em of 14px
  },

  /**
   * button-text: 16px / Anybody 700 / lh 1.25
   * Use for button labels.
   */
  buttonText: {
    fontFamily: FontFamily.anybody,
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 20,
  },
} as const;

/**
 * Text-shadow spec for headlines — "sticker" effect.
 * Apply to headline text as a textShadow style on Android,
 * or use the shadow* props on iOS.
 */
export const HeadlineTextShadow = {
  textShadowColor: '#000000',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 0, // No blur — hard shadow only per design system rules
} as const;
