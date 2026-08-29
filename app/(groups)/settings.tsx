/**
 * SynKrew — Group Settings & Lifecycle Management
 * Route: app/(groups)/settings.tsx
 *
 * Implements:
 *   - Creator control deck
 *   - Lifecycle management (Pause / Resume / Archive group)
 *   - Task definitions management entry point
 *   - Destructive danger zone actions (Transfer Ownership, Delete Group)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_THIN,
  BORDER_HEAVY,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';
import { TitleBar } from '../../components/ui/TitleBar';

export default function GroupSettingsScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.name ? String(params.name) : 'MORNING RUNNERS';
  const [currentStatus, setCurrentStatus] = useState<'active' | 'paused' | 'archived'>(
    params.state === 'paused' ? 'paused' : params.state === 'archived' ? 'archived' : 'active'
  );

  const handleStatusChange = (newStatus: 'active' | 'paused' | 'archived') => {
    setCurrentStatus(newStatus);
    Alert.alert(
      'LIFECYCLE STATUS UPDATED',
      `Group state has been modified to: ${newStatus.toUpperCase()}`,
      [
        {
          text: 'VIEW IN DETAIL',
          onPress: () =>
            router.replace({
              pathname: '/(groups)/detail',
              params: { name: groupName, state: newStatus },
            }),
        },
        { text: 'OK' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="GROUP_CONFIG.EXE" color="mint" />

          <View style={styles.body}>
            {/* Header Identity Box */}
            <View style={[styles.identityBox, hardShadow(SHADOW_OFFSET_SM)]}>
              <View style={styles.identityLeft}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>👑</Text>
                </View>
                <View>
                  <Text style={styles.groupTitle}>{groupName.toUpperCase()}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.creatorTag}>
                      <Text style={styles.creatorTagText}>CREATOR DECK</Text>
                    </View>
                    <Text style={styles.levelText}>LVL 42 CIRCLE</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ─── Section 1: Lifecycle State Controls ─── */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeading}>LIFECYCLE MANAGEMENT</Text>
              <Text style={styles.sectionSub}>Control synchronization status for all members.</Text>

              <View style={styles.statusChipsRow}>
                <Pressable
                  testID="settings-status-active"
                  style={[
                    styles.statusChip,
                    currentStatus === 'active' && styles.statusChipActive,
                  ]}
                  onPress={() => handleStatusChange('active')}
                >
                  <Text style={[styles.statusChipText, currentStatus === 'active' && styles.statusChipTextActive]}>
                    ● ACTIVE
                  </Text>
                </Pressable>

                <Pressable
                  testID="settings-status-paused"
                  style={[
                    styles.statusChip,
                    currentStatus === 'paused' && styles.statusChipPaused,
                  ]}
                  onPress={() => handleStatusChange('paused')}
                >
                  <Text style={[styles.statusChipText, currentStatus === 'paused' && styles.statusChipTextPaused]}>
                    ⏸ PAUSED
                  </Text>
                </Pressable>

                <Pressable
                  testID="settings-status-archived"
                  style={[
                    styles.statusChip,
                    currentStatus === 'archived' && styles.statusChipArchived,
                  ]}
                  onPress={() => handleStatusChange('archived')}
                >
                  <Text style={[styles.statusChipText, currentStatus === 'archived' && styles.statusChipTextArchived]}>
                    📁 ARCHIVED
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* ─── Section 2: Task Definitions ─── */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeading}>TASK MANIFEST</Text>
              <Text style={styles.sectionSub}>Edit active routines and verification rules.</Text>

              <Pressable
                testID="settings-btn-manage-tasks"
                style={[styles.taskManageBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={() => router.push({ pathname: '/(groups)/settings/tasks', params: { name: groupName } })}
                accessibilityRole="button"
              >
                <View style={styles.taskManageLeft}>
                  <Text style={styles.taskManageIcon}>📋</Text>
                  <View>
                    <Text style={styles.taskManageTitle}>MANAGE TASK DEFINITIONS</Text>
                    <Text style={styles.taskManageDesc}>3 active routines defined</Text>
                  </View>
                </View>
                <Text style={styles.taskManageArrow}>→</Text>
              </Pressable>
            </View>

            {/* ─── Section 3: Danger Zone (Destructive Actions) ─── */}
            <View style={styles.dangerSection}>
              <Text style={styles.dangerHeading}>DANGER ZONE</Text>

              <View style={{ gap: S.sm }}>
                <Pressable
                  testID="settings-btn-transfer"
                  style={[styles.dangerActionBtn, hardShadow(SHADOW_OFFSET_SM)]}
                  onPress={() => router.push({ pathname: '/(groups)/settings/transfer', params: { name: groupName } })}
                  accessibilityRole="button"
                >
                  <Text style={styles.dangerBtnIcon}>🔄</Text>
                  <Text style={styles.dangerBtnText}>TRANSFER GROUP OWNERSHIP</Text>
                </Pressable>

                <Pressable
                  testID="settings-btn-delete"
                  style={[styles.deleteActionBtn, hardShadow(SHADOW_OFFSET_SM)]}
                  onPress={() => router.push({ pathname: '/(groups)/settings/delete', params: { name: groupName } })}
                  accessibilityRole="button"
                >
                  <Text style={styles.deleteBtnIcon}>🗑️</Text>
                  <Text style={styles.deleteBtnText}>DELETE GROUP PERMANENTLY</Text>
                </Pressable>
              </View>
            </View>

            {/* Close Button */}
            <Pressable
              testID="settings-btn-close"
              style={styles.closeBtn}
              onPress={() => router.back()}
              accessibilityRole="button"
            >
              <Text style={styles.closeBtnText}>← BACK TO GROUP</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: S.md,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  body: {
    padding: S.xl,
    gap: S.lg,
  },

  // Identity
  identityBox: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
  },
  identityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: C.yellow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  groupTitle: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  creatorTag: {
    backgroundColor: C.pink,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  creatorTagText: {
    ...T.labelXs,
    fontSize: 9,
    fontWeight: '900',
    color: C.black,
  },
  levelText: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
  },

  // Sections
  sectionContainer: {
    gap: 6,
  },
  sectionHeading: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionSub: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    marginBottom: 4,
  },

  // Lifecycle Chips
  statusChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChipActive: {
    backgroundColor: C.mint,
  },
  statusChipPaused: {
    backgroundColor: '#fff3cd',
  },
  statusChipArchived: {
    backgroundColor: C.surfaceDim,
  },
  statusChipText: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },
  statusChipTextActive: {
    color: '#00513a',
    fontWeight: '900',
  },
  statusChipTextPaused: {
    color: '#856404',
    fontWeight: '900',
  },
  statusChipTextArchived: {
    color: C.black,
    fontWeight: '900',
  },

  // Task Manage Button
  taskManageBtn: {
    backgroundColor: C.surfaceContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskManageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  taskManageIcon: {
    fontSize: 22,
  },
  taskManageTitle: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
  },
  taskManageDesc: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
  taskManageArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: C.black,
  },

  // Danger Zone
  dangerSection: {
    borderTopWidth: BORDER,
    borderTopColor: C.black,
    borderStyle: 'dashed',
    paddingTop: S.md,
    gap: S.sm,
  },
  dangerHeading: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '900',
    letterSpacing: 1,
  },
  dangerActionBtn: {
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerBtnIcon: {
    fontSize: 16,
  },
  dangerBtnText: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },
  deleteActionBtn: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER_HEAVY,
    borderColor: '#ba1a1a',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnIcon: {
    fontSize: 16,
  },
  deleteBtnText: {
    ...T.labelSm,
    fontSize: 11,
    color: '#ba1a1a',
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Close
  closeBtn: {
    width: '100%',
    paddingVertical: S.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '700',
  },
});
