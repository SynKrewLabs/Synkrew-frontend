import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function PermissionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="camera-prompt" />
      <Stack.Screen name="camera-denied" />
      <Stack.Screen name="camera-perm-denied" />
      <Stack.Screen name="location-prompt" />
      <Stack.Screen name="location-denied" />
      <Stack.Screen name="location-perm-denied" />
      <Stack.Screen name="location-services-off" />
    </Stack>
  );
}
