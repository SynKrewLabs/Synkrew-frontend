/**
 * SynKrew — Camera Permanently Denied (Settings Deep-Link) Screen
 * Route: app/(task)/camera-perm-denied.tsx
 */

import React from 'react';
import { Linking, Alert } from 'react-native';
import { TaskFallbackLayout } from '../../components/task/TaskFallbackLayout';
import { C } from '../../theme/tokens';

export default function CameraPermanentlyDenied() {
  const handleOpenSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('SYSTEM SETTINGS', 'Please open system device settings and enable Camera permission for SynKrew.');
    });
  };

  return (
    <TaskFallbackLayout
      testID="camera-perm-denied-screen"
      windowTitle="SYSTEM_LOCK.EXE"
      titleBarColor="pink"
      iconText="🔒"
      badgeLabel="STATUS: PERMANENTLY_BLOCKED"
      badgeColor="#ffdad6"
      badgeTextColor="#ba1a1a"
      headline="CAMERA ACCESS BLOCKED"
      description="Camera permissions have been permanently denied in your OS preferences. You must enable camera permissions in your device settings to submit mission proofs."
      primaryActionLabel="OPEN SYSTEM SETTINGS"
      primaryActionColor={C.error}
      onPrimaryAction={handleOpenSettings}
      secondaryActionLabel="RETURN TO MISSION"
    />
  );
}
