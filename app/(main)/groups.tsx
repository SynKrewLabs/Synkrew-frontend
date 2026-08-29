/**
 * SynKrew — Main Groups Landing Redirect
 * Redirects to the complete Groups feature section at app/(groups)/index.tsx.
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { C } from '../../theme/tokens';

export default function MainGroupsRedirect() {
  useEffect(() => {
    router.replace('/(groups)');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={C.primary} size="large" />
    </View>
  );
}
