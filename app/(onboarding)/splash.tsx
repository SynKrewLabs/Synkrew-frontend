/**
 * SynKrew — Splash Screen (System Boot)
 * Screen 1 in Onboarding flow.
 *
 * Composed from the design tokens and shared rules:
 * - Surface background with 24px grid overlay
 * - Hero logo with 4px hard drop shadow and float animation
 * - 4 scattered twinkling pixel stars / sparkles
 * - OS Window loading card with 4px border and 6px hard shadow
 * - "SYSTEM LOADING..." indicator, 32px chunky cyan progress bar, version tag
 * - Anchored (C) 199X SYNKREW SYSTEMS footer
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  AccessibilityInfo,
  Platform,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER_HEAVY,
  BORDER_THIN,
  DOT_SIZE,
  HEADER_HEIGHT,
  STANDARD_TITLE_DOTS,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';

const LOGO_SOURCE = require('../../assets/logo.png');

async function checkAuthState(): Promise<boolean> {
  return false;
}

export default function SplashScreen() {
  const { width } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = useState(false);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const spark1 = useRef(new Animated.Value(0)).current;
  const spark2 = useRef(new Animated.Value(0)).current;
  const spark3 = useRef(new Animated.Value(0)).current;
  const spark4 = useRef(new Animated.Value(0)).current;

  const startAnimations = useCallback((rm: boolean) => {
    if (rm) {
      logoOpacity.setValue(1);
      logoScale.setValue(1);
      progressAnim.setValue(1);
      [spark1, spark2, spark3, spark4].forEach((s) => s.setValue(1));
      return;
    }

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, { toValue: -8, duration: 1800, useNativeDriver: true }),
          Animated.timing(logoFloat, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ])
      ).start();
    });

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2400,
      useNativeDriver: false,
    }).start();

    const twinkle = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 600, useNativeDriver: true }),
          Animated.delay(500),
        ])
      );

    twinkle(spark1, 0).start();
    twinkle(spark2, 300).start();
    twinkle(spark3, 650).start();
    twinkle(spark4, 1000).start();
  }, [logoOpacity, logoScale, logoFloat, progressAnim, spark1, spark2, spark3, spark4]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then((rm) => {
        setReduceMotion(rm);
        startAnimations(rm);
      })
      .catch(() => startAnimations(false));
  }, [startAnimations]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (!active) return;
      const isAuth = await checkAuthState();
      if (!active) return;
      router.replace(isAuth ? '/(main)/groups' : '/(onboarding)/welcome');
    }, 2900);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const sparkleStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }) }],
  });

  const logoWidth = Math.min(width * 0.55, 220);
  const logoHeight = logoWidth * 0.5;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.12)]} pointerEvents="none" />

      {/* Sparkles */}
      <Animated.Text style={[styles.sparkle, styles.sp1, sparkleStyle(spark1)]}>✦</Animated.Text>
      <Animated.Text style={[styles.sparkle, styles.sp2, sparkleStyle(spark2)]}>★</Animated.Text>
      <Animated.Text style={[styles.sparkle, styles.sp3, sparkleStyle(spark3)]}>✦</Animated.Text>
      <Animated.Text style={[styles.sparkle, styles.sp4, sparkleStyle(spark4)]}>✧</Animated.Text>

      {/* Center hero stack */}
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: logoFloat }],
            },
          ]}
        >
          <Image
            source={LOGO_SOURCE}
            style={{ width: logoWidth, height: logoHeight }}
            resizeMode="contain"
            accessibilityLabel="SynKrew"
          />
        </Animated.View>

        {/* OS Window Loading Card */}
        <View style={[styles.card, hardShadow(6)]}>
          <View style={styles.cardHeader}>
            <View style={styles.dotRow}>
              <View style={[styles.dot, { backgroundColor: STANDARD_TITLE_DOTS[0] }]} />
              <View style={[styles.dot, { backgroundColor: STANDARD_TITLE_DOTS[1] }]} />
              <View style={[styles.dot, { backgroundColor: STANDARD_TITLE_DOTS[2] }]} />
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.statusRow}>
              <Text style={styles.spinner}>⟳</Text>
              <Text style={styles.statusText}>SYSTEM LOADING...</Text>
            </View>

            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            <View style={styles.versionPill}>
              <Text style={styles.versionText}>V1.3.0_RC</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>(C) 199X SYNKREW SYSTEMS</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
  },
  sparkle: {
    position: 'absolute',
    fontWeight: '800',
    zIndex: 2,
  },
  sp1: { top: '16%', left: '12%', fontSize: 26, color: C.cyan },
  sp2: { top: '20%', right: '14%', fontSize: 22, color: C.primaryFixedDim },
  sp3: { bottom: '26%', left: '10%', fontSize: 32, color: C.secondaryFixed },
  sp4: { bottom: '22%', right: '12%', fontSize: 20, color: C.pink },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.md,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: S.xxl,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: C.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
      },
      android: { elevation: 4 },
      web: { filter: 'drop-shadow(4px 4px 0px #000000)' } as any,
    }),
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  cardHeader: {
    height: HEADER_HEIGHT,
    backgroundColor: C.surfaceContainerHigh,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.xs,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  cardBody: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  spinner: {
    fontSize: 16,
    fontWeight: '700',
    color: C.onSurface,
  },
  statusText: {
    ...T.label,
    color: C.onSurface,
    letterSpacing: 1,
  },
  progressBar: {
    width: '100%',
    height: 32,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLow,
    padding: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.cyan,
  },
  versionPill: {
    backgroundColor: C.surfaceVariant,
    borderWidth: 1,
    borderColor: C.black,
    borderRadius: 2,
    paddingHorizontal: S.xs,
    paddingVertical: 3,
  },
  versionText: {
    ...T.labelXs,
    color: C.outline,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: S.md,
    zIndex: 10,
  },
  footerText: {
    ...T.labelXs,
    color: C.black,
    opacity: 0.6,
    letterSpacing: 1,
  },
});
