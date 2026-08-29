/**
 * SynKrew — Wallet Section Layout
 * Route: app/(wallet)/_layout.tsx
 */

import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function WalletLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
