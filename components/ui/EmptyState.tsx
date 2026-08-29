/**
 * SynKrew — Empty State Component
 * Canonical implementation built from Stitch Screen ID: f1e97944d9124c689b5221e6caaa102c
 * (Global State: Empty)
 *
 * Design Language:
 * - OS Window container with TitleBar (STATE_MANAGER.EXE by default)
 * - 96x96 icon box with dual pixel accent corners (top-left mint, bottom-right pink)
 * - Uppercase bold headline
 * - Inviting, action-oriented description copy (never a blank void)
 * - Primary arcade CTA button
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
  Radius,
  Spacing,
  hardShadow,
} from '../../theme';
import { TitleBar } from './TitleBar';
import { Button } from './Button';

export interface EmptyStateProps {
  /** TitleBar window label (defaults to STATE_MANAGER.EXE) */
  windowTitle?: string;
  /** TitleBar color theme */
  titleBarColor?: 'pink' | 'mint' | 'cyan' | 'yellow' | 'lavender';
  /** Icon symbol or emoji displayed in the central frame */
  icon?: string | React.ReactNode;
  /** Primary headline (uppercase) */
  headline: string;
  /** Inviting, action-oriented subtext */
  description: string;
  /** Primary CTA button label */
  actionLabel?: string;
  /** Primary CTA button handler */
  onAction?: () => void;
  /** Optional secondary button label */
  secondaryActionLabel?: string;
  /** Optional secondary button handler */
  onSecondaryAction?: () => void;
  /** Container custom style */
  style?: ViewStyle;
  /** Test ID for automated tests */
  testID?: string;
}

export function EmptyState({
  windowTitle = 'STATE_MANAGER.EXE',
  titleBarColor = 'lavender',
  icon = '📭',
  headline,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
  testID = 'empty-state-view',
}: EmptyStateProps) {
  return (
    <View
      testID={testID}
      style={[styles.container, hardShadow(8), style]}
    >
      <TitleBar label={windowTitle} color={titleBarColor} />
      <View style={styles.body}>
        {/* Pixel Icon Box with Decorative Corner Accents */}
        <View style={[styles.iconBox, hardShadow(4)]}>
          {/* Top-Left Corner Accent Pixel */}
          <View style={styles.cornerTopLeft} />
          
          {/* Center Icon */}
          {typeof icon === 'string' ? (
            <Text style={styles.iconText}>{icon}</Text>
          ) : (
            icon
          )}

          {/* Bottom-Right Corner Accent Pixel */}
          <View style={styles.cornerBottomRight} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>{headline.toUpperCase()}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Action Buttons */}
        {(actionLabel || secondaryActionLabel) && (
          <View style={styles.actionContainer}>
            {actionLabel && onAction && (
              <Button
                label={actionLabel}
                variant="primary"
                fullWidth
                onPress={onAction}
              />
            )}
            {secondaryActionLabel && onSecondaryAction && (
              <Button
                label={secondaryActionLabel}
                variant="secondary"
                fullWidth
                onPress={onSecondaryAction}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  body: {
    padding: Spacing.margin,
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceBright,
  },
  iconBox: {
    width: 96,
    height: 96,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: Spacing.xs,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 8,
    height: 8,
    backgroundColor: Colors.secondaryContainer,
    borderRightWidth: BorderWidth.accent,
    borderBottomWidth: BorderWidth.accent,
    borderColor: Colors.strokeObsidian,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: Colors.primaryContainer,
    borderLeftWidth: BorderWidth.accent,
    borderTopWidth: BorderWidth.accent,
    borderColor: Colors.strokeObsidian,
  },
  iconText: {
    fontSize: 42,
    lineHeight: 48,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  headline: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  actionContainer: {
    width: '100%',
    maxWidth: 240,
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
});
