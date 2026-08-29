/**
 * SynKrew — Button Component
 * Arcade Pastel style: solid fill, 3px black border, hard offset shadow.
 *
 * Variants:
 *  - primary   : Bubblegum Pink bg, 3px black border, 4px hard bottom-right shadow
 *  - secondary : White bg, 3px black border
 *  - inverted  : Black bg, white text
 *  - outlined  : Transparent bg, 3px black border, no fill
 *
 * Press behavior: shadow shrinks + button shifts 2px down/right (simulated press).
 *
 * NOTE: Only 'primary' variant is fully built this session.
 * Other variants are typed and stub-ready for future sessions.
 */

import React, { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  PressableProps,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, BorderWidth, Spacing } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  /** Full-width button when true */
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  variant = 'primary',
  fullWidth = false,
  onPress,
  disabled = false,
  style,
  ...rest
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  const containerStyle: ViewStyle = {
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  return (
    <View style={[containerStyle, style]}>
      {/* Hard shadow layer — sits behind the button, creates the offset block shadow effect */}
      <View
        style={[
          styles.shadowLayer,
          styles[`${variant}Shadow` as keyof typeof styles] as ViewStyle,
          pressed && styles.shadowLayerPressed,
          disabled && styles.disabled,
        ]}
        pointerEvents="none"
      />
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[
          styles.button,
          styles[variant as keyof typeof styles] as ViewStyle,
          fullWidth && styles.fullWidth,
          pressed && styles.buttonPressed,
          disabled && styles.buttonDisabled,
        ]}
        {...rest}
      >
        <Text
          style={[
            styles.label,
            styles[`${variant}Label` as keyof typeof styles] as ViewStyle,
            disabled && styles.labelDisabled,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const SHADOW_OFFSET = 4;
const PRESSED_OFFSET = 2;

const styles = StyleSheet.create({
  button: {
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.DEFAULT,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.margin,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Spacing.touchTargetMin,
    minWidth: 120,
    // Default top-left position (offset = 0 when not pressed)
  },
  buttonPressed: {
    // Shift down+right by 2px on press (simulating "press into the shadow")
    transform: [{ translateX: PRESSED_OFFSET }, { translateY: PRESSED_OFFSET }],
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    ...Typography.buttonText,
    color: Colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  labelDisabled: {
    opacity: 0.6,
  },

  // ─── Variant: primary ──────────────────────────────────────────────────────
  primary: {
    backgroundColor: Colors.primaryContainer, // Bubblegum Pink
  },
  primaryLabel: {
    color: Colors.strokeObsidian,
  },
  primaryShadow: {
    backgroundColor: Colors.strokeObsidian,
  },

  // ─── Variant: secondary ────────────────────────────────────────────────────
  secondary: {
    backgroundColor: Colors.backgroundCard,
  },
  secondaryLabel: {
    color: Colors.strokeObsidian,
  },
  secondaryShadow: {
    backgroundColor: Colors.strokeObsidian,
  },

  // ─── Variant: inverted ─────────────────────────────────────────────────────
  inverted: {
    backgroundColor: Colors.strokeObsidian,
  },
  invertedLabel: {
    color: Colors.backgroundCard,
  },
  invertedShadow: {
    backgroundColor: Colors.onSurface,
  },

  // ─── Variant: outlined ─────────────────────────────────────────────────────
  outlined: {
    backgroundColor: 'transparent',
  },
  outlinedLabel: {
    color: Colors.strokeObsidian,
  },
  outlinedShadow: {
    backgroundColor: Colors.strokeObsidian,
  },

  // ─── Shadow layer shared styles ───────────────────────────────────────────
  shadowLayer: {
    position: 'absolute',
    top: SHADOW_OFFSET,
    left: SHADOW_OFFSET,
    right: -SHADOW_OFFSET,
    bottom: -SHADOW_OFFSET,
    borderRadius: Radius.DEFAULT,
  },
  shadowLayerPressed: {
    top: PRESSED_OFFSET,
    left: PRESSED_OFFSET,
    right: -PRESSED_OFFSET,
    bottom: -PRESSED_OFFSET,
  },

  // ─── Disabled states ──────────────────────────────────────────────────────
  disabled: {
    opacity: 0.3,
  },
});
