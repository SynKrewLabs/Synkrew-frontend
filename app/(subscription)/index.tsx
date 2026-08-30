/**
 * SynKrew — Subscription / Tier Comparison Screen
 * Route: app/(subscription)/index.tsx
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
import { useSubscriptionPlansQuery, useUserSubscriptionQuery } from '../../hooks/queries/useSubscription';

interface ComparisonRow {
  feature: string;
  free: string;
  premium: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  { feature: 'Groups Joined', free: '2', premium: '5' },
  { feature: 'Members / Group', free: '10', premium: '20' },
  { feature: 'Daily Task System', free: 'Same', premium: 'Same' },
  { feature: 'Verification Queue', free: 'Same', premium: 'Same' },
  { feature: 'Coin Economy', free: 'Same', premium: 'Same' },
  { feature: 'League Standings', free: 'Same', premium: 'Same' },
  { feature: 'Streaks & Badges', free: 'Same', premium: 'Same' },
];

export default function SubscriptionIndexScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 480);

  const { data: plans } = useSubscriptionPlansQuery();
  const { data: userSub } = useUserSubscriptionQuery();
  const isPremium = userSub?.tier === 'premium';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="SUBSCRIPTION.SYS" color="pink" />

          <View style={styles.body}>
            {/* Current Tier Header */}
            <View style={styles.headerBlock}>
              <View style={styles.tierTag}>
                <Text style={styles.tierTagText}>CURRENT STATUS: FREE_TIER</Text>
              </View>
              <Text style={styles.headline}>CAPACITY MATRIX</Text>
              <Text style={styles.description}>
                Premium is a capacity upgrade, not an economy upgrade. Same fair game, more squad slots.
              </Text>
            </View>

            {/* Comparison Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thCell, styles.thFeature]}>CAPABILITY</Text>
                <Text style={[styles.thCell, styles.thTier]}>FREE</Text>
                <Text style={[styles.thCell, styles.thTier, styles.thPremium]}>PRO</Text>
              </View>

              {/* Table Body Rows */}
              {COMPARISON_DATA.map((row, idx) => (
                <View
                  key={row.feature}
                  style={[
                    styles.tableRow,
                    idx % 2 === 1 && styles.tableRowAlt,
                    idx === COMPARISON_DATA.length - 1 && styles.tableRowLast,
                  ]}
                >
                  <Text style={[styles.tdCell, styles.tdFeature]}>{row.feature}</Text>
                  <Text style={[styles.tdCell, styles.tdValue]}>{row.free}</Text>
                  <Text style={[styles.tdCell, styles.tdValue, styles.tdPremium]}>
                    {row.premium}
                  </Text>
                </View>
              ))}
            </View>

            {/* Action Bar */}
            <View style={styles.actionBlock}>
              <Pressable
                testID="btn-upgrade-pro"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={() => router.push('/(subscription)/processing')}
                accessibilityRole="button"
                accessibilityLabel="Upgrade to Pro"
              >
                <Text style={styles.btnIcon}>⚡</Text>
                <Text style={styles.primaryBtnText}>UPGRADE_TO_PRO</Text>
              </Pressable>

              <Pressable
                testID="btn-back"
                style={styles.secondaryBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Return"
              >
                <Text style={styles.secondaryBtnText}>RETURN</Text>
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
  headerBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  tierTag: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 2,
  },
  tierTagText: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
    letterSpacing: 1,
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
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  table: {
    width: '100%',
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: C.surfaceContainerHigh,
    borderBottomWidth: BORDER,
    borderColor: C.black,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: C.black,
  },
  tableRowAlt: {
    backgroundColor: C.surfaceContainerLow,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  thCell: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
    paddingVertical: 8,
    paddingHorizontal: 8,
    letterSpacing: 0.8,
  },
  thFeature: {
    flex: 2,
    borderRightWidth: 1,
    borderColor: C.black,
  },
  thTier: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: C.black,
  },
  thPremium: {
    borderRightWidth: 0,
    backgroundColor: C.pink,
  },
  tdCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  tdFeature: {
    ...T.bodyMd,
    flex: 2,
    fontSize: 12,
    fontWeight: '600',
    color: C.onSurface,
    borderRightWidth: 1,
    borderColor: C.black,
  },
  tdValue: {
    ...T.labelSm,
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: C.onSurfaceVariant,
    borderRightWidth: 1,
    borderColor: C.black,
  },
  tdPremium: {
    borderRightWidth: 0,
    color: C.primary,
    fontWeight: '800',
  },
  actionBlock: {
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
    fontSize: 18,
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
    height: 40,
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
  },
});
