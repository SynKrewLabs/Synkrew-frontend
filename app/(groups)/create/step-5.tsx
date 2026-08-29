/**
 * SynKrew — Create Group: Step 5 (Review)
 * Route: app/(groups)/create/step-5.tsx
 *
 * Implements:
 *   - Pre-render Gate: Group limit check (2 free / 5 premium) redirects to Upsell before render
 *   - Complete parameter review card with decorative corner accents
 *   - Terms / Directive confirmation checkbox
 *   - Initialize submission -> Success Confirmation or Failed (Retry) handoff
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
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

// Simulated current active group count for standard tier limit check (standard limit = 2)
let currentActiveGroupsCount = 1; // Default under limit; toggleable via param `limit=true`

export default function CreateGroupStep5() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const isAtLimit = params.limit === 'true' || currentActiveGroupsCount >= 2;
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [confirmedProtocol, setConfirmedProtocol] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pre-render limit check: redirects to Limit Reached Upsell before showing review
  useEffect(() => {
    if (isAtLimit) {
      router.replace({
        pathname: '/(groups)/create/limit-reached',
        params: { ...params },
      });
    } else {
      setCheckingLimit(false);
    }
  }, [isAtLimit]);

  if (checkingLimit || isAtLimit) {
    return (
      <View style={[styles.loadingContainer, gridBgStyle(24, 0.08)]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  const groupName = params.name ? String(params.name) : 'NEON KNIGHTS';
  const taskCount = params.taskCount ? `${params.taskCount} Active` : '3 Active';
  const stakePercent = params.stakePercent ? `${params.stakePercent}%` : '60%';
  const cycleDays = params.cycleDays ? `${params.cycleDays}D` : '30D';
  const memberCount = params.memberCount ? String(params.memberCount) : '4';

  const handleInitializePact = async () => {
    if (!confirmedProtocol) return;
    setSubmitting(true);

    // Simulate backend submission
    setTimeout(() => {
      setSubmitting(false);
      // Simulate failure if specifically tested with param `fail=true`
      if (params.fail === 'true') {
        router.push({
          pathname: '/(groups)/create/failed',
          params: { ...params },
        });
      } else {
        router.replace({
          pathname: '/(groups)/create/confirmation',
          params: {
            ...params,
            name: groupName,
            stakePercent,
            cycleDays,
            memberCount,
          },
        });
      }
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="FINAL_REVIEW.EXE" color="pink" />

          <View style={styles.body}>
            {/* Step Progress */}
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.stepTag}>STEP 5/5</Text>
                <Text style={styles.stepStatus}>FINAL CONFIRMATION</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
              </View>
            </View>

            {/* Title */}
            <View style={styles.titleBlock}>
              <Text style={styles.headline}>SYSTEM CHECK</Text>
              <Text style={styles.subtitle}>
                Verify parameters before initialization.
              </Text>
            </View>

            {/* ─── Review Data Card ─── */}
            <View testID="step5-review-card" style={[styles.reviewCard, hardShadow(SHADOW_OFFSET_SM)]}>
              {/* Decorative corner blocks */}
              <View style={[styles.cornerSquare, { top: -4, left: -4, backgroundColor: C.pink }]} />
              <View style={[styles.cornerSquare, { top: -4, right: -4, backgroundColor: C.mint }]} />
              <View style={[styles.cornerSquare, { bottom: -4, left: -4, backgroundColor: C.cyan }]} />
              <View style={[styles.cornerSquare, { bottom: -4, right: -4, backgroundColor: C.yellow }]} />

              {/* Group Name Row */}
              <View style={styles.krewNameSection}>
                <Text style={styles.fieldLabel}>KREW DESIGNATION</Text>
                <Text style={styles.krewNameValue}>{groupName.toUpperCase()}</Text>
              </View>

              {/* 2-Column Grid: Tasks & Stake */}
              <View style={styles.gridRow}>
                <View style={styles.gridCol}>
                  <Text style={styles.fieldLabel}>ROUTINES</Text>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricIcon}>✓</Text>
                    <Text style={styles.metricText}>{taskCount}</Text>
                  </View>
                </View>

                <View style={styles.gridCol}>
                  <Text style={styles.fieldLabel}>STAKE & CYCLE</Text>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricIcon}>🪙</Text>
                    <Text style={styles.metricText}>{stakePercent} / {cycleDays}</Text>
                  </View>
                </View>
              </View>

              {/* Squad Members Row */}
              <View style={styles.membersSection}>
                <Text style={styles.fieldLabel}>ROSTER</Text>
                <View style={styles.membersRow}>
                  <View style={styles.avatarStack}>
                    <View style={[styles.avatarDot, { backgroundColor: C.pink, zIndex: 3 }]}>
                      <Text style={styles.avatarDotText}>U</Text>
                    </View>
                    <View style={[styles.avatarDot, { backgroundColor: C.cyan, zIndex: 2 }]}>
                      <Text style={styles.avatarDotText}>K</Text>
                    </View>
                    <View style={[styles.avatarDot, { backgroundColor: C.mint, zIndex: 1 }]}>
                      <Text style={styles.avatarDotText}>C</Text>
                    </View>
                  </View>
                  <Text style={styles.membersCountText}>{memberCount} Members Synced</Text>
                </View>
              </View>
            </View>

            {/* ─── Terms Confirmation Checkbox ─── */}
            <Pressable
              testID="step5-checkbox-terms"
              style={styles.checkboxRow}
              onPress={() => setConfirmedProtocol(!confirmedProtocol)}
            >
              <View style={[styles.checkboxBox, confirmedProtocol && styles.checkboxBoxChecked]}>
                {confirmedProtocol && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                I confirm that all parameters align with the Krew's directive protocol.
              </Text>
            </Pressable>

            {/* ─── Action Area ─── */}
            <View style={styles.actionRow}>
              <Pressable
                testID="step5-btn-back"
                style={styles.backBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.backBtnText}>BACK</Text>
              </Pressable>

              <Pressable
                testID="step5-btn-initialize"
                style={[
                  styles.initBtn,
                  (!confirmedProtocol || submitting) && styles.initBtnDisabled,
                  hardShadow(SHADOW_OFFSET_SM),
                ]}
                onPress={handleInitializePact}
                disabled={!confirmedProtocol || submitting}
                accessibilityRole="button"
              >
                <Text style={styles.initBtnIcon}>⚡</Text>
                <Text style={styles.initBtnText}>
                  {submitting ? 'INITIALIZING...' : 'INITIALIZE_PACT'}
                </Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
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

  progressHeader: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTag: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  stepStatus: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.white,
    flexDirection: 'row',
    padding: 2,
    gap: 2,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: C.surfaceVariant,
  },
  progressFilled: {
    backgroundColor: C.cyan,
  },

  titleBlock: {
    alignItems: 'center',
    gap: 4,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.black,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },

  // Review Card
  reviewCard: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.md,
    position: 'relative',
    marginVertical: 4,
  },
  cornerSquare: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: C.black,
  },
  krewNameSection: {
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    borderStyle: 'dashed',
    paddingBottom: S.xs,
    gap: 2,
  },
  fieldLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  krewNameValue: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
  },
  gridRow: {
    flexDirection: 'row',
    gap: S.md,
  },
  gridCol: {
    flex: 1,
    gap: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metricIcon: {
    fontSize: 14,
    color: C.primary,
    fontWeight: '800',
  },
  metricText: {
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '800',
  },
  membersSection: {
    borderTopWidth: BORDER_THIN,
    borderTopColor: C.black,
    borderStyle: 'dashed',
    paddingTop: S.xs,
    gap: 4,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  avatarDotText: {
    ...T.labelXs,
    fontSize: 10,
    fontWeight: '900',
    color: C.black,
  },
  membersCountText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '700',
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: C.secondaryContainer,
  },
  checkboxCheck: {
    fontSize: 14,
    fontWeight: '900',
    color: C.black,
  },
  checkboxLabel: {
    flex: 1,
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },

  // Action Area
  actionRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: 4,
  },
  backBtn: {
    flex: 1,
    height: 52,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  backBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  initBtn: {
    flex: 2,
    height: 52,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  initBtnDisabled: {
    opacity: 0.45,
    backgroundColor: C.surfaceDim,
  },
  initBtnIcon: {
    fontSize: 18,
  },
  initBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
