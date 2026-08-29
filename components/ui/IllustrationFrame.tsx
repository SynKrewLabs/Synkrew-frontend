import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, ViewStyle } from 'react-native';
import { C, S, BORDER, SHADOW_OFFSET, hardShadow } from '../../theme/tokens';

interface IllustrationFrameProps {
  source: ImageSourcePropType;
  size: number;
  style?: ViewStyle;
}

/**
 * Single shared Illustration Frame component used across all onboarding screens:
 * - Fixed square aspect ratio (size x size)
 * - Inset styling with C.surfaceContainer (#EFEBFF) background
 * - 3px solid black border with 4px border radius
 * - 4px hard black drop shadow
 * - resizeMode="contain" ensuring 0 cropping, 0 overflow, clean centering
 */
export function IllustrationFrame({ source, size, style }: IllustrationFrameProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={source}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.surfaceContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: S.xs,
    ...hardShadow(SHADOW_OFFSET),
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
