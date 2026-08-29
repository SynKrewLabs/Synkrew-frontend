import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { C, DOT_SIZE, BORDER_THIN, S } from '../../theme/tokens';

/**
 * Stitch references use three distinct dot styles across onboarding:
 * - 'bar':    Intro. Active = wider rectangle (32×12), inactive = 12×12 square. All 2px bordered.
 * - 'square': Stake. Active = solid primary fill, inactive = surface fill. All 2px bordered, square.
 * - 'solid':  Verify. Active = solid black (no border), inactive = surfaceVariant + 2px border.
 */
export type DotMode = 'bar' | 'square' | 'solid';

interface Props {
  total: number;
  current: number;
  mode: DotMode;
}

export function ProgressDots({ total, current, mode }: Props) {
  return (
    <View style={[styles.row, mode === 'solid' ? { gap: S.sm } : { gap: S.xs }]}>
      {Array.from({ length: total }, (_, i) => {
        const active = i === current;
        return <View key={i} style={dotStyle(mode, active)} />;
      })}
    </View>
  );
}

function dotStyle(mode: DotMode, active: boolean): ViewStyle {
  switch (mode) {
    case 'bar':
      return active
        ? { width: 32, height: DOT_SIZE, backgroundColor: C.primary, borderWidth: BORDER_THIN, borderColor: C.black }
        : { width: DOT_SIZE, height: DOT_SIZE, backgroundColor: C.surfaceContainerHigh, borderWidth: BORDER_THIN, borderColor: C.black };
    case 'square':
      return active
        ? { width: DOT_SIZE, height: DOT_SIZE, backgroundColor: C.primary, borderWidth: BORDER_THIN, borderColor: C.black }
        : { width: DOT_SIZE, height: DOT_SIZE, backgroundColor: C.surface, borderWidth: BORDER_THIN, borderColor: C.black };
    case 'solid':
      return active
        ? { width: DOT_SIZE, height: DOT_SIZE, backgroundColor: C.black }
        : { width: DOT_SIZE, height: DOT_SIZE, backgroundColor: C.surfaceVariant, borderWidth: BORDER_THIN, borderColor: C.black };
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
