/**
 * SynKrew — Daily Task: Capturing (In-App Camera Viewfinder)
 * Route: app/(task)/capture.tsx
 *
 * Implements:
 *   - Full-bleed viewfinder with focus reticle
 *   - Tamper-proof non-editable Geo + Timestamp overlay chip
 *   - Shutter action with flash & flip controls
 *   - Permission check gates (Camera & Location)
 *   - Edge state simulation triggers for testing
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
} from '../../theme/tokens';

export default function TaskCaptureScreen() {
  const { width, height } = useWindowDimensions();
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [currentTime, setCurrentTime] = useState('07:42:18 AM');
  const [isCapturing, setIsCapturing] = useState(false);

  // Live timestamp clock for sensor proof
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShutter = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      // Capture success -> proceed to uploading screen with photo metadata
      router.push({
        pathname: '/(task)/uploading',
        params: {
          timestamp: currentTime,
          geo: '37.7749° N, 122.4194° W',
        },
      });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      {/* ─── Testing / Edge State Demo Bar ─── */}
      <View style={styles.demoBar}>
        <Text style={styles.demoLabel}>FALLBACK TRIGGERS:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
          <Pressable
            testID="capture-demo-cam-denied"
            style={styles.demoChip}
            onPress={() => router.push('/(task)/camera-denied')}
          >
            <Text style={styles.demoChipText}>CAM DENIED</Text>
          </Pressable>
          <Pressable
            testID="capture-demo-cam-perm"
            style={styles.demoChip}
            onPress={() => router.push('/(task)/camera-perm-denied')}
          >
            <Text style={styles.demoChipText}>CAM PERM BLOCKED</Text>
          </Pressable>
          <Pressable
            testID="capture-demo-cap-failed"
            style={styles.demoChip}
            onPress={() => router.push('/(task)/capture-failed')}
          >
            <Text style={styles.demoChipText}>HARDWARE FAIL</Text>
          </Pressable>
          <Pressable
            testID="capture-demo-loc-denied"
            style={styles.demoChip}
            onPress={() => router.push('/(task)/location-denied')}
          >
            <Text style={styles.demoChipText}>LOC DENIED</Text>
          </Pressable>
          <Pressable
            testID="capture-demo-loc-unavail"
            style={styles.demoChip}
            onPress={() => router.push('/(task)/location-unavailable')}
          >
            <Text style={styles.demoChipText}>GPS UNKNOWN</Text>
          </Pressable>
          <Pressable
            testID="capture-demo-upload-fail"
            style={styles.demoChip}
            onPress={() => router.push('/(task)/upload-failed')}
          >
            <Text style={styles.demoChipText}>UPLOAD FAIL</Text>
          </Pressable>
          <Pressable
            testID="capture-demo-offline"
            style={styles.demoChip}
            onPress={() => router.push('/(task)/offline-queued')}
          >
            <Text style={styles.demoChipText}>OFFLINE QUEUE</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* ─── Camera Viewfinder ─── */}
      <View style={styles.viewfinderContainer}>
        {/* Top Control Bar */}
        <View style={styles.topControlBar}>
          <Pressable
            testID="capture-btn-close"
            style={[styles.ctrlBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.back()}
            accessibilityRole="button"
          >
            <Text style={styles.ctrlBtnText}>✕</Text>
          </Pressable>

          <View style={styles.taskTargetBadge}>
            <Text style={styles.taskTargetText}>5K OUTDOOR RUN</Text>
          </View>

          <Pressable
            testID="capture-btn-flash"
            style={[styles.ctrlBtn, flashMode === 'on' && styles.ctrlBtnActive, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => setFlashMode(flashMode === 'off' ? 'on' : 'off')}
            accessibilityRole="button"
          >
            <Text style={styles.ctrlIcon}>{flashMode === 'on' ? '⚡' : '🌩️'}</Text>
          </Pressable>
        </View>

        {/* Viewfinder Target & Reticles */}
        <View style={styles.reticleFrame}>
          {/* 4 Corner Markers */}
          <View style={[styles.cornerMarker, styles.cornerTL]} />
          <View style={[styles.cornerMarker, styles.cornerTR]} />
          <View style={[styles.cornerMarker, styles.cornerBL]} />
          <View style={[styles.cornerMarker, styles.cornerBR]} />

          {/* Center Crosshair */}
          <View style={styles.crosshair}>
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />
          </View>

          {/* Guide Text */}
          <Text style={styles.reticleGuideText}>FRAME LIVE PROOF HERE</Text>
        </View>

        {/* Tamper-Proof Geo + Timestamp Overlay Chip (Silent & Non-Editable) */}
        <View pointerEvents="none" style={[styles.geoChip, hardShadow(2)]}>
          <Text style={styles.geoPin}>📍</Text>
          <Text style={styles.geoText}>37.7749° N, 122.4194° W</Text>
          <Text style={styles.geoDivider}>•</Text>
          <Text style={styles.geoTime}>{currentTime}</Text>
        </View>

        {/* Bottom Shutter & Controls Bar */}
        <View style={styles.bottomBar}>
          <Pressable
            testID="capture-btn-flip"
            style={[styles.sideCtrlBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            accessibilityRole="button"
          >
            <Text style={styles.sideCtrlIcon}>🔄</Text>
          </Pressable>

          {/* Big Chunky Shutter Button */}
          <Pressable
            testID="capture-btn-shutter"
            style={[styles.shutterOuter, hardShadow(SHADOW_OFFSET)]}
            onPress={handleShutter}
            disabled={isCapturing}
            accessibilityRole="button"
          >
            <View style={styles.shutterInner}>
              {isCapturing ? (
                <ActivityIndicator color={C.black} size="small" />
              ) : (
                <View style={styles.shutterCore} />
              )}
            </View>
          </Pressable>

          <View style={{ width: 48 }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.black,
  },
  demoBar: {
    backgroundColor: C.surfaceContainerHigh,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 50,
  },
  demoLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    marginRight: 6,
    fontWeight: '800',
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

  viewfinderContainer: {
    flex: 1,
    backgroundColor: '#16131b',
    justifyContent: 'space-between',
    padding: S.md,
  },

  topControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  ctrlBtn: {
    width: 44,
    height: 44,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlBtnActive: {
    backgroundColor: C.yellow,
  },
  ctrlBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: C.black,
  },
  ctrlIcon: {
    fontSize: 18,
  },
  taskTargetBadge: {
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.md,
    paddingVertical: 6,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  taskTargetText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // Reticle Frame
  reticleFrame: {
    flex: 1,
    marginVertical: S.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: C.cyan,
  },
  cornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  crosshair: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crosshairH: {
    position: 'absolute',
    width: 24,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  crosshairV: {
    position: 'absolute',
    height: 24,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  reticleGuideText: {
    ...T.labelXs,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
    marginTop: 48,
  },

  // Geo + Timestamp Overlay (Non-editable)
  geoChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: BORDER_THIN,
    borderColor: C.mint,
    paddingHorizontal: S.sm,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 6,
    marginBottom: S.sm,
  },
  geoPin: {
    fontSize: 12,
  },
  geoText: {
    ...T.labelXs,
    color: C.mint,
    fontSize: 10,
    fontWeight: '800',
  },
  geoDivider: {
    color: C.mint,
  },
  geoTime: {
    ...T.labelXs,
    color: C.white,
    fontSize: 10,
    fontWeight: '800',
  },

  // Bottom Controls
  bottomBar: {
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  sideCtrlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideCtrlIcon: {
    fontSize: 20,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.pink,
  },
});
