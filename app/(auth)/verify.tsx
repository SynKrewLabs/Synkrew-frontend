/**
 * SynKrew — Verification Screen
 * Route: app/(auth)/verify.tsx
 *
 * States (all inline — no separate routes):
 *   'pending'    → 6-digit OTP input, resend countdown inline
 *   'expired'    → code has expired, request a new one
 *   'rate_limit' → too many resend attempts, cooldown required
 *
 * Routing:
 *   - Entered from: Signup → verify (email passed as query param)
 *   - On success:   router.replace('/(main)/groups')
 *   - Resend resets countdown and stays on 'pending'
 *
 * Design: Arcade Pastel OS Window Card — matches Login/Signup patterns.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
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

// ─── Constants ────────────────────────────────────────────────────────────────

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 59;
const MAX_RESEND_ATTEMPTS = 3;

type VerifyState = 'pending' | 'expired' | 'rate_limit';

const DOTS: [string, string, string] = [C.pink, C.white, C.mint];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function VerifyScreen() {
  const { width } = useWindowDimensions();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [state, setState] = useState<VerifyState>('pending');
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [rateLimitSecondsLeft, setRateLimitSecondsLeft] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>(Array(CODE_LENGTH).fill(null));
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardWidth = Math.min(width - S.md * 2, 448);

  // ─── Start resend countdown ──────────────────────────────────────────────
  const startCooldown = useCallback((seconds: number) => {
    setResendCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCooldown(RESEND_COOLDOWN_SECONDS);
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      if (rateTimerRef.current) clearInterval(rateTimerRef.current);
    };
  }, [startCooldown]);

  // ─── OTP digit handlers ──────────────────────────────────────────────────
  const handleDigitChange = useCallback((index: number, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(-1);
    setDigits(prev => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
    if (cleaned && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback((index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  // ─── Verify ──────────────────────────────────────────────────────────────
  const handleVerify = useCallback(async () => {
    const code = digits.join('');
    if (code.length < CODE_LENGTH) return;

    setIsVerifying(true);
    try {
      // Simulate API call — replace with real verification service
      await new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('EXPIRED')), 1000),
      );
      // On success: router.replace('/(main)/groups');
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      if (msg === 'EXPIRED') {
        setState('expired');
      } else {
        setState('expired'); // fallback
      }
    } finally {
      setIsVerifying(false);
    }
  }, [digits]);

  // ─── Resend code ─────────────────────────────────────────────────────────
  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;

    const nextAttempts = resendAttempts + 1;
    if (nextAttempts > MAX_RESEND_ATTEMPTS) {
      setState('rate_limit');
      // Start rate-limit cooldown (2:45)
      const RATE_LIMIT_SECONDS = 165;
      setRateLimitSecondsLeft(RATE_LIMIT_SECONDS);
      rateTimerRef.current = setInterval(() => {
        setRateLimitSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(rateTimerRef.current!);
            rateTimerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setResendAttempts(nextAttempts);
    setDigits(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    startCooldown(RESEND_COOLDOWN_SECONDS);
    // Simulate resend API call — replace with real service call
    setState('pending');
  }, [resendCooldown, resendAttempts, startCooldown]);

  // ─── Rate Limit State ────────────────────────────────────────────────────
  if (state === 'rate_limit') {
    const mins = Math.floor(rateLimitSecondsLeft / 60);
    const secs = rateLimitSecondsLeft % 60;
    const timeStr = `0${mins}:${String(secs).padStart(2, '0')}`;
    const progressPct = rateLimitSecondsLeft > 0 ? (rateLimitSecondsLeft / 165) * 100 : 0;

    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[StyleSheet.absoluteFill, gridBgStyle(32, 0.05)]} pointerEvents="none" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="RATE_LIMIT.EXE" barColor="#ffdad6" />
            <View style={s.body}>
              {/* Icon */}
              <View style={[s.iconFrame, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={s.iconEmoji}>⚠️</Text>
                <View style={s.exclamBadge}>
                  <Text style={s.exclamText}>!</Text>
                </View>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={[s.sectionHeadline, { color: C.onSurface }]}>TRANSMISSION ERROR</Text>
                <Text style={s.bodyText}>
                  Too many resend attempts detected. Please wait before requesting another
                  verification code — this is a temporary cooldown, not an account issue.
                </Text>
              </View>

              {/* Cooldown progress */}
              <View style={[s.timerBox, hardShadow(SHADOW_OFFSET_SM)]}>
                <View style={s.timerRow}>
                  <Text style={s.timerLabel}>COOLDOWN STATUS:</Text>
                  <Text style={[s.timerLabel, { color: '#ba1a1a' }]}>
                    {rateLimitSecondsLeft > 0 ? timeStr : 'READY'}
                  </Text>
                </View>
                <View style={s.progressBar}>
                  <View style={[s.progressFill, { width: `${progressPct}%` as any, backgroundColor: C.cyan }]} />
                </View>
              </View>

              {/* Resend disabled during cooldown */}
              <ArcadeBtn
                label="RESEND CODE"
                color={C.pink}
                onPress={() => {
                  if (rateLimitSecondsLeft <= 0) {
                    setResendAttempts(0);
                    setState('pending');
                    startCooldown(RESEND_COOLDOWN_SECONDS);
                  }
                }}
                disabled={rateLimitSecondsLeft > 0}
              />
              <GhostBtn
                label="RETURN TO DASHBOARD"
                onPress={() => router.replace('/(main)/groups')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Code Expired State ───────────────────────────────────────────────────
  if (state === 'expired') {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[StyleSheet.absoluteFill, gridBgStyle(20, 0.06)]} pointerEvents="none" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="VERIFY_ACCOUNT.EXE" barColor={C.surfaceContainerHigh} />
            <View style={s.body}>
              {/* Error banner */}
              <View style={s.errorBanner}>
                <Text style={s.errorBannerIcon}>⚠</Text>
                <Text style={s.errorBannerText}>ERROR: TOKEN_EXPIRED</Text>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={s.sectionHeadline}>ACCESS DENIED</Text>
                <Text style={s.bodyText}>
                  The verification code has expired. Codes are valid for a limited window.
                  Request a new one to continue — you won't need to restart sign-up.
                </Text>
              </View>

              {/* Expired / greyed digit boxes */}
              <View style={s.otpRow}>
                {Array(CODE_LENGTH).fill('').map((_, i) => (
                  <View key={i} style={[s.otpBox, s.otpBoxExpired]}>
                    <Text style={s.otpDigitExpired}>–</Text>
                  </View>
                ))}
              </View>

              <ArcadeBtn
                label="REQUEST_NEW_CODE"
                color={C.pink}
                onPress={() => {
                  setDigits(Array(CODE_LENGTH).fill(''));
                  setState('pending');
                  startCooldown(RESEND_COOLDOWN_SECONDS);
                }}
              />
              <Pressable onPress={() => router.replace('/(auth)/login')}>
                <Text style={s.cancelLink}>CANCEL_OPERATION</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Pending Code State ───────────────────────────────────────────────────
  const code = digits.join('');
  const canVerify = code.length === CODE_LENGTH;
  const canResend = resendCooldown === 0;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(40, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar dots={DOTS} label="VERIFY_ACCOUNT.EXE" barColor={C.pink} />
          <View style={s.body}>
            {/* Icon */}
            <View style={[s.iconFrame, { backgroundColor: C.secondaryFixed }, hardShadow(SHADOW_OFFSET_SM)]}>
              <Text style={s.iconEmoji}>📨</Text>
            </View>

            <View style={s.centeredTextBlock}>
              <Text style={s.sectionHeadline}>Check your inbox</Text>
              {email ? (
                <Text style={s.bodyText}>
                  We sent a 6-digit code to{' '}
                  <Text style={{ color: C.primaryDark }}>{email}</Text>.
                  Enter it below to unlock access.
                </Text>
              ) : (
                <Text style={s.bodyText}>
                  We sent a 6-digit transmission to your terminal. Enter it below to unlock access.
                </Text>
              )}
            </View>

            {/* OTP digit inputs */}
            <View style={s.otpRow}>
              {digits.map((d, i) => (
                <OTPBox
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  value={d}
                  onChangeText={v => handleDigitChange(i, v)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                  index={i}
                />
              ))}
            </View>

            {/* Verify button */}
            <ArcadeBtn
              label={isVerifying ? 'VERIFYING...' : 'VERIFY CODE'}
              color={C.pink}
              onPress={handleVerify}
              disabled={isVerifying || !canVerify}
            />

            {/* Resend row — inline countdown, not a separate route */}
            <View style={s.resendRow}>
              {canResend ? (
                <Pressable onPress={handleResend} style={s.resendBtn}>
                  <Text style={s.resendBtnLabel}>RESEND CODE</Text>
                </Pressable>
              ) : (
                <View style={s.resendRow}>
                  <Text style={s.resendLabel}>Resend in </Text>
                  <View style={s.countdownBadge}>
                    <Text style={s.countdownBadgeText}>
                      0:{String(resendCooldown).padStart(2, '0')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── OTPBox ───────────────────────────────────────────────────────────────────

interface OTPBoxProps {
  value: string;
  onChangeText: (v: string) => void;
  onKeyPress: (e: any) => void;
  index: number;
}

const OTPBox = React.forwardRef<TextInput, OTPBoxProps>(
  ({ value, onChangeText, onKeyPress }, ref) => {
    const [focused, setFocused] = useState(false);
    return (
      <TextInput
        ref={ref}
        style={[
          otp.box,
          focused && otp.boxFocused,
          value && otp.boxFilled,
        ]}
        value={value}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        maxLength={1}
        keyboardType="number-pad"
        selectTextOnFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={`Code digit ${1}`}
      />
    );
  },
);
OTPBox.displayName = 'OTPBox';

const otp = StyleSheet.create({
  box: {
    width: 44,
    height: 60,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.white,
    textAlign: 'center',
    ...T.headlineMd,
    color: C.onSurface,
  },
  boxFocused: {
    borderColor: C.cyan,
    ...Platform.select({ web: { boxShadow: `inset 0 0 0 2px ${C.cyan}` } as any }),
  },
  boxFilled: {
    backgroundColor: C.secondaryFixed,
  },
});

// ─── TitleBar ────────────────────────────────────────────────────────────────

function TitleBar({ dots, label, barColor }: { dots: [string, string, string]; label: string; barColor: string }) {
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
  bar: { height: 32, flexDirection: 'row', alignItems: 'center', borderBottomWidth: BORDER, borderBottomColor: C.black, paddingHorizontal: S.xs, gap: 6 },
  dotRow: { flexDirection: 'row', gap: 6 },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, borderWidth: BORDER_THIN, borderColor: C.black },
  label: { ...T.labelSm, color: C.black, textTransform: 'uppercase', letterSpacing: 2, flex: 1, textAlign: 'center' },
  spacer: { width: DOT_SIZE * 3 + 12 },
});

// ─── ArcadeBtn ────────────────────────────────────────────────────────────────

function ArcadeBtn({ label, color, onPress, disabled }: { label: string; color: string; onPress: () => void; disabled?: boolean }) {
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
  shadow: { position: 'absolute', top: SHADOW_OFFSET, left: SHADOW_OFFSET, right: -SHADOW_OFFSET, bottom: -SHADOW_OFFSET, backgroundColor: C.black },
  shadowPressed: { top: 0, left: 0, right: 0, bottom: 0 },
  btn: { width: '100%', borderWidth: BORDER, borderColor: C.black, paddingVertical: S.md, paddingHorizontal: S.xl, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  btnPressed: { transform: [{ translateX: SHADOW_OFFSET }, { translateY: SHADOW_OFFSET }] },
  disabled: { opacity: 0.45 },
  label: { ...T.label, color: C.black, textTransform: 'uppercase', letterSpacing: 2 },
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
  btn: { width: '100%', paddingVertical: S.sm, alignItems: 'center', borderWidth: BORDER_THIN, borderColor: C.black, backgroundColor: C.surfaceContainerLowest },
  label: { ...T.labelSm, color: C.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 },
});

// ─── Screen-level styles ──────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: S.md, paddingVertical: S.lg },
  card: { backgroundColor: C.surfaceContainerLowest, borderWidth: BORDER, borderColor: C.black, overflow: 'hidden' },
  body: { padding: S.xl, alignItems: 'center', gap: S.lg },
  iconFrame: { width: 80, height: 80, backgroundColor: C.surfaceVariant, borderWidth: BORDER, borderColor: C.black, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconEmoji: { fontSize: 36 },
  exclamBadge: { position: 'absolute', bottom: -6, right: -6, width: 20, height: 20, backgroundColor: '#ba1a1a', borderWidth: BORDER_THIN, borderColor: C.black, alignItems: 'center', justifyContent: 'center' },
  exclamText: { ...T.labelSm, color: C.white, fontSize: 11 },
  centeredTextBlock: { width: '100%', alignItems: 'center', gap: S.sm },
  sectionHeadline: { ...T.headlineMd, color: C.onSurface, textTransform: 'uppercase', textAlign: 'center' },
  bodyText: { ...T.bodyMd, color: C.onSurfaceVariant, textAlign: 'center' },

  // OTP
  otpRow: { flexDirection: 'row', gap: S.xs, justifyContent: 'center', width: '100%' },
  otpBox: { width: 44, height: 60, borderWidth: BORDER, borderColor: C.black, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  otpBoxExpired: { backgroundColor: C.surfaceContainerLow, opacity: 0.55 },
  otpDigitExpired: { ...T.headlineMd, color: C.outline },

  // Resend
  resendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: S.xs },
  resendLabel: { ...T.labelSm, color: C.onSurfaceVariant },
  resendBtn: { paddingVertical: S.xs, paddingHorizontal: S.sm, borderWidth: BORDER_THIN, borderColor: C.black, backgroundColor: C.mint },
  resendBtnLabel: { ...T.labelSm, color: C.black, textTransform: 'uppercase', letterSpacing: 1 },
  countdownBadge: { backgroundColor: C.mint, borderWidth: BORDER_THIN, borderColor: C.black, paddingHorizontal: S.xs, paddingVertical: 4 },
  countdownBadgeText: { ...T.label, color: C.black },

  // Error banner
  errorBanner: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: S.xs, backgroundColor: '#ba1a1a', borderWidth: BORDER, borderColor: C.black, padding: S.sm, justifyContent: 'center' },
  errorBannerIcon: { fontSize: 18, color: C.white },
  errorBannerText: { ...T.labelSm, color: C.white, textTransform: 'uppercase', letterSpacing: 2 },

  // Cancel link
  cancelLink: { ...T.label, color: C.primaryDark, textDecorationLine: 'underline', textTransform: 'uppercase' },

  // Rate limit timer
  timerBox: { width: '100%', backgroundColor: C.surfaceContainerLow, borderWidth: BORDER, borderColor: C.black, padding: S.md, gap: S.sm },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timerLabel: { ...T.labelSm, color: C.onSurface, textTransform: 'uppercase' },
  progressBar: { width: '100%', height: 20, backgroundColor: C.surfaceVariant, borderWidth: BORDER, borderColor: C.black, overflow: 'hidden' },
  progressFill: { height: '100%' },
});
