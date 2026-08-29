/**
 * SynKrew — Camera Permission Denied Screen
 * Route: app/(task)/camera-denied.tsx
 */

import React from 'react';
import { router } from 'expo-router';
import { TaskFallbackLayout } from '../../components/task/TaskFallbackLayout';
import { C } from '../../theme/tokens';

export default function CameraPermissionDenied() {
  const handleRetryPermission = () => {
    // Retry permission prompt and return to camera viewfinder
    router.replace('/(task)/capture');
  };

  return (
    <TaskFallbackLayout
      testID="camera-denied-screen"
      windowTitle="CAMERA_REQUIRED.EXE"
      titleBarColor="pink"
      iconText="📷"
      badgeLabel="ACCESS_LEVEL: RESTRICTED"
      badgeColor="#ffdad6"
      badgeTextColor="#ba1a1a"
      headline="CAMERA ACCESS DENIED"
      description="SynKrew requires live camera access to capture un-tampered proof of your daily mission. Photo library uploads are strictly prohibited to prevent spoofing."
      primaryActionLabel="GRANT CAMERA PERMISSION"
      primaryActionColor={C.pink}
      onPrimaryAction={handleRetryPermission}
      secondaryActionLabel="RETURN TO MISSION"
    />
  );
}
