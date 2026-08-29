/**
 * SynKrew — Bottom Navigation Bar
 * Shared persistent bottom navigation for core app tabs.
 * Design: Retro brutalist style with 4px top border, hard shadows, active pill states.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, S, T, BORDER, BORDER_THIN, hardShadow, SHADOW_OFFSET_SM } from '../../theme/tokens';

export type TabKey = 'profile' | 'groups' | 'verify' | 'league' | 'wallet';

export const BOTTOM_NAV_BASE_HEIGHT = 76;

interface BottomNavBarProps {
  activeTab?: TabKey;
  disabled?: boolean;
}

export function BottomNavBar({ activeTab = 'groups', disabled = false }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();

  const handleTabPress = (tab: TabKey) => {
    if (disabled) return;
    if (tab === 'profile') {
      router.push('/(profile)');
    } else if (tab === 'groups') {
      router.replace('/(groups)');
    } else if (tab === 'verify') {
      router.replace('/(verify)');
    } else if (tab === 'league') {
      router.push('/(league)');
    } else if (tab === 'wallet') {
      router.push('/(wallet)');
    }
  };

  return (
    <View
      style={[
        styles.navContainer,
        { paddingBottom: S.sm + insets.bottom },
        disabled && styles.navDisabled,
      ]}
    >
      <View style={styles.navInner}>
        {/* Profile */}
        <Pressable
          testID="nav-tab-profile"
          style={[styles.tabItem, activeTab === 'profile' && styles.activePill]}
          onPress={() => handleTabPress('profile')}
          accessibilityRole="tab"
          accessibilityLabel="Profile tab"
          accessibilityState={{ selected: activeTab === 'profile' }}
        >
          <Text style={[styles.tabIcon, activeTab === 'profile' && styles.activeTabIcon]}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>PROFILE</Text>
        </Pressable>

        {/* Groups */}
        <Pressable
          testID="nav-tab-groups"
          style={[styles.tabItem, activeTab === 'groups' && styles.activePill]}
          onPress={() => handleTabPress('groups')}
          accessibilityRole="tab"
          accessibilityLabel="Groups tab"
          accessibilityState={{ selected: activeTab === 'groups' }}
        >
          <Text style={[styles.tabIcon, activeTab === 'groups' && styles.activeTabIcon]}>👥</Text>
          <Text style={[styles.tabLabel, activeTab === 'groups' && styles.activeTabLabel]}>GROUPS</Text>
        </Pressable>

        {/* Verify */}
        <Pressable
          testID="nav-tab-verify"
          style={[styles.tabItem, activeTab === 'verify' && styles.activePill]}
          onPress={() => handleTabPress('verify')}
          accessibilityRole="tab"
          accessibilityLabel="Verify tab"
          accessibilityState={{ selected: activeTab === 'verify' }}
        >
          <View style={styles.badgeWrapper}>
            <Text style={[styles.tabIcon, activeTab === 'verify' && styles.activeTabIcon]}>✓</Text>
            <View style={styles.verifyBadge}>
              <Text style={styles.verifyBadgeText}>3</Text>
            </View>
          </View>
          <Text style={[styles.tabLabel, activeTab === 'verify' && styles.activeTabLabel]}>VERIFY</Text>
        </Pressable>

        {/* League */}
        <Pressable
          testID="nav-tab-league"
          style={[styles.tabItem, activeTab === 'league' && styles.activePill]}
          onPress={() => handleTabPress('league')}
          accessibilityRole="tab"
          accessibilityLabel="League tab"
          accessibilityState={{ selected: activeTab === 'league' }}
        >
          <Text style={[styles.tabIcon, activeTab === 'league' && styles.activeTabIcon]}>🏆</Text>
          <Text style={[styles.tabLabel, activeTab === 'league' && styles.activeTabLabel]}>LEAGUE</Text>
        </Pressable>

        {/* Wallet */}
        <Pressable
          testID="nav-tab-wallet"
          style={[styles.tabItem, activeTab === 'wallet' && styles.activePill]}
          onPress={() => handleTabPress('wallet')}
          accessibilityRole="tab"
          accessibilityLabel="Wallet tab"
          accessibilityState={{ selected: activeTab === 'wallet' }}
        >
          <Text style={[styles.tabIcon, activeTab === 'wallet' && styles.activeTabIcon]}>🪙</Text>
          <Text style={[styles.tabLabel, activeTab === 'wallet' && styles.activeTabLabel]}>WALLET</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    backgroundColor: C.surface,
    borderTopWidth: BORDER,
    borderTopColor: C.black,
    paddingVertical: S.xs,
    paddingHorizontal: S.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDisabled: {
    opacity: 0.6,
  },
  navInner: {
    width: '100%',
    maxWidth: 448,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
  },
  activePill: {
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  tabIcon: {
    fontSize: 18,
    lineHeight: 20,
    color: C.onSurfaceVariant,
  },
  activeTabIcon: {
    color: C.black,
  },
  tabLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  activeTabLabel: {
    color: C.black,
    fontWeight: '800',
  },
  badgeWrapper: {
    position: 'relative',
  },
  verifyBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: C.error,
    borderWidth: 1,
    borderColor: C.black,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBadgeText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.white,
    fontWeight: '800',
  },
});
