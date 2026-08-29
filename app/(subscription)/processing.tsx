/**
 * SynKrew — Purchase Flow: Processing
 * Route: app/(subscription)/processing.tsx
 * Screen ID: 278bb927a7d84d03872f604d1767cc5c
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_HEAVY,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';
import { TitleBar } from '../../components/ui/TitleBar';

export default function PurchaseProcessingScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 440);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    // Simulated progress increment for feedback
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 80 ? prev + 15 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // TODO: replace with real IAP/payment integration
  const simulateOutcome = (outcome: 'success' | 'failed' | 'cancelled' | 'provider-error') => {
    if (outcome === 'success') router.replace('/(subscription)/success');
    else if (outcome === 'failed') router.replace('/(subscription)/failed');
    else if (outcome === 'cancelled') router.replace('/(subscription)/cancelled');
    else if (outcome === 'provider-error') router.replace('/(subscription)/provider-error');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="TX_MANAGER.EXE" color="lavender" />

          <View style={styles.body}>
            <Text style={styles.headline}>PROCESSING_PAYMENT</Text>

            {/* Console Log Box */}
            <View style={styles.consoleBox}>
              <View style={styles.consoleRow}>
                <Text style={styles.consolePrompt}>&gt;</Text>
                <Text style={styles.consoleText}>Verifying with provider.</Text>
              </View>
              <View style={styles.consoleRow}>
                <Text style={styles.consolePrompt}>&gt;</Text>
                <Text style={styles.consoleText}>Please stand by...</Text>
              </View>
              <View style={styles.consoleRow}>
                <Text style={styles.consolePrompt}>&gt;</Text>
                <Text style={[styles.consoleText, { color: C.primary }]}>SECURE_HANDSHAKE_ACTIVE</Text>
              </View>
            </View>

            {/* Segmented Block Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                {[0, 1, 2, 3, 4, 5].map((blockIndex) => {
                  const filled = progress >= (blockIndex + 1) * 16;
                  return (
                    <View
                      key={blockIndex}
                      style={[
                        styles.progressBlock,
                        filled ? styles.blockFilled : styles.blockEmpty,
                      ]}
                    />
                  );
                })}
              </View>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </View>

            {/* Dev / Test Trigger Bar for Reviewing All Purchase States */}
            <View style={styles.devTriggerSection}>
              <Text style={styles.devHeader}>[DEV_SIMULATION_TRIGGERS]</Text>
              <View style={styles.devGrid}>
                <Pressable
                  testID="btn-sim-success"
                  style={[styles.devBtn, { backgroundColor: C.mint }]}
                  onPress={() => simulateOutcome('success')}
                >
                  <Text style={styles.devBtnText}>SIMULATE SUCCESS</Text>
                </Pressable>

                <Pressable
                  testID="btn-sim-failed"
                  style={[styles.devBtn, { backgroundColor: '#ffdad6' }]}
                  onPress={() => simulateOutcome('failed')}
                >
                  <Text style={[styles.devBtnText, { color: '#ba1a1a' }]}>SIMULATE FAILED</Text>
                </Pressable>

                <Pressable
                  testID="btn-sim-cancelled"
                  style={[styles.devBtn, { backgroundColor: C.surfaceContainerHigh }]}
                  onPress={() => simulateOutcome('cancelled')}
                >
                  <Text style={styles.devBtnText}>SIMULATE CANCELLED</Text>
                </Pressable>

                <Pressable
                  testID="btn-sim-provider-err"
                  style={[styles.devBtn, { backgroundColor: '#ffd8eb' }]}
                  onPress={() => simulateOutcome('provider-error')}
                >
                  <Text style={[styles.devBtnText, { color: C.primary }]}>PROVIDER ERROR</Text>
                </Pressable>
              </View>
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
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
    textAlign: 'center',
    letterSpacing: 1,
  },
  consoleBox: {
    width: '100%',
    backgroundColor: C.surfaceContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: 8,
  },
  consoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consolePrompt: {
    ...T.label,
    color: C.primary,
    fontWeight: '900',
  },
  consoleText: {
    ...T.labelSm,
    color: C.onSurface,
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: '100%',
    gap: S.xs,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 36,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    padding: 3,
    flexDirection: 'row',
    gap: 3,
  },
  progressBlock: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: C.black,
  },
  blockFilled: {
    backgroundColor: C.cyan,
  },
  blockEmpty: {
    backgroundColor: 'transparent',
    opacity: 0.2,
  },
  progressPercent: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  devTriggerSection: {
    width: '100%',
    borderTopWidth: BORDER,
    borderColor: C.black,
    borderStyle: 'dashed',
    paddingTop: S.md,
    gap: S.sm,
  },
  devHeader: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 1,
  },
  devGrid: {
    gap: 8,
  },
  devBtn: {
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devBtnText: {
    ...T.labelSm,
    fontWeight: '900',
    color: C.black,
    letterSpacing: 1,
  },
});
