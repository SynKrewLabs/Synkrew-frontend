/**
 * SynKrew — Root Layout
 * Configures font loading, splash screen prevention, safe area, and stack routing.
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Anybody_400Regular,
  Anybody_700Bold,
  Anybody_800ExtraBold,
} from '@expo-google-fonts/anybody';
import {
  WorkSans_400Regular,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { Colors } from '../theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/query-client';

// Keep native splash screen visible while fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Anybody: Anybody_700Bold,
    'Anybody-Regular': Anybody_400Regular,
    'Anybody-Bold': Anybody_700Bold,
    'Anybody-ExtraBold': Anybody_800ExtraBold,
    WorkSans: WorkSans_400Regular,
    'WorkSans-Regular': WorkSans_400Regular,
    'WorkSans-SemiBold': WorkSans_600SemiBold,
    'WorkSans-Bold': WorkSans_700Bold,
    JetBrainsMono: JetBrainsMono_400Regular,
    'JetBrainsMono-Regular': JetBrainsMono_400Regular,
    'JetBrainsMono-Bold': JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.backgroundApp },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)/splash" />
          <Stack.Screen name="(onboarding)/welcome" />
          <Stack.Screen name="(auth)/signup" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/verify" />
          <Stack.Screen name="(auth)/forgot-password" />
          <Stack.Screen name="(auth)/reset-password" />
          <Stack.Screen name="(auth)/session-expired" />
          <Stack.Screen name="(main)/groups" />
          <Stack.Screen name="(groups)" />
          <Stack.Screen name="(task)" />
          <Stack.Screen name="(verify)" />
          <Stack.Screen name="(settlement)" />
          <Stack.Screen name="(league)" />
          <Stack.Screen name="(wallet)" />
          <Stack.Screen name="(subscription)" />
          <Stack.Screen name="(profile)" />
          <Stack.Screen name="(notifications)" />
          <Stack.Screen name="(permissions)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
