/**
 * SynKrew — ErrorBanner Component
 * Canonical inline alert banner implementation.
 *
 * Design Language:
 * - Red fill / error-container for error, yellow for warning, surfaceContainerHigh for info
 * - 3px black border, label-md typography
 * - Always includes an icon paired with text (never color alone)
 * - Optional inline action / retry trigger button
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { Colors, Typography, BorderWidth, Radius, Spacing } from '../../theme';

export type ErrorBannerType = 'error' | 'warning' | 'info';

export interface ErrorBannerProps {
  message: string;
  type?: ErrorBannerType;
  icon?: string;
  style?: ViewStyle;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}

const TYPE_COLORS: Record<ErrorBannerType, { bg: string; text: string; icon: string }> = {
  error: { bg: Colors.errorContainer, text: Colors.onErrorContainer, icon: '✕' },
  warning: { bg: Colors.yellow, text: Colors.strokeObsidian, icon: '⚠' },
  info: { bg: Colors.surfaceContainerHigh, text: Colors.onSurface, icon: 'ℹ' },
};

export function ErrorBanner({
  message,
  type = 'error',
  icon,
  style,
  actionLabel,
  onAction,
  testID = 'error-banner',
}: ErrorBannerProps) {
  const config = TYPE_COLORS[type];
  const displayIcon = icon || config.icon;

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: config.bg }, style]}
      accessible
      accessibilityRole="alert"
    >
      <Text style={[styles.icon, { color: config.text }]}>{displayIcon}</Text>
      <Text style={[styles.message, { color: config.text }]}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable
          style={styles.actionBtn}
          onPress={onAction}
          accessible
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionText}>{actionLabel.toUpperCase()}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.DEFAULT,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.gutter,
    width: '100%',
  },
  icon: {
    ...Typography.labelMd,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '900',
  },
  message: {
    ...Typography.bodyMd,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  actionBtn: {
    backgroundColor: Colors.surface,
    borderWidth: BorderWidth.accent,
    borderColor: Colors.strokeObsidian,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  actionText: {
    ...Typography.labelMd,
    fontSize: 10,
    fontWeight: '900',
    color: Colors.strokeObsidian,
  },
});
