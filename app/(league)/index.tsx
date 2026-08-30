/**
 * SynKrew — League Standings (Full Screen)
 * Route: app/(league)/index.tsx
 *
 * Four view states, switched by `viewState` prop:
 *   'standings'    : Season active, groups ranked (main state)
 *   'season_off'   : Season not yet started
 *   'not_ranked'   : Group has insufficient data to rank (< 1 completed cycle)
 *   'loading'      : First load skeleton OR offline with cached data
 *
 * Mixed state (some groups ranked, some not): both can appear in the same list.
 * Unranked groups shown below ranked groups with a distinct "pending ranking" row.
 *
 * League points formula (50% task consistency + 50% verification consistency):
 * // TODO: replace with real league standings feed once points formula is confirmed
 *
 * Entry points:
 *   - Bottom nav League tab
 *   - Group Detail league widget tap-through
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
import { OfflineBanner } from '../../components/ui/OfflineBanner';
import { SkeletonBlock, SkeletonRow } from '../../components/ui/Skeleton';
import { BottomNavBar, BOTTOM_NAV_BASE_HEIGHT } from '../../components/groups/BottomNavBar';
import { useLeagueStandingsQuery } from '../../hooks/queries/useLeague';

export type LeagueViewState = 'standings' | 'season_off' | 'not_ranked' | 'loading';

// ─── Mock league data ─────────────────────────────────────────────────────────
// TODO: replace with real league standings feed once points formula is confirmed
interface LeagueEntry {
  rank: number;
  groupId: string;
  groupName: string;
  points: number;
  passRate: number;
  verifyRate: number;
  memberCount: number;
  rankChange: number; // positive = moved up, negative = moved down
  isCurrentUserGroup: boolean;
  isUnranked?: boolean;
}

const MOCK_STANDINGS: LeagueEntry[] = [
  {
    rank: 1,
    groupId: 'apex_grind',
    groupName: 'APEX GRIND',
    points: 982,
    passRate: 94,
    verifyRate: 91,
    memberCount: 8,
    rankChange: 0,
    isCurrentUserGroup: false,
  },
  {
    rank: 2,
    groupId: 'code_monks',
    groupName: 'CODE MONKS',
    points: 947,
    passRate: 91,
    verifyRate: 88,
    memberCount: 5,
    rankChange: 2,
    isCurrentUserGroup: false,
  },
  {
    rank: 3,
    groupId: 'morning_runners',
    groupName: 'MORNING RUNNERS',
    points: 891,
    passRate: 87,
    verifyRate: 82,
    memberCount: 3,
    rankChange: -1,
    isCurrentUserGroup: true,
  },
  {
    rank: 4,
    groupId: 'night_owls',
    groupName: 'NIGHT OWLS',
    points: 834,
    passRate: 80,
    verifyRate: 79,
    memberCount: 7,
    rankChange: 1,
    isCurrentUserGroup: false,
  },
  {
    rank: 5,
    groupId: 'crypto_fam',
    groupName: 'CRYPTO FAM',
    points: 701,
    passRate: 72,
    verifyRate: 65,
    memberCount: 6,
    rankChange: -2,
    isCurrentUserGroup: false,
  },
  // Mixed state example: unranked group (< 1 cycle completed)
  {
    rank: 0,
    groupId: 'code_grind',
    groupName: 'CODE GRIND',
    points: 0,
    passRate: 0,
    verifyRate: 0,
    memberCount: 2,
    rankChange: 0,
    isCurrentUserGroup: true,
    isUnranked: true,
  },
];

export default function LeagueStandings() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const { data: serverStandings } = useLeagueStandingsQuery();

  // Demo state switcher
  const [viewState, setViewState] = useState<LeagueViewState>('standings');

  const activeStandings = serverStandings?.standings && serverStandings.standings.length > 0
    ? serverStandings.standings.map(s => ({
        rank: s.rank,
        groupId: s.groupId,
        groupName: s.groupName,
        points: s.points,
        passRate: s.taskConsistencyPercent,
        verifyRate: s.verificationConsistencyPercent,
        memberCount: 5,
        rankChange: s.rank === 1 ? 0 : 1,
        isCurrentUserGroup: s.groupId === 'grp_neon_runners',
        isUnranked: false,
      }))
    : MOCK_STANDINGS;

  const rankedGroups = activeStandings.filter(g => !g.isUnranked);
  const unrankedGroups = activeStandings.filter(g => g.isUnranked);
  const myGroup = activeStandings.find(g => g.isCurrentUserGroup && !g.isUnranked);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={[styles.topBarInner, { maxWidth: cardWidth + S.md * 2 }]}>
          <Pressable
            testID="league-btn-back"
            style={[styles.backBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.replace('/(groups)')}
            accessibilityRole="button"
            accessibilityLabel="Back to groups"
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topBarTitle}>LEAGUE_STANDINGS.EXE</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* State demo bar */}
      <View style={styles.demoBar}>
        <Text style={styles.demoBarLabel}>VIEW STATE:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoBarScroll}>
          {(['standings', 'season_off', 'not_ranked', 'loading'] as LeagueViewState[]).map(state => (
            <Pressable
              key={state}
              style={[styles.demoChip, viewState === state && styles.demoChipActive]}
              onPress={() => setViewState(state)}
            >
              <Text style={[styles.demoChipText, viewState === state && styles.demoChipTextActive]}>
                {state.replace(/_/g, ' ')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: BOTTOM_NAV_BASE_HEIGHT + insets.bottom + S.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, alignSelf: 'center', gap: S.lg }}>

          {/* ═══════════════ LOADING STATE ═══════════════ */}
          {viewState === 'loading' && (
            <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
              <TitleBar label="LEAGUE_STANDINGS.EXE" color="lavender" />
              <View style={styles.cardBody}>
                {/* Offline notice */}
                <OfflineBanner
                  label="LOADING — SHOWING CACHED DATA"
                  style={{ marginBottom: S.sm }}
                />
                {/* Skeleton rows */}
                {[1, 2, 3, 4].map(i => (
                  <SkeletonRow key={i} />
                ))}
              </View>
            </View>
          )}

          {/* ═══════════════ SEASON NOT STARTED ═══════════════ */}
          {viewState === 'season_off' && (
            <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
              <View style={[styles.titleBar, { backgroundColor: C.cyan }]}>
                <View style={styles.dots}>
                  <View style={[styles.dot, { backgroundColor: C.pink }]} />
                  <View style={[styles.dot, { backgroundColor: C.white }]} />
                  <View style={[styles.dot, { backgroundColor: C.mint }]} />
                </View>
                <Text style={styles.titleBarLabel}>LEAGUE_STANDINGS.EXE</Text>
                <View style={{ width: 48 }} />
              </View>
              <View style={[styles.cardBody, { alignItems: 'center', gap: S.lg }]}>
                <View style={[styles.emptyIconFrame, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={styles.emptyIcon}>🏆</Text>
                </View>
                <View style={{ alignItems: 'center', gap: S.xs }}>
                  <Text style={styles.emptyHeadline}>SEASON NOT STARTED</Text>
                  <Text style={styles.emptyBody}>
                    The current league season hasn't begun yet. Complete at least one full cycle to earn your group a ranking.
                  </Text>
                </View>
                <View style={styles.seasonInfoBox}>
                  <Text style={styles.seasonInfoLabel}>SEASON OPENS WHEN</Text>
                  <Text style={styles.seasonInfoText}>
                    Your group completes its first full cycle and enough groups have data for standings to be meaningful.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ═══════════════ GROUP NOT YET RANKED ═══════════════ */}
          {viewState === 'not_ranked' && (
            <>
              {/* This shows the ranked groups + the unranked group row side by side */}
              <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
                <View style={[styles.titleBar, { backgroundColor: C.yellow }]}>
                  <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: C.pink }]} />
                    <View style={[styles.dot, { backgroundColor: C.white }]} />
                    <View style={[styles.dot, { backgroundColor: C.mint }]} />
                  </View>
                  <Text style={styles.titleBarLabel}>LEAGUE_STANDINGS.EXE</Text>
                  <View style={{ width: 48 }} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.sectionSublabel}>SEASON 1 · ACTIVE</Text>
                  {/* Show some ranked entries */}
                  {rankedGroups.slice(0, 3).map((entry) => (
                    <LeagueRow key={entry.groupId} entry={entry} />
                  ))}
                  {/* Unranked group(s) — below ranked, distinct treatment */}
                  <View style={styles.unrankedDivider}>
                    <Text style={styles.unrankedDividerLabel}>NOT YET RANKED</Text>
                  </View>
                  {unrankedGroups.map((entry) => (
                    <View
                      key={entry.groupId}
                      style={[styles.unrankedRow, entry.isCurrentUserGroup && styles.unrankedRowSelf]}
                    >
                      <View style={styles.unrankedRankBox}>
                        <Text style={styles.unrankedRankText}>—</Text>
                      </View>
                      <Text style={styles.rankRowName}>{entry.groupName}</Text>
                      <View style={styles.pendingChip}>
                        <Text style={styles.pendingChipText}>RANKING STARTS AFTER CYCLE 1</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* ═══════════════ FULL STANDINGS ═══════════════ */}
          {viewState === 'standings' && (
            <>
              {/* My group highlight if ranked */}
              {myGroup && (
                <View style={[styles.myGroupHighlight, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={styles.myGroupLabel}>YOUR GROUP</Text>
                  <Text style={styles.myGroupName}>{myGroup.groupName}</Text>
                  <View style={styles.myGroupStats}>
                    <Text style={styles.myGroupRank}>RANK #{myGroup.rank}</Text>
                    <Text style={styles.myGroupPoints}>{myGroup.points} PTS</Text>
                    <Text style={[
                      styles.myGroupChange,
                      myGroup.rankChange > 0 ? styles.rankUp : myGroup.rankChange < 0 ? styles.rankDown : styles.rankSame,
                    ]}>
                      {myGroup.rankChange > 0 ? `▲ +${myGroup.rankChange}` : myGroup.rankChange < 0 ? `▼ ${myGroup.rankChange}` : '— STABLE'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Standings list */}
              <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
                <View style={[styles.titleBar, { backgroundColor: C.yellow }]}>
                  <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: C.pink }]} />
                    <View style={[styles.dot, { backgroundColor: C.white }]} />
                    <View style={[styles.dot, { backgroundColor: C.mint }]} />
                  </View>
                  <Text style={styles.titleBarLabel}>GLOBAL_LEAGUE.EXE</Text>
                  <View style={{ width: 48 }} />
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.sectionSublabel}>SEASON 1 · ACTIVE</Text>
                  <View style={styles.columnHeaders}>
                    <Text style={[styles.colHeader, { flex: 1 }]}>GROUP</Text>
                    <Text style={[styles.colHeader, { width: 48, textAlign: 'right' }]}>PTS</Text>
                    <Text style={[styles.colHeader, { width: 40, textAlign: 'right' }]}>RANK</Text>
                  </View>

                  {rankedGroups.map((entry) => (
                    <LeagueRow key={entry.groupId} entry={entry} />
                  ))}

                  {/* Unranked group mixed state */}
                  {unrankedGroups.length > 0 && (
                    <>
                      <View style={styles.unrankedDivider}>
                        <Text style={styles.unrankedDividerLabel}>NOT YET RANKED</Text>
                      </View>
                      {unrankedGroups.map((entry) => (
                        <View
                          key={entry.groupId}
                          style={[styles.unrankedRow, entry.isCurrentUserGroup && styles.unrankedRowSelf]}
                        >
                          <View style={styles.unrankedRankBox}>
                            <Text style={styles.unrankedRankText}>—</Text>
                          </View>
                          <Text style={[styles.rankRowName, { flex: 1 }]}>{entry.groupName}</Text>
                          <View style={styles.pendingChip}>
                            <Text style={styles.pendingChipText}>AFTER CYCLE 1</Text>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              </View>

              {/* Points formula disclaimer */}
              <View style={styles.formulaDisclaimer}>
                <Text style={styles.formulaDisclaimerText}>
                  {/* TODO: replace with real league standings feed once points formula is confirmed */}
                  ℹ Points based on group task consistency + verification participation. Formula pending final confirmation.
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <BottomNavBar activeTab="league" />
    </SafeAreaView>
  );
}

// ─── League Row sub-component ─────────────────────────────────────────────────
function LeagueRow({ entry }: { entry: LeagueEntry }) {
  const isSelf = entry.isCurrentUserGroup;
  return (
    <View style={[rowStyles.row, isSelf && rowStyles.rowSelf]}>
      {/* Rank box */}
      <View style={[rowStyles.rankBox, entry.rank <= 3 && rowStyles.rankBoxTop]}>
        <Text style={rowStyles.rankText}>#{entry.rank}</Text>
      </View>

      {/* Group name + meta */}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={rowStyles.groupName}>{entry.groupName}</Text>
        <Text style={rowStyles.groupMeta}>{entry.memberCount} members</Text>
      </View>

      {/* Points */}
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text style={rowStyles.points}>{entry.points}</Text>
        <Text style={[
          rowStyles.rankChange,
          entry.rankChange > 0 ? rowStyles.rankUp : entry.rankChange < 0 ? rowStyles.rankDown : rowStyles.rankSame,
        ]}>
          {entry.rankChange > 0 ? `▲+${entry.rankChange}` : entry.rankChange < 0 ? `▼${entry.rankChange}` : '—'}
        </Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    paddingVertical: S.xs,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.surfaceContainerHigh,
  },
  rowSelf: {
    backgroundColor: C.primaryFixed,
    marginHorizontal: -S.lg,
    paddingHorizontal: S.lg,
  },
  rankBox: {
    width: 32,
    height: 32,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBoxTop: {
    backgroundColor: C.yellow,
  },
  rankText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  groupName: {
    ...T.label,
    color: C.onSurface,
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  groupMeta: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },
  points: {
    ...T.label,
    color: C.onSurface,
    fontWeight: '800',
  },
  rankChange: {
    ...T.labelXs,
    fontWeight: '800',
  },
  rankUp: { color: '#006c4e' },
  rankDown: { color: C.error },
  rankSame: { color: C.onSurfaceVariant },
});

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
  // State demo bar
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
    flexShrink: 0,
  },
  demoBarScroll: {
    gap: S.unit,
  },
  demoChip: {
    paddingHorizontal: S.xs,
    paddingVertical: 2,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
  },
  demoChipActive: {
    backgroundColor: C.pink,
  },
  demoChipText: {
    ...T.labelXs,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  demoChipTextActive: {
    color: C.black,
    fontWeight: '800',
  },
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
    gap: S.xs,
  },
  sectionSublabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: S.xs,
  },
  columnHeaders: {
    flexDirection: 'row',
    paddingBottom: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    marginBottom: S.xs,
  },
  colHeader: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // My group highlight
  myGroupHighlight: {
    backgroundColor: C.primaryFixed,
    borderWidth: BORDER,
    borderColor: C.primary,
    padding: S.md,
    gap: 4,
  },
  myGroupLabel: {
    ...T.labelXs,
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  myGroupName: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  myGroupStats: {
    flexDirection: 'row',
    gap: S.md,
    alignItems: 'center',
  },
  myGroupRank: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
  },
  myGroupPoints: {
    ...T.label,
    color: C.onSurface,
  },
  myGroupChange: {
    ...T.labelSm,
    fontWeight: '800',
  },
  rankUp: { color: '#006c4e' },
  rankDown: { color: C.error },
  rankSame: { color: C.onSurfaceVariant },
  // Unranked
  unrankedDivider: {
    marginTop: S.sm,
    marginBottom: S.xs,
    borderTopWidth: BORDER_THIN,
    borderTopColor: C.black,
    paddingTop: S.xs,
  },
  unrankedDividerLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  unrankedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    paddingVertical: S.xs,
    opacity: 0.7,
  },
  unrankedRowSelf: {
    opacity: 1,
    backgroundColor: C.primaryFixed,
    marginHorizontal: -S.lg,
    paddingHorizontal: S.lg,
  },
  unrankedRankBox: {
    width: 32,
    height: 32,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unrankedRankText: {
    ...T.label,
    color: C.onSurfaceVariant,
  },
  rankRowName: {
    ...T.label,
    color: C.onSurface,
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  pendingChip: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingChipText: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontSize: 9,
  },
  // Empty/season states
  emptyIconFrame: {
    width: 80,
    height: 80,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: { fontSize: 36 },
  emptyHeadline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  emptyBody: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
  },
  seasonInfoBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.md,
    gap: S.xs,
  },
  seasonInfoLabel: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  seasonInfoText: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 20,
  },
  // Formula disclaimer
  formulaDisclaimer: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.xs,
  },
  formulaDisclaimerText: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontSize: 10,
    lineHeight: 14,
  },
  // Skeleton
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    paddingVertical: S.xs,
  },
  offlineBanner: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.xs,
    marginBottom: S.xs,
  },
  offlineBannerText: {
    ...T.labelXs,
    color: C.onSurface,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
