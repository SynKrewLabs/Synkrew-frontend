/**
 * SynKrew — Purchase Flow: Success
 * Route: app/(subscription)/success.tsx
 * Screen ID: cf483ed9f6f24ab2a1f405676e9c25df
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

export default function PurchaseSuccessScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 440);

  const handleReturnToBase = () => {
    // Unblock limits immediately and return to Groups
    router.replace('/(groups)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="SUCCESS.EXE" color="pink" />

          <View style={styles.body}>
            {/* Success Icon Block */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>✓</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>PAYMENT_VERIFIED</Text>
              <Text style={styles.description}>
                Your capacity has been upgraded to Premium. 5 groups / 20 members unlocked.
              </Text>
            </View>

            {/* Summary Badge */}
            <View style={styles.tierPill}>
              <Text style={styles.tierPillLabel}>CURRENT_STATUS: PRO_TIER_ACTIVE</Text>
            </View>

            {/* Action */}
            <Pressable
              testID="btn-return-base"
              style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={handleReturnToBase}
              accessibilityRole="button"
              accessibilityLabel="Return to base"
            >
              <Text style={styles.primaryBtnText}>RETURN_TO_BASE</Text>
              <Text style={styles.btnArrow}>→</Text>
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
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: C.mint,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 44,
    color: C.black,
    fontWeight: '900',
  },
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.onSurface,
    textAlign: 'center',
    letterSpacing: 1,
  },
  description: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  tierPill: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: S.md,
    paddingVertical: 6,
  },
  tierPillLabel: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 14,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  btnArrow: {
    fontSize: 18,
    color: C.black,
    fontWeight: '900',
  },
});
