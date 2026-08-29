/**
 * SynKrew — Daily Task Section Layout
 * Route: app/(task)/_layout.tsx
 */

import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function TaskLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="capture" />
      <Stack.Screen name="uploading" />
      <Stack.Screen name="camera-denied" />
      <Stack.Screen name="camera-perm-denied" />
      <Stack.Screen name="capture-failed" />
      <Stack.Screen name="location-denied" />
      <Stack.Screen name="location-unavailable" />
      <Stack.Screen name="upload-failed" />
      <Stack.Screen name="offline-queued" />
    </Stack>
  );
}
