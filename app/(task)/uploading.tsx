/**
 * SynKrew — Daily Task: Uploading (Active Progress Screen)
 * Route: app/(task)/uploading.tsx
 *
 * Implements:
 *   - Live progress block-fill animation (0% -> 100%)
 *   - Encrypted sensor payload verification
 *   - Cancel affordance (aborts upload and returns to Capture)
 *   - Automatic transition to Group Detail (Pending Review state) upon completion
 */

import React, { useState, useEffect } from 'react';
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
} from '../../theme/tokens';
import { TitleBar } from '../../components/ui/TitleBar';

export default function TaskUploadingScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const [progress, setProgress] = useState(15);

  // Progressive upload ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            // Completed -> return to Group Detail in Pending Review state
            router.replace({
              pathname: '/(groups)/detail',
              params: { taskState: 'pending_review' },
            });
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const handleCancel = () => {
    router.replace('/(task)/capture');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="UPLOADING.EXE" color="mint" />

          <View style={styles.body}>
            {/* Payload Icon */}
            <View style={styles.payloadBox}>
              <View style={styles.payloadShadow} />
              <View style={styles.payloadCore}>
                <Text style={styles.payloadIcon}>📡</Text>
              </View>
            </View>

            {/* Headline */}
            <View style={styles.textBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>TRANSMITTING TO SQUAD VAULT</Text>
              </View>
              <Text style={styles.headline}>TRANSMITTING PROOF</Text>
              <Text style={styles.subtitle}>
                Encrypting GPS coordinates and sensory frame into peer review queue.
              </Text>
            </View>

            {/* Block-fill Progress Bar */}
            <View style={[styles.progressCard, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>PAYLOAD_01.DAT</Text>
                <Text style={styles.progressPercent}>{Math.min(100, progress)}%</Text>
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min(100, progress)}%` }]} />
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  {((Math.min(100, progress) / 100) * 2.4).toFixed(1)} MB / 2.4 MB
                </Text>
                <Text style={styles.statsSpeed}>1.2 MB/s</Text>
              </View>
            </View>

            {/* Metadata Preview Box */}
            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>GPS ATTACHED:</Text>
                <Text style={styles.metaVal}>{params.geo || '37.7749° N, 122.4194° W'}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>TIMESTAMP STAMP:</Text>
                <Text style={styles.metaVal}>{params.timestamp || '07:42 AM'}</Text>
              </View>
            </View>

            {/* Cancel Button */}
            <Pressable
              testID="uploading-btn-cancel"
              style={styles.cancelBtn}
              onPress={handleCancel}
              accessibilityRole="button"
            >
              <Text style={styles.cancelBtnText}>CANCEL & DISCARD TRANSMISSION</Text>
            </Pressable>
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

  payloadBox: {
    position: 'relative',
    marginVertical: S.xs,
  },
  payloadShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: C.mint,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
  },
  payloadCore: {
    width: 80,
    height: 80,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payloadIcon: {
    fontSize: 40,
  },

  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
  },
  badgeText: {
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
  },

  // Progress
  progressCard: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
  },
  progressPercent: {
    ...T.labelSm,
    color: C.primary,
    fontWeight: '900',
  },
  progressTrack: {
    width: '100%',
    height: 16,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  statsSpeed: {
    ...T.labelXs,
    fontSize: 10,
    color: C.primary,
    fontWeight: '900',
  },

  // Metadata
  metaBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  metaVal: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '900',
  },

  // Cancel
  cancelBtn: {
    paddingVertical: 4,
  },
  cancelBtnText: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontSize: 12,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
