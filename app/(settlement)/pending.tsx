/**
 * SynKrew — Settlement Pending/Processing
 * Route: app/(settlement)/pending.tsx
 *
 * Brief transient state shown when settlement is running async.
 * Should feel calm and brief — not like a long loading skeleton.
 * If this state persists unexpectedly, it's worth flagging upstream.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C, S, T,
  BORDER, BORDER_THIN, SHADOW_OFFSET, SHADOW_OFFSET_SM,
  hardShadow, gridBgStyle,
} from '../../theme/tokens';

export default function SettlementPending() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);

  // Pulsing block animation — hollow-frame block-fill, not a spinner
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Block-fill progress — 3 segments animate sequentially
  const block1 = useRef(new Animated.Value(0)).current;
  const block2 = useRef(new Animated.Value(0)).current;
  const block3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const seq = Animated.loop(
      Animated.sequence([
        Animated.timing(block1, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(block2, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.timing(block3, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(block1, { toValue: 0, duration: 200, useNativeDriver: false }),
          Animated.timing(block2, { toValue: 0, duration: 200, useNativeDriver: false }),
          Animated.timing(block3, { toValue: 0, duration: 200, useNativeDriver: false }),
        ]),
        Animated.delay(200),
      ])
    );
    seq.start();
    return () => seq.stop();
  }, [block1, block2, block3]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      <View style={styles.container}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          {/* Title bar */}
          <View style={[styles.titleBar, { backgroundColor: C.yellow }]}>
            <View style={styles.dots}>
              <View style={[styles.dot, { backgroundColor: C.pink }]} />
              <View style={[styles.dot, { backgroundColor: C.white }]} />
              <View style={[styles.dot, { backgroundColor: C.mint }]} />
            </View>
            <Text style={styles.titleBarLabel}>SETTLEMENT.EXE</Text>
            <View style={{ width: 48 }} />
          </View>

          <View style={styles.body}>
            {/* Status icon */}
            <Animated.View
              style={[styles.iconFrame, hardShadow(SHADOW_OFFSET_SM), { opacity: pulseAnim }]}
            >
              <Text style={styles.icon}>⏳</Text>
            </Animated.View>

            {/* Copy */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>TALLYING RESULTS</Text>
              <Text style={styles.bodyText}>
                Calculating stake movement for all members. This usually takes just a moment.
              </Text>
            </View>

            {/* Block-fill progress bar */}
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressBlock,
                  {
                    opacity: block1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1],
                    }),
                    backgroundColor: C.cyan,
                  },
                ]}
              />
              <View style={styles.progressSep} />
              <Animated.View
                style={[
                  styles.progressBlock,
                  {
                    opacity: block2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1],
                    }),
                    backgroundColor: C.cyan,
                  },
                ]}
              />
              <View style={styles.progressSep} />
              <Animated.View
                style={[
                  styles.progressBlock,
                  {
                    opacity: block3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1],
                    }),
                    backgroundColor: C.cyan,
                  },
                ]}
              />
            </View>

            <Text style={styles.sublabel}>PROCESSING DAILY STAKES...</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: S.md,
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
  iconFrame: {
    width: 80,
    height: 80,
    backgroundColor: C.yellow,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bodyText: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Block-fill progress — hollow frame pattern
  progressTrack: {
    width: '100%',
    height: 20,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: C.surfaceContainerHigh,
  },
  progressBlock: {
    flex: 1,
  },
  progressSep: {
    width: BORDER,
    backgroundColor: C.black,
  },
  sublabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
