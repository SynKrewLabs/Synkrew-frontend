/**
 * SynKrew — Create Group: Step 3 (Cycle Length & Stake %)
 * Route: app/(groups)/create/step-3.tsx
 *
 * Implements:
 *   - Cycle Length selector (Sprint 7D / Marathon 30D)
 *   - Daily Stake % preset chips (25%, 50%, 60%, 75%)
 *   - Dynamic preview terminal calculating risk in real-time
 *   - Proceed to Step 4 (stub)
 */

import React, { useState, useMemo } from 'react';
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

const STAKE_PRESETS = [25, 50, 60, 75] as const;

export default function CreateGroupStep3() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const [cycleDays, setCycleDays] = useState<7 | 30>(30);
  const [stakePercent, setStakePercent] = useState<number>(60);

  // Dynamic Risk calculation
  const estimatedRisk = useMemo(() => {
    // 100 coins baseline stake * (stakePercent / 100)
    return Math.round(stakePercent);
  }, [stakePercent]);

  const handleInitialize = () => {
    router.push({
      pathname: '/(groups)/create/step-4',
      params: {
        ...params,
        cycleDays: String(cycleDays),
        stakePercent: String(stakePercent),
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
          <TitleBar label="STEP_03.SYS" color="mint" />

          <View style={styles.body}>
            {/* Title Block */}
            <View style={styles.titleBlock}>
              <Text style={styles.headline}>STAKE_PARAMETERS.EXE</Text>
              <Text style={styles.subtitle}>
                Configure cycle duration and commitment metrics.
              </Text>
            </View>

            {/* Segmented Progress Bar (3/3 steps) */}
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, styles.progressFilled]} />
              <View style={[styles.progressSegment, styles.progressFilled]} />
              <View style={[styles.progressSegment, styles.progressFilled]} />
            </View>

            {/* Cycle Length Control */}
            <View style={[styles.controlBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.controlHeader}>
                <Text style={styles.controlTitle}>CYCLE LENGTH</Text>
                <Text testID="step3-cycle-display" style={styles.cycleValueDisplay}>{cycleDays} DAYS</Text>
              </View>

              <View style={styles.cycleOptionsRow}>
                <Pressable
                  testID="step3-cycle-7d"
                  style={[
                    styles.cycleOptionBtn,
                    cycleDays === 7 && styles.cycleOptionBtnActive,
                  ]}
                  onPress={() => setCycleDays(7)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.cycleOptionLabel,
                      cycleDays === 7 && styles.cycleOptionLabelActive,
                    ]}
                  >
                    SPRINT (7D)
                  </Text>
                </Pressable>

                <Pressable
                  testID="step3-cycle-30d"
                  style={[
                    styles.cycleOptionBtn,
                    cycleDays === 30 && styles.cycleOptionBtnActive,
                  ]}
                  onPress={() => setCycleDays(30)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.cycleOptionLabel,
                      cycleDays === 30 && styles.cycleOptionLabelActive,
                    ]}
                  >
                    MARATHON (30D)
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Daily Stake % Chips */}
            <View style={styles.stakeSection}>
              <View style={styles.stakeLabelRow}>
                <Text style={styles.stakeIcon}>🪙</Text>
                <Text style={styles.controlTitle}>DAILY STAKE %</Text>
              </View>

              <View style={styles.stakeChipsGrid}>
                {STAKE_PRESETS.map(preset => {
                  const isSelected = stakePercent === preset;
                  return (
                    <Pressable
                      key={preset}
                      testID={`step3-stake-chip-${preset}`}
                      style={[
                        styles.stakeChip,
                        isSelected ? styles.stakeChipSelected : styles.stakeChipUnselected,
                        hardShadow(isSelected ? SHADOW_OFFSET_SM : 1),
                      ]}
                      onPress={() => setStakePercent(preset)}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.stakeChipText,
                          isSelected && styles.stakeChipTextSelected,
                        ]}
                      >
                        {preset}%
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Dynamic Preview Terminal */}
            <View style={[styles.terminalBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.terminalTag}>&gt; CALC_RISK.BAT RUNNING...</Text>
              <View style={styles.terminalContent}>
                <Text style={styles.terminalLabel}>EST_DAILY_RISK:</Text>
                <Text testID="step3-terminal-risk" style={styles.terminalValue}>{estimatedRisk} COINS</Text>
              </View>
            </View>

            {/* Bottom Action Area */}
            <View style={styles.actionRow}>
              <Pressable
                testID="step3-btn-cancel"
                style={styles.cancelBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </Pressable>

              <Pressable
                testID="step3-btn-initialize"
                style={[styles.initBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleInitialize}
                accessibilityRole="button"
              >
                <Text style={styles.initBtnText}>INITIALIZE 🚀</Text>
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
  },

  titleBlock: {
    alignItems: 'center',
    gap: 4,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.black,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },

  // Progress Bar
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

  // Cycle Length Control
  controlBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.sm,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cycleValueDisplay: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.primary,
  },
  cycleOptionsRow: {
    flexDirection: 'row',
    gap: S.sm,
  },
  cycleOptionBtn: {
    flex: 1,
    paddingVertical: S.sm,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleOptionBtnActive: {
    backgroundColor: C.mint,
  },
  cycleOptionLabel: {
    ...T.labelSm,
    fontSize: 11,
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },
  cycleOptionLabelActive: {
    color: C.black,
    fontWeight: '800',
  },

  // Stake Section
  stakeSection: {
    gap: S.xs,
  },
  stakeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stakeIcon: {
    fontSize: 16,
  },
  stakeChipsGrid: {
    flexDirection: 'row',
    gap: S.xs,
  },
  stakeChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BORDER,
    borderColor: C.black,
  },
  stakeChipSelected: {
    backgroundColor: C.pink,
  },
  stakeChipUnselected: {
    backgroundColor: C.white,
  },
  stakeChipText: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '700',
  },
  stakeChipTextSelected: {
    color: C.black,
    fontWeight: '900',
  },

  // Terminal
  terminalBox: {
    backgroundColor: C.black,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: 6,
  },
  terminalTag: {
    ...T.labelXs,
    color: C.mint,
    fontSize: 10,
    opacity: 0.8,
  },
  terminalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  terminalLabel: {
    ...T.headlineMd,
    fontSize: 15,
    color: C.white,
    letterSpacing: 1,
  },
  terminalValue: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.mint,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: S.xs,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  cancelBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  initBtn: {
    flex: 2,
    height: 48,
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
