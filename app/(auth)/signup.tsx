/**
 * SynKrew — Sign Up Screen
 * Route: app/(auth)/signup.tsx
 *
 * Error states handled as in-screen state (not separate routes):
 *   - 'idle'       → clean form
 *   - 'validation' → inline field errors, values preserved
 *   - 'email_taken'→ banner + login redirect link, values preserved
 *   - 'network'    → connection-lost panel, form state preserved
 *
 * On success → routes to Verification: Pending Code (app/(auth)/verify)
 * NOT directly to Groups — email verification is mandatory.
 *
 * Design: Arcade Pastel OS Window Card — matches Splash/Onboarding patterns exactly.
 */

import React, { useState, useCallback, useRef } from 'react';
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
  DOT_SIZE,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

type ErrorState = 'idle' | 'validation' | 'email_taken' | 'network';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

// Dot sequence: [Pink, White, Mint] — same as all onboarding screens
const DOTS: [string, string, string] = [C.pink, C.white, C.mint];

// ─── Validation ──────────────────────────────────────────────────────────────

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.username.trim()) {
    errors.username = 'Handle is required.';
  } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
    errors.username = 'Handle must contain only alphanumeric characters and underscores.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Passkey is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Passkey must be at least 8 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your passkey.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passkeys do not match.';
  }

  if (!values.terms) {
    errors.terms = 'You must accept the terms.';
  }

  return errors;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SignUpScreen() {
  const { width } = useWindowDimensions();

  const [values, setValues] = useState<FormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorState, setErrorState] = useState<ErrorState>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardWidth = Math.min(width - S.md * 2, 448);

  const update = useCallback((field: keyof FormValues, value: string | boolean) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (field in fieldErrors) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear top-level error state when user edits
    if (errorState !== 'idle') setErrorState('idle');
  }, [fieldErrors, errorState]);

  const handleSubmit = useCallback(async () => {
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorState('validation');
      return;
    }

    setIsSubmitting(true);
    setErrorState('idle');

    try {
      // Simulate API call — replace with real auth service
      await new Promise<void>(resolve => setTimeout(resolve, 1200));
      // Success → verification gate (email verification is mandatory)
      router.replace({ pathname: '/(auth)/verify', params: { email: values.email } });
    } catch (e: any) {
      if (e?.message === 'EMAIL_TAKEN') {
        setErrorState('email_taken');
      } else {
        setErrorState('network');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  // ─── Network Error Screen ───────────────────────────────────────────────
  if (errorState === 'network') {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[StyleSheet.absoluteFill, gridBgStyle(20, 0.06)]} pointerEvents="none" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="SYS_ERROR.EXE" barColor={C.pink} />
            <View style={s.body}>
              {/* WiFi off icon in arcade frame */}
              <View style={[s.iconFrame, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={s.iconEmoji}>📡</Text>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={[s.errorHeadline, { color: '#ba1a1a' }]}>CONNECTION LOST</Text>
                <Text style={s.bodyText}>
                  The mainframe is unresponsive. We encountered a network interruption while attempting to process your registration.
                </Text>
              </View>

              {/* Status chip */}
              <View style={s.statusChip}>
                <View style={s.statusDot} />
                <Text style={s.statusLabel}>STATUS: OFFLINE</Text>
              </View>

              {/* Ping progress bar */}
              <View style={s.pingBarWrap}>
                <Text style={s.pingLabel}>PING TEST...</Text>
                <View style={s.pingBar}>
                  {[...Array(10)].map((_, i) => (
                    <View
                      key={i}
                      style={[s.pingSegment, { backgroundColor: i < 3 ? '#ba1a1a' : C.surfaceVariant }]}
                    />
                  ))}
                </View>
              </View>

              {/* Actions */}
              <ArcadeBtn label="↻  RETRY CONNECTION" color={C.pink} onPress={handleSubmit} />
              <GhostBtn label="CANCEL & RETURN" onPress={() => router.replace('/(onboarding)/welcome')} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Main Form (idle + validation + email_taken states) ────────────────
  const hasValidationErrors = errorState === 'validation';
  const hasEmailTaken = errorState === 'email_taken';

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(40, 0.08)]} pointerEvents="none" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="SYS_SIGNUP.EXE" barColor={C.mint} />

            <View style={s.body}>
              {/* Brand header */}
              <View style={s.brandHeader}>
                <Text style={s.brandTitle}>SYNKREW</Text>
                <View style={s.badgeMint}>
                  <Text style={s.badgeLabel}>NEW USER REGISTRATION</Text>
                </View>
              </View>

              {/* Validation error banner */}
              {hasValidationErrors && (
                <View style={[s.errorBanner, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={s.errorBannerIcon}>⚠</Text>
                  <Text style={s.errorBannerText}>INVALID_HANDLE_FORMAT — Fix errors below.</Text>
                </View>
              )}

              {/* Email-taken error banner */}
              {hasEmailTaken && (
                <View style={[s.errorBanner, { borderColor: '#ba1a1a', backgroundColor: '#ffdad6' }, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={s.errorBannerIcon}>⚠</Text>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={s.errorBannerText}>ERROR: EMAIL_IN_USE</Text>
                    <Text style={[s.bodyText, { fontSize: 13 }]}>
                      This identifier is already registered in the system mainframe.
                    </Text>
                    <Pressable onPress={() => router.replace('/(auth)/login')}>
                      <Text style={s.linkText}>LOGIN INSTEAD →</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* USERNAME field */}
              <FormField
                label="USERNAME"
                placeholder="Enter handle"
                value={values.username}
                onChangeText={v => update('username', v)}
                autoCapitalize="none"
                autoCorrect={false}
                error={fieldErrors.username}
              />

              {/* EMAIL field */}
              <FormField
                label="COMMS LINK (EMAIL)"
                placeholder="you@domain.com"
                value={values.email}
                onChangeText={v => update('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={fieldErrors.email}
              />

              {/* PASSWORD field */}
              <FormField
                label="PASSKEY"
                placeholder="••••••••"
                value={values.password}
                onChangeText={v => update('password', v)}
                secureTextEntry
                error={fieldErrors.password}
              />

              {/* CONFIRM PASSWORD field */}
              <FormField
                label="VERIFY PASSKEY"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChangeText={v => update('confirmPassword', v)}
                secureTextEntry
                error={fieldErrors.confirmPassword}
              />

              {/* Terms checkbox */}
              <View style={s.checkRow}>
                <Pressable
                  onPress={() => update('terms', !values.terms)}
                  style={[s.checkbox, values.terms && s.checkboxChecked]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: values.terms }}
                >
                  {values.terms && <Text style={s.checkmark}>✓</Text>}
                </Pressable>
                <Pressable onPress={() => update('terms', !values.terms)} style={{ flex: 1 }}>
                  <Text style={s.checkLabel}>
                    I agree to the terms and social accountability rituals.
                  </Text>
                </Pressable>
              </View>
              {fieldErrors.terms && <Text style={s.fieldError}>{fieldErrors.terms}</Text>}

              {/* Submit */}
              <ArcadeBtn
                label={isSubmitting ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                color={C.pink}
                onPress={handleSubmit}
                disabled={isSubmitting}
              />

              {/* Login link */}
              <View style={s.loginRow}>
                <Text style={s.bodyText}>Already have an account? </Text>
                <Pressable onPress={() => router.replace('/(auth)/login')}>
                  <Text style={s.linkText}>LOGIN</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface TitleBarProps {
  dots: [string, string, string];
  label: string;
  barColor: string;
}
function TitleBar({ dots, label, barColor }: TitleBarProps) {
  return (
    <View style={[tb.bar, { backgroundColor: barColor }]}>
      <View style={tb.dotRow}>
        {dots.map((c, i) => <View key={i} style={[tb.dot, { backgroundColor: c }]} />)}
      </View>
      <Text style={tb.label}>{label}</Text>
      <View style={tb.spacer} />
    </View>
  );
}

const tb = StyleSheet.create({
  bar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    paddingHorizontal: S.xs,
    gap: 6,
  },
  dotRow: { flexDirection: 'row', gap: 6 },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  label: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
  },
  spacer: { width: DOT_SIZE * 3 + 12 },
});

// ─── FormField ───────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={ff.group}>
      <Text style={ff.label}>{label}</Text>
      <TextInput
        style={[
          ff.input,
          focused && ff.inputFocused,
          error ? ff.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.outline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <Text style={ff.error}>{error}</Text>}
    </View>
  );
}

const ff = StyleSheet.create({
  group: { width: '100%', gap: 6 },
  label: {
    ...T.labelSm,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.sm,
    paddingHorizontal: S.md,
    ...T.bodyMd,
    color: C.onSurface,
  },
  inputFocused: {
    borderColor: C.cyan,
    shadowColor: C.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0,
    // web inset shadow
    ...Platform.select({ web: { boxShadow: `inset 0 0 0 2px ${C.cyan}` } as any }),
  },
  inputError: {
    borderColor: '#ba1a1a',
  },
  error: {
    ...T.labelSm,
    fontSize: 11,
    color: '#ba1a1a',
  },
});

// ─── ArcadeBtn ────────────────────────────────────────────────────────────────
interface ArcadeBtnProps {
  label: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}
function ArcadeBtn({ label, color, onPress, disabled }: ArcadeBtnProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <View style={ab.outer}>
      <View style={[ab.shadow, pressed && ab.shadowPressed]} />
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        style={[ab.btn, { backgroundColor: color }, pressed && ab.btnPressed, disabled && ab.disabled]}
        accessibilityRole="button"
      >
        <Text style={ab.label}>{label}</Text>
      </Pressable>
    </View>
  );
}
const ab = StyleSheet.create({
  outer: { width: '100%', position: 'relative' },
  shadow: {
    position: 'absolute',
    top: SHADOW_OFFSET,
    left: SHADOW_OFFSET,
    right: -SHADOW_OFFSET,
    bottom: -SHADOW_OFFSET,
    backgroundColor: C.black,
  },
  shadowPressed: { top: 0, left: 0, right: 0, bottom: 0 },
  btn: {
    width: '100%',
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.md,
    paddingHorizontal: S.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  btnPressed: { transform: [{ translateX: SHADOW_OFFSET }, { translateY: SHADOW_OFFSET }] },
  disabled: { opacity: 0.45 },
  label: {
    ...T.label,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

// ─── GhostBtn ────────────────────────────────────────────────────────────────
function GhostBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={gb.btn} accessibilityRole="button">
      <Text style={gb.label}>{label}</Text>
    </Pressable>
  );
}
const gb = StyleSheet.create({
  btn: {
    width: '100%',
    paddingVertical: S.sm,
    alignItems: 'center',
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
  },
  label: { ...T.labelSm, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 },
});

// ─── Screen-level styles ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.md,
    paddingVertical: S.lg,
  },

  // OS Window Card
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  body: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.lg,
  },

  // Brand header
  brandHeader: { alignItems: 'center', gap: S.xs },
  brandTitle: {
    ...T.headlineLg,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  badgeMint: {
    backgroundColor: C.mint,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
  },
  badgeLabel: { ...T.labelSm, color: C.black, textTransform: 'uppercase', letterSpacing: 1 },

  // Error banner
  errorBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: S.xs,
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
  },
  errorBannerIcon: { fontSize: 16, color: '#ba1a1a', lineHeight: 20 },
  errorBannerText: { ...T.labelSm, color: '#ba1a1a', textTransform: 'uppercase', letterSpacing: 1, flex: 1 },

  // Checkbox
  checkRow: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: S.sm },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: C.mint },
  checkmark: { fontSize: 13, fontWeight: '800', color: C.black },
  checkLabel: { ...T.bodyMd, color: C.onSurface, flex: 1 },
  fieldError: { ...T.labelSm, fontSize: 11, color: '#ba1a1a', width: '100%' },

  // Login link row
  loginRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
  linkText: { ...T.label, color: C.primaryDark, textDecorationLine: 'underline', letterSpacing: 1, textTransform: 'uppercase' },
  bodyText: { ...T.bodyMd, color: C.onSurfaceVariant, textAlign: 'center' },

  // Network error specific
  iconFrame: {
    width: 96,
    height: 96,
    backgroundColor: C.surfaceVariant,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 40 },
  centeredTextBlock: { width: '100%', alignItems: 'center', gap: S.sm },
  errorHeadline: {
    ...T.headlineMd,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    borderRadius: 2,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ba1a1a' },
  statusLabel: { ...T.labelSm, color: C.onSurfaceVariant, textTransform: 'uppercase' },
  pingBarWrap: { width: '100%', gap: 4 },
  pingLabel: { ...T.labelSm, color: C.onSurfaceVariant, textTransform: 'uppercase' },
  pingBar: {
    width: '100%',
    height: 16,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    padding: 2,
    gap: 2,
  },
  pingSegment: { flex: 1, height: '100%' },
});


