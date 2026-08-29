/**
 * SynKrew — Settlement Section Layout
 * Route: app/(settlement)/_layout.tsx
 */

import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function SettlementLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="daily-summary" />
      <Stack.Screen name="pending" />
      <Stack.Screen name="error" />
      <Stack.Screen name="milestone" />
      <Stack.Screen name="cycle-results" />
    </Stack>
  );
}
