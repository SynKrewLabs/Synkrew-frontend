import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S, T, BORDER, SHADOW_OFFSET, hardShadow, gridBgStyle } from '../../theme/tokens';
import { ProgressDots, DotMode } from '../ui/ProgressDots';
import { WindowCard } from '../ui/WindowCard';
import { ArcadeButton } from '../ui/ArcadeButton';

export interface SlideConfig {
  id: string;
  barColor: 'mint' | 'pink' | 'cyan' | 'lavender';
  barLabel: string;
  dotColors: [string, string, string];
  dotsHaveBorder?: boolean;
  borderWidth?: number;
  badgeText?: string;
  headline: string;
  headlineHighlight?: string;
  body: string;
  bodyVariant?: 'md' | 'lg';
  imageUrl: string;
  imageFallbackIcon: string;
  imageFallbackBg: string;
  hasDwellTimer?: boolean;
  dotMode: DotMode;
  bottomLayout?: 'stacked' | 'splitRow';
  buttonLabel: string;
}

interface WelcomeSlideProps {
  config: SlideConfig;
  slideIndex: number;
  totalSlides: number;
  onNext: () => void;
}

export function WelcomeSlide({
  config,
  slideIndex,
  totalSlides,
  onNext,
}: WelcomeSlideProps) {
  const { width, height } = useWindowDimensions();
  const [imgErr, setImgErr] = useState(false);

  const imgSize = Math.min(width - S.xl * 2 - S.lg * 2, 320, height * 0.32);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.12)]} pointerEvents="none" />
      <View style={styles.outerWrapper}>
        <WindowCard
          barColor={config.barColor}
          barLabel={config.barLabel}
          dotColors={config.dotColors}
          dotsHaveBorder={config.dotsHaveBorder}
          borderWidth={config.borderWidth ?? BORDER}
        >
          {config.badgeText ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{config.badgeText}</Text>
            </View>
          ) : null}

          <Text style={styles.headline}>
            {config.headline}
            {config.headlineHighlight ? (
              <Text style={styles.headlineHighlight}>{`\n${config.headlineHighlight}`}</Text>
            ) : null}
          </Text>

          <View style={[styles.imgFrame, hardShadow(SHADOW_OFFSET), { width: imgSize, height: imgSize }]}>
            {!imgErr ? (
              <Image
                source={{ uri: config.imageUrl }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.fallback, { backgroundColor: config.imageFallbackBg }]}>
                <Text style={styles.fallbackIcon}>{config.imageFallbackIcon}</Text>
              </View>
            )}
            {config.hasDwellTimer && (
              <View style={styles.dwellOverlay}>
                <View style={styles.dwellRing}>
                  <Text style={styles.dwellIcon}>⏱</Text>
                </View>
              </View>
            )}
          </View>

          <Text style={config.bodyVariant === 'md' ? styles.bodyMd : styles.bodyLg}>
            {config.body}
          </Text>

          {config.bottomLayout === 'splitRow' ? (
            <View style={styles.splitRow}>
              <ProgressDots total={totalSlides} current={slideIndex} mode={config.dotMode} />
              <ArcadeButton label={config.buttonLabel} onPress={onNext} />
            </View>
          ) : (
            <View style={styles.stacked}>
              <ProgressDots total={totalSlides} current={slideIndex} mode={config.dotMode} />
              <ArcadeButton label={config.buttonLabel} fullWidth onPress={onNext} />
            </View>
          )}
        </WindowCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.surface,
  },
  outerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.md,
    paddingVertical: S.md,
  },
  badge: {
    backgroundColor: C.pink,
    borderWidth: 2,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: S.unit,
    borderRadius: 2,
    ...hardShadow(2),
  },
  badgeText: {
    ...T.labelSm,
    color: C.black,
  },
  headline: {
    ...T.headlineMd,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: C.onSurface,
  },
  headlineHighlight: {
    color: C.primary,
  },
  imgFrame: {
    backgroundColor: C.surfaceContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
    position: 'relative',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIcon: {
    fontSize: 54,
  },
  dwellOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  dwellRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: C.cyan,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dwellIcon: {
    fontSize: 26,
  },
  bodyLg: {
    ...T.bodyLg,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  bodyMd: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 300,
  },
  splitRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stacked: {
    width: '100%',
    alignItems: 'center',
    gap: S.md,
  },
});
