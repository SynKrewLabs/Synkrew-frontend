/**
 * SynKrew — Global League Redirect
 * Route: app/(groups)/league.tsx
 *
 * Redirects to the standalone full-screen League section at app/(league)/index.tsx.
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { C } from '../../theme/tokens';

export default function GroupLeagueRedirect() {
  useEffect(() => {
    router.replace('/(league)');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={C.primary} size="large" />
    </View>
  );
}
