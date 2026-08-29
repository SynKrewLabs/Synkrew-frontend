/**
 * SynKrew — Error Retry State Component
 * Canonical implementation built from Stitch Screen ID: 4610910186504fbf9a086048fe721fba
 * (Global State: Error Retry)
 *
 * Design Language:
 * - Window Header with SYS_ERR.LOG TitleBar
 * - Error Container pastel background
 * - Bold red icon badge with white symbol and hard pixel shadow
 * - Non-apologetic, actionable error explanation
 * - Diagnostic attempt/timeout segmented meter
 * - Primary retry CTA button
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

export interface ErrorRetryProps {
  /** Window title for the error log header (defaults to SYS_ERR.LOG) */
  windowTitle?: string;
  /** Primary error headline (e.g. CONNECTION_LOST, UPLOAD_FAILED) */
  headline: string;
  /** Clear, non-apologetic explanation of what occurred */
  description: string;
  /** Icon symbol or emoji */
  icon?: string | React.ReactNode;
  /** Action button label (defaults to RETRY_CONNECTION) */
  retryLabel?: string;
  /** Retry button press callback */
  onRetry: () => void;
  /** Optional secondary button label (e.g. CANCEL or BACK) */
  secondaryLabel?: string;
  /** Optional secondary button callback */
  onSecondary?: () => void;
  /** Attempt diagnostic count (current attempt) */
  attempt?: number;
  /** Max diagnostic attempts */
  maxAttempts?: number;
  /** Timeout in seconds to display */
  timeoutSeconds?: number;
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export function ErrorRetry({
  windowTitle = 'SYS_ERR.LOG',
  headline = 'CONNECTION_LOST',
  description = 'Data stream interrupted. Please verify local network configuration and re-initialize connection protocol.',
  icon = '✕',
  retryLabel = 'RETRY_CONNECTION',
  onRetry,
  secondaryLabel,
  onSecondary,
  attempt = 3,
  maxAttempts = 5,
  timeoutSeconds = 12,
  style,
  testID = 'error-retry-state',
}: ErrorRetryProps) {
  return (
    <View
      testID={testID}
      style={[styles.container, hardShadow(8), style]}
    >
      <TitleBar label={windowTitle} color="pink" />
      
      <View style={styles.body}>
        {/* Red Icon Badge */}
        <View style={[styles.iconBox, hardShadow(4)]}>
          {typeof icon === 'string' ? (
            <Text style={styles.iconText}>{icon}</Text>
          ) : (
            icon
          )}
        </View>

        {/* Error Details */}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>{headline.toUpperCase()}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Retry & Secondary Buttons */}
        <View style={styles.actionContainer}>
          <Button
            label={retryLabel}
            variant="primary"
            fullWidth
            onPress={onRetry}
          />
          {secondaryLabel && onSecondary && (
            <Button
              label={secondaryLabel}
              variant="secondary"
              fullWidth
              onPress={onSecondary}
            />
          )}
        </View>

        {/* Diagnostic Segment Meter */}
        {maxAttempts > 0 && (
          <View style={styles.diagnosticsContainer}>
            <View style={styles.diagnosticsLabels}>
              <Text style={styles.diagLabel}>
                ATTEMPTS: {attempt}/{maxAttempts}
              </Text>
              {timeoutSeconds !== undefined && (
                <Text style={styles.diagLabel}>TIMEOUT: {timeoutSeconds}s</Text>
              )}
            </View>
            <View style={styles.meterTrack}>
              {Array.from({ length: maxAttempts }).map((_, idx) => {
                const isFilled = idx < attempt;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.meterSegment,
                      isFilled ? styles.segmentFilled : styles.segmentEmpty,
                    ]}
                  />
                );
              })}
            </View>
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
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: Colors.error,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  iconText: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    color: Colors.onError,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  headline: {
    ...Typography.headlineMd,
    color: Colors.onErrorContainer,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onErrorContainer,
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  actionContainer: {
    width: '100%',
    maxWidth: 280,
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  diagnosticsContainer: {
    width: '100%',
    maxWidth: 280,
    gap: 4,
    marginTop: Spacing.xs,
  },
  diagnosticsLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  diagLabel: {
    ...Typography.labelMd,
    fontSize: 10,
    color: Colors.onErrorContainer,
    opacity: 0.8,
  },
  meterTrack: {
    flexDirection: 'row',
    height: 14,
    borderWidth: BorderWidth.accent,
    borderColor: Colors.strokeObsidian,
    backgroundColor: Colors.surface,
    padding: 2,
    gap: 2,
  },
  meterSegment: {
    flex: 1,
    height: '100%',
  },
  segmentFilled: {
    backgroundColor: Colors.error,
  },
  segmentEmpty: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
});
