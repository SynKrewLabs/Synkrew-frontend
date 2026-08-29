/**
 * SynKrew — Account Settings
 * Route: app/(profile)/settings.tsx
 * Screen ID: 200dc4c33e064fbfa3b73e4b758a05df
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
import { router } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_HEAVY,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';
import { TitleBar } from '../../components/ui/TitleBar';
import { BottomNavBar, BOTTOM_NAV_BASE_HEIGHT } from '../../components/groups/BottomNavBar';

export default function AccountSettingsScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 460);

  const handleEditProfile = () => {
    Alert.alert('PROFILE_EDIT.EXE', 'Edit profile dialog is ready for next cycle update.');
  };

  const handleAuthMethods = () => {
    Alert.alert('AUTH_SECURITY.EXE', 'Active sessions: 1 device. 2FA is active.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Title Bar */}
      <View style={styles.topHeader}>
        <TitleBar
          label="SETTINGS.SYS"
          color="pink"
          leftElement={
            <Pressable
              testID="btn-settings-back"
              style={styles.backBtn}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Back to profile"
            >
              <Text style={styles.backBtnText}>←</Text>
            </Pressable>
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: BOTTOM_NAV_BASE_HEIGHT + S.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[{ width: cardWidth }, styles.container]}>
          {/* User Profile Card */}
          <View style={[styles.profileCard, hardShadow(SHADOW_OFFSET)]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>USER_PROFILE.EXE</Text>
            </View>

            <View style={styles.profileBody}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarEmoji}>👾</Text>
              </View>

              <Text style={styles.adminName}>Admin User</Text>
              <Text style={styles.adminId}>ID: #8942-SYN</Text>

              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedCheck}>✓</Text>
                <Text style={styles.verifiedText}>VERIFIED KREW MEMBER</Text>
              </View>
            </View>
          </View>

          {/* Settings Options List */}
          <View style={styles.optionsList}>
            {/* Edit Profile */}
            <Pressable
              testID="btn-setting-edit-profile"
              style={[styles.optionRow, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={handleEditProfile}
              accessibilityRole="button"
              accessibilityLabel="Edit Profile"
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBox, { backgroundColor: C.primaryFixedDim }]}>
                  <Text style={styles.optionIcon}>👤</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Edit Profile</Text>
                  <Text style={styles.optionSub}>Update username, bio & avatar</Text>
                </View>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </Pressable>

            {/* Notification Preferences */}
            <Pressable
              testID="btn-setting-notifs"
              style={[styles.optionRow, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={() => router.push('/(profile)/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notification Preferences"
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBox, { backgroundColor: C.mint }]}>
                  <Text style={styles.optionIcon}>🔔</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Notification Preferences</Text>
                  <Text style={styles.optionSub}>Push, email & in-app alerts</Text>
                </View>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </Pressable>

            {/* Auth Methods */}
            <Pressable
              testID="btn-setting-auth"
              style={[styles.optionRow, hardShadow(SHADOW_OFFSET_SM)]}
              onPress={handleAuthMethods}
              accessibilityRole="button"
              accessibilityLabel="Auth Methods"
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBox, { backgroundColor: C.surfaceContainerHigh }]}>
                  <Text style={styles.optionIcon}>🛡️</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Auth Methods</Text>
                  <Text style={styles.optionSub}>Passwords, 2FA & sessions</Text>
                </View>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </Pressable>
          </View>

          {/* Danger Zone */}
          <View style={[styles.dangerCard, hardShadow(SHADOW_OFFSET)]}>
            <View style={styles.dangerHeader}>
              <Text style={styles.dangerHeaderText}>DANGER_ZONE.BAT</Text>
            </View>

            <View style={styles.dangerBody}>
              <Text style={styles.dangerDesc}>
                Proceed with caution. These actions modify or terminate account identity.
              </Text>

              {/* Logout Button (Neutral Weight) */}
              <Pressable
                testID="btn-logout"
                style={[styles.logoutBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={() => router.push('/(profile)/logout-confirm')}
                accessibilityRole="button"
                accessibilityLabel="Logout"
              >
                <Text style={styles.btnActionIcon}>🚪</Text>
                <Text style={styles.logoutBtnText}>LOGOUT</Text>
              </Pressable>

              {/* Delete Account Button (Heavy Destructive Weight) */}
              <Pressable
                testID="btn-delete-account"
                style={[styles.deleteBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={() => router.push('/(profile)/delete-confirm')}
                accessibilityRole="button"
                accessibilityLabel="Delete Account"
              >
                <Text style={styles.btnActionIcon}>💣</Text>
                <Text style={styles.deleteBtnText}>DELETE ACCOUNT</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Nav */}
      <BottomNavBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  topHeader: {
    paddingHorizontal: S.md,
    paddingTop: S.xs,
  },
  backBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  backBtnText: {
    fontSize: 18,
    color: C.black,
    fontWeight: '900',
  },
  scroll: {
    alignItems: 'center',
    padding: S.md,
  },
  container: {
    gap: S.md,
  },
  profileCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 28,
    backgroundColor: C.primaryFixedDim,
    borderBottomWidth: BORDER,
    borderColor: C.black,
    justifyContent: 'center',
    paddingHorizontal: S.sm,
  },
  cardHeaderText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.black,
    letterSpacing: 1,
  },
  profileBody: {
    padding: S.lg,
    alignItems: 'center',
    gap: S.xs,
  },
  avatarBox: {
    width: 72,
    height: 72,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  adminName: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.onSurface,
  },
  adminId: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 11,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.mint,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 3,
    marginTop: 4,
  },
  verifiedCheck: {
    ...T.labelSm,
    fontWeight: '900',
    color: C.black,
  },
  verifiedText: {
    ...T.labelXs,
    fontWeight: '800',
    color: C.black,
  },
  optionsList: {
    gap: S.sm,
  },
  optionRow: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    flex: 1,
  },
  optionIconBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 20,
  },
  optionTextContainer: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...T.labelSm,
    fontWeight: '800',
    color: C.onSurface,
    fontSize: 13,
  },
  optionSub: {
    ...T.bodyMd,
    fontSize: 11,
    color: C.onSurfaceVariant,
  },
  optionArrow: {
    fontSize: 16,
    color: C.black,
    fontWeight: '900',
  },
  dangerCard: {
    backgroundColor: C.errorContainer,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  dangerHeader: {
    height: 28,
    backgroundColor: C.error,
    justifyContent: 'center',
    paddingHorizontal: S.sm,
  },
  dangerHeaderText: {
    ...T.labelXs,
    fontWeight: '900',
    color: C.white,
    letterSpacing: 1,
  },
  dangerBody: {
    padding: S.md,
    gap: S.sm,
  },
  dangerDesc: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onErrorContainer,
    lineHeight: 16,
  },
  logoutBtn: {
    width: '100%',
    height: 46,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.onSurface,
    fontWeight: '900',
    letterSpacing: 1,
  },
  deleteBtn: {
    width: '100%',
    height: 46,
    backgroundColor: C.error,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnText: {
    ...T.label,
    fontSize: 13,
    color: C.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  btnActionIcon: {
    fontSize: 16,
  },
});
