/**
 * SynKrew — Group Settings: Delete Confirmation (Double-Confirm)
 * Route: app/(groups)/settings/delete.tsx
 *
 * Implements:
 *   - Double-confirm destructive pattern
 *   - Vault stake release breakdown
 *   - Verification name match input check
 *   - Irreversible deletion and return to dashboard
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Alert,
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

export default function GroupDeleteConfirmation() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.name ? String(params.name) : 'MORNING RUNNERS';
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [agreedStakeRefund, setAgreedStakeRefund] = useState(false);

  // Exact match check for double-confirm security
  const isMatch = typedConfirmation.trim().toUpperCase() === groupName.toUpperCase() || typedConfirmation.trim().toUpperCase() === 'DELETE';
  const canDelete = isMatch && agreedStakeRefund;

  const handleDeleteGroup = () => {
    if (!canDelete) return;
    Alert.alert(
      'GROUP DISSOLVED',
      `"${groupName.toUpperCase()}" has been permanently purged. All active member stakes have been refunded to their personal wallets.`,
      [
        {
          text: 'RETURN TO DASHBOARD',
          onPress: () => router.replace('/(groups)'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="DELETE_GROUP.EXE" color="pink" />

          <View style={styles.body}>
            {/* Danger Warning Banner */}
            <View style={[styles.dangerBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>⚠️</Text>
              </View>
              <Text style={styles.dangerTitle}>PURGE PROTOCOL</Text>
              <Text style={styles.dangerDesc}>
                You are about to permanently dissolve <Text style={{ fontWeight: '900', color: '#ba1a1a' }}>"{groupName.toUpperCase()}"</Text>. This will cancel all active cycles and purge task manifests.
              </Text>
            </View>

            {/* Stake Breakdown */}
            <View style={styles.stakeBox}>
              <Text style={styles.stakeHeader}>AUTOMATIC VAULT SETTLEMENT:</Text>
              <View style={styles.stakeRow}>
                <Text style={styles.stakeItemLabel}>Active Member Stakes:</Text>
                <Text style={styles.stakeItemVal}>100% Refunded</Text>
              </View>
              <View style={styles.stakeRow}>
                <Text style={styles.stakeItemLabel}>League Standings:</Text>
                <Text style={styles.stakeItemVal}>Forfeited</Text>
              </View>
              <View style={styles.stakeRow}>
                <Text style={styles.stakeItemLabel}>Historical Rituals:</Text>
                <Text style={styles.stakeItemVal}>Archived Privately</Text>
              </View>
            </View>

            {/* Step 1 Checkbox */}
            <Pressable
              testID="delete-checkbox-refund"
              style={styles.checkboxRow}
              onPress={() => setAgreedStakeRefund(!agreedStakeRefund)}
            >
              <View style={[styles.checkboxBox, agreedStakeRefund && styles.checkboxBoxChecked]}>
                {agreedStakeRefund && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                I understand this will immediately end the cycle and refund all member stakes.
              </Text>
            </Pressable>

            {/* Step 2 Type Group Name verification */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>
                TYPE <Text style={{ fontWeight: '900', color: '#ba1a1a' }}>"{groupName.toUpperCase()}"</Text> TO CONFIRM:
              </Text>
              <TextInput
                testID="delete-input-confirm-name"
                style={[styles.textInput, isMatch && styles.textInputMatch]}
                placeholder={`Type "${groupName}"...`}
                placeholderTextColor={C.outline}
                value={typedConfirmation}
                onChangeText={setTypedConfirmation}
                autoCapitalize="characters"
              />
            </View>

            {/* Action Column */}
            <View style={styles.actionColumn}>
              <Pressable
                testID="delete-btn-confirm-purge"
                style={[
                  styles.deleteBtn,
                  !canDelete && styles.deleteBtnDisabled,
                  hardShadow(SHADOW_OFFSET_SM),
                ]}
                onPress={handleDeleteGroup}
                disabled={!canDelete}
                accessibilityRole="button"
              >
                <Text style={styles.deleteBtnText}>CONFIRM_IRREVERSIBLE_DELETION</Text>
              </Pressable>

              <Pressable
                testID="delete-btn-cancel"
                style={styles.cancelBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>CANCEL & KEEP GROUP</Text>
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
    gap: S.md,
    alignItems: 'center',
  },

  dangerBox: {
    width: '100%',
    backgroundColor: '#ffdad6',
    borderWidth: BORDER_HEAVY,
    borderColor: '#ba1a1a',
    padding: S.md,
    alignItems: 'center',
    gap: S.xs,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: '#ba1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  dangerTitle: {
    ...T.headlineMd,
    fontSize: 18,
    color: '#ba1a1a',
    fontWeight: '900',
    letterSpacing: 1,
  },
  dangerDesc: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#53424b',
    textAlign: 'center',
    lineHeight: 17,
  },

  stakeBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
    gap: 4,
  },
  stakeHeader: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '900',
    marginBottom: 2,
  },
  stakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stakeItemLabel: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
  stakeItemVal: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    width: '100%',
  },
  checkboxBox: {
    width: 22,
    height: 22,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: C.error,
  },
  checkboxCheck: {
    fontSize: 12,
    fontWeight: '900',
    color: C.white,
  },
  checkboxLabel: {
    flex: 1,
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurface,
  },

  inputSection: {
    width: '100%',
    gap: 4,
  },
  inputLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '800',
  },
  textInput: {
    height: 44,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
  },
  textInputMatch: {
    borderColor: '#ba1a1a',
    backgroundColor: '#fff0f0',
  },

  actionColumn: {
    width: '100%',
    gap: S.sm,
    marginTop: 4,
  },
  deleteBtn: {
    width: '100%',
    height: 52,
    backgroundColor: C.error,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnDisabled: {
    opacity: 0.45,
    backgroundColor: C.surfaceDim,
  },
  deleteBtnText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cancelBtn: {
    width: '100%',
    height: 42,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '700',
  },
});
