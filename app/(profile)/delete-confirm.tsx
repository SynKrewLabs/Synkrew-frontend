/**
 * SynKrew — Delete Account: Confirmation
 * Route: app/(profile)/delete-confirm.tsx
 * Screen ID: a2f881c948fa469e803df3bb4bc73978
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
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

export default function DeleteAccountConfirmModal() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 420);
  const [confirmText, setConfirmText] = useState('');

  const isConfirmed = confirmText.trim().toUpperCase() === 'FORFEIT';

  const handleDeletePermanently = () => {
    if (!isConfirmed) return;
    // Clear user account & state, route to login/splash
    router.replace('/(auth)/login');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.backdrop} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="SYSTEM_CRITICAL.EXE" color="pink" />

          <View style={styles.body}>
            {/* Severe Destructive Icon Box */}
            <View style={[styles.iconBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={styles.iconText}>💣</Text>
            </View>

            {/* Headline and Warning */}
            <View style={styles.textBlock}>
              <Text style={styles.headline}>PURGE_ACCOUNT?</Text>
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  <Text style={styles.warningBold}>WARNING: </Text>
                  Initiating purge protocol will result in permanent destruction of all accrued coins, active streaks, achievements, and Krew memberships. This action cannot be undone.
                </Text>
              </View>
            </View>

            {/* Confirmation Verification Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>
                Type <Text style={styles.forfeitHighlight}>FORFEIT</Text> to confirm purge:
              </Text>
              <TextInput
                testID="input-confirm-forfeit"
                style={styles.textInput}
                value={confirmText}
                onChangeText={setConfirmText}
                placeholder="FORFEIT"
                placeholderTextColor={C.outline}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Pressable
                testID="btn-delete-permanently"
                style={[
                  styles.deleteBtn,
                  isConfirmed ? [styles.deleteBtnActive, hardShadow(SHADOW_OFFSET_SM)] : styles.deleteBtnDisabled,
                ]}
                disabled={!isConfirmed}
                onPress={handleDeletePermanently}
                accessibilityRole="button"
                accessibilityLabel="Delete Account Permanently"
              >
                <Text style={styles.btnIcon}>💥</Text>
                <Text style={styles.deleteBtnText}>DELETE_PERMANENTLY</Text>
              </Pressable>

              <Pressable
                testID="btn-cancel-abort"
                style={[styles.cancelBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel="Cancel purge"
              >
                <Text style={styles.cancelBtnText}>CANCEL_ABORT</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
    width: 76,
    height: 76,
    backgroundColor: C.errorContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 38,
  },
  textBlock: {
    alignItems: 'center',
    gap: S.sm,
    width: '100%',
  },
  headline: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.error,
    textAlign: 'center',
    letterSpacing: 1,
  },
  warningBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.black,
    padding: S.md,
  },
  warningText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },
  warningBold: {
    fontWeight: '900',
    color: C.error,
  },
  inputSection: {
    width: '100%',
    gap: 6,
  },
  inputLabel: {
    ...T.labelSm,
    color: C.onSurface,
    fontSize: 12,
  },
  forfeitHighlight: {
    backgroundColor: C.error,
    color: C.white,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  textInput: {
    width: '100%',
    height: 44,
    backgroundColor: C.surface,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.md,
    ...T.label,
    fontSize: 14,
    color: C.black,
    letterSpacing: 1.5,
  },
  actions: {
    width: '100%',
    gap: S.sm,
  },
  deleteBtn: {
    width: '100%',
    height: 48,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnActive: {
    backgroundColor: C.error,
  },
  deleteBtnDisabled: {
    backgroundColor: C.outline,
    opacity: 0.5,
  },
  btnIcon: {
    fontSize: 16,
  },
  deleteBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cancelBtn: {
    width: '100%',
    height: 44,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...T.labelSm,
    color: C.onSurface,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
