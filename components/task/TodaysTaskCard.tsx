/**
 * SynKrew — Today's Task Card (Core State Machine)
 * Component: components/task/TodaysTaskCard.tsx
 *
 * Implements all 9 core task instance lifecycle states:
 *   1. Not Started (Live cutoff countdown + Capture Proof CTA + Skip Day shield)
 *   2. Capturing (Active viewfinder transition)
 *   3. Uploading (Hollow frame block-fill progress bar)
 *   4. Pending Review (Awaiting 2-of-3 quorum + 12h auto-pass countdown)
 *   5. Verified (2-of-3 approved + 50 coins reward + streak increment)
 *   6. Failed (2-of-3 rejected + stake slashed + streak reset)
 *   7. Auto-Passed (Window expired with no majority quorum)
 *   8. Expired (Cutoff passed with no submission)
 *   9. Skipped (Monthly skip shield applied)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
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
} from '../../theme/tokens';

export type TaskCardState =
  | 'not_started'
  | 'uploading'
  | 'pending_review'
  | 'verified'
  | 'failed'
  | 'auto_passed'
  | 'expired'
  | 'skipped';

interface TodaysTaskCardProps {
  initialState?: TaskCardState;
  taskTitle?: string;
  taskDesc?: string;
  targetMetric?: string;
  onCapturePress?: () => void;
}

// TODO: remove dev toggle once Verification tab feeds real status

export function TodaysTaskCard({
  initialState = 'not_started',
  taskTitle = '5K Outdoor Run',
  taskDesc = 'Complete a 5 kilometer run before 8:00 AM. Route tracking must be visible in proof submission.',
  targetMetric = '0.0 / 5.0 KM',
  onCapturePress,
}: TodaysTaskCardProps) {
  const [taskState, setTaskState] = useState<TaskCardState>(initialState);
  const [uploadProgress, setUploadProgress] = useState(65);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 15 });

  // Live ticking countdown to 11:59 PM cutoff
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleCapture = () => {
    if (onCapturePress) {
      onCapturePress();
    } else {
      router.push('/(task)/capture');
    }
  };

  const handleApplySkipDay = () => {
    Alert.alert(
      'APPLY SKIP DAY SHIELD',
      'Use 1 of your 2 monthly Skip Day shields? Your streak will be protected without submitting proof today.',
      [
        { text: 'CANCEL', style: 'cancel' },
        { text: 'USE SHIELD', onPress: () => setTaskState('skipped') },
      ]
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* Dev-Only State Machine Switcher */}
      <View style={styles.devBar}>
        <Text style={styles.devBarLabel}>DEV STATE:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.devScroll}>
          {(['not_started', 'uploading', 'pending_review', 'verified', 'failed', 'auto_passed', 'expired', 'skipped'] as TaskCardState[]).map(st => (
            <Pressable
              key={st}
              testID={`task-card-state-${st}`}
              style={[styles.devChip, taskState === st && styles.devChipActive]}
              onPress={() => setTaskState(st)}
            >
              <Text style={[styles.devChipText, taskState === st && styles.devChipTextActive]}>
                {st.replace(/_/g, ' ').toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Main OS Window Card */}
      <View testID="todays-task-card" style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
        {/* Title Bar */}
        <View style={styles.titleBar}>
          <View style={styles.titleBarLeft}>
            <Text style={styles.titleIcon}>⚡</Text>
            <Text style={styles.titleText}>TODAY'S MISSION</Text>
          </View>
          <Text style={styles.windowLabel}>RITUAL_01.EXE</Text>
        </View>

        {/* Card Body */}
        <View style={styles.body}>
          {/* Mission Info */}
          <View style={styles.missionHeader}>
            <View>
              <Text style={styles.taskTitleText}>{taskTitle.toUpperCase()}</Text>
              <Text style={styles.taskDescText}>{taskDesc}</Text>
            </View>
          </View>

          {/* ─── State Variant 1: Not Started ─── */}
          {taskState === 'not_started' && (
            <View style={styles.stateContainer}>
              {/* Countdown & Status */}
              <View style={styles.statusBox}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusDot}>○</Text>
                  <Text style={styles.statusLabel}>STATUS: NOT STARTED</Text>
                </View>
                <Text style={styles.metricText}>{targetMetric}</Text>
              </View>

              <View style={styles.countdownBadge}>
                <Text style={styles.countdownIcon}>⏱️</Text>
                <Text style={styles.countdownText}>CUTOFF IN {formatCountdown()}</Text>
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <Pressable
                  testID="task-btn-capture"
                  style={[styles.captureBtn, hardShadow(SHADOW_OFFSET_SM)]}
                  onPress={handleCapture}
                  accessibilityRole="button"
                >
                  <Text style={styles.captureIcon}>📷</Text>
                  <Text style={styles.captureText}>CAPTURE PROOF</Text>
                </Pressable>

                <Pressable
                  testID="task-btn-skip-day"
                  style={styles.skipBtn}
                  onPress={handleApplySkipDay}
                  accessibilityRole="button"
                >
                  <Text style={styles.skipBtnText}>🛡️ SKIP DAY (1 LEFT)</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ─── State Variant 2: Uploading ─── */}
          {taskState === 'uploading' && (
            <View style={styles.stateContainer}>
              <View style={[styles.uploadBox, hardShadow(SHADOW_OFFSET_SM)]}>
                <View style={styles.uploadHeader}>
                  <Text style={styles.uploadStatus}>UPLOADING_PAYLOAD.RAW</Text>
                  <Text style={styles.uploadPercent}>{uploadProgress}%</Text>
                </View>

                {/* Hollow frame block-fill progress bar */}
                <View style={styles.progressFrame}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>

                <Text style={styles.encryptingNotice}>&gt; Encrypting GPS & cryptographic sensor stamp...</Text>
              </View>

              <Pressable
                testID="task-btn-cancel-upload"
                style={styles.cancelUploadBtn}
                onPress={() => setTaskState('not_started')}
              >
                <Text style={styles.cancelUploadText}>CANCEL & DISCARD PHOTO</Text>
              </Pressable>
            </View>
          )}

          {/* ─── State Variant 3: Pending Review ─── */}
          {taskState === 'pending_review' && (
            <View style={styles.stateContainer}>
              <View style={[styles.pendingBadge, hardShadow(1)]}>
                <Text style={styles.badgeGlyph}>⏳</Text>
                <Text style={styles.pendingBadgeText}>IN PEER REVIEW (0/3 VOTES)</Text>
              </View>

              <View style={styles.reviewDetailsBox}>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>AUTO-PASS TIMEOUT</Text>
                  <Text style={styles.reviewVal}>11:58:12 REMAINING</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>QUORUM REQUIRED</Text>
                  <Text style={styles.reviewVal}>2 OF 3 PEER APPROVALS</Text>
                </View>
              </View>

              <View style={styles.lockedNoteBox}>
                <Text style={styles.lockedNoteText}>🔒 Proof transmitted. Awaiting squad member verification.</Text>
              </View>
            </View>
          )}

          {/* ─── State Variant 4: Verified ─── */}
          {taskState === 'verified' && (
            <View style={styles.stateContainer}>
              <View style={[styles.verifiedBadge, hardShadow(1)]}>
                <Text style={styles.badgeGlyph}>✓</Text>
                <Text style={styles.verifiedBadgeText}>VERIFIED (2/3 APPROVED)</Text>
              </View>

              <View style={styles.rewardsRow}>
                <View style={[styles.rewardChip, { backgroundColor: C.mint }]}>
                  <Text style={styles.rewardText}>🪙 +50 SYNCOINS UNLOCKED</Text>
                </View>
                <View style={[styles.rewardChip, { backgroundColor: C.pink }]}>
                  <Text style={styles.rewardText}>🔥 13 DAY STREAK</Text>
                </View>
              </View>

              <View style={styles.terminalNoticeBox}>
                <Text style={styles.terminalNoticeText}>Daily ritual completed. Vault rewards disbursed.</Text>
              </View>
            </View>
          )}

          {/* ─── State Variant 5: Failed ─── */}
          {taskState === 'failed' && (
            <View style={styles.stateContainer}>
              <View style={[styles.failedBadge, hardShadow(1)]}>
                <Text style={styles.badgeGlyph}>✕</Text>
                <Text style={styles.failedBadgeText}>FAILED (2/3 REJECTED)</Text>
              </View>

              <View style={styles.penaltyBox}>
                <Text style={styles.penaltyTitle}>STAKE PENALTY EXECUTED</Text>
                <Text style={styles.penaltyText}>-25 SynCoins slashed into group pool. Streak reset to 0.</Text>
              </View>
            </View>
          )}

          {/* ─── State Variant 6: Auto-Passed ─── */}
          {taskState === 'auto_passed' && (
            <View style={styles.stateContainer}>
              <View style={[styles.autoPassedBadge, hardShadow(1)]}>
                <Text style={styles.badgeGlyph}>⚡</Text>
                <Text style={styles.autoPassedBadgeText}>AUTO-PASSED (12H TIMEOUT)</Text>
              </View>

              <View style={styles.neutralNoticeBox}>
                <Text style={styles.neutralNoticeText}>
                  Review window elapsed with no majority quorum. Stake preserved safely.
                </Text>
              </View>
            </View>
          )}

          {/* ─── State Variant 7: Expired ─── */}
          {taskState === 'expired' && (
            <View style={styles.stateContainer}>
              <View style={[styles.expiredBadge, hardShadow(1)]}>
                <Text style={styles.badgeGlyph}>⚠️</Text>
                <Text style={styles.expiredBadgeText}>EXPIRED (NO SUBMISSION)</Text>
              </View>

              <View style={styles.penaltyBox}>
                <Text style={styles.penaltyTitle}>CUTOFF WINDOW PASSED</Text>
                <Text style={styles.penaltyText}>11:59 PM deadline passed without proof. Daily stake slashed.</Text>
              </View>
            </View>
          )}

          {/* ─── State Variant 8: Skipped ─── */}
          {taskState === 'skipped' && (
            <View style={styles.stateContainer}>
              <View style={[styles.skippedBadge, hardShadow(1)]}>
                <Text style={styles.badgeGlyph}>🛡️</Text>
                <Text style={styles.skippedBadgeText}>SKIPPED (SHIELD APPLIED)</Text>
              </View>

              <View style={styles.shieldNoticeBox}>
                <Text style={styles.shieldNoticeTitle}>STREAK PROTECTED</Text>
                <Text style={styles.shieldNoticeText}>1 of 2 monthly shields used. No stake forfeited.</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 6,
  },

  // Dev state switcher
  devBar: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
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
    fontWeight: '900',
  },
  devScroll: {
    flexDirection: 'row',
    gap: 4,
  },
  devChip: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  devChipActive: {
    backgroundColor: C.pink,
  },
  devChipText: {
    ...T.labelXs,
    fontSize: 8,
    color: C.black,
    fontWeight: '700',
  },
  devChipTextActive: {
    fontWeight: '900',
  },

  // OS Window Card
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  titleBar: {
    height: 38,
    backgroundColor: C.secondaryContainer,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  titleBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleIcon: {
    fontSize: 16,
  },
  titleText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  windowLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  body: {
    padding: S.md,
    gap: S.md,
  },

  missionHeader: {
    gap: 4,
  },
  taskTitleText: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
  },
  taskDescText: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },

  stateContainer: {
    gap: S.sm,
  },

  // Status Box
  statusBox: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    fontSize: 14,
    color: C.outline,
    fontWeight: '900',
  },
  statusLabel: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  metricText: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },

  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff3cd',
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingVertical: 4,
  },
  countdownIcon: {
    fontSize: 12,
  },
  countdownText: {
    ...T.labelXs,
    color: '#856404',
    fontWeight: '900',
    letterSpacing: 1,
  },

  // Actions
  actionsRow: {
    gap: S.xs,
    marginTop: 2,
  },
  captureBtn: {
    width: '100%',
    height: 50,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  captureIcon: {
    fontSize: 20,
  },
  captureText: {
    ...T.label,
    fontSize: 14,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  skipBtn: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },

  // Uploading
  uploadBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: 6,
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadStatus: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  uploadPercent: {
    ...T.labelSm,
    color: C.primary,
    fontWeight: '900',
  },
  progressFrame: {
    height: 14,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.primary,
  },
  encryptingNotice: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
  },
  cancelUploadBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  cancelUploadText: {
    ...T.labelXs,
    color: '#ba1a1a',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  // Badges (Shared visual anatomy across terminal states)
  badgeGlyph: {
    fontSize: 14,
    fontWeight: '900',
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingBadgeText: {
    ...T.labelSm,
    color: '#856404',
    fontWeight: '900',
  },
  verifiedBadge: {
    backgroundColor: C.mint,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadgeText: {
    ...T.labelSm,
    color: '#00513a',
    fontWeight: '900',
  },
  failedBadge: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  failedBadgeText: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '900',
  },
  autoPassedBadge: {
    backgroundColor: C.yellow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  autoPassedBadgeText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
  },
  expiredBadge: {
    backgroundColor: C.surfaceDim,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expiredBadgeText: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '900',
  },
  skippedBadge: {
    backgroundColor: C.cyan,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skippedBadgeText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
  },

  // Review / Rewards / Penalties
  reviewDetailsBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 4,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  reviewVal: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '900',
  },
  lockedNoteBox: {
    paddingVertical: 2,
    alignItems: 'center',
  },
  lockedNoteText: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },

  rewardsRow: {
    flexDirection: 'row',
    gap: S.sm,
  },
  rewardChip: {
    flex: 1,
    padding: S.sm,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
  },
  rewardText: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '900',
  },
  terminalNoticeBox: {
    alignItems: 'center',
  },
  terminalNoticeText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },

  penaltyBox: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 2,
  },
  penaltyTitle: {
    ...T.labelXs,
    color: '#ba1a1a',
    fontWeight: '900',
  },
  penaltyText: {
    ...T.bodyMd,
    fontSize: 11,
    color: '#53424b',
  },

  neutralNoticeBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
  },
  neutralNoticeText: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },

  shieldNoticeBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 2,
  },
  shieldNoticeTitle: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '900',
  },
  shieldNoticeText: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
});
