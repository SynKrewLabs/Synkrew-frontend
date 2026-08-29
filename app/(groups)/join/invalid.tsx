/**
 * SynKrew — Join Group: Invalid Invite Token (Terminal State)
 * Route: app/(groups)/join/invalid.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER, BORDER_THIN } from '../../../theme/tokens';

export default function JoinGroupInvalidInvite() {
  return (
    <JoinErrorLayout
      testID="join-error-invalid-screen"
      windowTitle="INVALID_TOKEN.EXE"
      titleBarColor="pink"
      iconText="🚫"
      badgeLabel="STATUS CODE: 400"
      headline="ERROR: INVALID_INVITE_TOKEN"
      description="The group invitation link you attempted to use is malformed, expired, or corrupted. The arcade machine rejected your token."
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
      primaryActionLabel="RETURN TO DASHBOARD"
    />
  );
}

const styles = StyleSheet.create({
  errorStripesBox: {
    height: 36,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  errorIconBlock: {
    width: 36,
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
    paddingHorizontal: 8,
    backgroundColor: C.surfaceVariant,
    height: '100%',
    justifyContent: 'center',
  },
  errorStripesText: {
    ...T.labelXs,
    fontSize: 9,
    color: '#ba1a1a',
    fontWeight: '800',
    letterSpacing: 1,
  },
});
