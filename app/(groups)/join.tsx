/**
 * SynKrew — Join Group: Invite Preview Screen
 * Route: app/(groups)/join.tsx
 *
 * Implements:
 *   - Incoming pact invite preview (group info, mission parameters, stake required)
 *   - Decline (returns to Groups dashboard)
 *   - Accept (routes to Join Confirmation stub)
 *   - Edge state simulation triggers (Invalid Invite / Expired Invite / Group Full)
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

  const handleAccept = () => {
    if (isPrivate) {
      router.push({
        pathname: '/(groups)/join/private-pending',
        params: { ...params, name: groupName, admin: inviterHandle },
      });
    } else {
      router.push({
        pathname: '/(groups)/join/confirmation',
        params: { ...params, name: groupName },
      });
    }
  };

  const handleDecline = () => {
    router.replace('/(groups)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Edge State Quick Demo Switcher */}
      <View style={styles.demoBar}>
        <Text style={styles.demoLabel}>DEMO STATES:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
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
            onPress={() => router.push({ pathname: '/(groups)/join/already-member', params: { name: groupName } })}
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
            onPress={() => router.push({ pathname: '/(groups)/join/private-pending', params: { name: groupName } })}
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
                <Text style={styles.groupAvatarIcon}>👥</Text>
              </View>
              <Text style={styles.groupTitle}>{groupName.toUpperCase()}</Text>
              <Text style={styles.inviterText}>
                Invited by <Text style={styles.inviterHighlight}>{inviterHandle}</Text>
              </Text>
            </View>

            {/* Mission Parameters Card */}
            <View style={[styles.paramsCard, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.paramsSectionTitle}>MISSION PARAMETERS</Text>

              {/* Primary Objective */}
              <View style={styles.paramRow}>
                <View style={[styles.paramIconBox, { backgroundColor: C.secondaryContainer }]}>
                  <Text style={styles.paramIcon}>✓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paramLabel}>PRIMARY OBJECTIVE</Text>
                  <Text style={styles.paramValue}>10k Daily Steps for 7 Days</Text>
                </View>
              </View>

              {/* Stake Required */}
              <View style={styles.paramRow}>
                <View style={[styles.paramIconBox, { backgroundColor: C.pink }]}>
                  <Text style={styles.paramIcon}>🪙</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paramLabel}>STAKE COMMITMENT</Text>
                  <Text style={styles.paramValue}>50 SynCoins</Text>
                </View>
              </View>

              {/* Current Squad */}
              <View style={styles.paramRow}>
                <View style={[styles.paramIconBox, { backgroundColor: C.cyan }]}>
                  <Text style={styles.paramIcon}>⚡</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paramLabel}>CURRENT SQUAD</Text>
                  <View style={styles.squadAvatarRow}>
                    <View style={[styles.squadDot, { backgroundColor: C.pink, zIndex: 3 }]} />
                    <View style={[styles.squadDot, { backgroundColor: C.secondaryContainer, zIndex: 2 }]} />
                    <View style={[styles.squadDot, { backgroundColor: C.surfaceContainerHigh, zIndex: 1 }]} />
                    <View style={styles.squadMoreBadge}>
                      <Text style={styles.squadMoreText}>+2</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Actions */}
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
    borderRadius: 2,
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
    gap: S.lg,
  },

  // Header
  groupHeader: {
    alignItems: 'center',
    gap: S.xs,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  groupAvatarIcon: {
    fontSize: 38,
  },
  groupTitle: {
    ...T.headlineMd,
    fontSize: 24,
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
    gap: S.md,
  },
  paramsSectionTitle: {
    ...T.labelSm,
    color: C.primary,
    fontWeight: '800',
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    paddingBottom: 4,
    letterSpacing: 1,
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
    fontSize: 14,
    color: C.black,
    fontWeight: '800',
  },
  squadAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  squadDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.black,
    marginLeft: -4,
  },
  squadMoreBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.black,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
  },
  squadMoreText: {
    ...T.labelXs,
    fontSize: 8,
    fontWeight: '900',
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: S.xs,
  },
  declineBtn: {
    flex: 1,
    height: 52,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  declineBtnIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: C.onSurface,
  },
  declineBtnText: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    letterSpacing: 1,
  },
  acceptBtn: {
    flex: 1,
    height: 52,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: C.black,
  },
  acceptBtnText: {
    ...T.label,
    fontSize: 14,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
