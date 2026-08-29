import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, PressableProps, ViewStyle } from 'react-native';
import { C, S, T, BORDER, SHADOW_OFFSET, hardShadow } from '../../theme/tokens';

interface ArcadeButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function ArcadeButton({ label, fullWidth = false, onPress, disabled, style, ...rest }: ArcadeButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={[styles.outer, fullWidth && styles.outerFull, style]}>
      <View style={[styles.shadow, pressed && styles.shadowPressed]} />
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[styles.btn, fullWidth && styles.btnFull, pressed && styles.btnPressed, disabled && styles.btnDisabled]}
        {...rest}
      >
        <Text style={styles.text}>{label}</Text>
        <Text style={styles.arrow}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
  },
  outerFull: {
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    top: SHADOW_OFFSET,
    left: SHADOW_OFFSET,
    right: -SHADOW_OFFSET,
    bottom: -SHADOW_OFFSET,
    backgroundColor: C.black,
  },
  shadowPressed: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  btn: {
    backgroundColor: C.pink,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.sm,
    paddingHorizontal: S.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.xs,
    minHeight: 48,
  },
  btnFull: {
    width: '100%',
  },
  btnPressed: {
    transform: [{ translateX: SHADOW_OFFSET }, { translateY: SHADOW_OFFSET }],
  },
  btnDisabled: {
    opacity: 0.4,
  },
  text: {
    ...T.label,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  arrow: {
    fontSize: 16,
    fontWeight: '800',
    color: C.black,
  },
});
