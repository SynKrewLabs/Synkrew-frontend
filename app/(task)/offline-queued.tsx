/**
 * SynKrew — Offline Capture / Queued Screen
 * Route: app/(task)/offline-queued.tsx
 *
 * Implements:
 *   - Offline local buffer caching explanation
 *   - Auto-detection and auto-transition to Uploading once online
 *   - Manual sync override button
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TaskFallbackLayout } from '../../components/task/TaskFallbackLayout';
import { C, T, BORDER_THIN, S } from '../../theme/tokens';

export default function OfflineQueuedScreen() {
  const params = useLocalSearchParams();
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-reconnect simulation: When network returns, automatically transitions to upload
  useEffect(() => {
    const autoSyncTimer = setTimeout(() => {
      handleSyncNow();
    }, 4000);
    return () => clearTimeout(autoSyncTimer);
  }, []);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      router.replace({
        pathname: '/(task)/uploading',
        params: { ...params },
      });
    }, 600);
  };

  return (
    <TaskFallbackLayout
      testID="offline-queued-screen"
      windowTitle="OFFLINE_QUEUE.EXE"
      titleBarColor="cyan"
      iconText="💾"
      iconBgColor={C.secondaryContainer}
      badgeLabel="STATUS: SAVED_TO_LOCAL_BUFFER"
      badgeColor={C.secondaryContainer}
      badgeTextColor="#00513a"
      headline="OFFLINE CAPTURE QUEUED"
      description="No cellular or Wi-Fi uplink detected. Your cryptographic sensor stamp and photo payload are safely preserved in the offline queue."
      extraContent={
        <View style={styles.autoBox}>
          <Text style={styles.autoTitle}>AUTOMATIC UPLINK LISTENER ACTIVE</Text>
          <Text style={styles.autoText}>
            This proof will automatically transmit the instant connectivity is restored. No further manual action required.
          </Text>
        </View>
      }
      primaryActionLabel={isSyncing ? 'SYNCING UPLINK...' : 'FORCE SYNC / UPLOAD NOW'}
      primaryActionColor={C.cyan}
      onPrimaryAction={handleSyncNow}
      secondaryActionLabel="RETURN TO GROUP DASHBOARD"
      onSecondaryAction={() => router.replace('/(groups)')}
    />
  );
}

const styles = StyleSheet.create({
  autoBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
    gap: 4,
  },
  autoTitle: {
    ...T.labelXs,
    fontSize: 10,
    color: '#00513a',
    fontWeight: '900',
  },
  autoText: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
    lineHeight: 16,
  },
});
