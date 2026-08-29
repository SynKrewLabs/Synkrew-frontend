/**
 * SynKrew — Settlement Failed to Compute (Error State) — Redesign
 * Route: app/(settlement)/error.tsx
 *
 * Rare error: settlement computation failed server-side.
 * NOT a generic retry — routes to a support path.
 * Uses ErrorBanner pattern; copy is support-directed, not "try again."
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C, S, T,
  BORDER, BORDER_THIN, SHADOW_OFFSET, SHADOW_OFFSET_SM,
  hardShadow, gridBgStyle,
} from '../../theme/tokens';
import { TitleBar, Button } from '../../components/ui';

export default function SettlementError() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@synkrew.app?subject=Settlement%20Compute%20Error');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, alignSelf: 'center', gap: S.lg }}>

          {/* Error card */}
          <View style={[styles.card, hardShadow(SHADOW_OFFSET)]}>
            <TitleBar label="ERROR_SETTLEMENT.EXE" color="pink" />

            <View style={styles.body}>
              {/* Error icon frame */}
              <View style={[styles.errorIconFrame, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={styles.errorIcon}>⚠</Text>
              </View>

              {/* Error heading */}
              <View style={styles.textBlock}>
                <Text style={styles.headline}>SETTLEMENT FAILED</Text>
                <Text style={styles.headline2}>TO COMPUTE</Text>
                <Text style={styles.bodyText}>
                  A server-side error prevented today's settlement from being calculated. Your stakes and balances are safe — no coins have been moved or lost.
                </Text>
              </View>

              {/* Error code chip — helps support triage */}
              <View style={styles.errorCodeChip}>
                <Text style={styles.errorCodeLabel}>ERROR CODE</Text>
                <Text style={styles.errorCodeValue}>SETTLE_COMPUTE_ERR_500</Text>
              </View>

              {/* What happens next */}
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>WHAT HAPPENS NOW</Text>
                <View style={styles.infoBoxItems}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoItemIcon}>🔒</Text>
                    <Text style={styles.infoItemText}>
                      Your stakes remain locked until settlement resolves successfully.
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoItemIcon}>📧</Text>
                    <Text style={styles.infoItemText}>
                      Our team has been automatically notified. You'll receive an email when it's resolved.
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoItemIcon}>⏱</Text>
                    <Text style={styles.infoItemText}>
                      Typical resolution time: under 2 hours. Streaks are preserved until then.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Support CTA */}
          <Button
            testID="settlement-error-btn-support"
            label="CONTACT SUPPORT →"
            variant="primary"
            fullWidth
            onPress={handleContactSupport}
          />

          {/* Back to group — secondary */}
          <Button
            testID="settlement-error-btn-back"
            label="RETURN TO GROUP"
            variant="secondary"
            fullWidth
            onPress={() => router.replace('/(groups)/detail')}
          />
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
    padding: S.md,
    paddingBottom: S.xxl,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  titleBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: BORDER_THIN, borderColor: C.black,
  },
  titleBarLabel: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  body: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.lg,
  },
  errorIconFrame: {
    width: 80,
    height: 80,
    backgroundColor: C.errorContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    fontSize: 36,
    color: C.onErrorContainer,
  },
  textBlock: {
    alignItems: 'center',
    gap: S.xs,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.onSurface,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  headline2: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.error,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bodyText: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: S.xs,
  },
  errorCodeChip: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: S.xs,
    alignItems: 'center',
    gap: 2,
    width: '100%',
  },
  errorCodeLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    letterSpacing: 2,
  },
  errorCodeValue: {
    ...T.labelSm,
    color: C.error,
    letterSpacing: 1,
  },
  infoBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.md,
    gap: S.sm,
  },
  infoBoxTitle: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoBoxItems: {
    gap: S.sm,
  },
  infoItem: {
    flexDirection: 'row',
    gap: S.xs,
    alignItems: 'flex-start',
  },
  infoItemIcon: {
    fontSize: 16,
    lineHeight: 22,
  },
  infoItemText: {
    ...T.bodyMd,
    flex: 1,
    color: C.onSurface,
    fontSize: 14,
    lineHeight: 20,
  },
  supportBtn: {
    width: '100%',
    backgroundColor: C.errorContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  supportBtnText: {
    ...T.label,
    color: C.onErrorContainer,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  backBtn: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  backBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
