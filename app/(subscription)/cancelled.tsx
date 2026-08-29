/**
 * SynKrew — Purchase Flow: Cancelled
 * Route: app/(subscription)/cancelled.tsx
 * Screen ID: e421958c61524907b7b05d0064d54426
 */

import React from 'react';
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

export default function PurchaseCancelledScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 440);

  const handleReturn = () => {
    router.replace('/(groups)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="STATUS_NEUTRAL.EXE" color="lavender" />

          <View style={styles.body}>
            {/* Neutral Icon Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>↩</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>PURCHASE_CANCELLED</Text>
              <View style={styles.divider} />
              <Text style={styles.description}>
                Changed your mind? No problem. Your Free Tier limits are still active.
              </Text>
            </View>

            {/* Action */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-return-profile"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleReturn}
                accessibilityRole="button"
                accessibilityLabel="Return to dashboard"
              >
                <Text style={styles.primaryBtnText}>RETURN_TO_DASHBOARD</Text>
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
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
    color: C.onSurface,
    fontWeight: '900',
  },
  textBlock: {
    alignItems: 'center',
    gap: S.sm,
    width: '100%',
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: C.black,
    marginVertical: 4,
  },
  description: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: C.black,
    borderStyle: 'dashed',
    paddingTop: S.md,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.onSurface,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
