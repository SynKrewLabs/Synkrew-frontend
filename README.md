# SynKrew — Social Accountability Interface

SynKrew is a retro-futuristic arcade-styled social accountability and habit-commitment mobile application built with React Native and Expo. Users create or join squad pacts, lock daily cryptocurrency/point stakes into accountability pools, upload photographic cryptographic proof of task completion, and participate in peer quorum verification to earn back their stakes, win forfeited pool shares, and rank on season leagues.

---

## Tech Stack

The application is built on top of modern React Native and the Expo ecosystem:

- **Framework**: [Expo SDK 52+](https://expo.dev) (`~57.0.16`)
- **Core Runtime**: React Native (`0.86.2`), React (`19.2.3`), React DOM (`19.2.3`)
- **Navigation & Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (`~57.0.16`) with typed file-based routes
- **Language**: TypeScript (`~6.0.3`) in strict mode
- **UI & Architecture**:
  - Safe Area Handling: `react-native-safe-area-context` (`~5.7.0`)
  - Screen Optimization: `react-native-screens` (`~4.26.0`)
  - Swiping & Paging: `react-native-pager-view` (`8.0.2`)
  - Web Compatibility: `react-native-web` (`^0.21.2`), `@expo/metro-runtime` (`~57.0.13`)
  - Fonts & Splash: `@expo-google-fonts/anybody`, `@expo-google-fonts/work-sans`, `@expo-google-fonts/jetbrains-mono`, `expo-font`, `expo-splash-screen`
  - System Linking & Status: `expo-linking`, `expo-status-bar`, `expo-constants`

---

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or `v20.x` LTS recommended
- **Package Manager**: `npm` (v9+) or `yarn` (v1.22+)
- **Mobile Development**:
  - **iOS Simulator** (macOS only): Xcode (v15+) with iOS 17+ Simulator
  - **Android Emulator**: Android Studio with Android SDK (API 34+) and virtual device
  - **Physical Device**: [Expo Go](https://expo.dev/go) app installed from the App Store or Google Play Store

---

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Synklabs/synkrew
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Type-checking verification**:
   ```bash
   npx tsc --noEmit
   ```

4. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

### Environment Configuration
The application is pre-configured to run out of the box with zero external secret requirements in mock/development mode. When integrating real production APIs:
- Create a `.env` file in the `synkrew/` root directory.
- Configure backend endpoints (e.g. `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_REVENUECAT_KEY`).
- No sensitive production secrets or private keys are committed in the repository.

---

## Running on Device & Simulators

From the interactive Expo CLI terminal:

- **Run on Web**: Press `w` or run `npm run web`
- **Run on iOS Simulator**: Press `i` or run `npm run ios`
- **Run on Android Emulator**: Press `a` or run `npm run android`
- **Run on Physical Device**: Open the camera (iOS) or Expo Go app (Android) and scan the QR code displayed in the terminal.

---

## Project Structure

```text
synkrew/
├── app/                        # Expo file-based application routes
│   ├── _layout.tsx             # Root layout: font loading, splash screen & stack provider
│   ├── index.tsx               # Root entry point redirecting to Onboarding / Dashboard
│   ├── (auth)/                 # Authentication (Login, Signup, Verify, Forgot/Reset Password, Session Expired)
│   ├── (groups)/               # Group dashboard, pact details, create flow (steps 1–5), join flow, settings
│   ├── (league)/               # Season standings, unranked states, offline caching, and group widgets
│   ├── (main)/                 # Main root tab alias handlers
│   ├── (notifications)/        # Notification inbox, empty queue, and push permission banner
│   ├── (onboarding)/           # System boot splash screen & 3-step value-prop walkthrough
│   ├── (permissions)/          # Camera & location system permission request and fallback states
│   ├── (profile)/              # Profile home, account settings, delete account, logout confirmation
│   ├── (settlement)/           # Daily summary, cycle results, celebrations, and compute failure
│   ├── (subscription)/         # Tier comparisons, upsell sheet, and purchase processing states
│   ├── (task)/                 # Today's task submission, capture camera, offline queue, failure fallbacks
│   ├── (verify)/               # Peer quorum verification card stack, dwell timer, rejection sheet
│   └── (wallet)/               # Coin balance breakdown, zero state, ledger history & transaction details
├── assets/                     # App icons, splash graphics, and onboarding vector illustrations
├── components/                 # Reusable component libraries
│   ├── groups/                 # Bottom navigation bar, pact cards, avatar stacks, member list items
│   ├── onboarding/             # Step indicators and value-prop slide cards
│   ├── task/                   # Today's task hero card, sensor stamps, fallback layouts
│   ├── ui/                     # Canonical Design System UI components
│   │   ├── Button.tsx          # Primary, Secondary, Inverted, Outlined buttons with 3D press physics
│   │   ├── Card.tsx            # Standard window container card with hard offset shadow
│   │   ├── EmptyState.tsx      # Canonical OS Window empty state with accent pixel corners & action CTAs
│   │   ├── ErrorBanner.tsx     # Standard inline error/warning/info alert banners
│   │   ├── ErrorRetry.tsx      # Canonical SYS_ERR.LOG full window error card with diagnostic meter
│   │   ├── IllustrationFrame.tsx # Fixed-ratio bordered vector illustration frame
│   │   ├── Input.tsx           # Text input with focus states, labels, and validation errors
│   │   ├── Logo.tsx            # SynKrew brand logo mark
│   │   ├── OfflineBanner.tsx   # Canonical mint-green OFFLINE_MODE persistent banner
│   │   ├── ProgressDots.tsx    # Monospace dot progress indicators
│   │   ├── Skeleton.tsx        # Canonical block-fill skeleton loading suite (no soft gradients)
│   │   ├── StatusBadge.tsx     # Task state badges with strict color + icon accessibility pairing
│   │   ├── TitleBar.tsx        # Canonical OS Window TitleBar with colored theme & control dots
│   │   ├── WindowCard.tsx      # Top-level window card wrapper
│   │   └── index.ts            # Component library index
│   └── verify/                 # Signature swipeable verification card stack & rejection sheet
├── lib/                        # Session state manager, auth helpers, API clients
│   ├── session.ts              # Mid-use session expiration detection & return-path preservation
│   └── index.ts                # API client configuration
├── theme/                      # Design System Tokens
│   ├── colors.ts               # Arcade Pastel color palette tokens (Primary, Secondary, Surface, Error)
│   ├── spacing.ts              # 4px-grid spacing scale, blocky radii scale, and border widths
│   ├── typography.ts           # Anybody, Work Sans, and JetBrains Mono typographic hierarchy
│   ├── shadows.ts              # Hard offset shadow definitions (Level 1, Level 2, Level 3)
│   ├── tokens.ts               # Compact theme token aliases and grid style generators
│   └── index.ts                # Theme exports
├── app.json                    # Expo application manifest and plugins
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies and npm scripts
```

---

## Design System Reference

SynKrew strictly adheres to the **Arcade Pastel / Retro Brutalist OS** design aesthetic documented in `DESIGN (3).md`:

- **Borders**: Standard `3px` solid black (`#000000`) on all containers and cards; `2px` on interior elements and badges.
- **Shadows**: Hard-offset rectangular drop shadows (e.g. `4px 4px 0px #000000`, `6px 6px 0px #000000`, `8px 8px 0px #000000`) with zero blur radius.
- **Corner Radii**: Stepped blocky curves (`Radius.DEFAULT = 4px`, `Radius.lg = 8px`).
- **Color Palette**:
  - `Primary`: Bubblegum Pink (`#ff85d0` / `#9e357b`)
  - `Secondary`: Mint Green (`#99f5cc` / `#006c4e`)
  - `Tertiary`: Cyan (`#00c2c2` / `#006a6a`)
  - `Surface`: Clean Lilac-tinted white (`#fcf8ff` / `#efebff`)
  - `Error`: Crimson Alert (`#ba1a1a` / `#ffdad6`)
- **Typography**:
  - `Anybody` (800 ExtraBold): Screen headlines, hero metrics, window titles
  - `Work Sans` (400 Regular, 600 SemiBold): Body descriptions, explanatory copy
  - `JetBrains Mono` (700 Bold): Monospace TitleBars, status badges, diagnostic metadata

---

## Known Gaps & Future Roadmap (`TODO`s)

The following items are intentionally marked in the codebase for production backend and provider integration:

1. **In-App Purchases & Subscriptions**:
   - `app/(subscription)/processing.tsx`: Replace simulated delay and testing toggles with real Apple StoreKit 2 / Google Play Billing or RevenueCat SDK integration.
2. **Real League Standings Feed**:
   - `app/(league)/index.tsx`: Replace mock league groups with live server-side standings feed computed from 50% task consistency + 50% quorum verification accuracy.
3. **Cross-Group Proof Quorum Feed**:
   - `components/verify/VerificationCardStack.tsx`: Replace mock proof cards with real-time peer photo quorum feed broadcast across synced group members.
4. **Verification Status Hookup**:
   - `components/task/TodaysTaskCard.tsx`: Remove manual dev state toggle once the Verification queue pushes real-time quorum decisions to the task lifecycle state.
5. **Private Group Join Creator Notification & Approval**:
   - `app/(groups)/join/private-pending.tsx`: Build real-time push notification and in-app creator request approval sheet for private group invites.
6. **Password Reset Verification Screen**:
   - `app/(auth)/reset-password.tsx`: Expand deep-link target into a dedicated password reset entry form once auth backend reset email links are finalized.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
