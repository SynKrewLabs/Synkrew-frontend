/**
 * SynKrew — Verification Tab Screen
 * Route: app/(verify)/index.tsx
 *
 * Implements:
 *   - Aggregated peer proof verification queue
 *   - Real-time nav badge decrementing loop
 *   - Signature card stack interaction
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_HEAVY,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';
import { VerificationCardStack } from '../../components/verify/VerificationCardStack';
import { BottomNavBar } from '../../components/groups/BottomNavBar';

export default function VerificationScreen() {
  const { width } = useWindowDimensions();
  const [queueCount, setQueueCount] = useState(3);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarInner}>
          <Text style={styles.topBarTitle}>VERIFICATION DECK</Text>
          <View style={[styles.queueBadge, hardShadow(SHADOW_OFFSET_SM)]}>
            <Text style={styles.queueBadgeText}>{queueCount} PENDING</Text>
          </View>
        </View>
      </View>

      {/* Main Verification Card Stack */}
      <View style={styles.content}>
        <VerificationCardStack onQueueCountChange={setQueueCount} />
      </View>

      {/* Bottom Nav with active Verify tab */}
      <BottomNavBar activeTab="verify" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  topBar: {
    width: '100%',
    backgroundColor: C.surface,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    ...hardShadow(2),
    zIndex: 50,
  },
  topBarInner: {
    height: 56,
    width: '100%',
    maxWidth: 448,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.md,
  },
  topBarTitle: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.black,
    letterSpacing: 1,
  },
  queueBadge: {
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  queueBadgeText: {
    ...T.labelXs,
    fontSize: 10,
    fontWeight: '900',
    color: C.black,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
