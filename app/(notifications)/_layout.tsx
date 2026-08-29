import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
