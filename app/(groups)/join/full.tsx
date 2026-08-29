/**
 * SynKrew — Join Group: Group Full (Terminal State)
 * Route: app/(groups)/join/full.tsx
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JoinErrorLayout } from '../../../components/groups/JoinErrorLayout';
import { C, T, BORDER, BORDER_THIN, S } from '../../../theme/tokens';

export default function JoinGroupFull() {
  return (
    <JoinErrorLayout
      testID="join-error-full-screen"
      windowTitle="NO_VACANCY.EXE"
      titleBarColor="pink"
      iconText="👥"
      badgeLabel="CAPACITY: 100% (FULL)"
      headline="ERROR: GROUP_CAPACITY_REACHED"
      description="Connection refused. The target Krew has reached its maximum member limit. Level up your own group or keep exploring the network."
      extraContent={
        <View style={styles.capacityContainer}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>SQUAD SLOTS</Text>
            <Text style={styles.capacityStatus}>8/8 OCCUPIED</Text>
          </View>

          {/* Segmented 100% capacity bar with last red block */}
          <View style={styles.capacityBar}>
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <View key={i} style={[styles.capacitySegment, { backgroundColor: C.tertiaryContainer }]} />
            ))}
            <View style={[styles.capacitySegment, { backgroundColor: C.error }]} />
          </View>
        </View>
      }
      primaryActionLabel="RETURN TO GROUPS"
    />
  );
}

const styles = StyleSheet.create({
  capacityContainer: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    gap: 6,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  capacityStatus: {
    ...T.labelXs,
    fontSize: 9,
    color: C.error,
    fontWeight: '900',
  },
  capacityBar: {
    width: '100%',
    height: 14,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.white,
    flexDirection: 'row',
    padding: 2,
    gap: 2,
  },
  capacitySegment: {
    flex: 1,
    height: '100%',
  },
});
