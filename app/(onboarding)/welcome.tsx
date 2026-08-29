/**
 * SynKrew — Welcome & Onboarding Deck
 *
 * Slides: Intro → Stake Coins → Verify Proof
 *
 * Unified Fixed Dimensions Rule:
 *  - All 3 cards share the EXACT same fixed width and height (cardWidth, cardHeight)
 *  - Fixed headline slot ensures illustrations are anchored at identical vertical Y coordinates
 *  - Bottom controls anchored to bottom of card
 *  - Zero card jumping or resizing during slide transitions
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_THIN,
  DOT_SIZE,
  SHADOW_OFFSET,
  hardShadow,
  gridBgStyle,
} from '../../theme/tokens';
import { ArcadeButton } from '../../components/ui/ArcadeButton';
import { ProgressDots } from '../../components/ui/ProgressDots';
import { IllustrationFrame } from '../../components/ui/IllustrationFrame';

const IMG = {
  intro:  require('../../assets/onboard_intro.jpg'),
  stake:  require('../../assets/onboard_stake.jpg'),
  verify: require('../../assets/onboard_verify.jpg'),
};

const DOTS: [string, string, string] = [C.mint, C.white, C.pink];

async function checkAuth(): Promise<boolean> {
  return false;
}

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    checkAuth().then((auth) => { if (auth) router.replace('/(main)/groups'); });
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== activeIndex && idx >= 0 && idx < 3) setActiveIndex(idx);
  }, [width, activeIndex]);

  const goNext = useCallback((from: number) => {
    if (from < 2) {
      const next = from + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    } else {
      router.replace('/(auth)/signup');
    }
  }, []);

  // Compute fixed card dimensions used identically on all 3 slides
  const cardWidth = Math.min(width - S.md * 2, 380);
  const cardHeight = Math.min(Math.max(height * 0.78, 540), 600);
  const imgSize = Math.min(cardWidth - S.lg * 2, 240, cardHeight * 0.38);

  const slides = [
    <IntroSlide  key="0" cardWidth={cardWidth} cardHeight={cardHeight} imgSize={imgSize} onNext={() => goNext(0)} />,
    <StakeSlide  key="1" cardWidth={cardWidth} cardHeight={cardHeight} imgSize={imgSize} onNext={() => goNext(1)} />,
    <VerifySlide key="2" cardWidth={cardWidth} cardHeight={cardHeight} imgSize={imgSize} onNext={() => goNext(2)} />,
  ];

  return (
    <View style={s.deck}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => <View style={{ width }}>{item}</View>}
      />
    </View>
  );
}

interface SlideProps {
  cardWidth: number;
  cardHeight: number;
  imgSize: number;
  onNext: () => void;
}

// ─── SLIDE 1: Welcome Intro ──────────────────────────────────────────────────
function IntroSlide({ cardWidth, cardHeight, imgSize, onNext }: SlideProps) {
  return (
    <SafeAreaView style={s.safe} edges={['top','bottom','left','right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(40, 0.1)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth, height: cardHeight }]}>
          {/* Title Bar */}
          <View style={[s.bar, { backgroundColor: C.mint }]}>
            {DOTS.map((c, i) => <View key={i} style={[s.dot, { backgroundColor: c }]} />)}
            <Text style={s.barLabel}>INSTALLER.EXE</Text>
            <View style={s.barSpacer} />
          </View>

          <View style={s.body}>
            {/* Top section: fixed headline slot + illustration */}
            <View style={s.topSection}>
              <View style={s.headlineSlot}>
                <Text style={s.headline}>
                  {'WELCOME TO\n'}<Text style={s.accent}>SYNKREW</Text>
                </Text>
              </View>

              <IllustrationFrame source={IMG.intro} size={imgSize} />

              <View style={s.bodyTextSlot}>
                <Text style={s.bodyText}>
                  Connect your squad. Level up your social network. The ultimate retro-infused platform for digital communities.
                </Text>
              </View>
            </View>

            {/* Bottom controls */}
            <View style={s.bottomSectionStacked}>
              <ProgressDots total={3} current={0} mode="bar" />
              <ArcadeButton label="NEXT" fullWidth onPress={onNext} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SLIDE 2: Stake Coins ────────────────────────────────────────────────────
function StakeSlide({ cardWidth, cardHeight, imgSize, onNext }: SlideProps) {
  return (
    <SafeAreaView style={s.safe} edges={['top','bottom','left','right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.12)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth, height: cardHeight }]}>
          {/* Title Bar */}
          <View style={[s.bar, { backgroundColor: C.pink }]}>
            {DOTS.map((c, i) => <View key={i} style={[s.dot, { backgroundColor: c }]} />)}
            <Text style={s.barLabel}>ONBOARD.EXE</Text>
            <View style={s.barSpacer} />
          </View>

          <View style={s.body}>
            {/* Top section: fixed headline slot + illustration */}
            <View style={s.topSection}>
              <View style={s.headlineSlot}>
                <Text style={s.headline}>{'STAKE COINS\nWITH FRIENDS'}</Text>
              </View>

              <IllustrationFrame source={IMG.stake} size={imgSize} />

              <View style={s.bodyTextSlot}>
                <Text style={s.bodyText}>
                  Lock in your commitment. Build your Krew. Dominate the rituals.
                </Text>
              </View>
            </View>

            {/* Bottom controls */}
            <View style={s.bottomSectionSplit}>
              <ProgressDots total={3} current={1} mode="square" />
              <ArcadeButton label="NEXT" onPress={onNext} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SLIDE 3: Verify Proof ───────────────────────────────────────────────────
function VerifySlide({ cardWidth, cardHeight, imgSize, onNext }: SlideProps) {
  return (
    <SafeAreaView style={s.safe} edges={['top','bottom','left','right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(20, 0.08)]} pointerEvents="none" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.card, hardShadow(SHADOW_OFFSET), { width: cardWidth, height: cardHeight }]}>
          {/* Title Bar */}
          <View style={[s.bar, { backgroundColor: C.pink }]}>
            {DOTS.map((c, i) => <View key={i} style={[s.dot, { backgroundColor: c }]} />)}
            <Text style={s.barLabel}>MESSAGE_INCOMING.EXE</Text>
            <View style={s.barSpacer} />
          </View>

          <View style={s.body}>
            {/* Top section: fixed headline slot + illustration */}
            <View style={s.topSection}>
              <View style={s.headlineSlot}>
                <Text style={s.headline}>VERIFY EACH OTHER</Text>
              </View>

              <IllustrationFrame source={IMG.verify} size={imgSize} />

              <View style={s.bodyTextSlot}>
                <Text style={s.bodyText}>
                  Hold your crew accountable. Review proof, lock it in, and level up together.
                </Text>
              </View>
            </View>

            {/* Bottom controls */}
            <View style={s.bottomSectionStacked}>
              <ProgressDots total={3} current={2} mode="solid" />
              <ArcadeButton label="GET STARTED" fullWidth onPress={onNext} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  deck: {
    flex: 1,
    backgroundColor: C.surface,
  },
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.md,
    paddingVertical: S.md,
  },

  // Card frame
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  // Title bar
  bar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
    paddingHorizontal: S.xs,
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
  },
  barLabel: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
  },
  barSpacer: {
    width: DOT_SIZE * 3 + 12,
  },

  // Card body fills remainder of fixed card height and spaces top/bottom evenly
  body: {
    flex: 1,
    padding: S.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topSection: {
    width: '100%',
    alignItems: 'center',
    gap: S.sm,
  },

  // Fixed headline slot: anchors illustration to exact same vertical Y position on all slides
  headlineSlot: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    ...T.headlineMd,
    color: C.onSurface,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  accent: {
    color: C.primary,
  },

  // Fixed body text slot: prevents height jumps between 2-line and 3-line copy
  bodyTextSlot: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    ...T.bodyMd,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 290,
  },

  // Bottom section variants
  bottomSectionStacked: {
    width: '100%',
    alignItems: 'center',
    gap: S.sm,
  },
  bottomSectionSplit: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
});
