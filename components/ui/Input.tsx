/**
 * SynKrew — Input Component
 * Arcade Pastel Input:
 * - White bg, 3px black border, blocky radius
 * - Focus state: Cyan border accent
 * - Label & error messaging support
 */

import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  Colors,
  Typography,
  BorderWidth,
  Radius,
  Spacing,
} from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={Colors.onSurfaceVariant}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.unit,
  },
  label: {
    ...Typography.labelMd,
    color: Colors.onSurface,
  },
  input: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: BorderWidth.container,
    borderColor: Colors.strokeObsidian,
    borderRadius: Radius.DEFAULT,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.gutter,
    ...Typography.bodyMd,
    color: Colors.onSurface,
    minHeight: Spacing.touchTargetMin,
  },
  inputFocused: {
    borderColor: Colors.tertiaryContainer, // Cyan focus state
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.labelMd,
    color: Colors.error,
    marginTop: Spacing.unit,
  },
});
