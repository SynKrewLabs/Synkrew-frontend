/**
 * SynKrew — Upload Failed (Retry) Screen
 * Route: app/(task)/upload-failed.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TaskFallbackLayout } from '../../components/task/TaskFallbackLayout';
import { C, T, BORDER_THIN, S } from '../../theme/tokens';

export default function UploadFailedScreen() {
  const params = useLocalSearchParams();

  const handleRetryUpload = () => {
    // Retry transmission with preserved photo payload
    router.replace({
      pathname: '/(task)/uploading',
      params: { ...params },
    });
  };

  return (
    <TaskFallbackLayout
      testID="upload-failed-screen"
      windowTitle="NETWORK_ERROR.EXE"
      titleBarColor="pink"
      iconText="⚡"
      badgeLabel="TRANSMISSION_ERROR: TIMEOUT"
      badgeColor="#ffdad6"
      badgeTextColor="#ba1a1a"
      headline="UPLOAD FAILED"
      description="Network connection dropped during payload transfer. Your captured photo and GPS telemetry remain safely cached in local storage."
      extraContent={
        <View style={styles.cachedBox}>
          <Text style={styles.cachedTitle}>CACHED PAYLOAD IN MEMORY</Text>
          <Text style={styles.cachedText}>Photo and telemetry preserved. Tap retry to transmit without re-taking.</Text>
        </View>
      }
      primaryActionLabel="RETRY UPLOAD TRANSMISSION"
      primaryActionColor={C.primaryFixedDim}
      onPrimaryAction={handleRetryUpload}
      secondaryActionLabel="DISCARD & RE-CAPTURE"
      onSecondaryAction={() => router.replace('/(task)/capture')}
    />
  );
}

const styles = StyleSheet.create({
  cachedBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
    gap: 4,
  },
  cachedTitle: {
    ...T.labelXs,
    fontSize: 10,
    color: C.primary,
    fontWeight: '900',
  },
  cachedText: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
});
