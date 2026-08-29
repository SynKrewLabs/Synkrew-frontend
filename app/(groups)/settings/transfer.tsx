/**
 * SynKrew — Group Settings: Transfer Ownership Confirmation
 * Route: app/(groups)/settings/transfer.tsx
 *
 * Implements:
 *   - Destructive action confirmation pattern
 *   - Squad candidate selector
 *   - Clear explanation of lifecycle rights handoff
 *   - Explicit confirmation check
 */

import React, { useState } from 'react';
import {
  View,
  Text,
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

interface Candidate {
  id: string;
  name: string;
  avatarLetter: string;
  avatarBg: string;
}

const CANDIDATES: Candidate[] = [
  { id: '1', name: 'SARAH_X', avatarLetter: 'S', avatarBg: C.cyan },
  { id: '2', name: 'MIKE_99', avatarLetter: 'M', avatarBg: C.secondaryContainer },
  { id: '3', name: 'CYBERSAM', avatarLetter: 'C', avatarBg: C.yellow },
];

export default function TransferOwnershipConfirmation() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.name ? String(params.name) : 'MORNING RUNNERS';
  const [selectedCandidate, setSelectedCandidate] = useState<string>('1');
  const [agreed, setAgreed] = useState(false);

  const handleConfirmTransfer = () => {
    if (!agreed) return;
    const candidate = CANDIDATES.find(c => c.id === selectedCandidate);
    Alert.alert(
      'OWNERSHIP TRANSFERRED',
      `Full administrative credentials for "${groupName.toUpperCase()}" have been transferred to @${candidate?.name}. You are now a standard squad member.`,
      [
        {
          text: 'RETURN TO GROUP',
          onPress: () => router.replace({ pathname: '/(groups)/detail', params: { name: groupName } }),
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
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="TRANSFER_OWNERSHIP.EXE" color="yellow" />

          <View style={styles.body}>
            {/* Warning Box */}
            <View style={[styles.warningBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>⚠️</Text>
              </View>
              <Text style={styles.warningTitle}>CRITICAL ACTION</Text>
              <Text style={styles.warningDesc}>
                Transferring ownership yields complete administrative sovereignty of <Text style={{ fontWeight: '800', color: C.black }}>"{groupName.toUpperCase()}"</Text>.
              </Text>
            </View>

            {/* Candidate Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SELECT NEW KREW CREATOR</Text>
              <View style={styles.candidateList}>
                {CANDIDATES.map(c => {
                  const isSelected = selectedCandidate === c.id;
                  return (
                    <Pressable
                      key={c.id}
                      testID={`transfer-candidate-${c.id}`}
                      style={[
                        styles.candidateCard,
                        isSelected && styles.candidateCardSelected,
                        hardShadow(1),
                      ]}
                      onPress={() => setSelectedCandidate(c.id)}
                    >
                      <View style={styles.candidateLeft}>
                        <View style={[styles.candidateAvatar, { backgroundColor: c.avatarBg }]}>
                          <Text style={styles.candidateAvatarText}>{c.avatarLetter}</Text>
                        </View>
                        <Text style={styles.candidateName}>@{c.name}</Text>
                      </View>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Rights Explanation */}
            <View style={styles.rightsNotice}>
              <Text style={styles.rightsTitle}>WHAT WILL CHANGE:</Text>
              <Text style={styles.rightsItem}>• New creator gains task editing, pausing, and deletion rights</Text>
              <Text style={styles.rightsItem}>• You will relinquish all administrator privileges</Text>
              <Text style={styles.rightsItem}>• This action cannot be unilaterally undone</Text>
            </View>

            {/* Checkbox */}
            <Pressable
              testID="transfer-checkbox-agreement"
              style={styles.checkboxRow}
              onPress={() => setAgreed(!agreed)}
            >
              <View style={[styles.checkboxBox, agreed && styles.checkboxBoxChecked]}>
                {agreed && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                I understand that I am permanently transferring group administration.
              </Text>
            </Pressable>

            {/* Actions */}
            <View style={styles.actionColumn}>
              <Pressable
                testID="transfer-btn-confirm"
                style={[
                  styles.confirmBtn,
                  !agreed && styles.confirmBtnDisabled,
                  hardShadow(SHADOW_OFFSET_SM),
                ]}
                onPress={handleConfirmTransfer}
                disabled={!agreed}
                accessibilityRole="button"
              >
                <Text style={styles.confirmBtnText}>CONFIRM_OWNERSHIP_TRANSFER</Text>
              </Pressable>

              <Pressable
                testID="transfer-btn-cancel"
                style={styles.cancelBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>CANCEL OPERATION</Text>
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

  // Warning Box
  warningBox: {
    width: '100%',
    backgroundColor: '#fff3cd',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    alignItems: 'center',
    gap: S.xs,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  warningTitle: {
    ...T.labelSm,
    color: '#856404',
    fontWeight: '900',
    letterSpacing: 1,
  },
  warningDesc: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#533f03',
    textAlign: 'center',
  },

  // Candidate Selector
  section: {
    width: '100%',
    gap: 6,
  },
  sectionTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  candidateList: {
    gap: 6,
  },
  candidateCard: {
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  candidateCardSelected: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER,
  },
  candidateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  candidateAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidateAvatarText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
  },
  candidateName: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '800',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: C.black,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.black,
  },

  // Rights notice
  rightsNotice: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
    gap: 4,
  },
  rightsTitle: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '900',
  },
  rightsItem: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },

  // Checkbox
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
    backgroundColor: C.secondaryContainer,
  },
  checkboxCheck: {
    fontSize: 12,
    fontWeight: '900',
    color: C.black,
  },
  checkboxLabel: {
    flex: 1,
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurface,
  },

  // Action Buttons
  actionColumn: {
    width: '100%',
    gap: S.sm,
    marginTop: 4,
  },
  confirmBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#ff8585',
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.45,
    backgroundColor: C.surfaceDim,
  },
  confirmBtnText: {
    ...T.labelSm,
    color: C.black,
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
