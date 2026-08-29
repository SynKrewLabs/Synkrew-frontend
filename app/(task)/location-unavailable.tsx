/**
 * SynKrew — Location Unavailable / Inaccurate Screen
 * Route: app/(task)/location-unavailable.tsx
 */

import React from 'react';
import { router } from 'expo-router';
import { TaskFallbackLayout } from '../../components/task/TaskFallbackLayout';
import { C } from '../../theme/tokens';

export default function LocationUnavailableScreen() {
  const handleRetryLock = () => {
    router.replace('/(task)/capture');
  };

  return (
    <TaskFallbackLayout
      testID="location-unavailable-screen"
      windowTitle="GPS_NO_LOCK.EXE"
      titleBarColor="yellow"
      iconText="🛰️"
      iconBgColor="#fff3cd"
      badgeLabel="SIGNAL: LOW_ACCURACY (>50M)"
      badgeColor="#fff3cd"
      badgeTextColor="#856404"
      headline="GPS FIX UNAVAILABLE"
      description="Telemetry accuracy is currently below threshold (>50m variance). Step outdoors or wait for satellite lock before snapping your daily proof."
      primaryActionLabel="RETRY SATELLITE FIX"
      primaryActionColor={C.yellow}
      onPrimaryAction={handleRetryLock}
      secondaryActionLabel="RETURN TO MISSION"
    />
  );
}
