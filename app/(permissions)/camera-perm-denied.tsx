/**
 * SynKrew — Camera Permanently Denied (OS Settings Deep-link)
 * Route: app/(permissions)/camera-perm-denied.tsx
 * Screen ID: 091e186361d2421aa1b4f783d4fcaac2
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
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

export default function CameraPermanentlyDeniedScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 420);

  const handleOpenSettings = () => {
    Linking.openSettings().catch(() => {});
  };

  const handleReturn = () => {
    router.replace('/(groups)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="SYSTEM_ALERT.EXE" color="pink" />

          <View style={styles.body}>
            {/* Severe Lock Icon Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>🔒</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>OS_LEVEL: LOCKDOWN</Text>
              </View>
              <Text style={styles.headline}>CAMERA_BLOCKED_OS</Text>
              <Text style={styles.description}>
                Camera access was permanently denied at the system level. Please enable camera permission in your device OS settings to continue your daily missions.
              </Text>
            </View>

            {/* Step Guide Box */}
            <View style={styles.stepsBox}>
              <Text style={styles.stepItem}>1. Tap below to launch Settings</Text>
              <Text style={styles.stepItem}>2. Locate SynKrew in app list</Text>
              <Text style={styles.stepItem}>3. Toggle Camera permission to ON</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-open-os-camera-settings"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleOpenSettings}
                accessibilityRole="button"
                accessibilityLabel="Open System Settings"
              >
                <Text style={styles.primaryBtnText}>OPEN_SYSTEM_SETTINGS</Text>
              </Pressable>

              <Pressable
                testID="btn-return-from-cam-perm"
                style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleReturn}
                accessibilityRole="button"
                accessibilityLabel="Return"
              >
                <Text style={styles.secondaryBtnText}>RETURN TO DASHBOARD</Text>
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
    backgroundColor: '#ffdad6',
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
  badge: {
    backgroundColor: C.errorContainer,
    borderWidth: 1,
    borderColor: C.error,
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    marginBottom: 4,
  },
  badgeText: {
    ...T.labelXs,
    color: C.error,
    fontWeight: '800',
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.error,
    textAlign: 'center',
    letterSpacing: 1,
  },
  description: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.black,
    padding: S.md,
    gap: 6,
  },
  stepItem: {
    ...T.labelSm,
    fontSize: 12,
    color: C.onSurface,
    fontWeight: '600',
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
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  secondaryBtn: {
    width: '100%',
    height: 44,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
