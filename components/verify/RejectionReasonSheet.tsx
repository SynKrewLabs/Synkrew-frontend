/**
 * SynKrew — Verification Rejection Reason Sheet
 * Component: components/verify/RejectionReasonSheet.tsx
 *
 * Implements:
 *   - Slide-up bottom modal / sheet
 *   - Standardized defect reason selectors
 *   - Required explanation text input (empty input validation blocks submission)
 *   - Confirm Rejection & Cancel actions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
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
import { TitleBar } from '../ui/TitleBar';

interface RejectionReasonSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const REASONS = [
  { id: 'MISSING_CORE_EVIDENCE', label: 'MISSING CORE EVIDENCE', desc: 'Primary ritual action not visible in frame' },
  { id: 'INCORRECT_TELEMETRY', label: 'INCORRECT TELEMETRY', desc: 'GPS or timestamp mismatch with group routine' },
  { id: 'TAMPERED_OR_SPOOFED', label: 'TAMPERED OR SPOOFED', desc: 'Screen capture or recycled photo detected' },
  { id: 'OTHER_DEFECT', label: 'OTHER DEFECT', desc: 'Custom violation of group pact directives' },
];

export function RejectionReasonSheet({ visible, onClose, onSubmit }: RejectionReasonSheetProps) {
  const [selectedReason, setSelectedReason] = useState('MISSING_CORE_EVIDENCE');
  const [details, setDetails] = useState('');

  const canSubmit = selectedReason !== 'OTHER_DEFECT' || details.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(selectedReason, details);
    setDetails('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          <View testID="rejection-reason-sheet" style={[styles.sheetCard, hardShadow(SHADOW_OFFSET)]}>
            <TitleBar label="REJECTION_PROTOCOL.EXE" color="pink" />

            <ScrollView contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>FLAG PROOF DEFECT</Text>
                <Text style={styles.sheetDesc}>
                  Select the defect category. Rejections require verification audit integrity.
                </Text>
              </View>

              {/* Reason Selectors */}
              <View style={styles.reasonsList}>
                {REASONS.map(r => {
                  const isSelected = selectedReason === r.id;
                  return (
                    <Pressable
                      key={r.id}
                      testID={`reason-opt-${r.id}`}
                      style={[
                        styles.reasonItem,
                        isSelected && styles.reasonItemSelected,
                        hardShadow(1),
                      ]}
                      onPress={() => setSelectedReason(r.id)}
                    >
                      <View style={styles.reasonLeft}>
                        <Text style={[styles.reasonLabel, isSelected && styles.reasonLabelSelected]}>
                          {r.label}
                        </Text>
                        <Text style={styles.reasonDesc}>{r.desc}</Text>
                      </View>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Notes Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  EXPLANATION / AUDIT NOTE {selectedReason === 'OTHER_DEFECT' && <Text style={{ color: '#ba1a1a' }}>* (REQUIRED)</Text>}
                </Text>
                <TextInput
                  testID="rejection-input-details"
                  style={styles.textInput}
                  placeholder="Describe the issue for peer record..."
                  placeholderTextColor={C.outline}
                  value={details}
                  onChangeText={setDetails}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Actions */}
              <View style={styles.actionColumn}>
                <Pressable
                  testID="rejection-btn-submit"
                  style={[
                    styles.submitBtn,
                    !canSubmit && styles.submitBtnDisabled,
                    hardShadow(SHADOW_OFFSET_SM),
                  ]}
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  accessibilityRole="button"
                >
                  <Text style={styles.submitBtnText}>CONFIRM & REJECT PROOF (✕)</Text>
                </Pressable>

                <Pressable
                  testID="rejection-btn-cancel"
                  style={styles.cancelBtn}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelBtnText}>CANCEL & RESUME REVIEW</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    padding: S.md,
  },
  sheetCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  sheetBody: {
    padding: S.md,
    gap: S.md,
  },
  sheetHeader: {
    gap: 4,
  },
  sheetTitle: {
    ...T.headlineMd,
    fontSize: 20,
    color: '#ba1a1a',
    textTransform: 'uppercase',
  },
  sheetDesc: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 16,
  },

  reasonsList: {
    gap: 6,
  },
  reasonItem: {
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reasonItemSelected: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: '#ba1a1a',
  },
  reasonLeft: {
    flex: 1,
    gap: 2,
  },
  reasonLabel: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
  },
  reasonLabelSelected: {
    color: '#ba1a1a',
  },
  reasonDesc: {
    ...T.bodyMd,
    fontSize: 10,
    color: C.onSurfaceVariant,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: S.sm,
  },
  radioCircleSelected: {
    borderColor: '#ba1a1a',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ba1a1a',
  },

  inputSection: {
    gap: 4,
  },
  inputLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '800',
  },
  textInput: {
    minHeight: 64,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    ...T.bodyMd,
    fontSize: 12,
    color: C.black,
    textAlignVertical: 'top',
  },

  actionColumn: {
    gap: S.xs,
    marginTop: 4,
  },
  submitBtn: {
    height: 48,
    backgroundColor: C.error,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.45,
    backgroundColor: C.surfaceDim,
  },
  submitBtnText: {
    ...T.labelSm,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cancelBtn: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '700',
  },
});
