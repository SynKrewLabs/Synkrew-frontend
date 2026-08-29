/**
 * SynKrew — Profile Home (Refined UI)
 * Route: app/(profile)/index.tsx
 * Screen ID: 06ade9a184594bc1b3838b91073c7fb3
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
import { BottomNavBar, BOTTOM_NAV_BASE_HEIGHT } from '../../components/groups/BottomNavBar';

interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  date: string;
  bg: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'FIRST_VICTORY', desc: '100% daily pass recorded', icon: '🏆', date: 'AUG 14', bg: C.pink },
  { id: '2', name: '7_DAY_STREAK', desc: 'Continuous 7 day ritual chain', icon: '🔥', date: 'AUG 21', bg: C.mint },
  { id: '3', name: 'VERIFIED_JUDGE', desc: '50 community proofs audited', icon: '✓', date: 'AUG 26', bg: C.cyan },
  { id: '4', name: 'COIN_HOARDER', desc: 'Accumulated 500+ stake coins', icon: '💰', date: 'YESTERDAY', bg: C.yellow },
];

export default function ProfileHomeScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 460);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      
      {/* Top Bar Chrome */}
      <View style={styles.topHeader}>
        <TitleBar
          label="USER_DAT.INI"
          color="pink"
          rightElement={
            <Pressable
              testID="btn-profile-settings"
              style={styles.settingsIconBtn}
              onPress={() => router.push('/(profile)/settings')}
              accessibilityRole="button"
              accessibilityLabel="Account settings"
            >
              <Text style={styles.settingsIconText}>⚙</Text>
            </Pressable>
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: BOTTOM_NAV_BASE_HEIGHT + S.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[{ width: cardWidth }, styles.container]}>
          {/* Profile Identity Card */}
          <View style={[styles.avatarSection, hardShadow(SHADOW_OFFSET)]}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarPixel}>👾</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>LVL 42 EXPLORER</Text>
              </View>
            </View>
            <Text style={styles.username}>KREW_MEMBER_01</Text>
            <Text style={styles.userHandle}>#8942-SYN • JOINED CYCLE 04</Text>
          </View>

          {/* Subscriptions Hub Entry */}
          <Pressable
            testID="btn-subscription-hub"
            style={[styles.subscriptionBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.push('/(subscription)')}
            accessibilityRole="button"
            accessibilityLabel="Manage subscriptions"
          >
            <View style={styles.subLeft}>
              <Text style={styles.subIcon}>⚡</Text>
              <Text style={styles.subTitle}>SUBSCRIPTIONS</Text>
            </View>
            <View style={styles.subTierPill}>
              <Text style={styles.subTierText}>PRO TIER</Text>
            </View>
          </Pressable>

          {/* Streaks Matrix */}
          <View style={styles.streakGrid}>
            <View style={[styles.streakCard, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={[styles.streakTag, { backgroundColor: C.pink }]}>
                <Text style={styles.streakTagText}>CURRENT.RUN</Text>
              </View>
              <Text style={styles.streakCount}>14</Text>
              <Text style={styles.streakUnit}>Days Active</Text>
            </View>

            <View style={[styles.streakCard, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={[styles.streakTag, { backgroundColor: C.mint }]}>
                <Text style={styles.streakTagText}>MAX_RUN.LOG</Text>
              </View>
              <Text style={styles.streakCount}>89</Text>
              <Text style={styles.streakUnit}>Personal Best</Text>
            </View>
          </View>

          {/* Achievements Directory Window */}
          <View style={[styles.achievementsCard, hardShadow(SHADOW_OFFSET)]}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsHeaderText}>ACHIEVEMENTS.DIR</Text>
              <Text style={styles.achievementsHeaderCount}>4 / 12 UNLOCKED</Text>
            </View>

            <View style={styles.achievementsBody}>
              {ACHIEVEMENTS.map((item) => (
                <View key={item.id} style={styles.achievementRow}>
                  <View style={[styles.achieveIconBox, { backgroundColor: item.bg }]}>
                    <Text style={styles.achieveIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.achieveInfo}>
                    <Text style={styles.achieveName}>{item.name}</Text>
                    <Text style={styles.achieveDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.achieveDate}>{item.date}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Settings Shortcut Button */}
          <Pressable
            testID="btn-account-settings-row"
            style={[styles.settingsShortcutBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.push('/(profile)/settings')}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Text style={styles.settingsShortcutText}>OPEN SETTINGS.SYS</Text>
            <Text style={styles.settingsShortcutArrow}>→</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  topHeader: {
    paddingHorizontal: S.md,
    paddingTop: S.xs,
  },
  settingsIconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  settingsIconText: {
    fontSize: 16,
    color: C.black,
    fontWeight: '900',
  },
  scroll: {
    alignItems: 'center',
    padding: S.md,
  },
  container: {
    gap: S.md,
  },
  avatarSection: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    padding: S.lg,
    alignItems: 'center',
    gap: S.xs,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarBox: {
    width: 100,
    height: 100,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPixel: {
    fontSize: 52,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: C.mint,
    borderWidth: 2,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  levelBadgeText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
  },
  username: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  userHandle: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 11,
  },
  subscriptionBtn: {
    width: '100%',
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subIcon: {
    fontSize: 18,
    color: C.black,
    fontWeight: '900',
  },
  subTitle: {
    ...T.headlineMd,
    fontSize: 16,
    color: C.black,
    letterSpacing: 1,
  },
  subTierPill: {
    backgroundColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  subTierText: {
    ...T.labelXs,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  streakGrid: {
    flexDirection: 'row',
    gap: S.md,
  },
  streakCard: {
    flex: 1,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    alignItems: 'center',
    gap: 4,
  },
  streakTag: {
    width: '100%',
    borderWidth: 1,
    borderColor: C.black,
    paddingVertical: 2,
    alignItems: 'center',
  },
  streakTagText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
  },
  streakCount: {
    ...T.headlineLg,
    fontSize: 36,
    color: C.black,
    lineHeight: 40,
  },
  streakUnit: {
    ...T.labelSm,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
  achievementsCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  achievementsHeader: {
    height: 32,
    backgroundColor: C.surfaceContainerHigh,
    borderBottomWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  achievementsHeaderText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
    letterSpacing: 1,
  },
  achievementsHeaderCount: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
  },
  achievementsBody: {
    padding: S.md,
    gap: S.sm,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.black,
    padding: S.sm,
  },
  achieveIconBox: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achieveIcon: {
    fontSize: 20,
  },
  achieveInfo: {
    flex: 1,
    gap: 2,
  },
  achieveName: {
    ...T.labelSm,
    fontWeight: '800',
    color: C.onSurface,
  },
  achieveDesc: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
  achieveDate: {
    ...T.labelSm,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },
  settingsShortcutBtn: {
    width: '100%',
    height: 48,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  settingsShortcutText: {
    ...T.label,
    fontSize: 13,
    color: C.onSurface,
    fontWeight: '900',
  },
  settingsShortcutArrow: {
    fontSize: 16,
    color: C.black,
    fontWeight: '900',
  },
});
