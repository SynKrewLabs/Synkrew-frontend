/**
 * SynKrew — Cycle Results
 * Route: app/(settlement)/cycle-results.tsx
 *
 * One component, three role/state variants:
 *  - 'creator'     : Final day complete, CTA to start next cycle
 *  - 'non_creator' : Waiting for creator to start next cycle
 *  - 'force_closed': Hard time-limit hit with unresolved data — distinct warning banner
 *
 * Implements: §2.12 Cycle Lifecycle, §5.3 Cycle Results inventory
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  C, S, T,
  BORDER, BORDER_THIN, SHADOW_OFFSET, SHADOW_OFFSET_SM,
  hardShadow, gridBgStyle,
} from '../../theme/tokens';

export type CycleResultsRole = 'creator' | 'non_creator' | 'force_closed';

// ─── Mock cycle data — replace with real cycle summary API ───────────────────
interface MemberSummary {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  isCurrentUser: boolean;
  daysCompleted: number;
  totalDays: number;
  passRate: number;
  netCoinChange: number;
  streakBest: number;
}

const MOCK_MEMBERS: MemberSummary[] = [
  {
    id: 'jay_r',
    name: 'JAY_R',
    avatarLetter: 'J',
    avatarBg: C.pink,
    isCurrentUser: true,
    daysCompleted: 26,
    totalDays: 30,
    passRate: 87,
    netCoinChange: 340,
    streakBest: 21,
  },
  {
    id: 'sarah_x',
    name: 'SARAH_X',
    avatarLetter: 'S',
    avatarBg: C.cyan,
    isCurrentUser: false,
    daysCompleted: 24,
    totalDays: 30,
    passRate: 80,
    netCoinChange: 210,
    streakBest: 14,
  },
  {
    id: 'mike_99',
    name: 'MIKE_99',
    avatarLetter: 'M',
    avatarBg: C.surfaceDim,
    isCurrentUser: false,
    daysCompleted: 14,
    totalDays: 30,
    passRate: 47,
    netCoinChange: -180,
    streakBest: 7,
  },
];

export default function CycleResults() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const role = (['creator', 'non_creator', 'force_closed'].includes(String(params.role))
    ? String(params.role)
    : 'creator') as CycleResultsRole;

  const groupName = params.group ? String(params.group) : 'MORNING RUNNERS';
  const cycleNum = params.cycle ? String(params.cycle) : '1';
  const creatorName = params.creator ? String(params.creator) : 'KrewMaster99';

  const isForceClose = role === 'force_closed';
  const isCreator = role === 'creator';
  const isNonCreator = role === 'non_creator';

  const [nextCycleStarted, setNextCycleStarted] = useState(false);

  const handleStartNextCycle = () => {
    Alert.alert(
      'INITIALIZE CYCLE 2',
      'This will start a new 30-day cycle for all members. Stakes will be locked from their current balances.',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'START CYCLE 2',
          onPress: () => {
            setNextCycleStarted(true);
            setTimeout(() => router.replace('/(groups)/detail'), 1000);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* ─── Force-Close Banner (if applicable) ── */}
      {isForceClose && (
        <View style={styles.forceCloseBanner}>
          <Text style={styles.forceCloseBannerIcon}>⚡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.forceCloseBannerTitle}>CYCLE FORCE-CLOSED</Text>
            <Text style={styles.forceCloseBannerText}>
              The hard time limit was reached before all data resolved. Shown results are final as of cutoff. Unresolved stakes were returned to member balances.
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: S.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, alignSelf: 'center', gap: S.lg }}>

          {/* ─── Cycle Header Card ── */}
          <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
            <View style={[styles.titleBar, { backgroundColor: isForceClose ? C.errorContainer : C.yellow }]}>
              <View style={styles.dots}>
                <View style={[styles.dot, { backgroundColor: C.pink }]} />
                <View style={[styles.dot, { backgroundColor: C.white }]} />
                <View style={[styles.dot, { backgroundColor: C.mint }]} />
              </View>
              <Text style={styles.titleBarLabel}>
                {isForceClose ? 'CYCLE_FORCE_CLOSED.EXE' : 'CYCLE_RESULTS.EXE'}
              </Text>
              <View style={{ width: 48 }} />
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cycleHeaderRow}>
                <View>
                  <Text style={styles.groupName}>{groupName}</Text>
                  <Text style={styles.cycleLabel}>
                    CYCLE {cycleNum} · 30-DAY RUN
                    {isForceClose ? ' · FORCE-CLOSED' : ' · COMPLETE'}
                  </Text>
                </View>
                <View style={[styles.completedBadge, {
                  backgroundColor: isForceClose ? C.errorContainer : C.secondaryContainer,
                }]}>
                  <Text style={[styles.completedBadgeText, {
                    color: isForceClose ? C.onErrorContainer : '#006c4e',
                  }]}>
                    {isForceClose ? '⚡ CLOSED' : '✓ DONE'}
                  </Text>
                </View>
              </View>

              {/* Aggregate stats */}
              <View style={styles.aggregateRow}>
                <View style={styles.aggregateStat}>
                  <Text style={styles.aggregateNum}>87%</Text>
                  <Text style={styles.aggregateLabel}>GROUP PASS RATE</Text>
                </View>
                <View style={styles.aggregateDivider} />
                <View style={styles.aggregateStat}>
                  <Text style={styles.aggregateNum}>3</Text>
                  <Text style={styles.aggregateLabel}>MEMBERS</Text>
                </View>
                <View style={styles.aggregateDivider} />
                <View style={styles.aggregateStat}>
                  <Text style={styles.aggregateNum}>+370</Text>
                  <Text style={styles.aggregateLabel}>NET COINS</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── Section label ── */}
          <Text style={styles.sectionLabel}>MEMBER LEADERBOARD</Text>

          {/* ─── Member leaderboard ── */}
          {MOCK_MEMBERS
            .sort((a, b) => b.netCoinChange - a.netCoinChange)
            .map((member, idx) => (
              <View
                key={member.id}
                style={[
                  styles.memberCard,
                  hardShadow(SHADOW_OFFSET_SM),
                  member.isCurrentUser && styles.memberCardSelf,
                ]}
              >
                {member.isCurrentUser && (
                  <View style={styles.youBadge}>
                    <Text style={styles.youBadgeText}>YOU</Text>
                  </View>
                )}
                <View style={styles.memberRow}>
                  {/* Rank */}
                  <View style={[styles.rankBox, { backgroundColor: idx === 0 ? C.yellow : C.surfaceContainerHigh }]}>
                    <Text style={styles.rankText}>#{idx + 1}</Text>
                  </View>

                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: member.avatarBg }]}>
                    <Text style={styles.avatarLetter}>{member.avatarLetter}</Text>
                  </View>

                  {/* Name + stats */}
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberStats}>
                      {member.daysCompleted}/{member.totalDays} days · {member.passRate}% · Best: {member.streakBest}d
                    </Text>
                  </View>

                  {/* Coin delta */}
                  <Text style={[
                    styles.coinDelta,
                    member.netCoinChange >= 0 ? styles.coinGain : styles.coinLoss,
                  ]}>
                    {member.netCoinChange >= 0 ? '+' : ''}{member.netCoinChange}
                  </Text>
                </View>
              </View>
            ))}

          {/* ─── Role-based CTA ── */}
          {isCreator && !isForceClose && (
            <View style={[styles.creatorCtaCard, hardShadow(SHADOW_OFFSET)]}>
              <View style={[styles.creatorCtaBar, { backgroundColor: C.mint }]}>
                <View style={styles.dots}>
                  <View style={[styles.dot, { backgroundColor: C.pink }]} />
                  <View style={[styles.dot, { backgroundColor: C.white }]} />
                  <View style={[styles.dot, { backgroundColor: C.mint }]} />
                </View>
                <Text style={styles.titleBarLabel}>CREATOR_ACTION.EXE</Text>
                <View style={{ width: 48 }} />
              </View>
              <View style={styles.creatorCtaBody}>
                <Text style={styles.creatorCtaTitle}>INITIALIZE CYCLE {Number(cycleNum) + 1}</Text>
                <Text style={styles.creatorCtaDesc}>
                  As Krew Creator, you control when the next cycle begins. All members' stakes will be recalculated from their current balances when you start.
                </Text>
                <Pressable
                  testID="cycle-results-btn-start-next-cycle"
                  style={[
                    styles.startCycleBtn,
                    hardShadow(SHADOW_OFFSET_SM),
                    nextCycleStarted && { opacity: 0.6 },
                  ]}
                  onPress={handleStartNextCycle}
                  disabled={nextCycleStarted}
                  accessibilityRole="button"
                >
                  <Text style={styles.startCycleBtnText}>
                    {nextCycleStarted ? 'STARTING...' : `LAUNCH CYCLE ${Number(cycleNum) + 1} →`}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {(isNonCreator || isForceClose) && (
            <View style={[styles.waitingCard, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.waitingIcon}>
                {isForceClose ? '⚡' : '⏳'}
              </Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.waitingTitle}>
                  {isForceClose ? 'CYCLE FORCE-CLOSED' : 'WAITING FOR CREATOR'}
                </Text>
                <Text style={styles.waitingText}>
                  {isForceClose
                    ? 'This cycle was closed by the system at the hard time limit. The next cycle can be started by the creator when ready.'
                    : `Awaiting @${creatorName} to initiate Cycle ${Number(cycleNum) + 1}. You'll be notified when the next cycle begins.`
                  }
                </Text>
              </View>
            </View>
          )}

          {/* Return button */}
          <Pressable
            testID="cycle-results-btn-return"
            style={[styles.returnBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.replace('/(groups)/detail')}
            accessibilityRole="button"
          >
            <Text style={styles.returnBtnText}>RETURN TO GROUP</Text>
          </Pressable>
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
    padding: S.md,
    gap: S.sm,
  },
  // Force-close banner — distinct from normal completion
  forceCloseBanner: {
    flexDirection: 'row',
    gap: S.sm,
    backgroundColor: C.errorContainer,
    borderBottomWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    alignItems: 'flex-start',
  },
  forceCloseBannerIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  forceCloseBannerTitle: {
    ...T.labelSm,
    color: C.onErrorContainer,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forceCloseBannerText: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onErrorContainer,
    lineHeight: 18,
    marginTop: 2,
  },
  // Card base
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
  cycleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  groupName: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  cycleLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  completedBadge: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.xs,
    paddingVertical: 4,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  completedBadgeText: {
    ...T.labelSm,
    fontWeight: '800',
  },
  aggregateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  aggregateStat: {
    alignItems: 'center',
    gap: 2,
  },
  aggregateNum: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
  },
  aggregateLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },
  aggregateDivider: {
    width: 2,
    height: 32,
    backgroundColor: C.black,
  },
  sectionLabel: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: S.xs,
  },
  // Member cards
  memberCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    position: 'relative',
  },
  memberCardSelf: {
    backgroundColor: C.surfaceContainerLow,
    borderColor: C.primary,
  },
  youBadge: {
    position: 'absolute',
    top: -1,
    right: S.md,
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  youBadgeText: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  rankBox: {
    width: 28,
    height: 28,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  avatar: {
    width: 36,
    height: 36,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    fontSize: 12,
  },
  memberName: {
    ...T.label,
    color: C.onSurface,
    fontWeight: '800',
    fontSize: 13,
  },
  memberStats: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    lineHeight: 14,
  },
  coinDelta: {
    ...T.label,
    fontWeight: '800',
  },
  coinGain: { color: '#006c4e' },
  coinLoss: { color: C.error },
  // Creator CTA card
  creatorCtaCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  creatorCtaBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  creatorCtaBody: {
    padding: S.lg,
    gap: S.md,
  },
  creatorCtaTitle: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  creatorCtaDesc: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  startCycleBtn: {
    backgroundColor: C.mint,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  startCycleBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  // Non-creator / force-close waiting card
  waitingCard: {
    flexDirection: 'row',
    gap: S.sm,
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.lg,
    alignItems: 'flex-start',
  },
  waitingIcon: {
    fontSize: 24,
    lineHeight: 28,
  },
  waitingTitle: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  waitingText: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 20,
  },
  returnBtn: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  returnBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
