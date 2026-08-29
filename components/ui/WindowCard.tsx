import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  C,
  S,
  T,
  BORDER,
  HEADER_HEIGHT,
  DOT_SIZE,
  BORDER_THIN,
  CARD_MAX_WIDTH,
  STANDARD_TITLE_DOTS,
  hardShadow,
  SHADOW_OFFSET,
} from '../../theme/tokens';

const BAR_BG: Record<string, string> = {
  mint: C.mint,
  pink: C.pink,
  cyan: C.cyan,
  lavender: C.surfaceContainerHigh,
};

interface WindowCardProps {
  /** Title bar background color key */
  barColor: keyof typeof BAR_BG;
  /** Monospace label in the title bar */
  barLabel: string;
  /** Window dot colors [left, center, right] — defaults to standardized [Pink, White, Mint] */
  dotColors?: [string, string, string];
  /** Whether dots have 2px borders */
  dotsHaveBorder?: boolean;
  /** Override card border width (default BORDER=3) */
  borderWidth?: number;
  /** Card max width override */
  maxWidth?: number;
  /** Card background color */
  bg?: string;
  children: ReactNode;
  style?: ViewStyle;
}

export function WindowCard({
  barColor,
  barLabel,
  dotColors = STANDARD_TITLE_DOTS,
  dotsHaveBorder = true,
  borderWidth = BORDER,
  maxWidth = CARD_MAX_WIDTH,
  bg = C.surfaceContainerLowest,
  children,
  style,
}: WindowCardProps) {
  return (
    <View style={[styles.card, hardShadow(SHADOW_OFFSET), { borderWidth, maxWidth, backgroundColor: bg }, style]}>
      {/* Title bar */}
      <View style={[styles.header, { backgroundColor: BAR_BG[barColor], borderBottomWidth: borderWidth }]}>
        <View style={styles.dots}>
          {dotColors.map((c, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: c },
                dotsHaveBorder ? styles.dotBordered : styles.dotSolid,
              ]}
            />
          ))}
        </View>
        <Text style={styles.label} numberOfLines={1}>{barLabel}</Text>
        <View style={styles.spacer} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderColor: C.black,
    overflow: 'hidden',
  },
  header: {
    height: HEADER_HEIGHT,
    borderBottomColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotBordered: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  dotSolid: {
    // No border — fill only
  },
  label: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  spacer: {
    width: 48,
  },
  body: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.lg,
  },
});
