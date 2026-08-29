/**
 * SynKrew — Join Group: Expired Invite (Terminal State)
 * Route: app/(groups)/join/expired.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER, BORDER_THIN, S } from '../../../theme/tokens';

export default function JoinGroupExpiredInvite() {
  return (
    <JoinErrorLayout
      testID="join-error-expired-screen"
      windowTitle="TIME_EXPIRED.EXE"
      titleBarColor="pink"
      iconText="⏳"
      badgeLabel="TTL_EXPIRED: 48H LIMIT"
      headline="ERROR: INVITE_EXPIRED"
      description="The space-time continuum has rejected your entry ticket. For security protocols, all Krew invitation links automatically self-destruct after 48 hours."
      extraContent={
        <View style={styles.expiredNoticeBox}>
          <Text style={styles.expiredNoticeTitle}>NEXT STEPS</Text>
          <Text style={styles.expiredNoticeText}>
            Please request a fresh invitation link from your group administrator to initiate a new connection handshake.
          </Text>
        </View>
      }
      primaryActionLabel="RETURN TO DASHBOARD"
    />
  );
}

const styles = StyleSheet.create({
  expiredNoticeBox: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 4,
  },
  expiredNoticeTitle: {
    ...T.labelXs,
    fontSize: 10,
    color: '#00513a',
    fontWeight: '800',
    letterSpacing: 1,
  },
  expiredNoticeText: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#002115',
    lineHeight: 16,
  },
});
