/**
 * SynKrew — Logout Confirmation
 * Route: app/(profile)/logout-confirm.tsx
 * Screen ID: 57c87d468f4a41189554dba9f7c502b8
 */

import React from 'react';
import {
  View,
  Text,
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

export default function LogoutConfirmModal() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 400);

  const handleConfirmLogout = () => {
    // Clear session and navigate to login
    router.replace('/(auth)/login');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.backdrop} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
        <TitleBar
          label="ALERT.EXE"
          color="pink"
          rightElement={
            <Pressable style={styles.closeBtn} onPress={handleCancel}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          }
        />

        <View style={styles.body}>
          {/* Neutral Logout Graphic */}
          <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
            <Text style={styles.iconText}>🚪</Text>
          </View>

          {/* Heading and Copy */}
          <View style={styles.textBlock}>
            <Text style={styles.headline}>END_SESSION?</Text>
            <View style={styles.messageBox}>
              <Text style={styles.description}>
                Are you sure you want to log out? Your streaks and stakes will stay safe.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              testID="btn-confirm-logout"
              style={[styles.primaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={handleConfirmLogout}
              accessibilityRole="button"
              accessibilityLabel="Confirm Logout"
            >
              <Text style={styles.btnIcon}>👋</Text>
              <Text style={styles.primaryBtnText}>LOGOUT</Text>
            </Pressable>

            <Pressable
              testID="btn-cancel-logout"
              style={[styles.secondaryBtn, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.secondaryBtnText}>CANCEL</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  closeBtnText: {
    fontSize: 14,
    color: C.black,
    fontWeight: '900',
  },
  body: {
    padding: S.xl,
    gap: S.lg,
    alignItems: 'center',
  },
  iconBox: {
    width: 72,
    height: 72,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 36,
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
  messageBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.black,
    padding: S.md,
  },
  description: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  actions: {
    width: '100%',
    gap: S.sm,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnIcon: {
    fontSize: 16,
  },
  primaryBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  secondaryBtn: {
    width: '100%',
    height: 44,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
