/**
 * SynKrew — Reset Password (stub)
 * Route: app/(auth)/reset-password.tsx
 *
 * TODO: screen not yet designed — flag to product
 *
 * This stub exists to prevent a 404 when a user clicks a valid (non-expired)
 * password reset link. The "Set New Password" screen is not yet in the design
 * inventory or checklist. Track separately with product.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S, T } from '../../theme/tokens';

export default function ResetPasswordScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.label}>RESET_PASSWORD.EXE</Text>
        <Text style={styles.note}>
          // TODO: screen not yet designed — flag to product
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: S.xl, gap: S.md },
  label: { ...T.label, color: C.onSurface, textTransform: 'uppercase', letterSpacing: 2 },
  note: { ...T.bodyMd, color: C.onSurfaceVariant, textAlign: 'center' },
});
