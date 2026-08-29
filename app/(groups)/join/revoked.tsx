/**
 * SynKrew — Join Group: Invite Revoked (Terminal State)
 * Route: app/(groups)/join/revoked.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER, BORDER_THIN, S } from '../../../theme/tokens';

export default function JoinGroupRevoked() {
  return (
    <JoinErrorLayout
      testID="join-error-revoked-screen"
      windowTitle="REVOKED.EXE"
      titleBarColor="pink"
      iconText="🔒"
      badgeLabel="STATUS: LINK_DEACTIVATED"
      headline="INVITATION REVOKED"
      description="The group creator has deactivated this invitation key before entry completion. The portal is no longer accessible."
      extraContent={
        <View style={styles.revokedNoticeBox}>
          <Text style={styles.revokedNoticeTitle}>KEY INVALIDATED</Text>
          <Text style={styles.revokedNoticeText}>
            Contact the Krew creator to request a regenerated invite token.
          </Text>
        </View>
      }
      primaryActionLabel="RETURN TO GROUPS"
    />
  );
}

const styles = StyleSheet.create({
  revokedNoticeBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.sm,
    gap: 4,
  },
  revokedNoticeTitle: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '800',
    letterSpacing: 1,
  },
  revokedNoticeText: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 16,
  },
});
