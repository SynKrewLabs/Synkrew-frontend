/**
 * SynKrew — Location Permission Prompt (Soft-Ask Rationale)
 * Route: app/(permissions)/location-prompt.tsx
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

export default function LocationPermissionPromptScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 420);

  const handleGrantLocation = () => {
    router.replace('/(task)/capture');
  };

  const handleLater = () => {
    router.replace('/(permissions)/location-denied');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="GPS_ACCESS.EXE" color="pink" />

          <View style={styles.body}>
            {/* Icon Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>📍</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>LOCATION_ACCESS_REQ</Text>
              <Text style={styles.description}>
                Trust requires proof of place. We embed tamper-proof geo-tags into every proof to verify your rituals are authentic and unique.
              </Text>
            </View>

            {/* Anti-spoofing Guarantee Pill */}
            <View style={styles.guaranteePill}>
              <Text style={styles.guaranteeText}>✓ EMBEDDED TELEMETRY • NO SILENT SUBMISSIONS</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-grant-location"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleGrantLocation}
                accessibilityRole="button"
                accessibilityLabel="Grant Location Access"
              >
                <Text style={styles.primaryBtnText}>GRANT_LOCATION</Text>
              </Pressable>

              <Pressable
                testID="btn-later-location"
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
    backgroundColor: C.mint,
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
