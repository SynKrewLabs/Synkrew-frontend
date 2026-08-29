/**
 * SynKrew — Group Detail Screen
 * Route: app/(groups)/detail.tsx
 *
 * Implements 4 state variants:
 *   1. Active (Default): Normal daily mission & proof capture
 *   2. Paused: Status banner, task actions suspended, cycle on hold
 *   3. Archived (Read-Only): Closed record chrome, no action affordances rendered
 *   4. Cycle Ended: Role-based branching (Creator sees "Initialize Next Cycle", Member sees waiting message)
 */

import React, { useState } from 'react';
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
} from '../../theme/tokens';
import { BottomNavBar } from '../../components/groups/BottomNavBar';
import { TodaysTaskCard } from '../../components/task/TodaysTaskCard';
import { LeagueWidget } from '../../components/groups/LeagueWidget';

export type GroupLifecycleState = 'active' | 'paused' | 'archived' | 'cycle_ended_creator' | 'cycle_ended_member';

interface SquadMember {
  id: string;
  name: string;
  isCurrentUser: boolean;
  streakDays: number;
  status: 'verified' | 'pending' | 'failed';
  avatarLetter: string;
  avatarBg: string;
}

const SQUAD_MEMBERS: SquadMember[] = [
  {
    id: 'jay_r',
    name: 'JAY_R',
    isCurrentUser: true,
    streakDays: 12,
    status: 'verified',
    avatarLetter: 'J',
    avatarBg: C.pink,
  },
  {
    id: 'sarah_x',
    name: 'SARAH_X',
    isCurrentUser: false,
    streakDays: 4,
    status: 'pending',
    avatarLetter: 'S',
    avatarBg: C.cyan,
  },
  {
    id: 'mike_99',
    name: 'MIKE_99',
    isCurrentUser: false,
    streakDays: 0,
    status: 'failed',
    avatarLetter: 'M',
    avatarBg: C.surfaceDim,
  },
];

export default function GroupDetailScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const [lifecycleState, setLifecycleState] = useState<GroupLifecycleState>(() => {
    if (params.state === 'paused') return 'paused';
    if (params.state === 'archived') return 'archived';
    if (params.state === 'cycle_ended') return 'cycle_ended_creator';
    return 'active';
  });

  const groupName = params.name ? String(params.name) : 'MORNING RUNNERS';
  const membersLabel = params.members ? String(params.members) : '8 MEMBERS';

  const isArchived = lifecycleState === 'archived';
  const isPaused = lifecycleState === 'paused';
  const isCycleEndedCreator = lifecycleState === 'cycle_ended_creator';
  const isCycleEndedMember = lifecycleState === 'cycle_ended_member';

  const handleStartNextCycle = () => {
    Alert.alert('NEW CYCLE PROTOCOL', 'Next 30-day synchronization cycle initialized! Fresh tasks generated.', [
      { text: 'CONFIRM', onPress: () => setLifecycleState('active') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Top Bar with Back Button & Settings Cog */}
      <View style={styles.topBar}>
        <View style={styles.topBarInner}>
          <Pressable
            testID="group-detail-btn-back"
            style={[styles.backBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.replace('/(groups)')}
            accessibilityRole="button"
            accessibilityLabel="Back to groups"
          >
            <Text style={styles.backBtnArrow}>←</Text>
          </Pressable>

          <Text style={styles.topBarTitle}>
            {isArchived ? 'ARCHIVED_PACT.EXE' : 'PACT_DETAIL.EXE'}
          </Text>

          {/* Settings Cog (Creator Only) */}
          <Pressable
            testID="group-detail-btn-settings"
            style={[styles.settingsBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.push({ pathname: '/(groups)/settings', params: { name: groupName, state: lifecycleState } })}
            accessibilityRole="button"
            accessibilityLabel="Group Settings"
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      {/* Lifecycle State Demo Switcher */}
      <View style={styles.demoBar}>
        <Text style={styles.demoLabel}>STATE DEMO:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
          {(['active', 'paused', 'archived', 'cycle_ended_creator', 'cycle_ended_member'] as GroupLifecycleState[]).map(state => (
            <Pressable
              key={state}
              testID={`detail-state-${state}`}
              style={[styles.demoChip, lifecycleState === state && styles.demoChipActive]}
              onPress={() => setLifecycleState(state)}
            >
              <Text style={[styles.demoChipText, lifecycleState === state && styles.demoChipTextActive]}>
                {state.replace(/_/g, ' ').toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ─── State Specific Top Banners ─── */}
      {isPaused && (
        <View testID="detail-banner-paused" style={styles.pausedBanner}>
          <Text style={styles.bannerIcon}>⚠️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>PACT PAUSED // HOLD ACTIVE</Text>
            <Text style={styles.bannerText}>
              Cycle on hold by administrator. No new task instances will generate until resumed.
            </Text>
          </View>
        </View>
      )}

      {isArchived && (
        <View testID="detail-banner-archived" style={styles.archivedBanner}>
          <Text style={styles.bannerIcon}>📁</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>ARCHIVED PACT // READ-ONLY MODE</Text>
            <Text style={styles.bannerText}>
              This pact has been permanently closed. Historical records and stats are preserved.
            </Text>
          </View>
        </View>
      )}

      {(isCycleEndedCreator || isCycleEndedMember) && (
        <View testID="detail-banner-cycle-ended" style={styles.cycleEndedBanner}>
          <Text style={styles.bannerIcon}>🏁</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>CYCLE 1 COMPLETED</Text>
            <Text style={styles.bannerText}>
              All rituals concluded. Stakes have been tallied in the league vault.
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, gap: S.lg }}>
          {/* Group Hero Section */}
          <View testID="group-detail-hero" style={styles.heroSection}>
            <View style={[styles.heroAvatarBox, isArchived && { backgroundColor: C.surfaceDim }, hardShadow(SHADOW_OFFSET)]}>
              <Text style={styles.heroAvatarIcon}>{isArchived ? '📁' : '👟'}</Text>
            </View>

            <View style={styles.heroInfo}>
              <Text style={[styles.heroTitle, isArchived && { color: C.onSurfaceVariant }]}>
                {groupName.toUpperCase()}
              </Text>
              <View style={styles.heroBadgesRow}>
                <View style={[styles.heroTagPink, isArchived && { backgroundColor: C.surfaceContainerHigh }]}>
                  <Text style={styles.heroTagPinkText}>FITNESS</Text>
                </View>
                <View style={[styles.heroTagMint, isArchived && { backgroundColor: C.surfaceContainerHigh }]}>
                  <Text style={styles.heroTagMintText}>{membersLabel.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── Cycle Ended State Actions ─── */}
          {isCycleEndedCreator && (
            <View testID="detail-cycle-ended-creator-box" style={[styles.cycleCtaBox, hardShadow(SHADOW_OFFSET)]}>
              <Text style={styles.cycleCtaTitle}>INITIALIZE CYCLE 2</Text>
              <Text style={styles.cycleCtaDesc}>
                As Krew Creator, start the next 30-day synchronization cycle for your members.
              </Text>
              <Pressable
                testID="detail-btn-start-next-cycle"
                style={[styles.startCycleBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleStartNextCycle}
              >
                <Text style={styles.startCycleBtnText}>LAUNCH NEXT CYCLE →</Text>
              </Pressable>
            </View>
          )}

          {isCycleEndedMember && (
            <View testID="detail-cycle-ended-member-box" style={[styles.waitingCycleBox, hardShadow(SHADOW_OFFSET)]}>
              <Text style={styles.waitingCycleIcon}>⏳</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.waitingCycleTitle}>WAITING FOR CREATOR</Text>
                <Text style={styles.waitingCycleText}>
                  Awaiting administrator (@KrewMaster99) to initiate the next cycle protocol.
                </Text>
              </View>
            </View>
          )}

          {/* ─── Today's Mission Card (State Machine) ─── */}
          {!isArchived && !isPaused && (
            <TodaysTaskCard
              initialState={params.taskState ? (params.taskState as any) : 'not_started'}
              taskTitle="5K Outdoor Run"
              taskDesc="Complete a 5 kilometer run before 8:00 AM. Route tracking must be visible in proof submission."
              targetMetric="0.0 / 5.0 KM"
            />
          )}

          {isPaused && (
            <View testID="group-detail-mission-paused" style={[styles.missionCard, hardShadow(SHADOW_OFFSET)]}>
              <View style={[styles.missionHeader, { backgroundColor: '#fff3cd' }]}>
                <View style={styles.missionHeaderLeft}>
                  <Text style={styles.missionHeaderIcon}>⏸️</Text>
                  <Text style={styles.missionHeaderTitle}>TODAY'S MISSION (HOLD)</Text>
                </View>
              </View>
              <View style={styles.missionBody}>
                <Text style={styles.missionName}>5K Outdoor Run</Text>
                <View style={styles.pausedNoticeBox}>
                  <Text style={styles.pausedNoticeText}>TASK SUBMISSIONS SUSPENDED WHILE PACT IS PAUSED</Text>
                </View>
              </View>
            </View>
          )}

          {isArchived && (
            <View testID="group-detail-mission-archived" style={[styles.missionCard, { opacity: 0.85 }, hardShadow(SHADOW_OFFSET)]}>
              <View style={[styles.missionHeader, { backgroundColor: C.surfaceContainerHigh }]}>
                <View style={styles.missionHeaderLeft}>
                  <Text style={styles.missionHeaderIcon}>📁</Text>
                  <Text style={styles.missionHeaderTitle}>TODAY'S MISSION (CLOSED)</Text>
                </View>
              </View>
              <View style={styles.missionBody}>
                <Text style={styles.missionName}>5K Outdoor Run</Text>
                <View style={styles.archivedNoticeBox}>
                  <Text style={styles.archivedNoticeText}>🔒 CLOSED ARCHIVE — SUBMISSIONS DISABLED</Text>
                </View>
              </View>
            </View>
          )}

          {/* Global League Widget (Embedded) */}
          <LeagueWidget
            rank={42}
            points={891}
            rankChange={3}
            tierName="BRONZE DIVISION"
            isUnranked={false}
          />

          {/* Squad Status List */}
          <View style={styles.squadSection}>
            <Text style={styles.squadHeadline}>SQUAD STATUS</Text>

            <View style={styles.squadList}>
              {SQUAD_MEMBERS.map(member => (
                <View
                  key={member.id}
                  style={[styles.memberCard, hardShadow(SHADOW_OFFSET_SM)]}
                >
                  {member.isCurrentUser && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>YOU</Text>
                    </View>
                  )}

                  <View style={styles.memberLeft}>
                    <View
                      style={[
                        styles.memberAvatar,
                        { backgroundColor: member.avatarBg },
                      ]}
                    >
                      <Text style={styles.memberAvatarLetter}>
                        {member.avatarLetter}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <View style={styles.memberStreakRow}>
                        <Text style={styles.memberStreakIcon}>
                          {member.status === 'failed' ? '💔' : '🔥'}
                        </Text>
                        <Text
                          style={[
                            styles.memberStreakText,
                            member.status === 'failed' && styles.memberStreakFailed,
                          ]}
                        >
                          {member.streakDays} DAY STREAK
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Status chip */}
                  <View
                    style={[
                      styles.memberStatusChip,
                      member.status === 'verified' && styles.statusChipVerified,
                      member.status === 'pending' && styles.statusChipPending,
                      member.status === 'failed' && styles.statusChipFailed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.memberStatusText,
                        member.status === 'verified' && { color: '#00513a' },
                        member.status === 'pending' && { color: C.onSurfaceVariant },
                        member.status === 'failed' && { color: C.white },
                      ]}
                    >
                      {member.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Nav Bar */}
      <BottomNavBar activeTab="groups" />
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
    backgroundColor: C.surface,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    ...hardShadow(SHADOW_OFFSET),
    zIndex: 50,
  },
  topBarInner: {
    height: 56,
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnArrow: {
    fontSize: 20,
    fontWeight: '900',
    color: C.black,
  },
  topBarTitle: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.black,
    letterSpacing: 1,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },

  // Demo bar
  demoBar: {
    backgroundColor: C.surfaceContainerHigh,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  demoLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    marginRight: 6,
    fontWeight: '800',
  },
  demoScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  demoChip: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  demoChipActive: {
    backgroundColor: C.pink,
  },
  demoChipText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '700',
  },
  demoChipTextActive: {
    fontWeight: '900',
  },

  // Banners
  pausedBanner: {
    backgroundColor: '#fff3cd',
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  archivedBanner: {
    backgroundColor: C.surfaceDim,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  cycleEndedBanner: {
    backgroundColor: C.secondaryContainer,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  bannerIcon: {
    fontSize: 18,
  },
  bannerTitle: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bannerText: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    lineHeight: 13,
  },

  scrollContent: {
    paddingHorizontal: S.md,
    paddingVertical: S.lg,
    alignItems: 'center',
    paddingBottom: 40,
  },

  // Hero section
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  heroAvatarBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: C.cyan,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarIcon: {
    fontSize: 34,
  },
  heroInfo: {
    flex: 1,
    gap: 6,
  },
  heroTitle: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.black,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  heroTagPink: {
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heroTagPinkText: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  heroTagMint: {
    backgroundColor: C.mint,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heroTagMintText: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },

  // Cycle CTA boxes
  cycleCtaBox: {
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    padding: S.md,
    gap: S.xs,
  },
  cycleCtaTitle: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.black,
    letterSpacing: 1,
  },
  cycleCtaDesc: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.black,
  },
  startCycleBtn: {
    backgroundColor: C.black,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  startCycleBtnText: {
    ...T.labelSm,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  waitingCycleBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  waitingCycleIcon: {
    fontSize: 28,
  },
  waitingCycleTitle: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '800',
  },
  waitingCycleText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },

  // Today's Mission OS Card
  missionCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    borderRadius: 16,
    overflow: 'hidden',
  },
  missionHeader: {
    height: 40,
    backgroundColor: C.secondaryContainer,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  missionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  missionHeaderIcon: {
    fontSize: 16,
  },
  missionHeaderTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  missionTime: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontSize: 11,
  },
  missionBody: {
    padding: S.md,
    gap: S.md,
  },
  missionName: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
  },
  missionDesc: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
  },
  missionStatusBox: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  missionStatusDot: {
    fontSize: 14,
    color: C.outline,
  },
  missionStatusLabel: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  missionMetric: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },
  captureProofBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.xs,
  },
  captureProofIcon: {
    fontSize: 20,
  },
  captureProofText: {
    ...T.label,
    fontSize: 15,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  pausedNoticeBox: {
    backgroundColor: C.surfaceDim,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    alignItems: 'center',
  },
  pausedNoticeText: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '800',
  },
  archivedNoticeBox: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
    alignItems: 'center',
  },
  archivedNoticeText: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },

  // League widget
  leagueWidget: {
    backgroundColor: C.white,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    borderRadius: 16,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  trophyBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.cyan,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyIcon: {
    fontSize: 26,
  },
  leagueContent: {
    flex: 1,
    gap: 2,
  },
  leagueTag: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontSize: 10,
  },
  leagueRankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leagueRank: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.black,
  },
  leagueGain: {
    ...T.labelXs,
    color: '#00a86b',
    fontWeight: '800',
  },
  leagueProgressTrack: {
    height: 10,
    backgroundColor: C.surfaceContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 4,
  },
  leagueProgressFill: {
    width: '65%',
    height: '100%',
    backgroundColor: C.pink,
  },

  // Squad Status
  squadSection: {
    gap: S.sm,
  },
  squadHeadline: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    paddingBottom: 6,
  },
  squadList: {
    gap: S.xs,
  },
  memberCard: {
    backgroundColor: C.white,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    borderRadius: 12,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  youBadge: {
    position: 'absolute',
    top: -8,
    right: S.md,
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  youBadgeText: {
    ...T.labelXs,
    fontSize: 9,
    fontWeight: '900',
    color: C.black,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarLetter: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.black,
  },
  memberName: {
    ...T.labelSm,
    fontSize: 14,
    color: C.black,
    fontWeight: '800',
  },
  memberStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  memberStreakIcon: {
    fontSize: 12,
  },
  memberStreakText: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '700',
  },
  memberStreakFailed: {
    color: '#ba1a1a',
    textDecorationLine: 'line-through',
  },
  memberStatusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderRadius: 6,
  },
  statusChipVerified: {
    backgroundColor: C.mint,
  },
  statusChipPending: {
    backgroundColor: C.surfaceContainerHigh,
  },
  statusChipFailed: {
    backgroundColor: C.error,
  },
  memberStatusText: {
    ...T.labelXs,
    fontSize: 10,
    fontWeight: '800',
  },
});
