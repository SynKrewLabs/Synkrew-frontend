/**
 * SynKrew — Daily Task Fallback Shared Layout
 * Parameterized template for task permission, capture, and connectivity fallbacks:
 *   - Camera Permission Denied
 *   - Camera Permanently Denied
 *   - Capture Failure / Retry
 *   - Location Denied
 *   - Location Unavailable / Inaccurate
 *   - Upload Failed (Retry)
 *   - Offline Capture / Queued
 */

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_THIN,
  BORDER_HEAVY,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';
import { TitleBar } from '../ui/TitleBar';

interface TaskFallbackLayoutProps {
  testID?: string;
  windowTitle: string;
  titleBarColor?: 'pink' | 'mint' | 'cyan' | 'yellow' | 'lavender';
  iconText: string;
  iconBgColor?: string;
  badgeLabel: string;
  badgeColor?: string;
  badgeTextColor?: string;
  headline: string;
  description: string;
  extraContent?: ReactNode;
  primaryActionLabel: string;
  primaryActionColor?: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function TaskFallbackLayout({
  testID,
  windowTitle,
  titleBarColor = 'pink',
  iconText,
  iconBgColor = C.surfaceContainerHigh,
  badgeLabel,
  badgeColor = '#ffdad6',
  badgeTextColor = '#ba1a1a',
  headline,
  description,
  extraContent,
  primaryActionLabel,
  primaryActionColor = C.pink,
  onPrimaryAction,
  secondaryActionLabel = 'RETURN TO MISSION',
  onSecondaryAction,
}: TaskFallbackLayoutProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const handleSecondary = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View testID={testID} style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label={windowTitle} color={titleBarColor} />

          <View style={styles.body}>
            {/* Graphic Icon Box */}
            <View style={styles.iconContainer}>
              <View style={styles.iconShadow} />
              <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
                <Text style={styles.icon}>{iconText}</Text>
              </View>
              <View style={styles.errorTag}>
                <Text style={styles.errorTagText}>SYS</Text>
              </View>
            </View>

            {/* Error Headlines & Badge */}
            <View style={styles.textBlock}>
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeLabel}</Text>
              </View>
              <Text style={styles.headline}>{headline}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

            {/* Extra Content (e.g. cached payload info, sensor diagnostics) */}
            {extraContent && (
              <View style={styles.extraContainer}>
                {extraContent}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionBlock}>
              <Pressable
                testID="fallback-btn-primary"
                style={[
                  styles.primaryBtn,
                  { backgroundColor: primaryActionColor },
                  hardShadow(SHADOW_OFFSET_SM),
                ]}
                onPress={onPrimaryAction}
                accessibilityRole="button"
              >
                <Text style={styles.primaryBtnText}>{primaryActionLabel}</Text>
              </Pressable>

              {secondaryActionLabel ? (
                <Pressable
                  testID="fallback-btn-secondary"
                  style={styles.secondaryBtn}
                  onPress={handleSecondary}
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryBtnText}>{secondaryActionLabel}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: S.md,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  body: {
    padding: S.xl,
    gap: S.lg,
    alignItems: 'center',
  },

  // Icon Box
  iconContainer: {
    position: 'relative',
    marginVertical: S.xs,
  },
  iconShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: '#ffdad6',
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
  },
  iconBox: {
    width: 88,
    height: 88,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 42,
  },
  errorTag: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: C.yellow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    transform: [{ rotate: '10deg' }],
  },
  errorTagText: {
    ...T.labelXs,
    fontSize: 9,
    fontWeight: '900',
    color: C.black,
  },

  // Text
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
    width: '100%',
  },
  badge: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
  },
  badgeText: {
    ...T.labelSm,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  description: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
  },

  extraContainer: {
    width: '100%',
  },

  // Actions
  actionBlock: {
    width: '100%',
    gap: S.sm,
    marginTop: S.xs,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  secondaryBtn: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '700',
  },
});
