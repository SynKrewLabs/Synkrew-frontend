/**
 * SynKrew — Logo Component
 * Shared asset used consistently across splash, header/nav, and any other logo placement.
 *
 * Props:
 *   size — 'splash' (hero) | 'header' (nav/header bar) | number (custom width)
 */

import React from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';

type LogoSize = 'splash' | 'header' | number;

interface LogoProps {
  size?: LogoSize;
  style?: ImageStyle;
}

const SIZES: Record<string, { width: number; height: number }> = {
  splash: { width: 200, height: 200 },
  header: { width: 80, height: 80 },
};

export function Logo({ size = 'header', style }: LogoProps) {
  const dimensions =
    typeof size === 'number'
      ? { width: size, height: size }
      : (SIZES[size] ?? SIZES.header);

  return (
    <Image
      source={require('../../assets/logo.png')}
      style={[dimensions, styles.base, style]}
      resizeMode="contain"
      accessibilityLabel="SynKrew logo"
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    // No additional default styles — let size prop and caller style control layout
  },
});
