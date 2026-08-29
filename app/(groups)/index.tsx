/**
 * SynKrew — Groups List Screen
 * Route: app/(groups)/index.tsx
 *
 * Implements 4 distinct states according to Stitch and UX Plan:
 *   1. Populated (active pacts: "Morning Runners", "Code Grind", streaks, FAB)
 *   2. Empty / First-Run (zero pacts, retro group_off icon, Create / Join CTAs)
 *   3. Loading Skeleton (flat-fill blocks, opacity pulse, no soft gradients)
 *   4. Offline Mode (cached pacts, persistent offline warning banner, disabled actions)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
import { TitleBar } from '../../components/ui/TitleBar';
import { BottomNavBar, BOTTOM_NAV_BASE_HEIGHT } from '../../components/groups/BottomNavBar';

type GroupsViewState = 'populated' | 'empty' | 'loading' | 'offline';

interface PactSummary {
  id: string;
  code: string;
  name: string;
  completedMembers: number;
  totalMembers: number;
  streakDays: number;
  status: 'synced' | 'pending';
  barColor: 'mint' | 'cyan' | 'pink';
  avatars: { label: string; bg: string }[];
}

const SAMPLE_PACTS: PactSummary[] = [
  {
    id: 'morning_runners',
    code: 'PACT_ALPHA',
    name: 'Morning Runners',
    completedMembers: 3,
    totalMembers: 4,
    streakDays: 12,
    status: 'synced',
    barColor: 'mint',
    avatars: [
      { label: 'A', bg: C.cyan },
      { label: 'B', bg: C.pink },
      { label: 'C', bg: C.surfaceDim },
    ],
  },
  {
    id: 'code_grind',
    code: 'PACT_BETA',
    name: 'Code Grind',
    completedMembers: 1,
    totalMembers: 2,
    streakDays: 5,
    status: 'pending',
    barColor: 'cyan',
    avatars: [
      { label: 'X', bg: C.cyan },
      { label: 'Y', bg: C.pink },
    ],
  },
];

// Session cache flag: Skeleton is shown once per session
let hasLoadedInSession = false;

export default function GroupsListScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const [viewState, setViewState] = useState<GroupsViewState>(() => {
    if (!hasLoadedInSession) {
      hasLoadedInSession = true;
      return 'populated'; // We can switch or demo loading via state switcher
    }
    return 'populated';
  });

  // Pulse animation for skeleton
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    if (viewState === 'loading') {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.85,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.35,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
  }, [viewState, pulseAnim]);

  const isOffline = viewState === 'offline';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(20, 0.06)]} pointerEvents="none" />

      {/* Top Application Bar */}
      <View style={styles.topAppBar}>
        <View style={styles.topAppBarInner}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/(notifications)')}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Text style={styles.appBarIconText}>🔔</Text>
          </Pressable>

          <Text style={styles.appTitle}>SYNKREW</Text>

          <Pressable
            style={styles.avatarCircle}
            onPress={() => router.push('/(profile)')}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <Text style={styles.avatarText}>U</Text>
          </Pressable>
        </View>
      </View>

      {/* State Switcher for quick inspection of all 4 states */}
      <View style={styles.devBar}>
        <Text style={styles.devBarLabel}>STATE DEMO:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.devScroll}>
          {(['populated', 'empty', 'loading', 'offline'] as GroupsViewState[]).map(state => (
            <Pressable
              key={state}
              testID={`groups-state-${state}`}
              style={[styles.devChip, viewState === state && styles.devChipActive]}
              onPress={() => setViewState(state)}
            >
              <Text style={[styles.devChipText, viewState === state && styles.devChipTextActive]}>
                {state.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Persistent Offline Banner (Offline Mode) */}
      {isOffline && (
        <View testID="groups-offline-banner" style={styles.offlineBanner}>
          <Text style={styles.offlineBannerIcon}>⚠️</Text>
          <View style={styles.offlineBannerContent}>
            <Text style={styles.offlineBannerTitle}>OFFLINE MODE — CACHED DATA</Text>
            <Text style={styles.offlineBannerText}>
              Displaying local offline pact cache. Create and join actions are temporarily disabled until connection is restored.
            </Text>
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, gap: S.md }}>
          {/* Header OS Card (GROUPS.EXE) */}
          <View style={[styles.osWindow, hardShadow(SHADOW_OFFSET)]}>
            <TitleBar label="GROUPS.EXE" color="mint" />
            <View style={styles.headerBody}>
              <View style={styles.headerTitleRow}>
                <Text style={styles.folderIcon}>📁</Text>
                <Text style={styles.headerTitle}>ACTIVE PACTS</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                Manage your active pacts and track today's synchronization rituals.
              </Text>
            </View>
          </View>

          {/* ─── State 1 & 4: Populated / Offline Cached List ─── */}
          {(viewState === 'populated' || viewState === 'offline') && (
            <View style={styles.pactList}>
              {SAMPLE_PACTS.map(pact => (
                <Pressable
                  key={pact.id}
                  testID={`pact-card-${pact.id}`}
                  style={[styles.pactCard, hardShadow(SHADOW_OFFSET)]}
                  onPress={() => router.push('/(groups)/detail')}
                  accessibilityRole="button"
                  accessibilityLabel={`Group: ${pact.name}`}
                >
                  {/* Card TitleBar */}
                  <View style={[styles.cardHeader, { backgroundColor: pact.barColor === 'mint' ? C.mint : C.cyan }]}>
                    <Text style={styles.cardHeaderLabel}>ID: {pact.code}</Text>
                    <View style={styles.dotRow}>
                      <View style={[styles.headerDot, { backgroundColor: C.pink }]} />
                      <View style={[styles.headerDot, { backgroundColor: C.cyan }]} />
                      <View style={[styles.headerDot, { backgroundColor: C.white }]} />
                    </View>
                  </View>

                  {/* Card Body */}
                  <View style={styles.cardBody}>
                    {/* Status Badge */}
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.statusBadge,
                          pact.status === 'synced' ? styles.statusBadgeSynced : styles.statusBadgePending,
                        ]}
                      >
                        <Text style={styles.statusBadgeIcon}>
                          {pact.status === 'synced' ? '✓' : '…'}
                        </Text>
                        <Text
                          style={[
                            styles.statusBadgeText,
                            pact.status === 'synced' ? { color: '#007353' } : { color: '#ba1a1a' },
                          ]}
                        >
                          {pact.status === 'synced' ? 'SYNCED' : 'PENDING'}
                        </Text>
                      </View>
                    </View>

                    {/* Group Title and Info */}
                    <View>
                      <Text style={styles.pactName}>{pact.name.toUpperCase()}</Text>
                      <Text style={styles.pactSubText}>
                        {pact.completedMembers}/{pact.totalMembers} Members Completed
                      </Text>
                    </View>

                    {/* Bottom row: Streak and Avatars */}
                    <View style={styles.cardFooter}>
                      <View style={styles.streakBadge}>
                        <Text style={styles.streakFireIcon}>🔥</Text>
                        <Text style={styles.streakText}>{pact.streakDays} DAY STREAK</Text>
                      </View>

                      {/* Stacked Avatar Rings */}
                      <View style={styles.avatarStack}>
                        {pact.avatars.map((av, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.avatarStackCircle,
                              { backgroundColor: av.bg, zIndex: 10 - idx },
                            ]}
                          >
                            <Text style={styles.avatarStackLabel}>{av.label}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* ─── State 2: Empty State (First-Run) ─── */}
          {viewState === 'empty' && (
            <View style={[styles.emptyCard, hardShadow(SHADOW_OFFSET)]}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyIconShadow} />
                <View style={styles.emptyIconBox}>
                  <Text style={styles.emptyIconText}>🚫👥</Text>
                </View>
              </View>

              <View style={styles.emptyPromptBox}>
                <Text style={styles.emptyPromptTag}>&gt; SYSTEM MSG: NO PACTS DETECTED</Text>
                <Text style={styles.emptyPromptHeading}>JOIN_OR_CREATE_PACT</Text>
                <Text style={styles.emptyPromptDesc}>
                  You are not currently enrolled in any synchronization circle. Initialize a new accountability pact or enter an invite key.
                </Text>
              </View>

              <View style={{ width: '100%', gap: S.sm }}>
                <Pressable
                  testID="empty-btn-create-group"
                  style={styles.primaryActionBtn}
                  onPress={() => router.push('/(groups)/create/step-1')}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryActionBtnText}>+ INITIALIZE_FIRST_GROUP</Text>
                </Pressable>

                <Pressable
                  testID="empty-btn-join-group"
                  style={styles.secondaryActionBtn}
                  onPress={() => router.push('/(groups)/join')}
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryActionBtnText}>JOIN WITH INVITE KEY</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ─── State 3: Loading Skeleton ─── */}
          {viewState === 'loading' && (
            <View testID="groups-loading-skeleton" style={{ gap: S.md }}>
              {[1, 2].map(idx => (
                <View key={idx} style={[styles.skeletonCard, hardShadow(SHADOW_OFFSET)]}>
                  <Animated.View style={[styles.skeletonHeader, { opacity: pulseAnim }]} />
                  <View style={styles.skeletonBody}>
                    <Animated.View style={[styles.skeletonLine, { width: '40%', height: 20, opacity: pulseAnim }]} />
                    <Animated.View style={[styles.skeletonLine, { width: '70%', height: 28, opacity: pulseAnim }]} />
                    <Animated.View style={[styles.skeletonLine, { width: '50%', height: 16, opacity: pulseAnim }]} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: S.sm }}>
                      <Animated.View style={[styles.skeletonLine, { width: '45%', height: 32, opacity: pulseAnim }]} />
                      <Animated.View style={[styles.skeletonLine, { width: '30%', height: 32, opacity: pulseAnim }]} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button (FAB) — Populated/Offline mode */}
      {viewState !== 'loading' && viewState !== 'empty' && (
        <View
          style={[
            styles.fabContainer,
            { bottom: BOTTOM_NAV_BASE_HEIGHT + insets.bottom + S.md },
          ]}
        >
          <Pressable
            testID="groups-fab-create-pact"
            style={[
              styles.fabButton,
              hardShadow(SHADOW_OFFSET),
              isOffline && styles.fabDisabled,
            ]}
            onPress={() => {
              if (!isOffline) {
                router.push('/(groups)/create/step-1');
              }
            }}
            disabled={isOffline}
            accessibilityRole="button"
            accessibilityLabel="Create New Pact"
          >
            <Text style={styles.fabIcon}>+</Text>
            <Text style={styles.fabText}>CREATE NEW PACT</Text>
          </Pressable>
        </View>
      )}

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
  topAppBar: {
    width: '100%',
    backgroundColor: C.surface,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    ...hardShadow(SHADOW_OFFSET),
    zIndex: 50,
  },
  topAppBarInner: {
    height: 56,
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  appBarIconText: {
    fontSize: 18,
  },
  appTitle: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.primary,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.cyan,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  avatarText: {
    ...T.label,
    fontSize: 16,
    color: C.black,
    fontWeight: '800',
  },

  // State Switcher (Dev Bar)
  devBar: {
    backgroundColor: C.surfaceContainerHigh,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  devBarLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    marginRight: 6,
  },
  devScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  devChip: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  devChipActive: {
    backgroundColor: C.pink,
    borderColor: C.black,
    fontWeight: '800',
  },
  devChipText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
  },
  devChipTextActive: {
    fontWeight: '800',
  },

  // Offline banner
  offlineBanner: {
    backgroundColor: '#ffdad6',
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    zIndex: 40,
  },
  offlineBannerIcon: {
    fontSize: 18,
  },
  offlineBannerContent: {
    flex: 1,
  },
  offlineBannerTitle: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '800',
  },
  offlineBannerText: {
    ...T.labelXs,
    color: '#53424b',
    fontSize: 10,
    lineHeight: 12,
  },

  scrollContent: {
    paddingHorizontal: S.md,
    paddingVertical: S.lg,
    alignItems: 'center',
    paddingBottom: 90,
  },

  // Header window card
  osWindow: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  headerBody: {
    padding: S.md,
    gap: S.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  folderIcon: {
    fontSize: 22,
  },
  headerTitle: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.black,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
  },

  // Pact cards
  pactList: {
    gap: S.md,
  },
  pactCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 34,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.sm,
  },
  cardHeaderLabel: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 4,
  },
  headerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  cardBody: {
    padding: S.md,
    gap: S.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderRadius: 12,
  },
  statusBadgeSynced: {
    backgroundColor: C.secondaryContainer,
  },
  statusBadgePending: {
    backgroundColor: '#ffdad6',
  },
  statusBadgeIcon: {
    fontSize: 12,
    fontWeight: '800',
  },
  statusBadgeText: {
    ...T.labelXs,
    fontWeight: '800',
  },
  pactName: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
  },
  pactSubText: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.surfaceVariant,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakFireIcon: {
    fontSize: 14,
  },
  streakText: {
    ...T.labelSm,
    color: C.primary,
    fontWeight: '800',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStackCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  avatarStackLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '800',
  },

  // Empty state
  emptyCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    padding: S.xl,
    alignItems: 'center',
    gap: S.lg,
  },
  emptyIconContainer: {
    position: 'relative',
    marginTop: S.sm,
  },
  emptyIconShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
  },
  emptyIconBox: {
    width: 88,
    height: 88,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyPromptBox: {
    backgroundColor: C.surface,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    width: '100%',
    ...hardShadow(SHADOW_OFFSET_SM),
    gap: 6,
  },
  emptyPromptTag: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  emptyPromptHeading: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.black,
    textTransform: 'uppercase',
  },
  emptyPromptDesc: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
  },
  primaryActionBtn: {
    width: '100%',
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(SHADOW_OFFSET),
  },
  primaryActionBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
  },
  secondaryActionBtn: {
    width: '100%',
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionBtnText: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '700',
  },

  // Skeleton
  skeletonCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  skeletonHeader: {
    height: 32,
    backgroundColor: C.surfaceDim,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  skeletonBody: {
    padding: S.md,
    gap: S.sm,
  },
  skeletonLine: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },

  // Floating Action Button
  fabContainer: {
    position: 'absolute',
    right: S.md,
    zIndex: 60,
  },
  fabButton: {
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fabDisabled: {
    opacity: 0.5,
    backgroundColor: C.surfaceDim,
  },
  fabIcon: {
    fontSize: 20,
    fontWeight: '900',
    color: C.black,
  },
  fabText: {
    ...T.labelSm,
    fontWeight: '900',
    color: C.black,
    letterSpacing: 1,
  },
});
