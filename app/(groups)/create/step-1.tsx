/**
 * SynKrew — Create Group: Step 1 (Name & Description)
 * Route: app/(groups)/create/step-1.tsx
 *
 * Implements:
 *   - Clean state
 *   - Validation error state (inline errors, entered fields preserved)
 *   - Progression to Step 2
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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

export default function CreateGroupStep1() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNext = () => {
    if (!groupName.trim()) {
      setErrorMessage('KREW DESIGNATION IS REQUIRED TO INITIALIZE A PACT.');
      return;
    }
    setErrorMessage(null);
    router.push({
      pathname: '/(groups)/create/step-2',
      params: { name: groupName.trim(), description: description.trim() },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            {/* Header OS Bar with Close Action */}
            <View style={styles.headerBar}>
              <Pressable
                testID="step1-btn-close"
                style={styles.closeBtn}
                onPress={() => router.replace('/(groups)')}
                accessibilityRole="button"
                accessibilityLabel="Close creation flow"
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
              <Text style={styles.headerTitle}>CREATE_PACT.EXE</Text>
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.body}>
              {/* Graphic Icon Header */}
              <View style={styles.iconGraphicContainer}>
                <View style={[styles.iconGraphicBox, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={styles.iconGraphicText}>🤝</Text>
                  <View style={styles.iconBadge}>
                    <Text style={styles.iconBadgeText}>+</Text>
                  </View>
                </View>
              </View>

              {/* Title & Subtitle */}
              <View style={styles.titleBlock}>
                <Text style={styles.headline}>FORM THE KREW</Text>
                <Text style={styles.subtitle}>
                  Initialize your group settings. Give it a name that demands respect.
                </Text>
              </View>

              {/* Inline Validation Error Banner */}
              {errorMessage && (
                <View testID="step1-validation-error" style={[styles.errorBanner, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={styles.errorIcon}>⚠</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.errorTitle}>ERROR: VALIDATION_FAILURE</Text>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                </View>
              )}

              {/* Form Input Card */}
              <View style={[styles.formContainer, hardShadow(SHADOW_OFFSET_SM)]}>
                {/* Group Name */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, errorMessage ? { color: '#ba1a1a' } : null]}>
                    KREW DESIGNATION *
                  </Text>
                  <View style={styles.inputRow}>
                    <View style={styles.inputPrefix}>
                      <Text style={styles.prefixIcon}>👥</Text>
                    </View>
                    <TextInput
                      testID="step1-input-name"
                      style={[
                        styles.textInput,
                        errorMessage ? styles.textInputError : null,
                      ]}
                      placeholder="e.g. Midnight Runners"
                      placeholderTextColor={C.outline}
                      value={groupName}
                      onChangeText={val => {
                        setGroupName(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Description */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>MISSION STATEMENT</Text>
                  <View style={[styles.inputRow, { alignItems: 'flex-start' }]}>
                    <View style={[styles.inputPrefix, { marginTop: 4 }]}>
                      <Text style={styles.prefixIcon}>📝</Text>
                    </View>
                    <TextInput
                      testID="step1-input-description"
                      style={[styles.textInput, styles.textArea]}
                      placeholder="Define your purpose..."
                      placeholderTextColor={C.outline}
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>
              </View>

              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressDot, styles.progressDotActive]} />
                <View style={styles.progressDot} />
                <View style={styles.progressDot} />
              </View>

              {/* Initialize / Next Button */}
              <Pressable
                testID="step1-btn-initialize"
                style={[styles.nextButton, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleNext}
                accessibilityRole="button"
              >
                <Text style={styles.nextButtonText}>INITIALIZE</Text>
                <Text style={styles.nextButtonArrow}>→</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerBar: {
    height: 48,
    backgroundColor: C.secondaryContainer,
    borderBottomWidth: BORDER_HEAVY,
    borderBottomColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.sm,
  },
  closeBtn: {
    width: 32,
    height: 32,
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(2),
  },
  closeBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  headerTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  body: {
    padding: S.xl,
    gap: S.lg,
    alignItems: 'center',
  },

  // Graphic Header
  iconGraphicContainer: {
    alignItems: 'center',
    marginVertical: S.xs,
  },
  iconGraphicBox: {
    width: 80,
    height: 80,
    backgroundColor: C.cyan,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconGraphicText: {
    fontSize: 36,
  },
  iconBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
  },

  titleBlock: {
    alignItems: 'center',
    gap: 4,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 24,
    color: C.black,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },

  // Error Banner
  errorBanner: {
    width: '100%',
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    gap: S.xs,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 18,
    color: '#ba1a1a',
  },
  errorTitle: {
    ...T.labelXs,
    color: '#ba1a1a',
    fontWeight: '800',
  },
  errorText: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#53424b',
  },

  // Form container
  formContainer: {
    width: '100%',
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.md,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  inputPrefix: {
    width: 36,
    height: 36,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixIcon: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurface,
  },
  textInputError: {
    borderColor: '#ba1a1a',
    backgroundColor: '#ffdad6',
  },
  textArea: {
    height: 72,
    paddingTop: 8,
    textAlignVertical: 'top',
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.surfaceVariant,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  progressDotActive: {
    width: 32,
    backgroundColor: C.pink,
  },

  // Next Button
  nextButton: {
    width: '100%',
    height: 52,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.xs,
  },
  nextButtonText: {
    ...T.label,
    fontSize: 15,
    color: C.black,
    letterSpacing: 2,
    fontWeight: '900',
  },
  nextButtonArrow: {
    fontSize: 18,
    color: C.black,
    fontWeight: '900',
  },
});
