/**
 * SynKrew — ErrorBanner Component [STUB]
 * Shared error/warning banner pattern used across all screens.
 *
 * Design: Red fill or error-container, 3px black border, label-md text.
 * Always includes an icon (⚠) paired with text — never color alone (accessibility).
 *
 * TODO (next session): Add icon prop, dismiss action, animation.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, BorderWidth, Radius, Spacing } from '../../theme';

export type ErrorBannerType = 'error' | 'warning' | 'info';

interface ErrorBannerProps {
  message: string;
  type?: ErrorBannerType;
  style?: ViewStyle;
  actionLabel?: string;
  onAction?: () => void;
}

const TYPE_COLORS: Record<ErrorBannerType, { bg: string; text: string }> = {
  error: { bg: Colors.errorContainer, text: Colors.onErrorContainer },
  warning: { bg: Colors.yellow, text: Colors.strokeObsidian },
  info: { bg: Colors.surfaceContainerHigh, text: Colors.onSurface },
};

const TYPE_ICONS: Record<ErrorBannerType, string> = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

import { Pressable } from 'react-native';

export function ErrorBanner({ message, type = 'error', style, actionLabel, onAction }: ErrorBannerProps) {
  const { bg, text } = TYPE_COLORS[type];

  return (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <Text style={[styles.icon, { color: text }]}>{TYPE_ICONS[type]}</Text>
      <Text style={[styles.message, { color: text }]}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.DEFAULT,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.gutter,
  },
  icon: {
    ...Typography.labelMd,
    fontSize: 16,
  },
  message: {
    ...Typography.bodyMd,
    flex: 1,
  },
  actionBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.strokeObsidian,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  actionText: {
    fontFamily: 'JetBrainsMono',
    fontSize: 10,
    fontWeight: '900',
    color: Colors.strokeObsidian,
  },
});
