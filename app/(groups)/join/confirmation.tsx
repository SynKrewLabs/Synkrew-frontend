/**
 * SynKrew — Join Group: Success Confirmation Screen
 * Route: app/(groups)/join/confirmation.tsx
 *
 * Implements:
 *   - Success handshake and verified enrollment badges
 *   - Vault stake lock confirmation
 *   - Direct progression to Group Detail
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

  const handleEnterGroup = () => {
    router.replace({
      pathname: '/(groups)/detail',
      params: { name: groupName },
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
          <TitleBar label="INVITE_ACCEPTED.EXE" color="mint" />

          <View style={styles.body}>
            {/* Graphic Badge */}
            <View style={styles.graphicContainer}>
              <View style={styles.graphicShadow} />
              <View style={styles.graphicBox}>
                <Text style={styles.graphicIcon}>🎉</Text>
              </View>
              <View style={styles.badgeCheck}>
                <Text style={styles.badgeCheckText}>✓</Text>
              </View>
            </View>

            {/* Headline */}
            <View style={styles.textBlock}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>ENROLLMENT COMPLETE</Text>
              </View>
              <Text style={styles.headline}>WELCOME TO THE KREW</Text>
              <Text style={styles.subtitle}>
                You have successfully joined <Text style={{ fontWeight: '800', color: C.black }}>"{groupName.toUpperCase()}"</Text>. Your stake has been locked into the collective accountability vault.
              </Text>
            </View>

            {/* Parameter breakdown */}
            <View style={[styles.detailsBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SYNCHRONIZATION</Text>
                <Text style={styles.detailValue}>ONLINE (DAY 1)</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>STAKE SECURED</Text>
                <Text style={styles.detailValue}>50 SYNCOINS</Text>
              </View>
            </View>

            {/* Action */}
            <View style={styles.actionColumn}>
              <Pressable
                testID="join-confirm-btn-enter"
                style={[styles.enterBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleEnterGroup}
                accessibilityRole="button"
              >
                <Text style={styles.enterBtnIcon}>🚀</Text>
                <Text style={styles.enterBtnText}>ENTER GROUP DASHBOARD</Text>
              </Pressable>

              <Pressable
                testID="join-confirm-btn-dashboard"
                style={styles.returnBtn}
                onPress={() => router.replace('/(groups)')}
                accessibilityRole="button"
              >
                <Text style={styles.returnBtnText}>← Return to All Groups</Text>
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
    backgroundColor: C.mint,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
  },
  graphicBox: {
    width: 90,
    height: 90,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicIcon: {
    fontSize: 44,
  },
  badgeCheck: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCheckText: {
    fontSize: 16,
    fontWeight: '900',
    color: C.black,
  },

  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
  },
  statusBadgeText: {
    ...T.labelXs,
    color: '#00513a',
    fontWeight: '900',
    letterSpacing: 1,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.primary,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },

  detailsBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  detailValue: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },

  actionColumn: {
    width: '100%',
    gap: S.sm,
  },
  enterBtn: {
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
  enterBtnIcon: {
    fontSize: 18,
  },
  enterBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  returnBtn: {
    width: '100%',
    paddingVertical: S.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '700',
  },
});
