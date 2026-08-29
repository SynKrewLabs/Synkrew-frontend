import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  Colors,
  Typography,
  BorderWidth,
  Spacing,
  STANDARD_TITLE_DOTS,
} from '../../theme';

export type TitleBarColor = 'pink' | 'mint' | 'cyan' | 'yellow' | 'lavender';

interface TitleBarProps {
  label: string;
  color?: TitleBarColor;
  /** Custom dot colors [left, middle, right]. Defaults to standardized [Pink, White, Mint]. */
  dotColors?: [string, string, string];
  /** Bottom border width */
  borderBottomWidth?: number;
  /** Optional left accessory (e.g. back button) */
  leftElement?: React.ReactNode;
  /** Optional right accessory (e.g. settings icon, close button, state toggle) */
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

const BAR_COLORS: Record<TitleBarColor, string> = {
  pink: Colors.pink,
  mint: Colors.mint,
  cyan: Colors.cyan,
  yellow: Colors.yellow,
  lavender: Colors.surfaceContainerHigh,
};

export function TitleBar({
  label,
  color = 'mint',
  dotColors = STANDARD_TITLE_DOTS,
  borderBottomWidth = BorderWidth.container,
  leftElement,
  rightElement,
  style,
}: TitleBarProps) {
  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: BAR_COLORS[color],
          borderBottomWidth,
          borderBottomColor: Colors.strokeObsidian,
        },
        style,
      ]}
    >
      {/* Window controls or left element */}
      <View style={styles.leftContainer}>
        {leftElement || (
          <View style={styles.controls}>
            <View style={[styles.dot, { backgroundColor: dotColors[0] }]} />
            <View style={[styles.dot, { backgroundColor: dotColors[1] }]} />
            <View style={[styles.dot, { backgroundColor: dotColors[2] }]} />
          </View>
        )}
      </View>

      {/* Label */}
      <Text style={styles.label} numberOfLines={1}>
        {label.toUpperCase()}
      </Text>

      {/* Right container or spacer */}
      <View style={styles.rightContainer}>
        {rightElement || <View style={styles.spacer} />}
      </View>
    </View>
  );
}

const CONTROL_DOT = 12;

const styles = StyleSheet.create({
  bar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: CONTROL_DOT,
    height: CONTROL_DOT,
    borderRadius: CONTROL_DOT / 2,
    borderWidth: BorderWidth.accent,
    borderColor: Colors.strokeObsidian,
  },
  label: {
    ...Typography.labelMd,
    color: Colors.strokeObsidian,
    letterSpacing: 1.5,
  },
  leftContainer: {
    minWidth: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    minWidth: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  spacer: {
    width: 12,
  },
});
