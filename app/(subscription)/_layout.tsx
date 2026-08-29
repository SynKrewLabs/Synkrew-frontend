import React from 'react';
import { Stack } from 'expo-router';
import { C } from '../../theme/tokens';

export default function SubscriptionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.surface },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="upsell" options={{ presentation: 'transparentModal' }} />
      <Stack.Screen name="processing" />
      <Stack.Screen name="success" />
      <Stack.Screen name="failed" />
      <Stack.Screen name="cancelled" />
      <Stack.Screen name="provider-error" />
    </Stack>
  );
}
