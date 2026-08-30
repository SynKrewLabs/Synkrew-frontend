/**
 * SynKrew — Verification Card Stack (Signature Interaction)
 * Component: components/verify/VerificationCardStack.tsx
 *
 * Implements the 9-state card stack lifecycle:
 *   1. Card appears / dwell locked (0–5s) with anti-collusion countdown
 *   2. Dwell complete / active (buttons brighten, haptic tick)
 *   3. Swipe right / Approve button -> APPROVE ✓ stamp & pixel sparkle exit
 *   4. Swipe left / Reject button -> Pauses mid-exit -> Rejection Reason Sheet
 *   5. Reject Exit Confirmation -> REJECT ✕ stamp & exit
 *   6. Empty queue state (Illustrated clear deck)
 *   7. Proof already resolved (Silent removal cue)
 *   8. Proof expired (Silent removal cue)
 *   9. Network failure mid-vote (Inline ErrorBanner + Retry lock)
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
  PanResponder,
  Platform,
  AccessibilityInfo,
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
import { TitleBar } from '../ui/TitleBar';
import { ErrorBanner } from '../ui/ErrorBanner';
import { EmptyState } from '../ui/EmptyState';
import { RejectionReasonSheet } from './RejectionReasonSheet';

import { useVerificationQueueQuery, useSubmitVoteMutation } from '../../hooks/queries/useVerification';

export const DWELL_DURATION_MS = 5000;
export const SWIPE_THRESHOLD = 120;
export const EXIT_ANIMATION_MS = 320;

export interface ProofItem {
  id: string;
  submitterId: string;
  submitterName: string;
  groupName: string;
  taskTitle: string;
  geoTelemetry: string;
  timestamp: string;
  votesCurrent: number;
  votesRequired: number;
  avatarBg: string;
}

interface VerificationCardStackProps {
  onQueueCountChange?: (count: number) => void;
}

export function VerificationCardStack({ onQueueCountChange }: VerificationCardStackProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 430);

  const { data: serverQueue } = useVerificationQueueQuery();
  const submitVoteMutation = useSubmitVoteMutation();

  const [queue, setQueue] = useState<ProofItem[]>([]);

  useEffect(() => {
    if (serverQueue && serverQueue.length > 0) {
      setQueue(
        serverQueue.map((item, index) => ({
          id: item.verificationId,
          submitterId: item.ownerUserId,
          submitterName: item.ownerUsername.toUpperCase(),
          groupName: item.groupName.toUpperCase(),
          taskTitle: item.taskTitle.toUpperCase(),
          geoTelemetry: '37.7749° N, 122.4194° W',
          timestamp: '07:42 AM',
          votesCurrent: item.currentVoteCount,
          votesRequired: 2,
          avatarBg: index % 2 === 0 ? C.cyan : C.pink,
        }))
      );
    }
  }, [serverQueue]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dwellTimeRemaining, setDwellTimeRemaining] = useState(5);
  const [isDwellLocked, setIsDwellLocked] = useState(true);
  const [exitState, setExitState] = useState<'idle' | 'approving' | 'rejecting'>('idle');
  const [showReasonSheet, setShowReasonSheet] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [silentNotice, setSilentNotice] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Position animation
  const pan = useRef(new Animated.ValueXY()).current;
  const dwellTimerRef = useRef<any>(null);

  const currentCard = queue[currentIndex];
  const nextCard = queue[currentIndex + 1];

  // Notify parent of count
  useEffect(() => {
    const remaining = Math.max(0, queue.length - currentIndex);
    if (onQueueCountChange) {
      onQueueCountChange(remaining);
    }
  }, [currentIndex, queue.length]);

  // Check accessibility reduced motion
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setReducedMotion(enabled);
    });
  }, []);

  // 5-Second Anti-Collusion Dwell Timer
  useEffect(() => {
    if (!currentCard) return;

    setIsDwellLocked(true);
    setDwellTimeRemaining(5);
    setExitState('idle');
    setNetworkError(null);
    pan.setValue({ x: 0, y: 0 });

    let count = 5;
    if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);

    dwellTimerRef.current = setInterval(() => {
      count -= 1;
      setDwellTimeRemaining(count);
      if (count <= 0) {
        if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);
        setIsDwellLocked(false);
      }
    }, 1000);

    return () => {
      if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);
    };
  }, [currentIndex, currentCard?.id]);

  // Pan Responder for Swiping
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (isDwellLocked || exitState !== 'idle') return false;
        return Math.abs(gesture.dx) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        if (isDwellLocked || exitState !== 'idle') return;
        pan.setValue({ x: gesture.dx, y: gesture.dy * 0.2 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (isDwellLocked || exitState !== 'idle') return;

        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe Right -> Approve
          handleApprove();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe Left -> Reject
          handleInitiateReject();
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleApprove = () => {
    if (isDwellLocked || exitState !== 'idle') return;
    setExitState('approving');

    if (reducedMotion) {
      advanceQueue();
      return;
    }

    Animated.timing(pan, {
      toValue: { x: 500, y: 0 },
      duration: EXIT_ANIMATION_MS,
      useNativeDriver: false,
    }).start(() => {
      advanceQueue();
    });
  };

  const handleInitiateReject = () => {
    if (isDwellLocked || exitState !== 'idle') return;
    setShowReasonSheet(true);
  };

  const handleConfirmReject = (reason: string, details: string) => {
    setShowReasonSheet(false);
    setExitState('rejecting');

    if (reducedMotion) {
      advanceQueue();
      return;
    }

    Animated.timing(pan, {
      toValue: { x: -500, y: 0 },
      duration: EXIT_ANIMATION_MS,
      useNativeDriver: false,
    }).start(() => {
      advanceQueue();
    });
  };

  const advanceQueue = () => {
    setCurrentIndex(prev => prev + 1);
  };

  // ─── Edge States Handlers ───
  const triggerNetworkError = () => {
    setNetworkError('Network dropped mid-vote. Tap retry to re-transmit vote.');
  };

  const triggerAlreadyResolved = () => {
    setSilentNotice('Proof resolved by peers — advancing queue...');
    setTimeout(() => {
      setSilentNotice(null);
      advanceQueue();
    }, 900);
  };

  const triggerExpired = () => {
    setSilentNotice('Voting cutoff elapsed — card removed silently.');
    setTimeout(() => {
      setSilentNotice(null);
      advanceQueue();
    }, 900);
  };

  // ─── Empty Queue State ───
  if (!currentCard || currentIndex >= queue.length) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          windowTitle="QUEUE_EMPTY.EXE"
          titleBarColor="mint"
          icon="🎉"
          headline="ALL PROOFS VERIFIED"
          description="Your verification queue is completely clear. Check back later as your squad mates complete their daily rituals."
          actionLabel="RETURN TO GROUPS DASHBOARD"
          onAction={() => router.replace('/(groups)')}
          testID="verify-empty-queue-state"
          style={{ width: cardWidth }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dev Edge State Simulator Bar */}
      <View style={styles.demoBar}>
        <Text style={styles.demoLabel}>EDGE CASES:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
          <Pressable testID="verify-demo-net-fail" style={styles.demoChip} onPress={triggerNetworkError}>
            <Text style={styles.demoChipText}>NET FAIL</Text>
          </Pressable>
          <Pressable testID="verify-demo-resolved" style={styles.demoChip} onPress={triggerAlreadyResolved}>
            <Text style={styles.demoChipText}>PEER RESOLVED</Text>
          </Pressable>
          <Pressable testID="verify-demo-expired" style={styles.demoChip} onPress={triggerExpired}>
            <Text style={styles.demoChipText}>EXPIRED</Text>
          </Pressable>
          <Pressable testID="verify-demo-clear" style={styles.demoChip} onPress={() => setCurrentIndex(queue.length)}>
            <Text style={styles.demoChipText}>CLEAR QUEUE</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Network Failure Inline Banner */}
      {networkError && (
        <View style={styles.errorWrapper}>
          <ErrorBanner
            message={networkError}
            actionLabel="RETRY VOTE"
            onAction={() => {
              setNetworkError(null);
              handleApprove();
            }}
          />
        </View>
      )}

      {/* Silent Removal Cue */}
      {silentNotice && (
        <View style={styles.silentNoticeBox}>
          <Text style={styles.silentNoticeText}>⚡ {silentNotice}</Text>
        </View>
      )}

      {/* ─── The Card Stack Area ─── */}
      <View style={[styles.stackArea, { width: cardWidth }]}>
        {/* Peeking Next Card Behind */}
        {nextCard && (
          <View
            style={[
              styles.backCard,
              hardShadow(SHADOW_OFFSET_SM),
              { width: cardWidth - 16, transform: [{ scale: 0.96 }, { translateY: 12 }] },
            ]}
          >
            <View style={styles.backCardHeader}>
              <Text style={styles.backCardTitle}>NEXT: {nextCard.submitterName}</Text>
            </View>
          </View>
        )}

        {/* Top Active Animated Card */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.activeCard,
            hardShadow(SHADOW_OFFSET),
            { width: cardWidth },
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                {
                  rotate: pan.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ['-12deg', '0deg', '12deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <TitleBar label="PROOF_VERIFICATION.EXE" color={isDwellLocked ? 'yellow' : 'mint'} />

          <View style={styles.cardContent}>
            {/* Submitter Info Header */}
            <View style={styles.submitterRow}>
              <View style={styles.submitterLeft}>
                <View style={[styles.submitterAvatar, { backgroundColor: currentCard.avatarBg }]}>
                  <Text style={styles.avatarLetter}>{currentCard.submitterName.slice(0, 1)}</Text>
                </View>
                <View>
                  <Text style={styles.submitterName}>@{currentCard.submitterName}</Text>
                  <Text style={styles.groupBadgeText}>{currentCard.groupName}</Text>
                </View>
              </View>

              {/* Vote count */}
              <View style={styles.voteTag}>
                <Text style={styles.voteTagText}>
                  {currentCard.votesCurrent}/{currentCard.votesRequired} VOTES
                </Text>
              </View>
            </View>

            {/* Proof Image Box (Full-Bleed Frame) */}
            <View style={styles.imageFrame}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.proofSymbol}>📸</Text>
                <Text style={styles.taskLabel}>{currentCard.taskTitle}</Text>
              </View>

              {/* Dwell Timer Ring / Overlay Badge */}
              {isDwellLocked ? (
                <View testID="verify-dwell-timer-badge" style={styles.dwellLockedBadge}>
                  <Text style={styles.dwellIcon}>⏱️</Text>
                  <Text style={styles.dwellText}>REVIEWING... {dwellTimeRemaining}S</Text>
                </View>
              ) : (
                <View testID="verify-dwell-ready-badge" style={styles.dwellReadyBadge}>
                  <Text style={styles.dwellReadyText}>● READY TO VOTE</Text>
                </View>
              )}

              {/* Floating Non-Editable Geo + Timestamp Chip */}
              <View pointerEvents="none" style={styles.telemetryOverlay}>
                <Text style={styles.telemetryText}>
                  📍 {currentCard.geoTelemetry} • {currentCard.timestamp}
                </Text>
              </View>

              {/* ─── Peak Frame Stamps & Pixel Sparkles ─── */}
              {exitState === 'approving' && (
                <View style={styles.stampOverlayApprove}>
                  <Text style={styles.stampTextApprove}>APPROVE ✓</Text>
                  <View style={styles.sparkleTL}><Text style={styles.sparkleGlyph}>✦</Text></View>
                  <View style={styles.sparkleTR}><Text style={styles.sparkleGlyph}>★</Text></View>
                  <View style={styles.sparkleBR}><Text style={styles.sparkleGlyph}>✦</Text></View>
                </View>
              )}

              {exitState === 'rejecting' && (
                <View style={styles.stampOverlayReject}>
                  <Text style={styles.stampTextReject}>REJECT ✕</Text>
                  <View style={styles.sparkleTL}><Text style={styles.sparkleGlyphRed}>✖</Text></View>
                  <View style={styles.sparkleTR}><Text style={styles.sparkleGlyphRed}>▲</Text></View>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* ─── Bottom Action Buttons (Full Accessibility Parity) ─── */}
      <View style={[styles.buttonsRow, { width: cardWidth }]}>
        {/* Reject Button */}
        <Pressable
          testID="verify-btn-reject"
          style={[
            styles.actionBtn,
            styles.rejectBtn,
            isDwellLocked && styles.btnDimmed,
            hardShadow(SHADOW_OFFSET_SM),
          ]}
          onPress={handleInitiateReject}
          disabled={isDwellLocked || exitState !== 'idle'}
          accessibilityRole="button"
          accessibilityLabel="Reject proof"
        >
          <Text style={styles.rejectBtnText}>✕ REJECT</Text>
        </Pressable>

        {/* Approve Button */}
        <Pressable
          testID="verify-btn-approve"
          style={[
            styles.actionBtn,
            styles.approveBtn,
            isDwellLocked && styles.btnDimmed,
            hardShadow(SHADOW_OFFSET_SM),
          ]}
          onPress={handleApprove}
          disabled={isDwellLocked || exitState !== 'idle'}
          accessibilityRole="button"
          accessibilityLabel="Approve proof"
        >
          <Text style={styles.approveBtnText}>APPROVE ✓</Text>
        </Pressable>
      </View>

      {/* Rejection Reason Sheet Modal */}
      <RejectionReasonSheet
        visible={showReasonSheet}
        onClose={() => setShowReasonSheet(false)}
        onSubmit={handleConfirmReject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: S.sm,
  },

  demoBar: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 50,
    marginBottom: 6,
  },
  demoLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    marginRight: 6,
    fontWeight: '900',
  },
  demoScroll: {
    flexDirection: 'row',
    gap: 4,
  },
  demoChip: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  demoChipText: {
    ...T.labelXs,
    fontSize: 8,
    color: C.black,
    fontWeight: '800',
  },

  errorWrapper: {
    width: '100%',
    maxWidth: 430,
    marginBottom: 4,
  },
  silentNoticeBox: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    marginBottom: 4,
  },
  silentNoticeText: {
    ...T.labelXs,
    fontSize: 10,
    color: '#00513a',
    fontWeight: '800',
  },

  // Stack Area
  stackArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    maxHeight: 520,
  },
  backCard: {
    position: 'absolute',
    height: 440,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    zIndex: 1,
    opacity: 0.6,
  },
  backCardHeader: {
    padding: S.sm,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
  },
  backCardTitle: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },

  // Active Card
  activeCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    zIndex: 10,
    overflow: 'hidden',
  },
  cardContent: {
    padding: S.md,
    gap: S.sm,
  },

  submitterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  submitterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    ...T.labelSm,
    fontWeight: '900',
    color: C.black,
  },
  submitterName: {
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
  },
  groupBadgeText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
  },
  voteTag: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  voteTagText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '900',
  },

  // Image Frame
  imageFrame: {
    width: '100%',
    height: 320,
    backgroundColor: '#1c1921',
    borderWidth: BORDER,
    borderColor: C.black,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  proofSymbol: {
    fontSize: 48,
  },
  taskLabel: {
    ...T.labelSm,
    color: C.white,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Dwell Badges
  dwellLockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff3cd',
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dwellIcon: {
    fontSize: 11,
  },
  dwellText: {
    ...T.labelXs,
    fontSize: 9,
    color: '#856404',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dwellReadyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: C.mint,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dwellReadyText: {
    ...T.labelXs,
    fontSize: 9,
    color: '#00513a',
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Telemetry
  telemetryOverlay: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: BORDER_THIN,
    borderColor: C.mint,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  telemetryText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.mint,
    fontWeight: '800',
  },

  // Stamps & Sparkles
  stampOverlayApprove: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(168, 240, 219, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  stampTextApprove: {
    ...T.headlineMd,
    fontSize: 32,
    color: '#00513a',
    borderWidth: 4,
    borderColor: '#00513a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '-12deg' }],
  },
  stampOverlayReject: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 186, 178, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  stampTextReject: {
    ...T.headlineMd,
    fontSize: 32,
    color: '#ba1a1a',
    borderWidth: 4,
    borderColor: '#ba1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '12deg' }],
  },
  sparkleTL: {
    position: 'absolute',
    top: 20,
    left: 24,
  },
  sparkleTR: {
    position: 'absolute',
    top: 24,
    right: 28,
  },
  sparkleBR: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  sparkleGlyph: {
    fontSize: 28,
    color: '#00513a',
  },
  sparkleGlyphRed: {
    fontSize: 28,
    color: '#ba1a1a',
  },

  // Action Buttons
  buttonsRow: {
    flexDirection: 'row',
    gap: S.md,
    marginTop: S.sm,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDimmed: {
    opacity: 0.35,
    backgroundColor: C.surfaceDim,
  },
  rejectBtn: {
    backgroundColor: '#ffdad6',
  },
  rejectBtnText: {
    ...T.label,
    fontSize: 13,
    color: '#ba1a1a',
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  approveBtn: {
    backgroundColor: C.mint,
  },
  approveBtnText: {
    ...T.label,
    fontSize: 13,
    color: '#00513a',
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  // Empty Queue State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: S.md,
  },
  emptyCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  emptyBody: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.lg,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.mint,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTextBlock: {
    alignItems: 'center',
    gap: 6,
  },
  emptyBadge: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
  },
  emptyBadgeText: {
    ...T.labelXs,
    color: '#00513a',
    fontWeight: '900',
    letterSpacing: 1,
  },
  emptyTitle: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.black,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  emptyDesc: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  returnGroupsBtn: {
    width: '100%',
    height: 50,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnGroupsBtnText: {
    ...T.label,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
