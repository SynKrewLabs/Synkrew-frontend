/**
 * SynKrew — Join Group: Already a Member (Terminal State)
 * Route: app/(groups)/join/already-member.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER_THIN, S } from '../../../theme/tokens';

export default function JoinGroupAlreadyMember() {
  const params = useLocalSearchParams();
  const groupName = params.name ? String(params.name) : 'NEON RUNNERS';

  const handleGoToGroup = () => {
    router.replace({
      pathname: '/(groups)/detail',
      params: { name: groupName },
    });
  };

  return (
    <JoinErrorLayout
      testID="join-error-already-member-screen"
      windowTitle="ALREADY_MEMBER.EXE"
      titleBarColor="mint"
      iconText="👤"
      badgeLabel="STATUS: ALREADY ENROLLED"
      headline="IDENTITY REGISTERED"
      description={`You are already an active participant in "${groupName.toUpperCase()}". Your stake and streak are currently active in this circle.`}
      extraContent={
        <View style={styles.activeStatusBox}>
          <Text style={styles.activeStatusTitle}>CURRENT ENROLLMENT: ACTIVE</Text>
          <Text style={styles.activeStatusText}>
            No additional handshake required. Head over to the group dashboard to view today's mission and pending verifications.
          </Text>
        </View>
      }
      primaryActionLabel="GO TO GROUP DASHBOARD"
      onPrimaryAction={handleGoToGroup}
    />
  );
}

const styles = StyleSheet.create({
  activeStatusBox: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 4,
  },
  activeStatusTitle: {
    ...T.labelXs,
    fontSize: 10,
    color: '#00513a',
    fontWeight: '900',
    letterSpacing: 1,
  },
  activeStatusText: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#002115',
    lineHeight: 16,
  },
});
