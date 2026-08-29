/**
 * SynKrew — Milestone Celebration
 * Route: app/(settlement)/milestone.tsx
 *
 * Triggered at 50/75/100% streak thresholds.
 * Also reachable via notification deep-link when app was closed when milestone hit
 * (same screen, different entry — params carry context from the notification payload).
 *
 * Milestone bonus split copy is kept general per §2.6 open question
 * (flat pool vs. percentage-scaled is unresolved).
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  C, S, T,
  BORDER, BORDER_THIN, SHADOW_OFFSET, SHADOW_OFFSET_SM,
  hardShadow, gridBgStyle,
} from '../../theme/tokens';

type MilestoneType = '50' | '75' | '100';

const MILESTONE_CONFIG: Record<MilestoneType, {
  label: string;
  color: string;
  icon: string;
  bonusLabel: string;
  tagline: string;
}> = {
  '50': {
    label: '50% MILESTONE',
    color: C.cyan,
    icon: '⚡',
    bonusLabel: '+50 BONUS COINS',
    tagline: 'HALFWAY THERE. THE KREW IS LOCKED IN.',
  },
  '75': {
    label: '75% MILESTONE',
    color: C.mint,
    icon: '🔥',
    bonusLabel: '+75 BONUS COINS',
    tagline: 'THREE QUARTERS DONE. MOMENTUM IS EVERYTHING.',
  },
  '100': {
    label: '100% MILESTONE',
    color: C.yellow,
    icon: '👑',
    bonusLabel: '+100 BONUS COINS',
    tagline: 'CYCLE COMPLETE. LEGENDARY STATUS ACHIEVED.',
  },
};

// Sparkle positions — retro design uses discrete sparkle accents, not gradients
const SPARKLES = [
  { top: '10%', left: '8%', char: '✦', size: 18 },
  { top: '15%', right: '10%', char: '★', size: 14 },
  { top: '30%', left: '5%', char: '✦', size: 12 },
  { top: '20%', right: '20%', char: '✦', size: 20 },
  { top: '5%', left: '40%', char: '★', size: 16 },
] as const;

export default function MilestoneCelebration() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  // milestone param: '50' | '75' | '100'
  const milestone = (['50', '75', '100'].includes(String(params.milestone))
    ? String(params.milestone)
    : '75') as MilestoneType;

  const groupName = params.group ? String(params.group) : 'MORNING RUNNERS';
  const fromNotif = params.from === 'notification';

  const cfg = MILESTONE_CONFIG[milestone];

  // Entrance animation
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Sparkle pulse
  const sparklePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparklePulse, { toValue: 1.3, duration: 600, useNativeDriver: true }),
        Animated.timing(sparklePulse, { toValue: 0.8, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [scaleAnim, opacityAnim, sparklePulse]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Decorative sparkles */}
      {SPARKLES.map((sp, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.sparkle,
            {
              top: sp.top as any,
              left: 'left' in sp ? (sp as any).left : undefined,
              right: 'right' in sp ? (sp as any).right : undefined,
              fontSize: sp.size,
              transform: [{ scale: sparklePulse }],
              opacity: opacityAnim,
            },
          ]}
        >
          {sp.char}
        </Animated.Text>
      ))}

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            width: cardWidth,
            alignSelf: 'center',
            gap: S.lg,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          {/* Deep-link context banner */}
          {fromNotif && (
            <View style={styles.notifBanner}>
              <Text style={styles.notifBannerText}>
                📬 YOU REACHED THIS MILESTONE WHILE THE APP WAS CLOSED
              </Text>
            </View>
          )}

          {/* Main celebration card */}
          <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
            <View style={[styles.titleBar, { backgroundColor: cfg.color }]}>
              <View style={styles.dots}>
                <View style={[styles.dot, { backgroundColor: C.pink }]} />
                <View style={[styles.dot, { backgroundColor: C.white }]} />
                <View style={[styles.dot, { backgroundColor: C.mint }]} />
              </View>
              <Text style={styles.titleBarLabel}>MILESTONE_{milestone}PCT.EXE</Text>
              <View style={{ width: 48 }} />
            </View>

            <View style={styles.body}>
              {/* Trophy frame */}
              <View style={[styles.trophyFrame, { backgroundColor: cfg.color }, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={styles.trophyIcon}>{cfg.icon}</Text>
              </View>

              {/* Labels */}
              <View style={styles.textBlock}>
                <View style={[styles.milestonePill, { backgroundColor: cfg.color }]}>
                  <Text style={styles.milestonePillText}>{cfg.label}</Text>
                </View>
                <Text style={styles.groupName}>{groupName}</Text>
                <Text style={styles.tagline}>{cfg.tagline}</Text>
              </View>

              {/* Bonus breakdown */}
              <View style={styles.bonusCard}>
                <Text style={styles.bonusCardTitle}>MILESTONE BONUS</Text>
                <View style={styles.bonusRow}>
                  <Text style={styles.bonusAmount}>{cfg.bonusLabel}</Text>
                </View>
                <Text style={styles.bonusNote}>
                  Split evenly across all members who reached this milestone today.
                  {'\n'}
                  <Text style={styles.bonusNoteItalic}>
                    (Exact allocation visible in your Wallet ledger)
                  </Text>
                </Text>
              </View>

              {/* Milestone progress bar — show all 3 segments */}
              <View style={styles.milestoneSection}>
                <Text style={styles.milestoneSectionLabel}>CYCLE PROGRESS</Text>
                <View style={styles.milestoneBarOuter}>
                  <View style={[
                    styles.milestoneBarFill,
                    {
                      width: milestone === '50' ? '50%' : milestone === '75' ? '75%' : '100%',
                      backgroundColor: cfg.color,
                    },
                  ]} />
                  {['50%', '75%', '100%'].map((mark) => (
                    <View
                      key={mark}
                      style={[styles.milestoneMarker, { left: mark as any }]}
                    />
                  ))}
                </View>
                <View style={styles.milestoneLabels}>
                  <Text style={styles.milestoneMarkLabel}>50%</Text>
                  <Text style={styles.milestoneMarkLabel}>75%</Text>
                  <Text style={styles.milestoneMarkLabel}>100%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* CTAs */}
          <Pressable
            testID="milestone-btn-view-wallet"
            style={[styles.primaryBtn, { backgroundColor: cfg.color }, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.push('/(wallet)')}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>VIEW WALLET LEDGER →</Text>
          </Pressable>

          <Pressable
            testID="milestone-btn-return-group"
            style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.replace('/(groups)/detail')}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryBtnText}>RETURN TO GROUP</Text>
          </Pressable>
        </Animated.View>
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
    padding: S.md,
    paddingBottom: S.xxl,
    overflow: 'visible',
  },
  sparkle: {
    position: 'absolute',
    color: C.yellow,
    zIndex: 0,
    pointerEvents: 'none',
  } as any,
  notifBanner: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.xs,
    marginBottom: S.xs,
  },
  notifBannerText: {
    ...T.labelXs,
    color: C.onSurface,
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  titleBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: BORDER_THIN, borderColor: C.black,
  },
  titleBarLabel: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  body: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.lg,
  },
  trophyFrame: {
    width: 88,
    height: 88,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyIcon: {
    fontSize: 40,
  },
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  milestonePill: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  milestonePillText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 2,
  },
  groupName: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.onSurface,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tagline: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  bonusCard: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.lg,
    gap: S.xs,
  },
  bonusCardTitle: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusAmount: {
    ...T.headlineMd,
    fontSize: 20,
    color: '#006c4e',
    textTransform: 'uppercase',
  },
  bonusNote: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },
  bonusNoteItalic: {
    fontStyle: 'italic',
    color: C.onSurfaceVariant,
  },
  milestoneSection: {
    width: '100%',
    gap: S.xs,
  },
  milestoneSectionLabel: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  milestoneBarOuter: {
    height: 20,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerHigh,
    position: 'relative',
    overflow: 'hidden',
  },
  milestoneBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  milestoneMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: BORDER,
    backgroundColor: C.black,
  },
  milestoneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  milestoneMarkLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
  },
  primaryBtn: {
    width: '100%',
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  primaryBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  secondaryBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
