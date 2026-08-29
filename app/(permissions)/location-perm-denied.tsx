/**
 * SynKrew — Location Permanently Denied
 * Route: app/(permissions)/location-perm-denied.tsx
 * Screen ID: 1f941a6210c440f19d38081d2c14caf4
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

export default function LocationPermanentlyDeniedScreen() {
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
          <TitleBar label="GPS_LOCK.EXE" color="pink" />

          <View style={styles.body}>
            {/* Lock Icon Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>🌐</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PERM_DENIED: APP_SETTINGS</Text>
              </View>
              <Text style={styles.headline}>GEO_TRACKING_LOCKED</Text>
              <Text style={styles.description}>
                Location access is blocked in your device settings. SynKrew cannot verify your rituals or stakes without active location permission.
              </Text>
            </View>

            {/* Instruction Box */}
            <View style={styles.instructionBox}>
              <Text style={styles.instTitle}>TO RE-ENABLE TELEMETRY:</Text>
              <Text style={styles.instText}>1. Tap below to launch Settings</Text>
              <Text style={styles.instText}>2. Set Location Permission to "While Using App"</Text>
              <Text style={styles.instText}>3. Return to SynKrew to submit</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-go-to-os-settings"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleOpenSettings}
                accessibilityRole="button"
                accessibilityLabel="Go to OS Settings"
              >
                <Text style={styles.primaryBtnText}>GO_TO_OS_SETTINGS</Text>
              </Pressable>

              <Pressable
                testID="btn-return-dashboard-loc"
                style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleReturn}
                accessibilityRole="button"
                accessibilityLabel="Return to Dashboard"
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
  instructionBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.black,
    padding: S.md,
    gap: 4,
  },
  instTitle: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
    marginBottom: 2,
  },
  instText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurface,
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
