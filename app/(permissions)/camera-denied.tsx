/**
 * SynKrew — Camera Permission Denied
 * Route: app/(permissions)/camera-denied.tsx
 * Screen ID: 6d709e08b5454d06be77a68c6eca80e1
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

export default function CameraDeniedScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 420);

  const handleRetryPermission = () => {
    router.replace('/(permissions)/camera-prompt');
  };

  const handleOpenSettings = () => {
    Linking.openSettings().catch(() => {
      router.push('/(permissions)/camera-perm-denied');
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="CAMERA_REQUIRED.EXE" color="pink" />

          <View style={styles.body}>
            {/* Warning Icon Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>🚫</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ACCESS_LEVEL: RESTRICTED</Text>
              </View>
              <Text style={styles.headline}>CAMERA__DENIED</Text>
              <Text style={styles.description}>
                SynKrew is blind without a lens. You won't be able to submit tasks or verify your pact until camera access is granted.
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-retry-camera-perm"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleRetryPermission}
                accessibilityRole="button"
                accessibilityLabel="Retry Permission"
              >
                <Text style={styles.primaryBtnText}>RETRY_PERMISSION</Text>
              </Pressable>

              <Pressable
                testID="btn-open-camera-settings"
                style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleOpenSettings}
                accessibilityRole="button"
                accessibilityLabel="Open Settings"
              >
                <Text style={styles.secondaryBtnText}>OPEN_SETTINGS</Text>
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
