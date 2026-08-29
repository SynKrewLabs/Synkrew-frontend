import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="logout-confirm" options={{ presentation: 'transparentModal' }} />
      <Stack.Screen name="delete-confirm" options={{ presentation: 'transparentModal' }} />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
