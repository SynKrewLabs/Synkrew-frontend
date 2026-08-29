# SynKrew — UI/UX Screen Inventory (v1)

Companion doc to the Frontend UX Plan (v1.2). That doc defines flows and logic; this doc enumerates **every screen/state that needs a design**, including fallback, empty, error, and permission states, so nothing gets designed ad hoc mid-build.

Each entry: **Screen** — Purpose — Key elements — Fallback/edge states.

---

## 0. Screen Count Summary

| Category | Primary screens | Fallback/edge states |
|---|---|---|
| Onboarding & Auth | 6 | 7 |
| Groups | 8 | 11 |
| Daily Task | 1 (multi-state) | 8 |
| Verification | 1 (multi-state) | 7 |
| Settlement | 3 | 3 |
| League | 2 | 3 |
| Wallet | 2 | 4 |
| Subscription | 2 | 5 |
| Profile / Account | 3 | 3 |
| Notifications | 1 | 2 |
| Permissions | 2 | 4 |
| Global system states | — | 6 |
| **Total** | **31** | **63** |

---

## 1. Onboarding & Authentication

### 1.1 Welcome / Value Prop (slides 1–3)
Purpose: first-run pitch — "stake coins with friends," "verify each other," "build streaks."
Elements: swipeable slide deck, skip button, progress dots.
Fallback: none (static content) — but must handle **already-authenticated user landing here by mistake** → auto-redirect to Groups, never shown.

### 1.2 Signup
Elements: email/phone + password or OAuth options, terms acceptance.
Fallback states: **validation error** (inline), **email already registered**, **network error on submit**, **OAuth provider failure**.

### 1.3 Login
Elements: email/phone + password or OAuth, "forgot password" link.
Fallback states: **invalid credentials**, **account locked/rate-limited**, **network error**.

### 1.4 Forgot Password
Elements: email input, "check your email" confirmation state.
Fallback states: **email not found** (handled without confirming/denying account existence, standard security practice), **reset link expired**.

### 1.5 Email/Phone Verification Pending
Purpose: gate between signup and app access if verification is required.
Elements: "resend code" action, countdown before resend is allowed.
Fallback: **code expired**, **too many resend attempts**.

### 1.6 First-Run Empty State (post-auth)
Purpose: lands new user in Groups tab with nothing in it.
Elements: "Create a group" / "Join a group" CTAs, brief explainer.
This **is** the fallback/empty state for Groups (§2.1) on first run — listed here to mark the auth→app handoff.

---

## 2. Groups

### 2.1 Groups List (Home)
Purpose: all groups the user belongs to.
Elements: group cards (name, cycle progress, next task due), Create/Join CTAs.
Fallback states: **empty (no groups)** → see §1.6, **loading skeleton**, **offline (cached list + banner)**.

### 2.2 Create Group — Step 1: Name & Description
Fallback: **name validation error** (empty/too long).

### 2.3 Create Group — Step 2: Task Definitions
Elements: add task (title, repeat pattern), supports multiple tasks/day.
Fallback: **no tasks added yet** (blocks "Next"), **duplicate task name warning**.

### 2.4 Create Group — Step 3: Cycle Length & Stake %
Elements: 7/30-day toggle, stake % slider/preset chips (25/50/60/75%).
Fallback: **stake % out of bounds** (if bounds are enforced per open question in UX plan §15).

### 2.5 Create Group — Step 4: Invite Members
Elements: contact picker, shareable link/QR.
Fallback: **contact permission denied** → manual link-share only, **invite send failure**.

### 2.6 Create Group — Step 5: Review
Elements: full summary, member cap vs. tier limit, groups-joined count vs. limit.
Fallback: **at group-limit** → blocks creation, redirects to Upsell (§8.2) instead of showing review.

### 2.7 Create Group — Confirmation
Elements: success state, lands in new Group Detail.
Fallback: **creation failed** (network/server error) → retry, draft preserved.

### 2.8 Join Group — Invite Preview
Elements: group name, creator, member count/cap, task + stake summary, group rules.
Fallback states: **invalid invite**, **expired invite**, **group full**, **already a member**, **user previously removed/banned from this group**, **private group requiring creator approval** (pending-approval state), **invite revoked after link opened**.

### 2.9 Join Group — Confirmation
Elements: Accept/Decline, lands in Group Detail on accept.
Fallback: **client-side group-count limit check fails** → redirect to Upsell before allowing Accept.

### 2.10 Group Detail
Purpose: hub for one group — today's task status, members, cycle progress, milestone bar.
Elements: Today's Task card(s), Cycle Progress widget, Members list, League widget, Settings entry (creator only).
Fallback states: **group paused** (banner + disabled task actions), **group archived** (read-only view), **cycle ended, awaiting creator to start next cycle** (waiting state, visible to all members).

### 2.11 Group Settings / Lifecycle Management (creator-only, some member-accessible)
Elements: edit name/description, add/remove members, transfer ownership, archive/delete, pause/resume, invite management (active invites, regenerate/revoke link).
Fallback states: **transfer-ownership confirmation** (destructive-action pattern), **creator attempts to leave with no other members** → forced into archive flow, **delete confirmation** (double-confirm, destructive).

### 2.12 Task Definition Management
Elements: add/edit/delete task (creator-only), pause task (keeps history), change repeat pattern.
Fallback: **cannot delete last remaining task** (group needs ≥1 active task) → blocked with explanation.

---

## 3. Daily Task Submission

### 3.1 Today's Task Card (state machine — one screen, many states)
Purpose: primary daily action surface, shown on Group Detail and/or Home.
States: **Not started** → **Capturing** (in-app camera, front/back) → **Uploading** → **Pending review** → terminal: **Verified / Failed / Auto-passed / Expired / Skipped**.
Elements per state: countdown to cutoff, capture button, geo/timestamp confirmation chip, status badge.

**Fallback/edge states:**
- **Camera permission denied** → see §11.1
- **Camera permanently denied** → settings deep-link prompt
- **Capture failure** (hardware/app error) → retry
- **Location denied** → blocks submission with explanation + retry/settings path (proof never submits without location)
- **Location unavailable/inaccurate** → retry or wait state
- **Upload failed** (network) → Retry state, auto-queued if offline
- **Offline capture** → Captured → queued → auto-uploads on reconnect
- **Cutoff passed before submission** → auto-transitions to Expired (treated as Failed)

---

## 4. Verification (signature interaction — see UX Plan §2.5)

### 4.1 Verification Card Stack (state machine — one screen, many states)
Purpose: cross-group swipeable proof review, the product's core daily loop.
States: **Card appears (0s, dwell locked)** → **5s dwell complete (active)** → **Approve (swipe right)** / **Reject (swipe left → reason sheet → exit)**.
Elements: proof image, submitter, group name, timestamp/location chip, dwell-timer ring, vote count ("1 of 2 needed"), button fallback pair.

**Fallback/edge states:**
- **Empty queue** (nothing to verify) → dedicated empty state, not a blank screen (see §12 for tone)
- **Proof already resolved by others** → silently removed from stack, no error shown
- **Proof expired** (voting window closed) → removed from stack
- **User not eligible** (own proof) → never enters their own queue
- **User already voted** → removed from stack
- **Network failure mid-vote** → vote retry, card doesn't advance until confirmed
- **Reject reason field validation** (empty reason blocks submit)

---

## 5. Settlement / Results

### 5.1 Daily Settlement Summary
Purpose: end-of-day recap, per-member pass/fail + coin movement (push + in-app).
Elements: per-member result list, individual stake amount shown next to each result (percentages differ per member — see UX Plan §2.6).
Fallback: **settlement pending/processing** (brief loading state if resolution runs async), **settlement failed to compute** (rare — error state with support path).

### 5.2 Milestone Celebration
Purpose: triggered at 50/75/100% thresholds.
Elements: confetti/sparkle animation, bonus coin breakdown.
Fallback: **milestone reached while app closed** → surfaced via notification deep link into this screen retroactively, not lost.

### 5.3 Cycle Results (final day)
Purpose: full-cycle wrap-up — final tally, locked-balance unlock, "start next cycle" CTA (creator only).
Elements: cycle stats, member leaderboard within group, streak deltas.
Fallback: **non-creator waiting state** ("waiting for [creator] to start the next cycle"), **cycle force-closed** (hard time-limit hit with unresolved data) → explanatory banner distinct from normal completion.

---

## 6. League / Standings

### 6.1 League Standings (full screen)
Elements: season standings list, group's rank/points, tier structure.
Fallback: **season not yet started**, **group not yet ranked** (insufficient data), **loading/offline cached state**.

### 6.2 Group's League Widget (embedded in Group Detail)
Elements: compact rank display, link to full standings.
Fallback: **not yet ranked** — shown as "ranking starts after cycle 1" or similar, not blank.

---

## 7. Wallet

### 7.1 Wallet Home
Elements: Available / Locked / Total balance breakdown, "today's stake: X (Y%)" label (recalculates daily), transaction list entry point.
Fallback: **zero balance state** (see UX Plan open question on floor logic — needs explanatory copy, not just "0"), **loading skeleton**.

### 7.2 Transaction History (filterable by group)
Elements: transaction rows (stake locked/returned/forfeited, win share, milestone bonus), tap for detail.
Fallback: **empty (no transactions yet)**, **filter returns no results**, **pending vs. settled distinction** (visual, not a separate screen).

### 7.3 Transaction Detail (sheet/modal)
Elements: amount, type, related group/task, timestamp, settlement status, % basis (e.g. "72 (60% of 120)").

---

## 8. Subscription / Tier

### 8.1 Subscription Screen (Profile-accessed)
Elements: current tier, limits table (members/group, groups joined), free-vs-premium comparison.

### 8.2 Upsell Modal (contextual, triggered from multiple flows)
Triggers: adding an over-cap member, creating/joining beyond group-count limit.
Elements: limit explanation, upgrade CTA, dismiss.
Fallback: **dismiss without upgrading** → returns user to the blocked action's origin screen, action remains blocked.

### 8.3 Purchase Flow
States: **Processing** → **Success** / **Failed** / **Cancelled**.
Fallback: **payment provider error** (distinct copy from generic failure), **limits fail to update immediately post-purchase** → manual refresh affordance as backup.

---

## 9. Profile / Account

### 9.1 Profile Home
Elements: avatar, name, streak summary, entry points to Subscription, Account Settings.

### 9.2 Account Settings
Elements: edit profile info, notification preferences, linked auth methods, logout, delete account.
Fallback: **delete-account confirmation** (destructive, double-confirm, explains coin/group forfeiture).

### 9.3 Logout Confirmation
Fallback: none beyond the confirm/cancel itself.

---

## 10. Notifications

### 10.1 Notification Inbox
Purpose: chronological list, accessible via bell icon from any tab, independent of push permission state.
Elements: notification rows (verification needed, settlement completed, milestone reached, invite received), tap → deep link.
Fallback: **empty inbox**, **push permission denied** → inbox still functions, banner suggesting enabling push (dismissible, not blocking).

---

## 11. Permissions

### 11.1 Camera Permission Prompt
Elements: rationale copy before system prompt (soft-ask pattern), then native system dialog.
Fallback: **denied** → explanation + settings deep link, **permanently denied** (can't re-prompt) → settings deep link only.

### 11.2 Location Permission Prompt
Same pattern as 11.1.
Fallback: **denied**, **permanently denied**, **location services off at OS level** (distinct from app-level denial — needs distinct copy pointing to OS settings, not app settings).

---

## 12. Global System States
(Not standalone screens — a shared state system layered onto every screen above.)

- **Loading / Skeleton** — first load per session, per screen
- **Success** — default populated state
- **Empty** — no data yet (tone: invitation to act, per UX writing principles — never a blank void)
- **Error / Retry** — explains what happened, offers a clear next action, no apology-voice
- **Offline** — persistent banner, last-cached data shown, network-dependent actions disabled with inline messaging (not silent failure)
- **Session expired / logged out mid-use** — redirect to Login with a preserved return-path where possible, distinct from a fresh logout

---

## 13. Design Priority Notes

- **Verification card stack (§4.1)** is the signature interaction (see UX Plan §0/§2.5) — prototype motion/timing here first; it sets the visual/interaction bar the rest of the app should match.
- **Camera capture (§3.1) and its fallback states** are the second priority — this is the most permission-dependent flow and the one most likely to break on real devices (camera denial, GPS accuracy, offline capture).
- **Create Group (§2.2–2.7)** is a 5-step flow; validate the step count doesn't cause drop-off before committing to it as multi-screen vs. single scrollable form.
- Every **fallback/edge state** listed above needs its own visual treatment before this can be called design-complete — a state without a design is a state that gets improvised at build time.
