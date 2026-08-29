/**
 * SynKrew — Group's League Widget (Embedded)
 * Component: components/groups/LeagueWidget.tsx
 *
 * Rendered inside Group Detail screen.
 * Links on tap to the full League Standings screen at /(league).
 *
 * Supports:
 *   - Ranked state (e.g. Rank #3, +120 pts, progress bar, tier indicator)
 *   - Unranked state (e.g. "RANKING STARTS AFTER CYCLE 1")
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_THIN,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
} from '../../theme/tokens';

interface LeagueWidgetProps {
  rank?: number | null;
  points?: number;
  rankChange?: number; // e.g. +3, -1, 0
  tierName?: string;
  isUnranked?: boolean;
  style?: ViewStyle;
}

export function LeagueWidget({
  rank = 3,
  points = 891,
  rankChange = 2,
  tierName = 'BRONZE DIVISION',
  isUnranked = false,
  style,
}: LeagueWidgetProps) {
  const handlePress = () => {
    router.push('/(league)');
  };

  return (
    <Pressable
      testID="group-detail-league-widget"
      style={[styles.container, hardShadow(SHADOW_OFFSET), style]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="View Global League standings"
    >
      {/* Title / Chrome bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🏆</Text>
          <Text style={styles.headerTitle}>GLOBAL LEAGUE</Text>
        </View>
        <Text style={styles.chevron}>→</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {isUnranked ? (
          <View style={styles.unrankedContent}>
            <View style={[styles.badge, styles.unrankedBadge]}>
              <Text style={styles.unrankedBadgeText}>UNRANKED</Text>
            </View>
            <Text style={styles.unrankedDesc}>
              Ranking begins automatically after your group completes Cycle 1.
            </Text>
          </View>
        ) : (
          <View style={styles.rankedContent}>
            <View style={styles.topRow}>
              <View style={styles.rankPill}>
                <Text style={styles.rankPillText}>RANK #{rank}</Text>
              </View>
              <Text style={styles.pointsText}>{points} PTS</Text>
              <View
                style={[
                  styles.changePill,
                  rankChange > 0
                    ? styles.changeUp
                    : rankChange < 0
                    ? styles.changeDown
                    : styles.changeSame,
                ]}
              >
                <Text
                  style={[
                    styles.changePillText,
                    rankChange > 0
                      ? styles.changeUpText
                      : rankChange < 0
                      ? styles.changeDownText
                      : styles.changeSameText,
                  ]}
                >
                  {rankChange > 0 ? `▲ +${rankChange}` : rankChange < 0 ? `▼ ${rankChange}` : '—'}
                </Text>
              </View>
            </View>

            {/* Division track */}
            <View style={styles.divisionRow}>
              <Text style={styles.divisionLabel}>{tierName}</Text>
              <Text style={styles.viewStandingsText}>VIEW STANDINGS →</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '68%' }]} />
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  headerBar: {
    height: 32,
    backgroundColor: C.yellow,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIcon: {
    fontSize: 14,
  },
  headerTitle: {
    ...T.labelSm,
    color: C.black,
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  chevron: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
  },
  body: {
    padding: S.md,
  },
  rankedContent: {
    gap: S.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankPill: {
    backgroundColor: C.pink,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.xs,
    paddingVertical: 2,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  rankPillText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  pointsText: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.onSurface,
  },
  changePill: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  changeUp: {
    backgroundColor: C.secondaryContainer,
  },
  changeDown: {
    backgroundColor: C.errorContainer,
  },
  changeSame: {
    backgroundColor: C.surfaceContainerHigh,
  },
  changePillText: {
    ...T.labelXs,
    fontWeight: '800',
  },
  changeUpText: {
    color: '#00513a',
  },
  changeDownText: {
    color: C.onErrorContainer,
  },
  changeSameText: {
    color: C.onSurfaceVariant,
  },
  divisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  divisionLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    letterSpacing: 1,
  },
  viewStandingsText: {
    ...T.labelXs,
    color: C.primary,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.cyan,
  },
  unrankedContent: {
    alignItems: 'flex-start',
    gap: S.xs,
  },
  badge: {
    paddingHorizontal: S.xs,
    paddingVertical: 2,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  unrankedBadge: {
    backgroundColor: C.surfaceContainerHigh,
  },
  unrankedBadgeText: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  unrankedDesc: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },
});
