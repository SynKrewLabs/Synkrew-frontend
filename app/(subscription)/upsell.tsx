/**
 * SynKrew — Upsell Modal (Capacity Limit)
 * Route: app/(subscription)/upsell.tsx
 * Screen ID: 064c75d56e844285bd7f5a0dc16c3080
 */

import React from 'react';
import {
  View,
  Text,
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

export default function UpsellModal() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 420);

  const handleGoPremium = () => {
    // Navigate to purchase processing flow
    router.push('/(subscription)/processing');
  };

  const handleDismiss = () => {
    // Dismiss modal and return to origin screen where action remains blocked
    router.back();
  };

  return (
    <SafeAreaView style={styles.backdrop} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
        <TitleBar label="UPGRADE_CAPACITY.EXE" color="pink" />

        <View style={styles.body}>
          {/* Header & Copy */}
          <View style={styles.textBlock}>
            <View style={styles.limitChip}>
              <Text style={styles.limitChipText}>FREE TIER CAP HIT</Text>
            </View>
            <Text style={styles.headline}>LIMIT REACHED</Text>
            <Text style={styles.description}>
              You've reached the 2-group limit for the Free Tier. Unlock 3 more slots and 20-member capacity with Premium.
            </Text>
          </View>

          {/* Benefits summary list */}
          <View style={styles.perksBox}>
            <View style={styles.perkRow}>
              <Text style={styles.perkCheck}>★</Text>
              <Text style={styles.perkText}>5 Active Groups (vs 2 Free)</Text>
            </View>
            <View style={styles.perkRow}>
              <Text style={styles.perkCheck}>★</Text>
              <Text style={styles.perkText}>20 Members per Group (vs 10 Free)</Text>
            </View>
            <View style={styles.perkRow}>
              <Text style={styles.perkCheck}>★</Text>
              <Text style={styles.perkText}>Same fair coin & league economy</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              testID="btn-go-premium"
              style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={handleGoPremium}
              accessibilityRole="button"
              accessibilityLabel="Go Premium"
            >
              <Text style={styles.btnStar}>★</Text>
              <Text style={styles.primaryBtnText}>GO_PREMIUM</Text>
            </Pressable>

            <Pressable
              testID="btn-dismiss"
              style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={handleDismiss}
              accessibilityRole="button"
              accessibilityLabel="Dismiss modal"
            >
              <Text style={styles.secondaryBtnText}>DISMISS</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  limitChip: {
    backgroundColor: C.errorContainer,
    borderWidth: 1,
    borderColor: C.error,
    paddingHorizontal: S.sm,
    paddingVertical: 2,
    marginBottom: 4,
  },
  limitChipText: {
    ...T.labelXs,
    color: C.error,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 26,
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
  perksBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.xs,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  perkCheck: {
    ...T.labelSm,
    color: C.primary,
    fontWeight: '900',
  },
  perkText: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurface,
    fontWeight: '500',
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
  btnStar: {
    fontSize: 16,
    color: C.black,
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
