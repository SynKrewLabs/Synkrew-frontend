/**
 * SynKrew — Create Group: Creation Failed (Retry)
 * Route: app/(groups)/create/failed.tsx
 *
 * Implements:
 *   - Glitch error icon & terminal failure readout
 *   - "RETRY_INITIALIZATION": Preserves all draft data from Steps 1–5 and re-attempts submission
 *   - "Return to Main Deck": Returns to Groups List
 */

import React, { useState } from 'react';
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

export default function CreateGroupFailedScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      // Successful retry hands off draft data to Confirmation screen
      router.replace({
        pathname: '/(groups)/create/confirmation',
        params: {
          ...params,
          fail: 'false',
        },
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="RETRY_REQUIRED.EXE" color="pink" />

          <View style={styles.body}>
            {/* Glitch Icon Frame */}
            <View style={styles.glitchContainer}>
              <View style={[styles.glitchShadowCyan, { transform: [{ rotate: '4deg' }] }]} />
              <View style={[styles.glitchShadowPink, { transform: [{ rotate: '-4deg' }] }]} />
              <View style={styles.glitchBox}>
                <Text style={styles.glitchIcon}>⚠️</Text>
              </View>
            </View>

            {/* Error Headlines */}
            <View style={styles.errorHeader}>
              <View style={styles.errorBadge}>
                <Text style={styles.errorBadgeText}>SYSTEM_ERROR</Text>
              </View>
              <Text style={styles.packetLossTitle}>PACKET_LOSS</Text>
            </View>

            {/* Terminal Stream Box */}
            <View style={[styles.terminalBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.terminalCyan}>&gt; Analyzing stream...</Text>
              <Text style={styles.terminalRed}>&gt; Critical failure in Group Initialization.</Text>
              <Text style={styles.terminalWhite}>&gt; Connection severed at node 404.</Text>
              <Text style={styles.terminalMint}>_ Awaiting user retry command.</Text>
            </View>

            {/* Draft Data Preserved Notice */}
            <View style={styles.preservedNotice}>
              <Text style={styles.preservedIcon}>💾</Text>
              <Text style={styles.preservedText}>
                Draft data for <Text style={{ fontWeight: '800', color: C.black }}>"{params.name || 'NEW_KREW'}"</Text> is safely cached.
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actionColumn}>
              <Pressable
                testID="failed-btn-retry"
                style={[
                  styles.retryBtn,
                  retrying && styles.retryBtnDisabled,
                  hardShadow(SHADOW_OFFSET_SM),
                ]}
                onPress={handleRetry}
                disabled={retrying}
                accessibilityRole="button"
              >
                {retrying ? (
                  <ActivityIndicator color={C.black} size="small" />
                ) : (
                  <>
                    <Text style={styles.retryBtnIcon}>↻</Text>
                    <Text style={styles.retryBtnText}>RETRY_INITIALIZATION</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                testID="failed-btn-dashboard"
                style={styles.returnBtn}
                onPress={() => router.replace('/(groups)')}
                accessibilityRole="button"
              >
                <Text style={styles.returnBtnText}>← Return to Main Deck</Text>
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

  // Glitch Icon Frame
  glitchContainer: {
    position: 'relative',
    marginVertical: S.xs,
    width: 90,
    height: 90,
  },
  glitchShadowCyan: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    backgroundColor: C.cyan,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  glitchShadowPink: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: 2,
    bottom: 2,
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  glitchBox: {
    width: '100%',
    height: '100%',
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
  glitchIcon: {
    fontSize: 44,
  },

  // Error header
  errorHeader: {
    alignItems: 'center',
    gap: 6,
  },
  errorBadge: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    transform: [{ rotate: '-2deg' }],
  },
  errorBadgeText: {
    ...T.headlineMd,
    fontSize: 16,
    color: '#ba1a1a',
    letterSpacing: 1,
  },
  packetLossTitle: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.black,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    borderStyle: 'dashed',
    paddingBottom: 4,
  },

  // Terminal Stream Box
  terminalBox: {
    width: '100%',
    backgroundColor: C.black,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: 4,
  },
  terminalCyan: {
    ...T.labelXs,
    color: C.cyan,
    fontSize: 11,
  },
  terminalRed: {
    ...T.labelXs,
    color: '#ff8585',
    fontSize: 11,
  },
  terminalWhite: {
    ...T.labelXs,
    color: C.white,
    fontSize: 11,
  },
  terminalMint: {
    ...T.labelXs,
    color: C.mint,
    fontSize: 11,
  },

  // Draft Data notice
  preservedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 6,
    width: '100%',
  },
  preservedIcon: {
    fontSize: 16,
  },
  preservedText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    flex: 1,
  },

  // Action Buttons
  actionColumn: {
    width: '100%',
    gap: S.sm,
  },
  retryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.primaryFixedDim,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryBtnDisabled: {
    opacity: 0.6,
  },
  retryBtnIcon: {
    fontSize: 20,
    fontWeight: '900',
    color: C.black,
  },
  retryBtnText: {
    ...T.label,
    fontSize: 14,
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
