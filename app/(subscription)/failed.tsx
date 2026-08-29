/**
 * SynKrew — Purchase Flow: Failed
 * Route: app/(subscription)/failed.tsx
 * Screen ID: 9f93c2908cd6460ba77b50c3fe405c8f
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

export default function PurchaseFailedScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 440);

  const handleRetry = () => {
    // Re-attempt purchase
    router.replace('/(subscription)/processing');
  };

  const handleCancel = () => {
    // Cancel and return to origin
    router.replace('/(groups)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="ERROR_DIALOG.EXE" color="lavender" />

          <View style={styles.body}>
            {/* Error Icon Block */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>⚠</Text>
            </View>

            {/* Content */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>TRANSACTION_FAILED</Text>
              <Text style={styles.description}>
                An unknown error occurred during checkout. No coins or cash were moved. Please try again.
              </Text>
            </View>

            {/* Error Code Diagnostic Box */}
            <View style={styles.diagnosticBox}>
              <View style={styles.diagnosticRow}>
                <Text style={styles.diagnosticPrefix}>&gt;</Text>
                <Text style={styles.diagnosticText}>ERROR_CODE: ERR_TX_504_TIMEOUT</Text>
              </View>
              <View style={styles.diagnosticBar}>
                <View style={styles.diagnosticFill} />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-retry-purchase"
                style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleRetry}
                accessibilityRole="button"
                accessibilityLabel="Retry purchase"
              >
                <Text style={styles.primaryBtnText}>RETRY_PURCHASE</Text>
              </Pressable>

              <Pressable
                testID="btn-cancel-process"
                style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel="Cancel process"
              >
                <Text style={styles.secondaryBtnText}>CANCEL_PROCESS</Text>
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
    backgroundColor: C.error,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
    color: C.white,
    fontWeight: '900',
  },
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.error,
    textAlign: 'center',
    letterSpacing: 1,
  },
  description: {
    ...T.bodyMd,
    color: C.onSurface,
    textAlign: 'center',
    lineHeight: 22,
  },
  diagnosticBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: 8,
  },
  diagnosticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diagnosticPrefix: {
    ...T.labelSm,
    color: C.error,
    fontWeight: '900',
  },
  diagnosticText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 12,
  },
  diagnosticBar: {
    height: 8,
    borderWidth: 1,
    borderColor: C.black,
    backgroundColor: C.surface,
  },
  diagnosticFill: {
    width: '35%',
    height: '100%',
    backgroundColor: C.error,
  },
  actions: {
    width: '100%',
    gap: S.sm,
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 14,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  secondaryBtn: {
    width: '100%',
    height: 44,
    backgroundColor: C.surface,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
