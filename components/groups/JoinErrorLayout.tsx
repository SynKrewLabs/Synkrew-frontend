/**
 * SynKrew — Join Group Terminal Error Shared Layout
 * Shared template for terminal Join Group error states:
 *   - Invalid Invite
 *   - Expired Invite
 *   - Group Full
 *
 * Rules:
 *   - Terminal dead-end: single "Return to Groups" action (no retry affordance)
 *   - Standardized OS Window card, chunky borders, and hard shadows
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

interface JoinErrorLayoutProps {
  testID?: string;
  windowTitle: string;
  titleBarColor?: 'pink' | 'mint' | 'cyan' | 'yellow' | 'lavender';
  iconText: string;
  badgeLabel: string;
  headline: string;
  description: string;
  extraContent?: ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

export function JoinErrorLayout({
  testID,
  windowTitle,
  titleBarColor = 'pink',
  iconText,
  badgeLabel,
  headline,
  description,
  extraContent,
  primaryActionLabel = 'RETURN TO DASHBOARD',
  onPrimaryAction,
}: JoinErrorLayoutProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const handleReturn = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      router.replace('/(groups)');
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
            {/* Error Graphic Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconShadow} />
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{iconText}</Text>
              </View>
              <View style={styles.errorTag}>
                <Text style={styles.errorTagText}>ERR!</Text>
              </View>
            </View>

            {/* Error Headlines & Badge */}
            <View style={styles.textBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeLabel}</Text>
              </View>
              <Text style={styles.headline}>{headline}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

            {/* Optional Extra Content (e.g. 100% capacity bar or status code) */}
            {extraContent && (
              <View style={styles.extraContainer}>
                {extraContent}
              </View>
            )}

            {/* Terminal Dead-End Single Action */}
            <View style={styles.actionBlock}>
              <Pressable
                testID="join-error-btn-return"
                style={[styles.returnBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleReturn}
                accessibilityRole="button"
              >
                <Text style={styles.returnBtnIcon}>←</Text>
                <Text style={styles.returnBtnText}>{primaryActionLabel}</Text>
              </Pressable>
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
    backgroundColor: C.surfaceContainerHigh,
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
    backgroundColor: C.mint,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    transform: [{ rotate: '12deg' }],
  },
  errorTagText: {
    ...T.labelXs,
    fontSize: 10,
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
    backgroundColor: '#ffdad6',
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
  },
  badgeText: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '800',
    fontSize: 11,
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

  // Action
  actionBlock: {
    width: '100%',
    marginTop: S.xs,
  },
  returnBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.primaryFixedDim,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  returnBtnIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: C.black,
  },
  returnBtnText: {
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
