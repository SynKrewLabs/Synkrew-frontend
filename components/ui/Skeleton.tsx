/**
 * SynKrew — Skeleton Loading Components
 * Canonical implementation built from Stitch Screen ID: 7be34e956f9b4fee832f90224959d265
 * (Global State: Loading Skeleton)
 *
 * Design Language:
 * - Solid flat block-fill pattern with 3px black borders (no soft gradients or shimmer effects)
 * - Rhythmic opacity pulse (0.65 to 1.0)
 * - Colors: surfaceContainerHigh, surfaceContainerHighest, secondaryContainer/primaryContainer accents
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  StyleProp,
  DimensionValue,
} from 'react-native';
import { Colors, BorderWidth, Radius, Spacing, hardShadow } from '../../theme';
import { TitleBar } from './TitleBar';

// ─── Shared Pulse Animation Hook ──────────────────────────────────────────────
export function useSkeletonPulse() {
  const opacityAnim = useRef(new Animated.Value(0.65)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.65,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacityAnim]);

  return opacityAnim;
}

// ─── Canonical Skeleton Block ────────────────────────────────────────────────
export interface SkeletonBlockProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
  animate?: boolean;
}

export function SkeletonBlock({
  width = '100%',
  height = 16,
  borderRadius = Radius.DEFAULT,
  backgroundColor = Colors.surfaceContainerHigh,
  borderColor = Colors.strokeObsidian,
  borderWidth = BorderWidth.container,
  style,
  animate = true,
}: SkeletonBlockProps) {
  const pulseAnim = useSkeletonPulse();

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          borderColor,
          borderWidth,
          opacity: animate ? pulseAnim : 1,
        },
        style,
      ]}
    />
  );
}

// ─── Canonical Skeleton Card ─────────────────────────────────────────────────
export interface SkeletonCardProps {
  hasImage?: boolean;
  imageHeight?: number;
  style?: ViewStyle;
}

export function SkeletonCard({
  hasImage = true,
  imageHeight = 140,
  style,
}: SkeletonCardProps) {
  return (
    <View style={[styles.card, hardShadow(6), style]}>
      {hasImage && (
        <SkeletonBlock
          width="100%"
          height={imageHeight}
          style={styles.cardImage}
        />
      )}
      
      {/* Title & tags */}
      <View style={styles.cardHeader}>
        <SkeletonBlock width="70%" height={24} />
        <View style={styles.badgeRow}>
          <SkeletonBlock
            width={64}
            height={22}
            backgroundColor={Colors.secondaryContainer}
            borderWidth={BorderWidth.accent}
          />
          <SkeletonBlock
            width={88}
            height={22}
            backgroundColor={Colors.primaryContainer}
            borderWidth={BorderWidth.accent}
          />
        </View>
      </View>

      {/* Content lines */}
      <View style={styles.contentLines}>
        <SkeletonBlock
          width="100%"
          height={14}
          backgroundColor={Colors.surfaceContainerHighest}
        />
        <SkeletonBlock
          width="85%"
          height={14}
          backgroundColor={Colors.surfaceContainerHighest}
        />
        <SkeletonBlock
          width="60%"
          height={14}
          backgroundColor={Colors.surfaceContainerHighest}
        />
      </View>

      {/* Footer / Avatars + Action */}
      <View style={styles.cardFooter}>
        <View style={styles.avatarGroup}>
          <SkeletonBlock
            width={32}
            height={32}
            borderRadius={Radius.full}
            borderWidth={BorderWidth.accent}
          />
          <SkeletonBlock
            width={32}
            height={32}
            borderRadius={Radius.full}
            borderWidth={BorderWidth.accent}
            style={styles.avatarOverlap}
          />
          <SkeletonBlock
            width={32}
            height={32}
            borderRadius={Radius.full}
            borderWidth={BorderWidth.accent}
            style={styles.avatarOverlap}
          />
        </View>
        <SkeletonBlock width={88} height={36} />
      </View>
    </View>
  );
}

// ─── Canonical Skeleton List Row ─────────────────────────────────────────────
export interface SkeletonRowProps {
  style?: ViewStyle;
}

export function SkeletonRow({ style }: SkeletonRowProps) {
  return (
    <View style={[styles.row, style]}>
      <SkeletonBlock
        width={36}
        height={36}
        borderRadius={Radius.DEFAULT}
        borderWidth={BorderWidth.accent}
      />
      <View style={styles.rowContent}>
        <SkeletonBlock width="65%" height={16} />
        <SkeletonBlock
          width="40%"
          height={12}
          backgroundColor={Colors.surfaceContainerHighest}
          style={{ marginTop: 4 }}
        />
      </View>
      <SkeletonBlock width={54} height={20} borderWidth={BorderWidth.accent} />
    </View>
  );
}

// ─── Canonical Skeleton Header ───────────────────────────────────────────────
export function SkeletonHeader({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.headerTitles}>
        <SkeletonBlock width="75%" height={32} />
        <SkeletonBlock
          width="50%"
          height={18}
          backgroundColor={Colors.surfaceContainerHighest}
          style={{ marginTop: 6 }}
        />
      </View>
      <SkeletonBlock
        width="100%"
        height={44}
        style={[styles.searchBlock, hardShadow(4)]}
      />
    </View>
  );
}

// ─── Canonical Skeleton Window Layout ─────────────────────────────────────────
export interface SkeletonLayoutProps {
  windowTitle?: string;
  cardCount?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function SkeletonLayout({
  windowTitle = 'LOADING.SYS',
  cardCount = 3,
  style,
  children,
}: SkeletonLayoutProps) {
  return (
    <View style={[styles.windowContainer, hardShadow(8), style]}>
      <TitleBar label={windowTitle} color="pink" />
      <View style={styles.windowBody}>
        {children || (
          <>
            <SkeletonHeader />
            <View style={styles.cardsGrid}>
              {Array.from({ length: cardCount }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    overflow: 'hidden',
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    padding: Spacing.margin,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardImage: {
    marginBottom: Spacing.xs,
  },
  cardHeader: {
    gap: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.unit,
  },
  contentLines: {
    gap: Spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: BorderWidth.accent,
    borderTopColor: Colors.strokeObsidian,
    marginTop: Spacing.xs,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: BorderWidth.accent,
    borderColor: Colors.strokeObsidian,
    marginBottom: Spacing.xs,
  },
  rowContent: {
    flex: 1,
  },
  headerContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: BorderWidth.container,
    borderBottomColor: Colors.strokeObsidian,
    marginBottom: Spacing.lg,
  },
  headerTitles: {
    width: '100%',
  },
  searchBlock: {
    marginTop: Spacing.xs,
  },
  windowContainer: {
    backgroundColor: Colors.surface,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    width: '100%',
  },
  windowBody: {
    padding: Spacing.margin,
  },
  cardsGrid: {
    gap: Spacing.md,
  },
});
