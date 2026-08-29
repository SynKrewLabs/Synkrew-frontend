/**
 * SynKrew — Location Denied Screen
 * Route: app/(task)/location-denied.tsx
 */

import React from 'react';
import { Linking } from 'react-native';
import { TaskFallbackLayout } from '../../components/task/TaskFallbackLayout';
import { C } from '../../theme/tokens';

export default function LocationDeniedScreen() {
  const handleGrantLocation = () => {
    Linking.openSettings().catch(() => {});
  };

  return (
    <TaskFallbackLayout
      testID="location-denied-screen"
      windowTitle="GPS_REQUIRED.EXE"
      titleBarColor="pink"
      iconText="📍"
      badgeLabel="LOCATION: ACCESS_DENIED"
      badgeColor="#ffdad6"
      badgeTextColor="#ba1a1a"
      headline="LOCATION SERVICES REQUIRED"
      description="SynKrew mandates tamper-proof geographic telemetry embedded into every mission proof to guarantee authenticity. Proof cannot be transmitted without location verification."
      primaryActionLabel="GRANT LOCATION PERMISSION"
      primaryActionColor={C.pink}
      onPrimaryAction={handleGrantLocation}
      secondaryActionLabel="RETURN TO MISSION"
    />
  );
}
