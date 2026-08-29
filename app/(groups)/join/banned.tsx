/**
 * SynKrew — Join Group: Previously Banned (Terminal State)
 * Route: app/(groups)/join/banned.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER, BORDER_THIN, S } from '../../../theme/tokens';

export default function JoinGroupBanned() {
  return (
    <JoinErrorLayout
      testID="join-error-banned-screen"
      windowTitle="ACCESS_DENIED.EXE"
      titleBarColor="pink"
      iconText="🚫"
      badgeLabel="ACCESS_LEVEL: REVOKED (PERMANENT)"
      headline="ENTRY FORBIDDEN"
      description="Your account credentials have been blacklisted from this group by the administration. Re-entry protocols are permanently locked."
      extraContent={
        <View style={styles.bannedNoticeBox}>
          <Text style={styles.bannedNoticeTitle}>ADMINISTRATIVE LOCKOUT</Text>
          <Text style={styles.bannedNoticeText}>
            Enforcement of group membership rules is final. You may join other active circles across the network.
          </Text>
        </View>
      }
      primaryActionLabel="RETURN TO GROUPS"
    />
  );
}

const styles = StyleSheet.create({
  bannedNoticeBox: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 4,
  },
  bannedNoticeTitle: {
    ...T.labelXs,
    fontSize: 10,
    color: '#ba1a1a',
    fontWeight: '800',
    letterSpacing: 1,
  },
  bannedNoticeText: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#53424b',
    lineHeight: 16,
  },
});
