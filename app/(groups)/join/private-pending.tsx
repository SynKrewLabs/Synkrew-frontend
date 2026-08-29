/**
 * SynKrew — Join Group: Private (Pending Approval)
 * Route: app/(groups)/join/private-pending.tsx
 *
 * Implements:
 *   - Waiting state for private group join requests
 *   - Clear instruction that the Krew Administrator must authorize credentials
 *   - Hand-off transition stub (notification-driven approval)
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

// TODO: screen/notification not yet designed — flag to product (Hand-off transition when creator approves request)

export default function JoinGroupPrivatePending() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.name ? String(params.name) : 'NEON RUNNERS';
  const adminHandle = params.admin ? String(params.admin) : '@KrewMaster99';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="PENDING_APPROVAL.EXE" color="cyan" />

          <View style={styles.body}>
            {/* Status Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconShadow} />
              <View style={styles.iconBox}>
                <Text style={styles.icon}>⏳</Text>
              </View>
              <View style={styles.statusTag}>
                <Text style={styles.statusTagText}>REQUEST SENT</Text>
              </View>
            </View>

            {/* Headline */}
            <View style={styles.textBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>STATUS: PENDING AUTHORIZATION</Text>
              </View>
              <Text style={styles.headline}>APPLICATION SUBMITTED</Text>
              <Text style={styles.description}>
                This is a private circle. The Krew Administrator (<Text style={{ fontWeight: '800', color: C.black }}>{adminHandle}</Text>) must authorize your credentials before entry into <Text style={{ fontWeight: '800', color: C.black }}>"{groupName.toUpperCase()}"</Text>.
              </Text>
            </View>

            {/* Notification notice */}
            <View style={[styles.noticeBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.noticeIcon}>🔔</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.noticeTitle}>DISPATCH NOTIFICATION ENABLED</Text>
                <Text style={styles.noticeText}>
                  You will receive a real-time signal notification as soon as your request is processed.
                </Text>
              </View>
            </View>

            {/* Action */}
            <View style={styles.actionColumn}>
              <Pressable
                testID="private-pending-btn-return"
                style={[styles.returnBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={() => router.replace('/(groups)')}
                accessibilityRole="button"
              >
                <Text style={styles.returnBtnIcon}>←</Text>
                <Text style={styles.returnBtnText}>RETURN TO DASHBOARD</Text>
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

  // Icon
  iconContainer: {
    position: 'relative',
    marginVertical: S.xs,
  },
  iconShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: C.cyan,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
  },
  iconBox: {
    width: 88,
    height: 88,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 42,
  },
  statusTag: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: C.yellow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
    transform: [{ rotate: '8deg' }],
  },
  statusTagText: {
    ...T.labelXs,
    fontSize: 9,
    fontWeight: '900',
    color: C.black,
  },

  // Text
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
    width: '100%',
  },
  badge: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
  },
  badgeText: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    fontSize: 11,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  description: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
  },

  // Notice
  noticeBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  noticeIcon: {
    fontSize: 24,
  },
  noticeTitle: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },
  noticeText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },

  // Action
  actionColumn: {
    width: '100%',
    marginTop: S.xs,
  },
  returnBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  returnBtnIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: C.black,
  },
  returnBtnText: {
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
