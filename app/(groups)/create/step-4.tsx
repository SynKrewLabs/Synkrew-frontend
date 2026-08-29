/**
 * SynKrew — Create Group: Step 4 (Invite Members)
 * Route: app/(groups)/create/step-4.tsx
 *
 * Implements:
 *   - Search contacts / invite username input
 *   - Soft-ask permission rationale & permission denied inline fallback
 *   - Link / QR code generation with copy feedback
 *   - Pending roster management (add/remove members)
 *   - Progression to Step 5 (Review)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
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
} from '../../../theme/tokens';
import { TitleBar } from '../../../components/ui/TitleBar';

interface RosterMember {
  id: string;
  username: string;
  status: 'pending' | 'ready';
  avatarBg: string;
}

export default function CreateGroupStep4() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  // Permission states: 'unrequested' | 'rationale' | 'granted' | 'denied'
  const [permissionState, setPermissionState] = useState<'unrequested' | 'rationale' | 'granted' | 'denied'>('unrequested');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [roster, setRoster] = useState<RosterMember[]>([
    { id: '1', username: 'KrewMaster99', status: 'ready', avatarBg: C.pink },
    { id: '2', username: 'CyberSam', status: 'pending', avatarBg: C.cyan },
    { id: '3', username: 'NeonRider', status: 'pending', avatarBg: C.secondaryContainer },
  ]);

  const handleRequestContacts = () => {
    setPermissionState('rationale');
  };

  const handleGrantPermission = () => {
    setPermissionState('granted');
  };

  const handleDenyPermission = () => {
    setPermissionState('denied');
  };

  const handleAddMember = () => {
    if (!searchQuery.trim()) return;
    const cleanName = searchQuery.trim().replace(/^@/, '');
    const newMember: RosterMember = {
      id: `member_${Date.now()}`,
      username: cleanName,
      status: 'pending',
      avatarBg: [C.pink, C.cyan, C.mint, C.yellow][roster.length % 4],
    };
    setRoster(prev => [...prev, newMember]);
    setSearchQuery('');
  };

  const handleRemoveMember = (id: string) => {
    setRoster(prev => prev.filter(m => m.id !== id));
  };

  const handleCopyInviteLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleProceedToReview = () => {
    router.push({
      pathname: '/(groups)/create/step-5',
      params: {
        ...params,
        memberCount: String(roster.length + 1), // Roster + creator
        rosterNames: JSON.stringify(roster.map(r => r.username)),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="INVITE_SQUAD.EXE" color="pink" />

          <View style={styles.body}>
            {/* Progress Header */}
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.stepTag}>STEP 4/5</Text>
                <Text style={styles.stepStatus}>BUILD ROSTER</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={styles.progressSegment} />
              </View>
            </View>

            {/* Title & Instructions */}
            <View style={styles.titleBlock}>
              <Text style={styles.headline}>BUILD YOUR ROSTER</Text>
              <Text style={styles.subtitle}>
                Search for agents or broadcast your encrypted pact link.
              </Text>
            </View>

            {/* ─── Soft-Ask Permission Prompt ─── */}
            {permissionState === 'rationale' && (
              <View testID="step4-permission-soft-ask" style={[styles.permissionCard, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={styles.permissionIcon}>📱</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.permissionTitle}>SYNC CONTACTS PROTOCOL</Text>
                  <Text style={styles.permissionDesc}>
                    SynKrew reads your address book locally to quickly find your crew. Contacts are never stored or broadcasted.
                  </Text>
                  <View style={styles.permissionBtnRow}>
                    <Pressable
                      testID="step4-btn-grant-permission"
                      style={styles.permissionBtnAllow}
                      onPress={handleGrantPermission}
                    >
                      <Text style={styles.permissionBtnAllowText}>ALLOW ACCESS</Text>
                    </Pressable>
                    <Pressable
                      testID="step4-btn-deny-permission"
                      style={styles.permissionBtnDeny}
                      onPress={handleDenyPermission}
                    >
                      <Text style={styles.permissionBtnDenyText}>DENY</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}

            {/* ─── Permission Denied Fallback Panel ─── */}
            {permissionState === 'denied' && (
              <View testID="step4-permission-denied-panel" style={[styles.deniedCard, hardShadow(SHADOW_OFFSET_SM)]}>
                <View style={styles.deniedIconBox}>
                  <Text style={styles.deniedIcon}>🚫</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.deniedTitle}>ACCESS_DENIED: CONTACTS</Text>
                  <Text style={styles.deniedDesc}>
                    Contact reading is disabled. You can still invite agents directly via link or username below.
                  </Text>
                </View>
              </View>
            )}

            {/* ─── Action Area: Link & Search ─── */}
            <View style={[styles.actionContainer, hardShadow(SHADOW_OFFSET_SM)]}>
              {/* Search / Add by Username */}
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.formLabel}>SEARCH OR ADD AGENT</Text>
                  {permissionState === 'unrequested' && (
                    <Pressable onPress={handleRequestContacts}>
                      <Text style={styles.contactSyncLink}>SYNC CONTACTS ↗</Text>
                    </Pressable>
                  )}
                </View>
                <View style={styles.searchRow}>
                  <TextInput
                    testID="step4-input-search"
                    style={styles.searchInput}
                    placeholder="Enter @username..."
                    placeholderTextColor={C.outline}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                  />
                  <Pressable
                    testID="step4-btn-add-agent"
                    style={[styles.addAgentBtn, !searchQuery.trim() && styles.addAgentBtnDisabled]}
                    onPress={handleAddMember}
                    disabled={!searchQuery.trim()}
                  >
                    <Text style={styles.addAgentBtnText}>+ ADD</Text>
                  </Pressable>
                </View>
              </View>

              {/* Generate / Copy Invite Link */}
              <View style={styles.linkShareBox}>
                <Pressable
                  testID="step4-btn-generate-link"
                  style={[styles.copyLinkBtn, hardShadow(SHADOW_OFFSET_SM)]}
                  onPress={handleCopyInviteLink}
                >
                  <Text style={styles.copyLinkIcon}>🔗</Text>
                  <Text style={styles.copyLinkText}>
                    {copiedLink ? 'INVITE LINK COPIED! ✓' : 'GENERATE_INVITE_LINK'}
                  </Text>
                </Pressable>
                <Text style={styles.linkHelpText}>
                  Unique key: synkrew.sys/join/{params.name ? String(params.name).toLowerCase().replace(/\s+/g, '-') : 'krew-99'}
                </Text>
              </View>
            </View>

            {/* ─── Roster List ─── */}
            <View style={styles.rosterSection}>
              <View style={styles.rosterHeaderRow}>
                <Text style={styles.rosterTitle}>PENDING ROSTER ({roster.length})</Text>
              </View>

              <View testID="step4-roster-list" style={styles.rosterList}>
                {roster.map(item => (
                  <View key={item.id} testID={`roster-item-${item.id}`} style={[styles.rosterCard, hardShadow(1)]}>
                    <View style={styles.rosterLeft}>
                      <View style={[styles.rosterAvatar, { backgroundColor: item.avatarBg }]}>
                        <Text style={styles.rosterAvatarText}>{item.username.slice(0, 1).toUpperCase()}</Text>
                      </View>
                      <View>
                        <Text style={styles.rosterUsername}>@{item.username}</Text>
                        <Text style={styles.rosterStatus}>{item.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Pressable
                      testID={`roster-remove-${item.id}`}
                      style={styles.rosterRemoveBtn}
                      onPress={() => handleRemoveMember(item.id)}
                    >
                      <Text style={styles.rosterRemoveIcon}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>

            {/* ─── Action Buttons ─── */}
            <View style={styles.bottomNavRow}>
              <Pressable
                testID="step4-btn-back"
                style={styles.backBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.backBtnText}>BACK</Text>
              </Pressable>

              <Pressable
                testID="step4-btn-next"
                style={[styles.proceedBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleProceedToReview}
                accessibilityRole="button"
              >
                <Text style={styles.proceedBtnText}>PROCEED_TO_REVIEW</Text>
                <Text style={styles.proceedBtnArrow}>→</Text>
              </Pressable>
            </View>
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
    padding: S.lg,
    gap: S.md,
  },

  // Progress
  progressHeader: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTag: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  stepStatus: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.white,
    flexDirection: 'row',
    padding: 2,
    gap: 2,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: C.surfaceVariant,
  },
  progressFilled: {
    backgroundColor: C.cyan,
  },

  titleBlock: {
    alignItems: 'center',
    gap: 4,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.black,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },

  // Permission Soft-Ask
  permissionCard: {
    backgroundColor: C.surfaceContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    gap: S.sm,
    alignItems: 'center',
  },
  permissionIcon: {
    fontSize: 24,
  },
  permissionTitle: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },
  permissionDesc: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
  },
  permissionBtnRow: {
    flexDirection: 'row',
    gap: S.xs,
    marginTop: 4,
  },
  permissionBtnAllow: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  permissionBtnAllowText: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  permissionBtnDeny: {
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  permissionBtnDenyText: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },

  // Permission Denied
  deniedCard: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    gap: S.xs,
    alignItems: 'center',
  },
  deniedIconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deniedIcon: {
    fontSize: 20,
  },
  deniedTitle: {
    ...T.labelXs,
    color: '#ba1a1a',
    fontWeight: '800',
  },
  deniedDesc: {
    ...T.bodyMd,
    fontSize: 11,
    color: '#53424b',
  },

  // Action Container
  actionContainer: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.sm,
  },
  formGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '800',
  },
  contactSyncLink: {
    ...T.labelXs,
    fontSize: 10,
    color: C.cyan,
    textDecorationLine: 'underline',
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurface,
  },
  addAgentBtn: {
    height: 42,
    backgroundColor: C.primaryFixedDim,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAgentBtnDisabled: {
    opacity: 0.4,
  },
  addAgentBtnText: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },

  // Link Share
  linkShareBox: {
    gap: 4,
    marginTop: 4,
  },
  copyLinkBtn: {
    height: 44,
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  copyLinkIcon: {
    fontSize: 16,
  },
  copyLinkText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  linkHelpText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },

  // Roster
  rosterSection: {
    gap: S.xs,
  },
  rosterHeaderRow: {
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    paddingBottom: 4,
  },
  rosterTitle: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rosterList: {
    gap: 6,
  },
  rosterCard: {
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rosterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  rosterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rosterAvatarText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
  },
  rosterUsername: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '800',
  },
  rosterStatus: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
  },
  rosterRemoveBtn: {
    padding: 6,
  },
  rosterRemoveIcon: {
    fontSize: 14,
    color: C.error,
    fontWeight: '800',
  },

  // Bottom Nav
  bottomNavRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: 4,
  },
  backBtn: {
    flex: 1,
    height: 48,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  backBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  proceedBtn: {
    flex: 2,
    height: 48,
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  proceedBtnText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  proceedBtnArrow: {
    fontSize: 16,
    color: C.black,
    fontWeight: '900',
  },
});
