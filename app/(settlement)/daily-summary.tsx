/**
 * SynKrew — Daily Settlement Summary
 * Route: app/(settlement)/daily-summary.tsx
 *
 * Shown after daily task resolution. Displays per-member pass/fail + coin movement.
 * Entry: push notification tap OR triggered after task terminal state is reached.
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
import { router, useLocalSearchParams } from 'expo-router';
import {
  C, S, T,
  BORDER, BORDER_THIN, SHADOW_OFFSET, SHADOW_OFFSET_SM,
  hardShadow, gridBgStyle,
} from '../../theme/tokens';

// ─── Mock data — replace with real settlement API response ───────────────────
interface MemberResult {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
  isCurrentUser: boolean;
  status: 'verified' | 'failed' | 'auto_passed' | 'expired' | 'skipped';
  stakeCoin: number;
  stakePercent: number;
  balanceBefore: number;
  coinDelta: number; // positive = gained, negative = forfeited
  winShareCoin?: number; // from others' forfeits
}

const MOCK_RESULTS: MemberResult[] = [
  {
    id: 'jay_r',
    name: 'JAY_R',
    avatarLetter: 'J',
    avatarBg: C.pink,
    isCurrentUser: true,
    status: 'verified',
    stakeCoin: 72,
    stakePercent: 60,
    balanceBefore: 120,
    coinDelta: 72,
    winShareCoin: 24,
  },
  {
    id: 'sarah_x',
    name: 'SARAH_X',
    avatarLetter: 'S',
    avatarBg: C.cyan,
    isCurrentUser: false,
    status: 'verified',
    stakeCoin: 48,
    stakePercent: 60,
    balanceBefore: 80,
    coinDelta: 48,
    winShareCoin: 24,
  },
  {
    id: 'mike_99',
    name: 'MIKE_99',
    avatarLetter: 'M',
    avatarBg: C.surfaceDim,
    isCurrentUser: false,
    status: 'failed',
    stakeCoin: 48,
    stakePercent: 60,
    balanceBefore: 80,
    coinDelta: -48,
  },
];

const STATUS_CONFIG = {
  verified:    { label: 'VERIFIED',    icon: '✓', bg: C.secondaryContainer, text: '#00513a' },
  failed:      { label: 'FAILED',      icon: '✕', bg: C.errorContainer,     text: C.onErrorContainer },
  auto_passed: { label: 'AUTO-PASSED', icon: '⟳', bg: C.surfaceContainerHigh, text: C.onSurface },
  expired:     { label: 'EXPIRED',     icon: '⌛', bg: C.surfaceContainerHighest, text: C.onSurface },
  skipped:     { label: 'SKIPPED',     icon: '→', bg: C.primaryFixed,        text: C.onSurface },
} as const;

export default function DailySettlementSummary() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.group ? String(params.group) : 'MORNING RUNNERS';
  const dayNumber = params.day ? String(params.day) : '14';
  const dateStr = params.date ? String(params.date) : 'AUG 27, 2026';

  const passCount = MOCK_RESULTS.filter(m => m.status === 'verified' || m.status === 'auto_passed').length;
  const failCount = MOCK_RESULTS.filter(m => m.status === 'failed' || m.status === 'expired').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: S.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, alignSelf: 'center', gap: S.lg }}>

          {/* ─── Header Card ── */}
          <View style={[styles.headerCard, hardShadow(SHADOW_OFFSET)]}>
            <View style={[styles.headerBar, { backgroundColor: C.mint }]}>
              <View style={styles.headerDots}>
                <View style={[styles.dot, { backgroundColor: C.pink }]} />
                <View style={[styles.dot, { backgroundColor: C.white }]} />
                <View style={[styles.dot, { backgroundColor: C.mint }]} />
              </View>
              <Text style={styles.headerBarLabel}>DAILY_SETTLEMENT.EXE</Text>
              <View style={{ width: 48 }} />
            </View>

            <View style={styles.headerBody}>
              <View style={styles.headerTopRow}>
                <View>
                  <Text style={styles.groupName}>{groupName}</Text>
                  <Text style={styles.dateLabel}>{dateStr} · DAY {dayNumber}</Text>
                </View>
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillText}>{passCount}/{MOCK_RESULTS.length}</Text>
                </View>
              </View>

              {/* Aggregate stat chips */}
              <View style={styles.statRow}>
                <View style={[styles.statChip, { backgroundColor: C.secondaryContainer }]}>
                  <Text style={styles.statChipIcon}>✓</Text>
                  <Text style={styles.statChipText}>{passCount} PASSED</Text>
                </View>
                <View style={[styles.statChip, { backgroundColor: C.errorContainer }]}>
                  <Text style={styles.statChipIcon}>✕</Text>
                  <Text style={styles.statChipText}>{failCount} FAILED</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── Per-Member Results ── */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>SQUAD RESULTS</Text>
          </View>

          {MOCK_RESULTS.map((member) => {
            const cfg = STATUS_CONFIG[member.status];
            const gained = member.coinDelta >= 0;
            return (
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
                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: member.avatarBg }]}>
                    <Text style={styles.avatarLetter}>{member.avatarLetter}</Text>
                  </View>

                  {/* Name + stake info */}
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.stakeLabel}>
                      Staked {member.stakeCoin} ({member.stakePercent}% of {member.balanceBefore})
                    </Text>
                    {member.winShareCoin != null && member.winShareCoin > 0 && (
                      <View style={styles.winShareRow}>
                        <Text style={styles.winShareText}>
                          +{member.winShareCoin} WIN SHARE
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Status + delta */}
                  <View style={styles.memberRight}>
                    <View style={[styles.statusChip, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.statusChipText, { color: cfg.text }]}>
                        {cfg.icon} {cfg.label}
                      </Text>
                    </View>
                    <Text style={[styles.coinDelta, gained ? styles.coinGain : styles.coinLoss]}>
                      {gained ? '+' : ''}{member.coinDelta}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* ─── Streak Update ── */}
          <View style={[styles.streakCard, hardShadow(SHADOW_OFFSET_SM)]}>
            <View style={[styles.streakBar, { backgroundColor: C.yellow }]}>
              <View style={styles.headerDots}>
                <View style={[styles.dot, { backgroundColor: C.pink }]} />
                <View style={[styles.dot, { backgroundColor: C.white }]} />
                <View style={[styles.dot, { backgroundColor: C.mint }]} />
              </View>
              <Text style={styles.headerBarLabel}>STREAK_STATUS.EXE</Text>
              <View style={{ width: 48 }} />
            </View>
            <View style={styles.streakBody}>
              <View style={styles.streakStatRow}>
                <View style={styles.streakStat}>
                  <Text style={styles.streakStatNum}>14</Text>
                  <Text style={styles.streakStatLabel}>CURRENT</Text>
                </View>
                <View style={styles.streakDivider} />
                <View style={styles.streakStat}>
                  <Text style={styles.streakStatNum}>21</Text>
                  <Text style={styles.streakStatLabel}>LONGEST</Text>
                </View>
                <View style={styles.streakDivider} />
                <View style={styles.streakStat}>
                  <Text style={styles.streakStatNum}>58%</Text>
                  <Text style={styles.streakStatLabel}>TOWARD 75%</Text>
                </View>
              </View>

              {/* Milestone progress bar */}
              <View style={styles.milestoneTrack}>
                <View style={[styles.milestoneFill, { width: '58%' }]} />
                {/* Threshold markers */}
                <View style={[styles.milestoneMarker, { left: '50%' }]}>
                  <Text style={styles.milestoneMarkerLabel}>50%</Text>
                </View>
                <View style={[styles.milestoneMarker, { left: '75%' }]}>
                  <Text style={styles.milestoneMarkerLabel}>75%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── CTAs ── */}
          <Pressable
            testID="settlement-btn-return-group"
            style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.replace('/(groups)/detail')}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>RETURN TO GROUP →</Text>
          </Pressable>

          <Pressable
            testID="settlement-btn-view-wallet"
            style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.push('/(wallet)')}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryBtnText}>VIEW WALLET LEDGER</Text>
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

  // Header card
  headerCard: {
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
    overflow: 'hidden',
  },
  headerBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  headerDots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: BORDER_THIN, borderColor: C.black,
  },
  headerBarLabel: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  headerBody: {
    padding: S.lg,
    gap: S.md,
  },
  headerTopRow: {
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
  dateLabel: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  scorePill: {
    backgroundColor: C.mint,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: S.unit,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  scorePillText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
  },
  statRow: {
    flexDirection: 'row',
    gap: S.xs,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.xs,
    paddingVertical: 4,
  },
  statChipIcon: {
    ...T.labelSm,
    color: C.black,
  },
  statChipText: {
    ...T.labelSm,
    color: C.black,
  },

  // Section label
  sectionLabel: {
    marginTop: S.xs,
  },
  sectionLabelText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
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
    alignItems: 'flex-start',
    gap: S.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
  },
  memberName: {
    ...T.label,
    color: C.onSurface,
    fontWeight: '800',
  },
  stakeLabel: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
  },
  winShareRow: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  winShareText: {
    ...T.labelXs,
    color: '#00513a',
    fontWeight: '800',
  },
  memberRight: {
    alignItems: 'flex-end',
    gap: S.unit,
  },
  statusChip: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusChipText: {
    ...T.labelXs,
    fontWeight: '800',
  },
  coinDelta: {
    ...T.label,
    fontWeight: '800',
  },
  coinGain: { color: '#006c4e' },
  coinLoss: { color: C.error },

  // Streak card
  streakCard: {
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
    backgroundColor: C.surfaceContainerLowest,
  },
  streakBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  streakBody: {
    padding: S.lg,
    gap: S.md,
  },
  streakStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  streakStat: {
    alignItems: 'center',
    gap: 4,
  },
  streakStatNum: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.onSurface,
  },
  streakStatLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },
  streakDivider: {
    width: 2,
    height: 32,
    backgroundColor: C.black,
  },

  // Milestone progress bar — hollow frame with block fill
  milestoneTrack: {
    height: 16,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerHigh,
    position: 'relative',
    overflow: 'hidden',
  },
  milestoneFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: C.cyan,
  },
  milestoneMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: BORDER,
    backgroundColor: C.black,
    alignItems: 'center',
  },
  milestoneMarkerLabel: {
    ...T.labelXs,
    fontSize: 8,
    color: C.black,
    position: 'absolute',
    bottom: -14,
  },

  // Buttons
  primaryBtn: {
    width: '100%',
    backgroundColor: C.mint,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
