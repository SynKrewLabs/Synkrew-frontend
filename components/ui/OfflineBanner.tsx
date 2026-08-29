/**
 * SynKrew — Offline Banner Component
 * Canonical implementation built from Stitch Screen ID: 3145d16ce6934c1fb8b4fbf3520aa6f7
 * (Global State: Offline Banner)
 *
 * Design Language:
 * - Mint-green secondary-container background (#99F5CC)
 * - 3px solid black border with hard bottom drop shadow
 * - wifi_off / 📡 icon paired with uppercase tracking-widest monospace label
 * - Calm, informational tone (visually distinct from red/actionable ErrorBanner)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {
  Colors,
  Typography,
  BorderWidth,
  Spacing,
  hardShadow,
} from '../../theme';

export interface OfflineBannerProps {
  /** Text label displayed in the banner */
  label?: string;
  /** Optional secondary explanatory text */
  subtitle?: string;
  /** Icon symbol or emoji */
  icon?: string;
  /** Custom container style */
  style?: ViewStyle;
  /** Whether banner is sticky at top */
  isSticky?: boolean;
  /** Test ID */
  testID?: string;
}

export function OfflineBanner({
  label = 'OFFLINE_MODE // CACHED_DATA',
  subtitle,
  icon = '📡',
  style,
  isSticky = false,
  testID = 'offline-banner',
}: OfflineBannerProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.container,
        isSticky && styles.sticky,
        hardShadow(3),
        style,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Offline mode active: ${label}`}
    >
      <View style={styles.contentRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      </View>
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryContainer,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.margin,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 60,
  },
  sticky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 14,
    lineHeight: 16,
    color: Colors.strokeObsidian,
  },
  label: {
    ...Typography.labelMd,
    fontSize: 12,
    letterSpacing: 1.5,
    color: Colors.strokeObsidian,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.bodyMd,
    fontSize: 11,
    color: Colors.strokeObsidian,
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
});
