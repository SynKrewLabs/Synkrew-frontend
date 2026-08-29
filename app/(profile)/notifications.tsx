/**
 * SynKrew — Notification Preferences Sub-view
 * Route: app/(profile)/notifications.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
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

interface NotifSetting {
  id: string;
  title: string;
  desc: string;
  enabled: boolean;
}

export default function NotificationPreferencesScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 460);

  const [settings, setSettings] = useState<NotifSetting[]>([
    { id: 'tasks', title: 'Task Reminders', desc: 'Alerts before 11:59 PM mission cutoff', enabled: true },
    { id: 'verify', title: 'Verification Requests', desc: 'Notifies when Krew members submit proofs', enabled: true },
    { id: 'results', title: 'Results & Settlement', desc: 'Daily coin distribution and streak updates', enabled: true },
    { id: 'groups', title: 'Squad Invites & Activity', desc: 'New members joining and cycle progress', enabled: true },
    { id: 'league', title: 'League Standings', desc: 'Weekly ranking adjustments and promotions', enabled: false },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TitleBar
          label="NOTIF_PREFS.SYS"
          color="pink"
          leftElement={
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>←</Text>
            </Pressable>
          }
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[{ width: cardWidth }, styles.container]}>
          <View style={[styles.headerCard, hardShadow(SHADOW_OFFSET)]}>
            <Text style={styles.headline}>NOTIFICATION CHANNELS</Text>
            <Text style={styles.description}>
              Customize system telemetry alerts sent to your device.
            </Text>
          </View>

          <View style={styles.list}>
            {settings.map((item) => (
              <View
                key={item.id}
                style={[styles.settingRow, hardShadow(SHADOW_OFFSET_SM)]}
              >
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDesc}>{item.desc}</Text>
                </View>
                <Switch
                  value={item.enabled}
                  onValueChange={() => toggleSetting(item.id)}
                  trackColor={{ false: C.surfaceContainerHigh, true: C.pink }}
                  thumbColor={item.enabled ? C.black : C.outline}
                />
              </View>
            ))}
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
  topHeader: {
    paddingHorizontal: S.md,
    paddingTop: S.xs,
  },
  backBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  backBtnText: {
    fontSize: 18,
    color: C.black,
    fontWeight: '900',
  },
  scroll: {
    alignItems: 'center',
    padding: S.md,
  },
  container: {
    gap: S.md,
  },
  headerCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    padding: S.lg,
    gap: S.xs,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.onSurface,
  },
  description: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },
  list: {
    gap: S.sm,
  },
  settingRow: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: S.md,
  },
  settingText: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    ...T.labelSm,
    fontWeight: '800',
    color: C.onSurface,
    fontSize: 13,
  },
  settingDesc: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
});
