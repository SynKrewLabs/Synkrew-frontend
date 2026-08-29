/**
 * SynKrew — Session Expired Screen
 * Route: app/(auth)/session-expired.tsx
 * Canonical implementation built from Stitch Screen ID: 317f37694ba545d8a30ef29e7cf3cd00
 * (Global State: Session Expired)
 *
 * Flow:
 * - Triggered when a session token expires mid-use
 * - Preserves the previous route target
 * - Presents the SYS_MSG.EXE window card with hourglass icon
 * - Returns the user to login with preserved redirect query
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Colors,
  Typography,
  BorderWidth,
  Radius,
  Spacing,
  hardShadow,
} from '../../theme';
import { TitleBar, Button } from '../../components/ui';
import { sessionManager } from '../../lib/session';

export default function SessionExpiredScreen() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ redirect?: string }>();
  
  const returnPath = params.redirect || sessionManager.getReturnPath();
  const cardWidth = Math.min(width - Spacing.margin * 2, 440);

  const handleReturnToLogin = () => {
    // Navigate to Login with redirect parameter
    router.replace({
      pathname: '/(auth)/login',
      params: { redirect: returnPath },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* OS Window Card */}
        <View style={[styles.windowCard, hardShadow(8), { width: cardWidth }]}>
          {/* Header Bar */}
          <TitleBar label="SYS_MSG.EXE" color="mint" />

          {/* Window Body */}
          <View style={styles.cardBody}>
            {/* Hourglass Icon Container */}
            <View style={[styles.iconBox, hardShadow(4)]}>
              <Text style={styles.iconText}>⌛</Text>
            </View>

            {/* Error Message */}
            <View style={styles.textContainer}>
              <Text style={styles.headline}>SESSION EXPIRED</Text>
              <Text style={styles.description}>
                Please log in again to sync with your Krew.
              </Text>
            </View>

            {/* Action CTA */}
            <View style={styles.actionContainer}>
              <Button
                label="RETURN TO LOGIN"
                variant="primary"
                fullWidth
                onPress={handleReturnToLogin}
              />
            </View>
          </View>
        </View>

        {/* Decorative background note */}
        <Text style={styles.footerNote}>
          SECURITY PROTOCOL // AUTH_TOKEN_TIMEOUT
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundApp,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.margin,
  },
  windowCard: {
    backgroundColor: Colors.surface,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    overflow: 'hidden',
  },
  cardBody: {
    padding: Spacing.margin,
    backgroundColor: Colors.surfaceBright,
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 96,
    height: 96,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },
  iconText: {
    fontSize: 44,
    lineHeight: 48,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  headline: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  actionContainer: {
    width: '100%',
    maxWidth: 260,
    marginTop: Spacing.xs,
  },
  footerNote: {
    ...Typography.labelMd,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
    marginTop: Spacing.lg,
    letterSpacing: 1.5,
  },
});
