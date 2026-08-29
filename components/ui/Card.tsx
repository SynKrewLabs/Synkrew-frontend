/**
 * SynKrew — Card Component
 * Arcade Pastel "OS Window" style card:
 * - White/lavender body with 3px black border
 * - 4px hard offset shadow
 * - Standardized corner radius
 */

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors, BorderWidth, Radius, ShadowLv1, Spacing } from '../../theme';

interface CardProps extends ViewProps {
  children?: React.ReactNode;
}

export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View
      style={[styles.container, ShadowLv1, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.lg,
    padding: Spacing.cardPadding,
  },
});
