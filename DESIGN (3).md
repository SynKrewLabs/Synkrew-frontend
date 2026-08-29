---
name: Arcade Pastel
colors:
  surface: '#fcf8ff'
  surface-dim: '#d9d6ff'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2ff'
  surface-container: '#efebff'
  surface-container-high: '#e9e5ff'
  surface-container-highest: '#e3dfff'
  on-surface: '#18173c'
  on-surface-variant: '#53424b'
  inverse-surface: '#2d2c52'
  inverse-on-surface: '#f2efff'
  outline: '#86727b'
  outline-variant: '#d8c0cb'
  surface-tint: '#9e357b'
  primary: '#9e357b'
  on-primary: '#ffffff'
  primary-container: '#ff85d0'
  on-primary-container: '#7a135d'
  inverse-primary: '#ffaedb'
  secondary: '#006c4e'
  on-secondary: '#ffffff'
  secondary-container: '#99f5cc'
  on-secondary-container: '#007353'
  tertiary: '#006a6a'
  on-tertiary: '#ffffff'
  tertiary-container: '#00c2c2'
  on-tertiary-container: '#004a4a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd8eb'
  primary-fixed-dim: '#ffaedb'
  on-primary-fixed: '#3c002b'
  on-primary-fixed-variant: '#811962'
  secondary-fixed: '#99f5cc'
  secondary-fixed-dim: '#7dd8b1'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#00fbfb'
  tertiary-fixed-dim: '#00dddd'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#004f4f'
  background: '#fcf8ff'
  on-background: '#18173c'
  surface-variant: '#e3dfff'
typography:
  headline-lg:
    fontFamily: Anybody
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Anybody
    fontSize: 28px
    fontWeight: '800'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  container-max: 1200px
---

## Brand & Style

The design system is a playful fusion of 90s desktop computing and 8-bit arcade aesthetics. It targets a generation that finds comfort in nostalgic "Lo-Fi" environments while demanding modern usability. 

The style utilizes a **Retro-Vaporwave** approach characterized by "chunky" logic. It rejects smooth gradients and organic curves in favor of stepped, pixelated geometry. Every interface element is treated as a physical game object, wrapped in heavy outlines to ensure it pops against the soft pastel background. The UI should evoke the feeling of a gamified operating system where every interaction feels like a "level up."

## Colors

The palette is built on a foundation of **Soft Lavender (#C9C6F5)**, which acts as the "desktop" surface. Vibrant neon-pastels are used to categorize information:
- **Headers & Primary Actions:** Bubblegum Pink creates a high-energy focal point.
- **Success & Secondary Accents:** Mint Green and Cyan provide cooling contrast.
- **Attention & Interactive States:** Sunshine Yellow is reserved for hovering or "New" badges.
- **System Feedback:** Coral Red for health/errors and Golden Orange for high-value rewards.

All elements must be contained within a **Solid Black (#000000)** 3px border to maintain the 8-bit illustration style.

## Typography

This design system uses a high-contrast typographic pairing. **Anybody** (set to high weight and width) mimics the blocky impact of arcade fonts while remaining legible. **Work Sans** provides a grounded, neutral balance for long-form content, ensuring the "game" remains functional. **JetBrains Mono** is used for UI labels and metadata to reinforce the technical, retro-computing vibe.

For headlines, apply a subtle text-shadow (2px 2px #000000) to create a "sticker" effect.

## Layout & Spacing

The layout follows a **Fixed Grid** model reminiscent of old CRT monitor resolutions. Use a strict 4px or 8px base unit for all margins and padding to ensure elements align "to the pixel."

- **Grid:** 12-column layout for desktop; 4-column for mobile.
- **Windows:** Main content should be housed in "OS Windows" with a fixed 3px black border. 
- **Reflow:** On mobile, sidebars stack vertically. Elements do not fluidly stretch; they "snap" to the nearest 8px increment.
- **Inner Padding:** Use a generous 24px internal padding for windows to prevent the thick borders from crowding the text.

## Elevation & Depth

In this design system, depth is achieved through **Hard Shadows** rather than blurs.
- **Level 0 (Background):** Pastel Lavender surface.
- **Level 1 (Cards/Buttons):** Flat fill with a 3px black border.
- **Level 2 (Hover/Active):** An additional "drop shadow" block (3px or 6px offset) in solid Black or a darker shade of the element's color.
- **Window Chrome:** Top bars of windows use a contrasting color (e.g., Pink or Cyan) to denote the active focus.

Avoid all Gaussian blurs, soft shadows, or transparency.

## Shapes

The "Soft" setting (0.25rem) is used here to create **Blocky Rounded Corners**. These are not true circles but "stepped" corners that mimic pixel-art curves. 

- **Containers:** All corners must have the 3px black stroke.
- **Interactive Elements:** Buttons and Chips use the same 4px radius. 
- **Pixel Perfection:** Avoid "anti-aliasing" in the CSS where possible; shapes should feel sharp and intentional.

## Components

### OS Windows (Containers)
Every major section must be wrapped in a window component.
- **Header Bar:** A solid 32px bar with a 3px bottom border.
- **Window Controls:** Three 12px circles on the left (Pink, Yellow, Green) representing Close, Minimize, Maximize.
- **Body:** White or Lavender background with a 3px black border.

### Buttons
- **Primary:** Bubblegum Pink background, 3px black border, heavy black bottom-right shadow (4px).
- **State Change:** On hover, the shadow disappears and the button moves 2px down and 2px right to simulate a "press."

### Input Fields
- **Style:** White background, 3px black border.
- **Focus State:** Border changes to Cyan or Mint Green with a 2px "inner" pixelated shadow.

### Chips & Badges
- **Style:** Small, rectangular with "stepped" corners.
- **Colors:** Use Sunshine Yellow for rewards and Mint Green for "Completed" tags.

### Icons
- **Style:** Strictly 1-bit or limited color pixel art. Icons must be enclosed in a square box with a 2px border.

### Progress Bars
- **Style:** A hollow black frame (3px border) with "blocks" of color (Cyan or Mint) filling the interior based on percentage.