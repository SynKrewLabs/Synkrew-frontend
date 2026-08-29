/**
 * SynKrew — Location: OS-Level Services Off
 * Route: app/(permissions)/location-services-off.tsx
 * Screen ID: 46380eca87e64de6baaeebc2066e1667
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

export default function LocationServicesOffScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 420);

  const handleOpenDeviceSettings = () => {
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
          <TitleBar label="GPS_SERVICES.EXE" color="pink" />

          <View style={styles.body}>
            {/* Master OS GPS Off Graphic Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>📡</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>OS_HARDWARE: GPS_DISABLED</Text>
              </View>
              <Text style={styles.headline}>SYSTEM_GPS_OFF</Text>
              <Text style={styles.description}>
                Your device's Location Services master switch is completely disabled. Please toggle Location on in your main device settings to sync telemetry with your Krew.
              </Text>
            </View>

            {/* OS Note */}
            <View style={styles.osNoteBox}>
              <Text style={styles.osNoteTitle}>DEVICE SYSTEM LEVEL REQUIREMENT:</Text>
              <Text style={styles.osNoteText}>
                This is a global phone setting, not just for SynKrew. Open Settings → Privacy & Security → Location Services.
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-open-device-settings"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleOpenDeviceSettings}
                accessibilityRole="button"
                accessibilityLabel="Open Device Settings"
              >
                <Text style={styles.btnIcon}>⚙</Text>
                <Text style={styles.primaryBtnText}>OPEN_DEVICE_SETTINGS</Text>
              </Pressable>

              <Pressable
                testID="btn-return-from-gps-off"
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
    backgroundColor: C.errorContainer,
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
  osNoteBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.black,
    padding: S.md,
    gap: 4,
  },
  osNoteTitle: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
    fontSize: 11,
  },
  osNoteText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnIcon: {
    fontSize: 16,
    color: C.black,
    fontWeight: '900',
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
