/**
 * SynKrew — Camera Permission Prompt (Soft-Ask Rationale)
 * Route: app/(permissions)/camera-prompt.tsx
 * Screen ID: 14eb88b4cc7e4705b0916a9479afc425
 */

import React from 'react';
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
  BORDER_HEAVY,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';
import { TitleBar } from '../../components/ui/TitleBar';

export default function CameraPermissionPromptScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 420);

  const handleGrantAccess = () => {
    // Proceed to camera capture
    router.replace('/(task)/capture');
  };

  const handleLater = () => {
    router.replace('/(permissions)/camera-denied');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="CAMERA_ACCESS.EXE" color="pink" />

          <View style={styles.body}>
            {/* Icon Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>📷</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>CAMERA_ACCESS_REQ</Text>
              <Text style={styles.description}>
                To capture proof of your daily rituals, SynKrew needs access to your camera sensor. No gallery uploads allowed—staying honest means staying live.
              </Text>
            </View>

            {/* Anti-spoofing Guarantee Pill */}
            <View style={styles.guaranteePill}>
              <Text style={styles.guaranteeText}>✓ HARDWARE CAMERA ONLY • ZERO SPOOFING</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-grant-camera"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleGrantAccess}
                accessibilityRole="button"
                accessibilityLabel="Grant Camera Access"
              >
                <Text style={styles.primaryBtnText}>GRANT_ACCESS</Text>
              </Pressable>

              <Pressable
                testID="btn-later-camera"
                style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleLater}
                accessibilityRole="button"
                accessibilityLabel="Later"
              >
                <Text style={styles.secondaryBtnText}>LATER</Text>
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
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
    textAlign: 'center',
    letterSpacing: 1,
  },
  description: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  guaranteePill: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
  },
  guaranteeText: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  actions: {
    width: '100%',
    gap: S.sm,
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 14,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  secondaryBtn: {
    width: '100%',
    height: 44,
    backgroundColor: C.surface,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
