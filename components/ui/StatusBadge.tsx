/**
 * SynKrew — StatusBadge Component [STUB]
 * Used for task instance states: Not started / Uploading / Pending / Verified /
 * Failed / Skipped / Auto-passed / Expired
 *
 * Design: Small rectangular chip with "stepped" corners.
 * RULE: Always pair color with an icon — never color alone (accessibility, §13).
 *
 * TODO (next session): Wire up all task states with correct colors + pixel icons.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, BorderWidth, Radius, Spacing } from '../../theme';

export type TaskStatus =
  | 'not_started'
  | 'capturing'
  | 'uploading'
  | 'pending'
  | 'verified'
  | 'failed'
  | 'auto_passed'
  | 'expired'
  | 'skipped';

interface StatusBadgeProps {
  status: TaskStatus;
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; icon: string; bg: string; text: string }
> = {
  not_started: {
    label: 'Not Started',
    icon: '○',
    bg: Colors.surfaceContainerHigh,
    text: Colors.onSurface,
  },
  capturing: {
    label: 'Capturing',
    icon: '◎',
    bg: Colors.yellow,
    text: Colors.strokeObsidian,
  },
  uploading: {
    label: 'Uploading',
    icon: '↑',
    bg: Colors.tertiaryFixed,
    text: Colors.strokeObsidian,
  },
  pending: {
    label: 'Pending',
    icon: '…',
    bg: Colors.primaryFixed,
    text: Colors.onPrimaryFixed,
  },
  verified: {
    label: 'Verified',
    icon: '✓',
    bg: Colors.secondaryContainer,
    text: Colors.onSecondaryContainer,
  },
  failed: {
    label: 'Failed',
    icon: '✕',
    bg: Colors.errorContainer,
    text: Colors.onErrorContainer,
  },
  auto_passed: {
    label: 'Auto-Passed',
    icon: '⟳',
    bg: Colors.surfaceContainerHigh,
    text: Colors.onSurface,
  },
  expired: {
    label: 'Expired',
    icon: '⌛',
    bg: Colors.surfaceContainerHighest,
    text: Colors.onSurface,
  },
  skipped: {
    label: 'Skipped',
    icon: '→',
    bg: Colors.primaryFixed,
    text: Colors.onPrimaryFixed,
  },
};

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        style,
      ]}
      accessible
      accessibilityLabel={`Status: ${config.label}`}
    >
      <Text style={[styles.icon, { color: config.text }]}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: BorderWidth.accent,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.unit,
    paddingHorizontal: Spacing.xs,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 12,
    lineHeight: 14,
  },
  label: {
    ...Typography.labelMd,
    fontSize: 11,
  },
});
