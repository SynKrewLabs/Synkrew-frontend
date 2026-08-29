/**
 * SynKrew — Notification Inbox (Populated, Empty & Push Banner States)
 * Route: app/(notifications)/index.tsx
 * Screen IDs: 54b503b12daa44fca39b70908e551feb, 89dc0a2513e9464da8c1f9b75163263e, 808960b7c3c3420ea223e82301ecf33e
 */

import React, { useState } from 'react';
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
import { EmptyState } from '../../components/ui/EmptyState';
import { BottomNavBar, BOTTOM_NAV_BASE_HEIGHT } from '../../components/groups/BottomNavBar';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  color: string;
  read: boolean;
  route?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Verification Needed',
    desc: 'Identity protocol requires manual override. 3 pending proofs in your queue.',
    time: '10:42 AM',
    icon: '🛡️',
    color: C.pink,
    read: false,
    route: '/(verify)',
  },
  {
    id: '2',
    title: 'Settlement Completed',
    desc: 'Transaction TX-9842 successfully cleared. Daily pass coins credited.',
    time: 'YESTERDAY',
    icon: '💰',
    color: C.mint,
    read: false,
    route: '/(settlement)/daily-summary',
  },
  {
    id: '3',
    title: 'Milestone Reached',
    desc: 'Level 5 connectivity achieved in sector 7G. Bonus unlocked.',
    time: 'MON',
    icon: '🏆',
    color: C.cyan,
    read: false,
    route: '/(settlement)/milestone',
  },
  {
    id: '4',
    title: 'Invite Received',
    desc: 'New squad operation pending your approval. Join the Alpha cycle.',
    time: 'OCT 12',
    icon: '✉️',
    color: C.yellow,
    read: false,
    route: '/(groups)/join',
  },
  {
    id: '5',
    title: 'System Update',
    desc: 'Core system algorithms updated to V2.4.1.',
    time: 'OCT 10',
    icon: 'ℹ️',
    color: C.surfaceContainerHigh,
    read: true,
  },
];

export default function NotificationInboxScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 480);

  const [showPushBanner, setShowPushBanner] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isEmptyState, setIsEmptyState] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationPress = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const toggleEmptyPopulated = () => {
    setIsEmptyState((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TitleBar
          label="INBOX.SYS"
          color="pink"
          leftElement={
            <Pressable
              testID="btn-notif-back"
              style={styles.backBtn}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Text style={styles.backBtnText}>←</Text>
            </Pressable>
          }
          rightElement={
            <Pressable
              testID="btn-toggle-notif-state"
              style={styles.stateToggleBtn}
              onPress={toggleEmptyPopulated}
              accessibilityRole="button"
              accessibilityLabel="Toggle empty/populated state"
            >
              <Text style={styles.stateToggleText}>
                {isEmptyState ? 'SHOW POPULATED' : 'SHOW EMPTY'}
              </Text>
            </Pressable>
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: BOTTOM_NAV_BASE_HEIGHT + S.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[{ width: cardWidth }, styles.container]}>
          {/* Push Permission-Off Banner (Dismissible, Shared Component Pattern) */}
          {showPushBanner && (
            <View style={[styles.pushBanner, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.bannerLeft}>
                <View style={styles.bannerIconBox}>
                  <Text style={styles.bannerIcon}>⚠️</Text>
                </View>
                <View style={styles.bannerText}>
                  <Text style={styles.bannerTitle}>PUSH_NOTIFS_DISABLED</Text>
                  <Text style={styles.bannerDesc}>Link terminal alerts to stay synced.</Text>
                </View>
              </View>
              <View style={styles.bannerActions}>
                <Pressable
                  testID="btn-enable-push"
                  style={styles.enableBtn}
                  onPress={() => setShowPushBanner(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Enable push notifications"
                >
                  <Text style={styles.enableBtnText}>ENABLE</Text>
                </Pressable>
                <Pressable
                  testID="btn-dismiss-push-banner"
                  style={styles.dismissBannerBtn}
                  onPress={() => setShowPushBanner(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss banner"
                >
                  <Text style={styles.dismissBannerText}>✕</Text>
                </Pressable>
              </View>
            </View>
          )}

          {isEmptyState || notifications.length === 0 ? (
            /* Empty State Window */
            <EmptyState
              windowTitle="INBOX_EMPTY.EXE"
              titleBarColor="mint"
              icon="📭"
              headline="QUEUE_CLEAN"
              description="Nothing to report. Check back when your Krew starts moving."
              actionLabel="REFRESH STATUS"
              onAction={() => setIsEmptyState(false)}
              testID="notifications-empty-state"
            />
          ) : (
            /* Populated State Window */
            <View style={[styles.inboxWindow, hardShadow(SHADOW_OFFSET)]}>
              <View style={styles.inboxHeader}>
                <Text style={styles.inboxTitle}>NOTIFICATIONS</Text>
                <Pressable
                  testID="btn-mark-all-read"
                  style={styles.markReadBtn}
                  onPress={handleMarkAllRead}
                  accessibilityRole="button"
                  accessibilityLabel="Mark all read"
                >
                  <Text style={styles.markReadText}>MARK ALL READ</Text>
                </Pressable>
              </View>

              <View style={styles.notifList}>
                {notifications.map((item) => (
                  <Pressable
                    key={item.id}
                    testID={`notif-item-${item.id}`}
                    style={[
                      styles.notifRow,
                      item.read && styles.notifRowRead,
                      hardShadow(SHADOW_OFFSET_SM),
                    ]}
                    onPress={() => handleNotificationPress(item)}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                  >
                    <View style={[styles.notifIconBox, { backgroundColor: item.color }]}>
                      <Text style={styles.notifIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.notifInfo}>
                      <View style={styles.notifTopLine}>
                        <Text style={[styles.notifTitle, item.read && styles.notifTitleRead]}>
                          {item.title}
                        </Text>
                        <Text style={styles.notifTime}>{item.time}</Text>
                      </View>
                      <Text style={styles.notifDesc} numberOfLines={2}>
                        {item.desc}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Persistent Bottom Nav */}
      <BottomNavBar activeTab="groups" />
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
  backBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  backBtnText: {
    fontSize: 18,
    color: C.black,
    fontWeight: '900',
  },
  stateToggleBtn: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stateToggleText: {
    ...T.labelXs,
    fontSize: 9,
    fontWeight: '900',
    color: C.black,
  },
  scroll: {
    alignItems: 'center',
    padding: S.md,
  },
  container: {
    gap: S.md,
  },
  pushBanner: {
    width: '100%',
    backgroundColor: C.yellow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: S.xs,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    flex: 1,
  },
  bannerIconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIcon: {
    fontSize: 20,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    ...T.labelSm,
    fontWeight: '900',
    color: C.black,
    fontSize: 11,
  },
  bannerDesc: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.black,
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  enableBtn: {
    backgroundColor: C.pink,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
  },
  enableBtnText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
    letterSpacing: 0.5,
  },
  dismissBannerBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  dismissBannerText: {
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
  },
  inboxWindow: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    padding: S.md,
    gap: S.md,
  },
  inboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inboxTitle: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.onSurface,
    letterSpacing: 1,
  },
  markReadBtn: {
    backgroundColor: C.mint,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
  },
  markReadText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
    letterSpacing: 0.5,
  },
  notifList: {
    gap: S.sm,
  },
  notifRow: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  notifRowRead: {
    backgroundColor: C.surfaceContainerLow,
    opacity: 0.75,
  },
  notifIconBox: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 22,
  },
  notifInfo: {
    flex: 1,
    gap: 2,
  },
  notifTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    ...T.labelSm,
    fontWeight: '800',
    color: C.onSurface,
    fontSize: 13,
  },
  notifTitleRead: {
    color: C.onSurfaceVariant,
  },
  notifTime: {
    ...T.labelSm,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },
  notifDesc: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 16,
  },
  emptyCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    padding: S.xl,
    alignItems: 'center',
    gap: S.lg,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconEmoji: {
    fontSize: 40,
  },
  emptyTextBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  emptyHeadline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  emptyDesc: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  refreshBtn: {
    backgroundColor: C.primaryFixedDim,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    gap: 8,
  },
  refreshIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: C.black,
  },
  refreshBtnText: {
    ...T.labelSm,
    fontWeight: '900',
    color: C.black,
    letterSpacing: 1,
  },
});
