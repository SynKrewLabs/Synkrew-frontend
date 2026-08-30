/**
 * SynKrew — Join Group: Invalid Invite (Terminal State)
 * Route: app/(groups)/join/invalid.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER, BORDER_THIN, S } from '../../../theme/tokens';

export default function JoinGroupInvalidInvite() {
  return (
    <JoinErrorLayout
      testID="join-error-invalid-screen"
      windowTitle="INVALID_INVITE.EXE"
      titleBarColor="pink"
      iconText="🚫"
      badgeLabel="STATUS: 404_NOT_FOUND"
      headline="INVALID INVITATION LINK"
      description="The invitation code is corrupted, mistyped, or does not exist on the network. Check the link or ask the Krew creator for a fresh invite."
      extraContent={
        <View style={styles.errorStripesBox}>
          <View style={styles.errorIconBlock}>
            <Text style={styles.errorIconText}>⚠</Text>
          </View>
          <View style={styles.errorStripesFill}>
            <Text style={styles.errorStripesText}>TOKEN_VERIFICATION_FAILED</Text>
          </View>
        </View>
      }
      primaryActionLabel="RETURN TO GROUPS"
    />
  );
}

const styles = StyleSheet.create({
  errorStripesBox: {
    height: 38,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  errorIconBlock: {
    width: 38,
    height: '100%',
    backgroundColor: C.error,
    borderRightWidth: BORDER,
    borderRightColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconText: {
    fontSize: 14,
    color: C.white,
    fontWeight: '900',
  },
  errorStripesFill: {
    flex: 1,
    paddingHorizontal: S.sm,
    backgroundColor: C.surfaceVariant,
    height: '100%',
    justifyContent: 'center',
  },
  errorStripesText: {
    ...T.labelXs,
    fontSize: 10,
    color: '#ba1a1a',
    fontWeight: '900',
    letterSpacing: 1,
  },
});
