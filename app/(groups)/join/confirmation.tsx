/**
 * SynKrew — Join Group: Success Confirmation
 * Route: app/(groups)/join/confirmation.tsx
 *
 * Implements:
 *   - Success handshake graphic & security badges matching Create Group Confirmation pattern
 *   - Mission parameter confirmation (stake secured, sync protocol active)
 *   - "ENTER GROUP DASHBOARD" CTA: Hands off data to active Group Detail screen
 *   - "Return to All Groups" secondary link
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

export default function JoinGroupConfirmation() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.name ? String(params.name) : 'NEON RUNNERS';
  const memberCount = params.members ? String(params.members) : '5 MEMBERS';
  const stakePercent = params.stakePercent ? String(params.stakePercent) : '60%';

  const handleGoToGroup = () => {
    // Navigate to active Group Detail with newly joined group parameters
    router.replace({
      pathname: '/(groups)/detail',
      params: {
        name: groupName,
        members: memberCount,
        stake: stakePercent,
        isNew: 'true',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="PACT_JOINED.EXE" color="mint" />

          <View style={styles.body}>
            {/* Success Graphic Frame (Matches Create Group Confirmation) */}
            <View style={styles.graphicContainer}>
              <View style={styles.graphicShadow} />
              <View style={styles.graphicBox}>
                <Text style={styles.graphicIcon}>🤝</Text>
              </View>
              <View style={styles.verifiedCheckBadge}>
                <Text style={styles.verifiedCheckText}>✓</Text>
              </View>
            </View>

            {/* Headline */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>PACT_JOINED</Text>
              <Text style={styles.subtitle}>
                You have successfully joined <Text style={{ fontWeight: '900', color: C.black }}>"{groupName.toUpperCase()}"</Text>. Your daily routines are scheduled, and your stake is locked into the vault.
              </Text>
            </View>

            {/* Stats Badges */}
            <View style={styles.badgesRow}>
              <View style={[styles.badgeItem, { backgroundColor: C.secondaryContainer }, hardShadow(1)]}>
                <Text style={styles.badgeIcon}>👥</Text>
                <Text style={styles.badgeLabel}>SQUAD: ACTIVE</Text>
              </View>

              <View style={[styles.badgeItem, { backgroundColor: C.pink }, hardShadow(1)]}>
                <Text style={styles.badgeIcon}>🔒</Text>
                <Text style={styles.badgeLabel}>STATUS: SECURE</Text>
              </View>
            </View>

            {/* Summary Details Box */}
            <View style={[styles.summaryBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>SYNC PROTOCOL</Text>
                <Text style={styles.summaryVal}>DAY 1 INITIALIZED</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>DAILY COMMITMENT</Text>
                <Text style={styles.summaryVal}>{stakePercent} STAKE RISK</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>GROUP VISIBILITY</Text>
                <Text style={styles.summaryVal}>ALL MEMBERS ACTIVE</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionColumn}>
              <Pressable
                testID="confirmation-btn-go-to-group"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleGoToGroup}
                accessibilityRole="button"
              >
                <Text style={styles.primaryBtnIcon}>🚀</Text>
                <Text style={styles.primaryBtnText}>ENTER GROUP DASHBOARD</Text>
              </Pressable>

              <Pressable
                testID="confirmation-btn-dashboard"
                style={styles.secondaryBtn}
                onPress={() => router.replace('/(groups)')}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryBtnText}>← Return to All Groups</Text>
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

  // Graphic Frame
  graphicContainer: {
    position: 'relative',
    marginVertical: S.xs,
  },
  graphicShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
  },
  graphicBox: {
    width: 96,
    height: 96,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicIcon: {
    fontSize: 48,
  },
  verifiedCheckBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.mint,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheckText: {
    fontSize: 16,
    fontWeight: '900',
    color: C.black,
  },

  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.primary,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    gap: S.sm,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: S.sm,
    paddingVertical: 6,
    borderWidth: BORDER,
    borderColor: C.black,
  },
  badgeIcon: {
    fontSize: 14,
  },
  badgeLabel: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },

  // Summary box
  summaryBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.xs,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  summaryVal: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },

  // Actions
  actionColumn: {
    width: '100%',
    gap: S.sm,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnIcon: {
    fontSize: 18,
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: S.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.onSurfaceVariant,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
});
