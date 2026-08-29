/**
 * SynKrew — Forgot Password Screen
 * Route: app/(auth)/forgot-password.tsx
 *
 * States:
 *   'form'        → email input + submit
 *   'confirmation'→ "check your inbox" — shown regardless of whether email exists
 *                    (intentional: avoids confirming/denying account existence)
 *   'link_expired'→ deep-linked in when a reset URL token is stale
 *
 * Note: "Set New Password" (reset-password.tsx) is stubbed separately.
 * Design: Arcade Pastel OS Window Card — same pattern as Login/Signup.
 */

import React, { useState, useCallback } from 'react';
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

type ForgotPasswordState = 'form' | 'confirmation' | 'link_expired';

const DOTS: [string, string, string] = [C.pink, C.white, C.mint];

export default function ForgotPasswordScreen() {
  const { width } = useWindowDimensions();
  const [state, setState] = useState<ForgotPasswordState>('form');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardWidth = Math.min(width - S.md * 2, 448);

  const handleSubmit = useCallback(async () => {
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      // Always show confirmation — never disclose whether email exists (security standard)
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setState('confirmation');
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  // ─── Link Expired State ────────────────────────────────────────────────────
  if (state === 'link_expired') {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[StyleSheet.absoluteFill, gridBgStyle(20, 0.06)]} pointerEvents="none" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="LINK_EXPIRED.EXE" barColor={C.pink} />
            <View style={s.body}>
              <View style={[s.iconFrame, { backgroundColor: '#ffdad6' }, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={s.iconEmoji}>⏰</Text>
                {/* Decorative X badge */}
                <View style={s.expiredBadge}>
                  <Text style={s.expiredBadgeText}>✕</Text>
                </View>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={s.sectionHeadline}>TIME'S UP!</Text>
                <Text style={s.bodyText}>
                  This password reset link has expired or was already used. Reset links
                  self-destruct after 24 hours for your security.
                </Text>
              </View>

              {/* Status badge */}
              <View style={s.statusChip}>
                <View style={[s.statusDot, { backgroundColor: '#ba1a1a' }]} />
                <Text style={s.statusLabel}>STATUS: ERROR 410</Text>
              </View>

              <ArcadeBtn
                label="REQUEST NEW LINK"
                color={C.pink}
                onPress={() => setState('form')}
              />
              <GhostBtn
                label="RETURN TO LOGIN"
                onPress={() => router.replace('/(auth)/login')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Confirmation State ────────────────────────────────────────────────────
  if (state === 'confirmation') {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={[StyleSheet.absoluteFill, gridBgStyle(32, 0.07)]} pointerEvents="none" />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="SYS.MSG" barColor={C.primaryFixed} />
            <View style={s.body}>
              {/* Stacked icon with decorative shadow */}
              <View style={s.confirmIconStack}>
                <View style={s.confirmIconBg} />
                <View style={[s.confirmIconBox, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={{ fontSize: 48 }}>✉️</Text>
                </View>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={s.confirmHeadline}>CHECK_INBOX</Text>
                <Text style={s.bodyText}>
                  We've dispatched a recovery link to your registered address. Check your email and
                  follow the instructions to reset your passkey.
                </Text>
              </View>

              <GhostBtn
                label="← BACK_TO_LOGIN"
                onPress={() => router.replace('/(auth)/login')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Main Form ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(32, 0.08)]} pointerEvents="none" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar dots={DOTS} label="RECOVERY.EXE" barColor={C.pink} />
            <View style={s.body}>
              {/* Icon */}
              <View style={[s.iconFrame, hardShadow(SHADOW_OFFSET_SM), { transform: [{ rotate: '-3deg' }] }]}>
                <Text style={s.iconEmoji}>🔑</Text>
              </View>

              <View style={s.centeredTextBlock}>
                <Text style={s.sectionHeadline}>SYSTEM LOCKOUT</Text>
                <Text style={s.bodyText}>
                  Enter your root email address to dispatch a recovery packet.
                </Text>
              </View>

              {/* Email field */}
              <View style={s.fieldGroup}>
                <Text style={s.fieldLabel}>EMAIL.ADDRESS</Text>
                <EmailInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="user@domain.net"
                />
              </View>

              <ArcadeBtn
                label={isSubmitting ? 'DISPATCHING...' : 'SEND_RESET_LINK'}
                color={C.pink}
                onPress={handleSubmit}
                disabled={isSubmitting || !email.trim()}
              />

              {/* Divider */}
              <View style={s.divider} />

              <GhostBtn
                label="RETURN TO LOGIN"
                onPress={() => router.replace('/(auth)/login')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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

// ─── EmailInput ───────────────────────────────────────────────────────────────

function EmailInput({ value, onChangeText, placeholder }: { value: string; onChangeText: (v: string) => void; placeholder: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      style={[ei.input, focused && ei.focused]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.outline}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}
const ei = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.sm,
    paddingHorizontal: S.md,
    ...T.bodyMd,
    color: C.onSurface,
  },
  focused: {
    borderColor: C.cyan,
    ...Platform.select({ web: { boxShadow: `inset 0 0 0 2px ${C.cyan}` } as any }),
  },
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
  iconFrame: { width: 96, height: 96, backgroundColor: C.surfaceVariant, borderWidth: BORDER, borderColor: C.black, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconEmoji: { fontSize: 40 },
  expiredBadge: { position: 'absolute', top: -8, right: -8, width: 20, height: 20, backgroundColor: C.cyan, borderWidth: BORDER_THIN, borderColor: C.black, alignItems: 'center', justifyContent: 'center' },
  expiredBadgeText: { ...T.labelSm, color: C.black, fontSize: 10 },
  centeredTextBlock: { width: '100%', alignItems: 'center', gap: S.sm },
  sectionHeadline: { ...T.headlineMd, color: C.onSurface, textTransform: 'uppercase', textAlign: 'center' },
  confirmHeadline: { ...T.headlineMd, color: C.onSurface, textAlign: 'center' },
  bodyText: { ...T.bodyMd, color: C.onSurfaceVariant, textAlign: 'center' },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: S.xs, backgroundColor: C.surfaceContainerHigh, borderWidth: BORDER_THIN, borderColor: C.black, paddingHorizontal: S.sm, paddingVertical: 4, borderRadius: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { ...T.labelSm, color: C.onSurfaceVariant, textTransform: 'uppercase' },
  fieldGroup: { width: '100%', gap: 6 },
  fieldLabel: { ...T.labelSm, color: C.onSurface, textTransform: 'uppercase' },
  divider: { width: '100%', borderTopWidth: BORDER_THIN, borderTopColor: C.black, borderStyle: 'dashed' },
  confirmIconStack: { position: 'relative', width: 128, height: 128, alignItems: 'center', justifyContent: 'center', marginTop: S.md },
  confirmIconBg: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: C.secondaryFixed, borderWidth: BORDER, borderColor: C.black, transform: [{ rotate: '-6deg' }] },
  confirmIconBox: { width: 120, height: 120, backgroundColor: C.surfaceContainerHighest, borderWidth: BORDER, borderColor: C.black, alignItems: 'center', justifyContent: 'center' },
});
