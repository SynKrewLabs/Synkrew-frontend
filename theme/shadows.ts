/**
 * SynKrew — Shadow/Elevation Tokens
 * Source of truth: DESIGN (3).md
 *
 * RULE: NO Gaussian blurs, soft shadows, or transparency.
 * Depth is achieved through HARD OFFSET SHADOWS only.
 *
 * Hard shadow = a solid colored block shifted right+down,
 * simulating a physical "game object" lifted off the surface.
 *
 * In React Native, hard block shadows are best implemented via
 * a sibling View with a background color, or using the shadowColor +
 * shadowOffset with shadowRadius: 0 (no blur) approach.
 */

import { ViewStyle } from 'react-native';
import { Colors } from './colors';

/**
 * Hard drop shadow — Level 1 (cards, containers).
 * 3px offset, solid black — simulates one level of elevation.
 */
export const ShadowLv1: ViewStyle = {
  // iOS
  shadowColor: Colors.strokeObsidian,
  shadowOffset: { width: 3, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 0,
  // Android
  elevation: 3,
} as const;

/**
 * Hard drop shadow — Level 2 (active/pressed buttons, modal windows).
 * 6px offset, solid black — a more prominent "lifted" state.
 */
export const ShadowLv2: ViewStyle = {
  // iOS
  shadowColor: Colors.strokeObsidian,
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 0,
  // Android
  elevation: 6,
} as const;

/**
 * Button "press" simulation — shadow shrinks as button appears pressed down.
 * Offset reduced to 2px, button appears to move 2px down+right.
 */
export const ShadowPressed: ViewStyle = {
  shadowColor: Colors.strokeObsidian,
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 2,
} as const;

/**
 * No shadow — Level 0 (background, inactive elements).
 */
export const ShadowNone: ViewStyle = {
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
} as const;
