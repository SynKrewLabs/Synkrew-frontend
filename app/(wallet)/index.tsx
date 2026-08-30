/**
 * SynKrew — Wallet Home
 * Route: app/(wallet)/index.tsx
 *
 * Three view states:
 *   'balance'  : Normal balance breakdown (Available / Locked / Total)
 *   'zero'     : Very low/zero balance — explanatory copy, not just "$0"
 *   'loading'  : First-load skeleton (hollow-frame block-fill pattern)
 *
 * Key requirements from §2.9 / §2.9a:
 *  - Locked balance is NOT static — shows "today's stake: X (Y%)" label
 *  - Zero balance state keeps copy general (floor rule unconfirmed per §15)
 *  - Available / Locked / Total split always shown as 3 distinct figures
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C, S, T,
  BORDER, BORDER_THIN, SHADOW_OFFSET, SHADOW_OFFSET_SM,
  hardShadow, gridBgStyle,
} from '../../theme/tokens';
import { TitleBar } from '../../components/ui/TitleBar';
import { SkeletonBlock } from '../../components/ui/Skeleton';
import { BottomNavBar, BOTTOM_NAV_BASE_HEIGHT } from '../../components/groups/BottomNavBar';
import { useWalletBalanceQuery } from '../../hooks/queries/useWallet';

export type WalletViewState = 'balance' | 'zero' | 'loading';

export default function WalletHome() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const { data: walletData, isLoading } = useWalletBalanceQuery();

  const [viewState, setViewState] = useState<WalletViewState>('balance');

  const available = walletData?.availableCoins ?? 840;
  const locked = walletData?.lockedCoins ?? 72;
  const stakePercent = walletData?.todayStakePercent ?? 60;
  const balanceBeforeStake = Math.round(locked / (stakePercent / 100)) || 120;
  const total = walletData?.totalCoins ?? available + locked;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={[styles.topBarInner, { maxWidth: cardWidth + S.md * 2 }]}>
          <Pressable
            testID="wallet-btn-back"
            style={[styles.backBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.replace('/(groups)')}
            accessibilityRole="button"
            accessibilityLabel="Back to groups"
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topBarTitle}>WALLET.EXE</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* State demo bar */}
      <View style={styles.demoBar}>
        <Text style={styles.demoBarLabel}>STATE:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoBarScroll}>
          {(['balance', 'zero', 'loading'] as WalletViewState[]).map(state => (
            <Pressable
              key={state}
              style={[styles.demoChip, viewState === state && styles.demoChipActive]}
              onPress={() => setViewState(state)}
            >
              <Text style={[styles.demoChipText, viewState === state && styles.demoChipTextActive]}>
                {state}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: BOTTOM_NAV_BASE_HEIGHT + insets.bottom + S.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, alignSelf: 'center', gap: S.lg }}>

          {/* ═══ LOADING SKELETON ═══ */}
          {viewState === 'loading' && (
            <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
              <TitleBar label="WALLET.EXE" color="lavender" />
              <View style={styles.cardBody}>
                {/* Balance skeleton */}
                <View style={styles.skeletonBalanceRow}>
                  <SkeletonBlock width="35%" height={48} />
                  <View style={{ flex: 1, gap: S.xs }}>
                    <SkeletonBlock width="70%" height={16} />
                    <SkeletonBlock width="50%" height={16} />
                    <SkeletonBlock width="60%" height={16} />
                  </View>
                </View>
                {/* Divider */}
                <View style={styles.skeletonDivider} />
                {/* Transaction skeleton rows */}
                {[1, 2, 3].map(i => (
                  <View key={i} style={styles.skeletonTxRow}>
                    <SkeletonBlock width={32} height={32} />
                    <View style={{ flex: 1, gap: S.unit }}>
                      <SkeletonBlock width="65%" height={14} />
                      <SkeletonBlock width="45%" height={12} />
                    </View>
                    <SkeletonBlock width={48} height={14} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ═══ ZERO BALANCE STATE ═══ */}
          {viewState === 'zero' && (
            <>
              <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
                <View style={[styles.titleBar, { backgroundColor: C.yellow }]}>
                  <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: C.pink }]} />
                    <View style={[styles.dot, { backgroundColor: C.white }]} />
                    <View style={[styles.dot, { backgroundColor: C.mint }]} />
                  </View>
                  <Text style={styles.titleBarLabel}>WALLET.EXE</Text>
                  <View style={{ width: 48 }} />
                </View>
                <View style={[styles.cardBody, { alignItems: 'center', gap: S.lg }]}>
                  {/* Balance display — still shows structure, not just "0" */}
                  <View style={styles.balanceBlock}>
                    <View style={styles.balanceRow}>
                      <Text style={styles.balanceLabel}>AVAILABLE</Text>
                      <Text style={[styles.balanceValue, styles.balanceZero]}>0</Text>
                    </View>
                    <View style={styles.balanceDivider} />
                    <View style={styles.balanceRow}>
                      <Text style={styles.balanceLabel}>LOCKED</Text>
                      <Text style={[styles.balanceValue, styles.balanceZero]}>0</Text>
                    </View>
                    <View style={styles.balanceDivider} />
                    <View style={styles.balanceRow}>
                      <Text style={[styles.balanceLabel, { fontWeight: '800' }]}>TOTAL</Text>
                      <Text style={[styles.balanceValue, styles.balanceTotalZero]}>0</Text>
                    </View>
                  </View>

                  {/* Explanatory copy — general, not asserting a floor rule */}
                  <View style={styles.zeroExplainerBox}>
                    <Text style={styles.zeroExplainerTitle}>YOUR BALANCE IS VERY LOW</Text>
                    <Text style={styles.zeroExplainerText}>
                      Your coin balance has dropped significantly. This can happen after a run of missed tasks — each day's stake is a percentage of your remaining balance.
                    </Text>
                    <Text style={[styles.zeroExplainerText, { marginTop: S.xs }]}>
                      Stakes continue to lock each day based on whatever balance is available. Check with your group creator if you have questions about the stake percentage.
                    </Text>
                  </View>

                  {/* Small history CTA */}
                  <Pressable
                    testID="wallet-zero-btn-history"
                    style={[styles.historyBtn, hardShadow(SHADOW_OFFSET_SM)]}
                    onPress={() => router.push('/(wallet)/history')}
                    accessibilityRole="button"
                  >
                    <Text style={styles.historyBtnText}>VIEW TRANSACTION HISTORY →</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {/* ═══ NORMAL BALANCE STATE ═══ */}
          {viewState === 'balance' && (
            <>
              {/* Balance breakdown card */}
              <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
                <View style={[styles.titleBar, { backgroundColor: C.mint }]}>
                  <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: C.pink }]} />
                    <View style={[styles.dot, { backgroundColor: C.white }]} />
                    <View style={[styles.dot, { backgroundColor: C.mint }]} />
                  </View>
                  <Text style={styles.titleBarLabel}>WALLET.EXE</Text>
                  <View style={{ width: 48 }} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.balanceBlock}>
                    <View style={styles.balanceRow}>
                      <View>
                        <Text style={styles.balanceLabel}>AVAILABLE</Text>
                        <Text style={styles.balanceSubLabel}>Free to use</Text>
                      </View>
                      <Text style={[styles.balanceValue, styles.balanceAvailable]}>{available}</Text>
                    </View>

                    <View style={styles.balanceDivider} />

                    <View style={styles.balanceRow}>
                      <View>
                        <Text style={styles.balanceLabel}>LOCKED (STAKED)</Text>
                        {/* Required label per §2.9a — stake recalculates daily */}
                        <Text style={styles.lockedDailyLabel}>
                          Today: {locked} coins ({stakePercent}% of {balanceBeforeStake})
                        </Text>
                        <Text style={styles.lockedRecalcNote}>Recalculates each day</Text>
                      </View>
                      <Text style={[styles.balanceValue, styles.balanceLocked]}>{locked}</Text>
                    </View>

                    <View style={styles.balanceDivider} />

                    <View style={styles.balanceRow}>
                      <Text style={[styles.balanceLabel, { fontWeight: '800' }]}>TOTAL</Text>
                      <Text style={[styles.balanceValue, styles.balanceTotal]}>{total}</Text>
                    </View>
                  </View>

                  {/* Visual balance bar */}
                  <View style={{ gap: 4 }}>
                    <View style={styles.balanceBar}>
                      <View style={[styles.balanceBarAvail, {
                        flex: available,
                      }]} />
                      <View style={styles.balanceBarSep} />
                      <View style={[styles.balanceBarLocked, {
                        flex: locked,
                      }]} />
                    </View>
                    <View style={styles.balanceBarLegend}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: C.secondaryContainer }]} />
                        <Text style={styles.legendLabel}>AVAILABLE</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: C.yellow }]} />
                        <Text style={styles.legendLabel}>LOCKED</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Recent Transactions entry point */}
              <Pressable
                testID="wallet-btn-history"
                style={[styles.historyEntryCard, hardShadow(SHADOW_OFFSET)]}
                onPress={() => router.push('/(wallet)/history')}
                accessibilityRole="button"
              >
                <View style={[styles.titleBar, { backgroundColor: C.cyan }]}>
                  <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: C.pink }]} />
                    <View style={[styles.dot, { backgroundColor: C.white }]} />
                    <View style={[styles.dot, { backgroundColor: C.mint }]} />
                  </View>
                  <Text style={styles.titleBarLabel}>LEDGER.EXE</Text>
                  <View style={{ width: 48 }} />
                </View>
                <View style={styles.historyEntryBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyEntryTitle}>TRANSACTION HISTORY</Text>
                    <Text style={styles.historyEntrySubtitle}>Stakes, returns, win shares, bonuses</Text>
                  </View>
                  <Text style={styles.historyEntryArrow}>→</Text>
                </View>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      <BottomNavBar activeTab="wallet" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  topBar: {
    width: '100%',
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    alignItems: 'center',
  },
  topBarInner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
  },
  topBarTitle: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  // Demo bar
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.md,
    paddingVertical: S.unit,
    backgroundColor: C.surfaceContainerLow,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    gap: S.xs,
  },
  demoBarLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },
  demoBarScroll: { gap: S.unit },
  demoChip: {
    paddingHorizontal: S.xs,
    paddingVertical: 2,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
  },
  demoChipActive: { backgroundColor: C.pink },
  demoChipText: {
    ...T.labelXs,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  demoChipTextActive: { color: C.black, fontWeight: '800' },
  scroll: {
    padding: S.md,
    gap: S.md,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  titleBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: BORDER_THIN, borderColor: C.black,
  },
  titleBarLabel: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  cardBody: {
    padding: S.lg,
    gap: S.md,
  },
  // Balance breakdown
  balanceBlock: {
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: S.md,
  },
  balanceDivider: {
    height: BORDER,
    backgroundColor: C.black,
  },
  balanceLabel: {
    ...T.labelSm,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  balanceSubLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  lockedDailyLabel: {
    ...T.labelXs,
    color: C.onSurface,
    marginTop: 2,
    fontWeight: '800',
  },
  lockedRecalcNote: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    marginTop: 1,
    fontStyle: 'italic',
  },
  balanceValue: {
    ...T.headlineMd,
    fontSize: 28,
  },
  balanceAvailable: { color: '#006c4e' },
  balanceLocked: { color: '#7a135d' },
  balanceZero: { color: C.onSurfaceVariant },
  balanceTotal: { color: C.onSurface },
  balanceTotalZero: { color: C.onSurfaceVariant },
  // Balance bar
  balanceBar: {
    height: 16,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  balanceBarAvail: {
    backgroundColor: C.secondaryContainer,
  },
  balanceBarSep: {
    width: BORDER,
    backgroundColor: C.black,
  },
  balanceBarLocked: {
    backgroundColor: C.yellow,
  },
  balanceBarLegend: {
    flexDirection: 'row',
    gap: S.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: C.black,
  },
  legendLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },
  // History entry
  historyEntryCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  historyEntryBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: S.lg,
    gap: S.sm,
  },
  historyEntryTitle: {
    ...T.label,
    color: C.onSurface,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  historyEntrySubtitle: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  historyEntryArrow: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.onSurface,
  },
  historyBtn: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  historyBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  // Zero state explainer
  zeroExplainerBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.md,
    gap: S.xs,
  },
  zeroExplainerTitle: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  zeroExplainerText: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 20,
  },
  // Skeleton
  skeletonBalanceRow: {
    flexDirection: 'row',
    gap: S.md,
    alignItems: 'center',
  },
  skeletonDivider: {
    height: BORDER,
    backgroundColor: C.surfaceContainerHigh,
    marginVertical: S.xs,
  },
  skeletonTxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    paddingVertical: S.xs,
  },
});
