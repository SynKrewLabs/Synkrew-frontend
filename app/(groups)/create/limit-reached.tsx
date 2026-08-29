/**
 * SynKrew — Create Group: Limit Reached (Upsell Gate)
 * Route: app/(groups)/create/limit-reached.tsx
 *
 * Implements:
 *   - Gate view when a user on Standard Tier reaches 2/2 groups
 *   - Clear capacity limit explanation and upgrade action
 *   - Cancel operation return to dashboard
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
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
} from '../../../theme/tokens';
import { TitleBar } from '../../../components/ui/TitleBar';

export default function LimitReachedScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const handleUpgrade = () => {
    router.push('/(subscription)/upsell');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="SYSTEM_HALT.EXE" color="pink" />

          <View style={styles.body}>
            {/* Warning Box */}
            <View style={[styles.warningBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>⚠️</Text>
              </View>

              <Text style={styles.haltTitle}>SYSTEM HALT</Text>

              <View style={styles.limitTag}>
                <Text style={styles.limitTagText}>LIMIT_REACHED: 2/2_GROUPS</Text>
              </View>

              <Text style={styles.haltDesc}>
                Your account has reached the maximum capacity for active groups in the standard tier. Increase your operational limits to proceed.
              </Text>
            </View>

            {/* Features of Pro Tier */}
            <View style={styles.featuresBox}>
              <Text style={styles.featuresHeader}>PRO TIER UNLOCKS:</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>Up to 5 simultaneous active pacts</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>Advanced custom stake multipliers</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>Priority global league matchmaking</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionColumn}>
              <Pressable
                testID="limit-btn-upgrade"
                style={[styles.upgradeBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleUpgrade}
                accessibilityRole="button"
              >
                <Text style={styles.upgradeBtnIcon}>⚡</Text>
                <Text style={styles.upgradeBtnText}>UPGRADE_TO_PREMIUM</Text>
              </Pressable>

              <Pressable
                testID="limit-btn-cancel"
                style={styles.cancelBtn}
                onPress={() => router.replace('/(groups)')}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>CANCEL OPERATION</Text>
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

  // Warning Box
  warningBox: {
    width: '100%',
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.lg,
    alignItems: 'center',
    gap: S.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  haltTitle: {
    ...T.headlineMd,
    fontSize: 22,
    color: '#ba1a1a',
    textTransform: 'uppercase',
  },
  limitTag: {
    backgroundColor: C.surface,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
  },
  limitTagText: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '800',
    letterSpacing: 1,
  },
  haltDesc: {
    ...T.bodyMd,
    fontSize: 13,
    color: '#53424b',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Features Box
  featuresBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.md,
    gap: 6,
  },
  featuresHeader: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureCheck: {
    ...T.labelSm,
    color: C.primary,
    fontWeight: '900',
  },
  featureText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },

  // Actions
  actionColumn: {
    width: '100%',
    gap: S.sm,
  },
  upgradeBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  upgradeBtnIcon: {
    fontSize: 18,
  },
  upgradeBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cancelBtn: {
    width: '100%',
    height: 44,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },
});
