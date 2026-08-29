/**
 * SynKrew — Purchase Flow: Payment Provider Error
 * Route: app/(subscription)/provider-error.tsx
 * Screen ID: 012cc85da0b9460eb0bf3bd58f9360ee
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

export default function PaymentProviderErrorScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 440);

  const handleRetry = () => {
    // Re-attempt purchase
    router.replace('/(subscription)/processing');
  };

  const handleCancel = () => {
    router.replace('/(groups)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="PROVIDER_ERROR.EXE" color="lavender" />

          <View style={styles.body}>
            {/* Provider Outage Graphic Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>📡</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>EXTERNAL_GATEWAY_TIMEOUT</Text>
              </View>
              <Text style={styles.headline}>PROVIDER_ERROR</Text>
              <Text style={styles.description}>
                Our payment processor (App Store / Google Play) is having a moment. It's not you, it's them. Try again in a few minutes.
              </Text>
            </View>

            {/* Diagnostic Box */}
            <View style={styles.diagnosticBox}>
              <Text style={styles.diagLabel}>GATEWAY_STATUS: STOREKIT_UNRESPONSIVE</Text>
              <Text style={styles.diagSub}>All in-app coins and local states preserved.</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-retry-provider"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleRetry}
                accessibilityRole="button"
                accessibilityLabel="Retry purchase"
              >
                <Text style={styles.btnIcon}>↻</Text>
                <Text style={styles.primaryBtnText}>RETRY</Text>
              </Pressable>

              <Pressable
                testID="btn-cancel-provider"
                style={styles.cancelBtn}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel="Cancel purchase"
              >
                <Text style={styles.cancelBtnText}>Cancel Purchase</Text>
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
  statusBadge: {
    backgroundColor: C.errorContainer,
    borderWidth: 1,
    borderColor: C.error,
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    marginBottom: 4,
  },
  statusBadgeText: {
    ...T.labelXs,
    color: C.error,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.error,
    textAlign: 'center',
    letterSpacing: 1,
  },
  description: {
    ...T.bodyMd,
    color: C.onSurface,
    textAlign: 'center',
    lineHeight: 22,
  },
  diagnosticBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: 4,
  },
  diagLabel: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
  },
  diagSub: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },
  actions: {
    width: '100%',
    gap: S.sm,
    alignItems: 'center',
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
    fontSize: 18,
    color: C.black,
    fontWeight: '900',
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 14,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: S.md,
  },
  cancelBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
});
