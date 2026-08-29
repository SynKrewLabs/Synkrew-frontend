/**
 * SynKrew — Groups Section Layout
 * Route: app/(groups)/_layout.tsx
 */

import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function GroupsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create/step-1" />
      <Stack.Screen name="create/step-2" />
      <Stack.Screen name="create/step-3" />
      <Stack.Screen name="create/step-4" />
      <Stack.Screen name="create/step-5" />
      <Stack.Screen name="create/limit-reached" />
      <Stack.Screen name="create/confirmation" />
      <Stack.Screen name="create/failed" />
      <Stack.Screen name="join" />
      <Stack.Screen name="join/invalid" />
      <Stack.Screen name="join/expired" />
      <Stack.Screen name="join/full" />
      <Stack.Screen name="join/already-member" />
      <Stack.Screen name="join/banned" />
      <Stack.Screen name="join/revoked" />
      <Stack.Screen name="join/private-pending" />
      <Stack.Screen name="join/confirmation" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="league" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="settings/tasks" />
      <Stack.Screen name="settings/transfer" />
      <Stack.Screen name="settings/delete" />
    </Stack>
  );
}
