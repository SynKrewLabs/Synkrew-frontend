/**
 * SynKrew — Join Group: Invite Preview Screen
 * Route: app/(groups)/join.tsx
 *
 * Implements:
 *   - Incoming pact invite preview (group info, mission parameters, stake % & cycle length)
 *   - Explicitly NO task summary (tasks are per-member, defined individually)
 *   - Accept / Decline actions on-screen (Accept routes to shared Define Tasks with mode: 'join')
 *   - Client-side group cap limit check before accepting
 *   - Demo state switcher bar for edge/terminal states
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
import { TitleBar } from '../../components/ui/TitleBar';

export default function JoinGroupInvitePreview() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const isPrivate = params.type === 'private';
  const groupName = params.name ? String(params.name) : 'NEON RUNNERS';
  const inviterHandle = params.inviter ? String(params.inviter) : '@KrewMaster99';
  const cycleLength = params.cycle ? String(params.cycle) : '30-DAY MARATHON';
  const stakePercent = params.stake ? String(params.stake) : '60%';
  const memberCount = params.members ? String(params.members) : '4/10';

  // Mock joined groups count for client-side tier limit check (Free limit = 2)
  const [userJoinedGroupsCount] = useState<number>(1);
  const FREE_TIER_GROUP_LIMIT = 2;

  const handleAccept = () => {
    // Client-side group-count-limit check
    if (userJoinedGroupsCount >= FREE_TIER_GROUP_LIMIT) {
      Alert.alert(
        'GROUP LIMIT REACHED (2/2)',
        'Free tier accounts can join a maximum of 2 active groups. Upgrade to SynKrew Premium to unlock up to 5 concurrent groups.',
        [
          { text: 'MAYBE LATER', style: 'cancel' },
          {
            text: 'UPGRADE TO PREMIUM',
            onPress: () => router.push('/(subscription)'),
          },
        ]
      );
      return;
    }

    if (isPrivate) {
      router.push({
        pathname: '/(groups)/join/private-pending',
        params: { ...params, name: groupName, admin: inviterHandle },
      });
      return;
    }

    // Happy path: navigate into the SAME shared Define Tasks screen
    router.push({
      pathname: '/(groups)/define-tasks',
      params: {
        ...params,
        mode: 'join',
        name: groupName,
        inviter: inviterHandle,
        stakePercent,
        cycleLength,
      },
    });
  };

  const handleDecline = () => {
    router.replace('/(groups)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Edge State Quick Demo Switcher Bar */}
      <View style={styles.demoBar}>
        <Text style={styles.demoLabel}>DEMO STATES:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Pressable
            testID="join-demo-invalid"
            style={styles.demoChip}
            onPress={() => router.push('/(groups)/join/invalid')}
          >
            <Text style={styles.demoChipText}>INVALID</Text>
          </Pressable>
          <Pressable
            testID="join-demo-expired"
            style={styles.demoChip}
            onPress={() => router.push('/(groups)/join/expired')}
          >
            <Text style={styles.demoChipText}>EXPIRED</Text>
          </Pressable>
          <Pressable
            testID="join-demo-full"
            style={styles.demoChip}
            onPress={() => router.push('/(groups)/join/full')}
          >
            <Text style={styles.demoChipText}>FULL</Text>
          </Pressable>
          <Pressable
            testID="join-demo-already"
            style={styles.demoChip}
            onPress={() =>
              router.push({
                pathname: '/(groups)/join/already-member',
                params: { name: groupName },
              })
            }
          >
            <Text style={styles.demoChipText}>ALREADY MEMBER</Text>
          </Pressable>
          <Pressable
            testID="join-demo-banned"
            style={styles.demoChip}
            onPress={() => router.push('/(groups)/join/banned')}
          >
            <Text style={styles.demoChipText}>BANNED</Text>
          </Pressable>
          <Pressable
            testID="join-demo-revoked"
            style={styles.demoChip}
            onPress={() => router.push('/(groups)/join/revoked')}
          >
            <Text style={styles.demoChipText}>REVOKED</Text>
          </Pressable>
          <Pressable
            testID="join-demo-private"
            style={styles.demoChip}
            onPress={() =>
              router.push({
                pathname: '/(groups)/join/private-pending',
                params: { name: groupName, admin: inviterHandle },
              })
            }
          >
            <Text style={styles.demoChipText}>PRIVATE PENDING</Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="INCOMING_INVITE.EXE" color="pink" />

          <View style={styles.body}>
            {/* Group Header Info */}
            <View style={styles.groupHeader}>
              <View style={[styles.groupAvatar, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={styles.groupAvatarIcon}>🤝</Text>
              </View>
              <Text style={styles.groupTitle}>{groupName.toUpperCase()}</Text>
              <Text style={styles.inviterText}>
                Invited by <Text style={styles.inviterHighlight}>{inviterHandle}</Text>
              </Text>
            </View>

            {/* Mission Parameters Card (No task summary — tasks are per-member) */}
            <View style={[styles.paramsCard, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.paramsSectionTitle}>MISSION PARAMETERS</Text>

              {/* Cycle Duration */}
              <View style={styles.paramRow}>
                <View style={[styles.paramIconBox, { backgroundColor: C.secondaryContainer }]}>
                  <Text style={styles.paramIcon}>⏱</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paramLabel}>CYCLE LENGTH</Text>
                  <Text style={styles.paramValue}>{cycleLength}</Text>
                </View>
              </View>

              {/* Stake Risk */}
              <View style={styles.paramRow}>
                <View style={[styles.paramIconBox, { backgroundColor: C.pink }]}>
                  <Text style={styles.paramIcon}>🪙</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paramLabel}>DAILY STAKE AT RISK</Text>
                  <Text style={styles.paramValue}>{stakePercent} of Daily Balance</Text>
                </View>
              </View>

              {/* Current Squad Count */}
              <View style={styles.paramRow}>
                <View style={[styles.paramIconBox, { backgroundColor: C.cyan }]}>
                  <Text style={styles.paramIcon}>👥</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paramLabel}>SQUAD ENROLLMENT</Text>
                  <Text style={styles.paramValue}>{memberCount} Members Enrolled</Text>
                </View>
              </View>
            </View>

            {/* Group Rules & Protocol */}
            <View style={styles.rulesCard}>
              <Text style={styles.rulesTitle}>KREW PROTOCOL</Text>
              <View style={styles.rulesList}>
                <Text style={styles.ruleItem}>• Define and schedule your own 3 daily routines</Text>
                <Text style={styles.ruleItem}>• Submit front/back photo proof before 11:59 PM</Text>
                <Text style={styles.ruleItem}>• 2-of-3 peer verification required to return stake</Text>
              </View>
            </View>

            {/* Actions: Accept & Decline on Invite Preview */}
            <View style={styles.actionRow}>
              <Pressable
                testID="join-btn-decline"
                style={styles.declineBtn}
                onPress={handleDecline}
                accessibilityRole="button"
              >
                <Text style={styles.declineBtnIcon}>✕</Text>
                <Text style={styles.declineBtnText}>DECLINE</Text>
              </Pressable>

              <Pressable
                testID="join-btn-accept"
                style={[styles.acceptBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleAccept}
                accessibilityRole="button"
              >
                <Text style={styles.acceptBtnIcon}>✓</Text>
                <Text style={styles.acceptBtnText}>ACCEPT</Text>
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
  },
  demoChipText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '700',
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
    gap: S.md,
  },

  // Header
  groupHeader: {
    alignItems: 'center',
    gap: 4,
  },
  groupAvatar: {
    width: 72,
    height: 72,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  groupAvatarIcon: {
    fontSize: 36,
  },
  groupTitle: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.black,
    textTransform: 'uppercase',
  },
  inviterText: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
  },
  inviterHighlight: {
    color: C.primary,
    fontWeight: '800',
  },

  // Parameters Card
  paramsCard: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.sm,
  },
  paramsSectionTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    paddingBottom: 4,
    letterSpacing: 1,
    fontSize: 11,
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  paramIconBox: {
    width: 32,
    height: 32,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: C.black,
  },
  paramLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  paramValue: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.black,
    fontWeight: '800',
  },

  // Rules Card
  rulesCard: {
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 4,
  },
  rulesTitle: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  rulesList: {
    gap: 2,
  },
  ruleItem: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
    lineHeight: 16,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: S.xs,
  },
  declineBtn: {
    flex: 1,
    height: 48,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  declineBtnIcon: {
    fontSize: 14,
    fontWeight: '900',
    color: C.black,
  },
  declineBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 12,
  },
  acceptBtn: {
    flex: 1,
    height: 48,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: C.black,
  },
  acceptBtnText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
