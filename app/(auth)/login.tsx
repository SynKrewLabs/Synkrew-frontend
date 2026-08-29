/**
 * SynKrew — Login Screen
 * Route: app/(auth)/login.tsx
 *
 * Error states handled inline (not separate routes):
 *   'idle'                → clean form
 *   'invalid_credentials' → error banner + fields preserved; no hint which field is wrong
 *   'account_locked'      → full locked panel, distinct copy from Verification rate-limit
 *   'network'             → connection-lost panel, form state preserved
 *
 * Design: Arcade Pastel OS Window Card — matches Signup/Onboarding patterns exactly.
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
  DOT_SIZE,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

type LoginErrorState = 'idle' | 'invalid_credentials' | 'account_locked' | 'network';

interface FormValues {
  email: string;
  password: string;
}

// Window dots: Pink, White, Mint — standardized
const DOTS: [string, string, string] = [C.pink, C.white, C.mint];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { width } = useWindowDimensions();

  const [values, setValues] = useState<FormValues>({ email: '', password: '' });
  const [errorState, setErrorState] = useState<LoginErrorState>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockedSecondsLeft, setLockedSecondsLeft] = useState(0);
  const lockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardWidth = Math.min(width - S.md * 2, 448);

  const update = useCallback(
    (field: keyof FormValues, value: string) => {
      setValues(prev => ({ ...prev, [field]: value }));
      if (errorState !== 'idle') setErrorState('idle');
    },
    [errorState],
  );

  const startLockCountdown = useCallback((seconds: number) => {
    setLockedSecondsLeft(seconds);
    if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    lockTimerRef.current = setInterval(() => {
      setLockedSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(lockTimerRef.current!);
          lockTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!values.email.trim() || !values.password) return;

    setIsSubmitting(true);
    setErrorState('idle');

    try {
      // Simulate authentication check
      await new Promise<void>(resolve => setTimeout(resolve, 600));

      // Handle lock or network simulation if typed specifically, otherwise succeed
      if (values.email.toLowerCase().includes('locked')) {
        throw new Error('ACCOUNT_LOCKED');
      } else if (values.email.toLowerCase().includes('error')) {
        throw new Error('INVALID_CREDENTIALS');
      } else if (values.email.toLowerCase().includes('offline')) {
        throw new Error('NETWORK');
      }

      // Success -> navigate to Groups Dashboard
      router.replace('/(groups)');
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      if (msg === 'ACCOUNT_LOCKED') {
        setErrorState('account_locked');
        startLockCountdown(15 * 60); // 15-min cooldown
      } else if (msg === 'NETWORK') {
        setErrorState('network');
      } else {
        // INVALID_CREDENTIALS — or any unrecognised auth failure
        setErrorState('invalid_credentials');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, startLockCountdown]);

  // ─── Account Locked Panel ──────────────────────────────────────────────────
  if (errorState === 'account_locked') {
    const mins = Math.floor(lockedSecondsLeft / 60);
    const secs = lockedSecondsLeft % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const progressFilled = Math.max(0, Math.min(10, Math.round((lockedSecondsLeft / (15 * 60)) * 10)));

    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[StyleSheet.absoluteFill, gridBgStyle(20, 0.06)]} pointerEvents="none" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="SECURITY_LOCK.EXE" barColor={C.pink} />
            <View style={s.body}>
              {/* Icon */}
              <View style={[s.iconFrame, { backgroundColor: '#ffdad6' }, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={s.iconEmoji}>🔒</Text>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={[s.errorHeadline, { color: C.onSurface }]}>ACCESS DENIED</Text>
                <Text style={s.bodyText}>
                  Too many failed attempts. Your account has been temporarily locked. This is a
                  cooldown — your account is safe and will unlock automatically.
                </Text>
              </View>

              {/* Countdown */}
              <View style={[s.timerBox, hardShadow(SHADOW_OFFSET_SM)]}>
                <View style={s.timerTag}>
                  <Text style={s.timerTagLabel}>SYSTEM_TIMER</Text>
                </View>
                <Text style={s.timerText}>{lockedSecondsLeft > 0 ? timeStr : 'UNLOCKED'}</Text>
                {/* Progress bar */}
                <View style={s.pingBar}>
                  {[...Array(10)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        s.pingSegment,
                        { backgroundColor: i < progressFilled ? C.cyan : C.surfaceVariant },
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Actions */}
              {lockedSecondsLeft === 0 ? (
                <ArcadeBtn
                  label="RETRY AUTHENTICATION"
                  color={C.pink}
                  onPress={() => setErrorState('idle')}
                />
              ) : (
                <ArcadeBtn label="RETRY AUTHENTICATION" color={C.pink} onPress={() => {}} disabled />
              )}
              <GhostBtn label="CONTACT SUPPORT" onPress={() => {}} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Network Error Panel ───────────────────────────────────────────────────
  if (errorState === 'network') {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[StyleSheet.absoluteFill, gridBgStyle(20, 0.06)]} pointerEvents="none" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="SYS_ERR.EXE" barColor={C.pink} />
            <View style={s.body}>
              <View style={[s.iconFrame, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={s.iconEmoji}>📡</Text>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={[s.errorHeadline, { color: '#ba1a1a' }]}>CONNECTION TIMEOUT</Text>
                <Text style={s.bodyText}>
                  The server did not respond in time. Network connection lost. Your login details
                  are preserved — try again when connectivity is restored.
                </Text>
              </View>

              {/* Status chip */}
              <View style={s.statusChip}>
                <View style={s.statusDot} />
                <Text style={s.statusLabel}>STATUS: DISCONNECTED · PING: 999ms</Text>
              </View>

              {/* Ping bar */}
              <View style={s.pingBarWrap}>
                <Text style={s.pingLabel}>SIGNAL TEST...</Text>
                <View style={s.pingBar}>
                  {[...Array(10)].map((_, i) => (
                    <View
                      key={i}
                      style={[s.pingSegment, { backgroundColor: i < 2 ? '#ba1a1a' : C.surfaceVariant }]}
                    />
                  ))}
                </View>
              </View>

              <ArcadeBtn label="↻  RETRY CONNECTION" color={C.pink} onPress={handleSubmit} />
              <GhostBtn
                label="CANCEL & RETURN"
                onPress={() => router.replace('/(onboarding)/welcome')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Main Form (idle + invalid_credentials) ────────────────────────────────
  const hasCredError = errorState === 'invalid_credentials';

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(40, 0.08)]} pointerEvents="none" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="LOGIN.EXE" barColor={C.pink} />

            <View style={s.body}>
              {/* Brand header */}
              <View style={s.brandHeader}>
                <Text style={s.brandTitle}>SYNKREW_AUTH</Text>
                <View style={s.badgeMint}>
                  <Text style={s.badgeLabel}>ENTER CREDENTIALS TO PROCEED</Text>
                </View>
              </View>

              {/* Invalid credentials banner */}
              {hasCredError && (
                <View style={[s.errorBanner, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={s.errorBannerIcon}>⚠</Text>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={s.errorBannerText}>ERROR: AUTH_FAILURE</Text>
                    <Text style={[s.bodyText, { fontSize: 13, textAlign: 'left' }]}>
                      Credentials not recognised. Double-check your email and passkey.
                    </Text>
                  </View>
                </View>
              )}

              {/* EMAIL field */}
              <FormField
                label="EMAIL_IDENTIFIER"
                placeholder="USER@DOMAIN.SYS"
                value={values.email}
                onChangeText={v => update('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                hasError={hasCredError}
              />

              {/* PASSWORD field */}
              <FormField
                label="SECURITY_KEY"
                placeholder="••••••••"
                value={values.password}
                onChangeText={v => update('password', v)}
                secureTextEntry
                hasError={hasCredError}
              />

              {/* Forgot password */}
              <View style={s.forgotRow}>
                <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text style={s.forgotLink}>FORGOT_PASSWORD?</Text>
                </Pressable>
              </View>

              {/* Submit */}
              <ArcadeBtn
                label={isSubmitting ? 'AUTHENTICATING...' : 'EXECUTE_LOGIN'}
                color={C.pink}
                onPress={handleSubmit}
                disabled={isSubmitting || !values.email.trim() || !values.password}
              />

              {/* Signup link */}
              <View style={s.signupRow}>
                <Text style={s.bodyText}>NEW_USER? </Text>
                <Pressable onPress={() => router.replace('/(auth)/signup')}>
                  <Text style={s.linkText}>INITIATE_REGISTRATION</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── TitleBar ────────────────────────────────────────────────────────────────

interface TitleBarProps {
  dots: [string, string, string];
  label: string;
  barColor: string;
}
function TitleBar({ dots, label, barColor }: TitleBarProps) {
  return (
    <View style={[tb.bar, { backgroundColor: barColor }]}>
      <View style={tb.dotRow}>
        {dots.map((c, i) => (
          <View key={i} style={[tb.dot, { backgroundColor: c }]} />
        ))}
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

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  hasError?: boolean;
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
  hasError,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={ff.group}>
      <Text style={[ff.label, hasError && { color: '#ba1a1a' }]}>{label}</Text>
      <TextInput
        style={[
          ff.input,
          focused && ff.inputFocused,
          hasError && ff.inputError,
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
    ...Platform.select({ web: { boxShadow: `inset 0 0 0 2px ${C.cyan}` } as any }),
  },
  inputError: { borderColor: '#ba1a1a', backgroundColor: '#ffdad6' },
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
  safe: { flex: 1, backgroundColor: C.surface },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.md,
    paddingVertical: S.lg,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  body: { padding: S.xl, alignItems: 'center', gap: S.lg },

  // Brand header
  brandHeader: { alignItems: 'center', gap: S.xs },
  brandTitle: { ...T.headlineMd, color: C.onSurface, textTransform: 'uppercase' },
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
  errorBannerText: { ...T.labelSm, color: '#ba1a1a', textTransform: 'uppercase', letterSpacing: 1 },

  // Forgot / signup rows
  forgotRow: { width: '100%', alignItems: 'flex-end' },
  forgotLink: {
    ...T.labelSm,
    color: C.cyan,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  linkText: {
    ...T.label,
    color: C.primaryDark,
    textDecorationLine: 'underline',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bodyText: { ...T.bodyMd, color: C.onSurfaceVariant, textAlign: 'center' },

  // Locked / network error shared
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
  errorHeadline: { ...T.headlineMd, textTransform: 'uppercase', textAlign: 'center' },

  // Timer box (account locked)
  timerBox: {
    width: '100%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.sm,
    position: 'relative',
    marginTop: S.sm,
  },
  timerTag: {
    position: 'absolute',
    top: -12,
    left: S.md,
    backgroundColor: C.cyan,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.xs,
    paddingVertical: 2,
  },
  timerTagLabel: { ...T.labelSm, color: C.black, textTransform: 'uppercase', letterSpacing: 1 },
  timerText: {
    ...T.headlineMd,
    color: C.primaryDark,
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: S.xs,
  },

  // Status chip (network error)
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

  // Ping bar
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
