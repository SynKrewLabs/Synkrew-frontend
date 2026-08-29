/**
 * SynKrew — Capture Failure / Hardware Retry Screen
 * Route: app/(task)/capture-failed.tsx
 */

import React from 'react';
import { router } from 'expo-router';
import { TaskFallbackLayout } from '../../components/task/TaskFallbackLayout';
import { C } from '../../theme/tokens';

export default function CaptureFailureScreen() {
  const handleRetryCapture = () => {
    router.replace('/(task)/capture');
  };

  return (
    <TaskFallbackLayout
      testID="capture-failed-screen"
      windowTitle="CAPTURE_ERROR.EXE"
      titleBarColor="yellow"
      iconText="⚠️"
      iconBgColor="#fff3cd"
      badgeLabel="HARDWARE_ERROR: 500"
      badgeColor="#fff3cd"
      badgeTextColor="#856404"
      headline="CAPTURE FAILED"
      description="The camera shutter sensor failed to acquire a frame buffer. Re-initialize the optic sensor and try capturing your proof again."
      primaryActionLabel="RETRY CAPTURE NOW"
      primaryActionColor={C.yellow}
      onPrimaryAction={handleRetryCapture}
      secondaryActionLabel="RETURN TO MISSION"
    />
  );
}
