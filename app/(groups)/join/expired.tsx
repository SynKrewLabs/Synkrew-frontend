/**
 * SynKrew — Join Group: Expired Invite (Terminal State)
 * Route: app/(groups)/join/expired.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER_THIN, S } from '../../../theme/tokens';

export default function JoinGroupExpiredInvite() {
  return (
    <JoinErrorLayout
      testID="join-error-expired-screen"
      windowTitle="EXPIRED_INVITE.EXE"
      titleBarColor="pink"
      iconText="⏳"
      badgeLabel="TTL_EXPIRED: 48-HOUR LIMIT"
      headline="INVITATION EXPIRED"
      description="This invitation link has passed its 48-hour security window. For group integrity, stale invitation tokens are automatically decommissioned."
      extraContent={
        <View style={styles.expiredNoticeBox}>
          <Text style={styles.expiredNoticeTitle}>NEXT STEPS</Text>
          <Text style={styles.expiredNoticeText}>
            Request a fresh invitation link from the group administrator to initiate a new connection handshake.
          </Text>
        </View>
      }
      primaryActionLabel="RETURN TO GROUPS"
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
    fontWeight: '900',
    letterSpacing: 1,
  },
  expiredNoticeText: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#002115',
    lineHeight: 16,
  },
});
