# SynKrew — Screens Checklist (v1.2)

Use this to track design (Stitch) and build (Expo) status per screen. Check off as each is: designed in Stitch → matches locked design system → built in Expo → uses shared components (no one-off styling).

**Update from v1.1**: confirmed Define Tasks and Schedule Tasks are shared screens (one design, reused by both Create Group and Join Group) — removed the duplicate Join Group entries and checked off the 4 shared task-definition/scheduling items using their confirmed Stitch screen IDs. Join Group's remaining checklist now only covers what's unique to it: Invite Preview, its edge states, and Confirmation.

**Update from v1**: tasks are now per-member (creator + every joining member define their own 3 tasks, visible group-wide), with a new weekday-scheduling step after task definition. New items below are unchecked (`[ ]`) since they weren't part of the original design pass — everything previously checked off under the old shared-task model should be re-verified against the new flow before re-marking complete, particularly Join Group's Invite Preview/Confirmation and Task Definition Management.

Legend: `[ ]` not started · mark with an `x` as you go, or duplicate columns if tracking design/build separately.

---

## Design System Foundation (build before any screen)
- [x] Color tokens extracted (`theme/colors.ts`)
- [x] Spacing/radius tokens extracted (`theme/spacing.ts`)
- [x] Typography tokens extracted (`theme/typography.ts`)
- [x] `Button` component (Primary / Secondary / Inverted / Outlined variants)
- [x] `Card` component
- [x] `TitleBar` component (colored bar + monospace label pattern)
- [x] `Input` component (with icon prefix, label, error state)
- [x] `ProgressDots` component
- [x] `ErrorBanner` component
- [x] `StatusBadge` component (task states — color + icon)
- [ ] Bottom nav bar component (with badge/pill support)

---

## 1. Onboarding & Auth
- [x] Splash Screen (System Boot)
- [x] Welcome / value-prop slide 1
- [x] Welcome / value-prop slide 2 (Stake Coins)
- [x] Welcome / value-prop slide 3 (Verify Each Other)
- [ ] Signup
- [ ] Signup — validation error
- [ ] Signup — email already registered
- [ ] Signup — network error on submit
- [ ] Login
- [ ] Login — invalid credentials error
- [ ] Login — account locked / rate-limited
- [ ] Login — network error
- [ ] Forgot Password
- [ ] Forgot Password — check-your-email confirmation
- [ ] Forgot Password — reset link expired
- [ ] Email/Phone Verification Pending
- [ ] Verification — code expired
- [ ] Verification — too many resend attempts

## 2. Groups
- [x] Groups List — populated
- [x] Groups List — empty (first-run)
- [x] Groups List — loading skeleton
- [x] Groups List — offline (cached + banner)
- [x] Create Group — Step 1: Name & Description
- [x] Create Group — Step 1: validation error
- [x] Define Tasks — shared screen, used by both Create Group & Join Group (Stitch ID: `e7a34275bf7b43a0a8621a1c581832cf` — supersedes deprecated `d03d65694c3b4a129e6663de8c6795c9`)
- [x] Define Tasks — no tasks added (blocked state) (Stitch ID: `01c9eb3fdaab43fe95955c8a2c6b1a7d` — supersedes deprecated `6c56a2d359e54d37be3040a31ee5b289`)
- [x] Schedule Tasks (Dropdown) — shared screen (Stitch ID: `8c9aef810d83493b93ea9d818fbd9a66` — supersedes deprecated grid-based `1752c2d64f31404fb3a80db118bf3e46`)
- [x] Schedule Tasks (Dropdown) — day with zero tasks checked (blocked state) (Stitch ID: `1cef2fef30d643f586b36d212837e39f` — supersedes deprecated grid-based `dec9e28b99a2464f815d6c9f92ae79fb`)
- [x] Create Group — Step 3: Cycle Length & Stake %
- [x] Create Group — Step 4: Invite Members
- [x] Create Group — Step 4: contact permission denied
- [x] Create Group — Step 5: Review
- [x] Create Group — Step 5: at group-limit (redirect to Upsell)
- [x] Create Group — Confirmation / success
- [x] Create Group — creation failed (retry)
- [x] Join Group — Invite Preview (RE-VERIFIED: shows stake %/cycle length, no task summary — tasks are per-member)
- [x] Join Group — invalid invite
- [x] Join Group — expired invite
- [x] Join Group — group full
- [x] Join Group — already a member
- [x] Join Group — previously removed/banned
- [x] Join Group — private/pending-approval
- [x] Join Group — invite revoked
- [x] Join Group — Confirmation (RE-VERIFIED: lands in Group Detail showing all members' tasks)

**Note**: Join Group does NOT get its own Define Tasks / Schedule Tasks screens — it reuses the two shared items checked off above, entered after Accept/Decline instead of after Name/Description. Nothing to design or build twice.

- [x] Group Detail — active
- [x] Group Detail — paused
- [x] Group Detail — archived (read-only)
- [x] Group Detail — cycle ended, awaiting next cycle
- [x] Group Settings / Lifecycle Management
- [x] Group Settings — transfer ownership confirmation
- [x] Group Settings — delete confirmation
- [x] Task Definition Management (RE-VERIFIED: member-scoped, not creator-only) (Stitch ID: `e7ab28fb58fd4e4ca1a4deb14f52ee50`)
- [x] Task Definition — cannot delete last task (blocked) (Stubbed with ErrorBanner)
- [x] Task Schedule Management (Redesign — companion 7-day dropdown, editable post-join) (Stitch ID: `7b28fd10253443e3a5943b1256c2b96a`)
- [x] Task Schedule Management — cannot uncheck last task on a day (blocked) (Stubbed with ErrorBanner)
- [x] Task Schedule Management — deleting a task leaves a day at zero (blocked/reassign) (Stubbed with ErrorBanner)

## 3. Daily Task Submission
- [x] Today's Task — Not started
- [x] Today's Task — Capturing (in-app camera)
- [x] Today's Task — Uploading
- [x] Today's Task — Pending review
- [x] Today's Task — Verified
- [x] Today's Task — Failed
- [x] Today's Task — Auto-passed
- [x] Today's Task — Expired
- [x] Today's Task — Skipped
- [x] Camera permission denied
- [x] Camera permanently denied (settings deep-link)
- [x] Capture failure / retry
- [x] Location denied
- [x] Location unavailable/inaccurate
- [x] Upload failed (retry)
- [x] Offline capture / queued state

## 4. Verification (signature interaction)
- [ ] Card stack — card appears / dwell locked (0–5s) (RE-VERIFY: add task-owner/task-name label — tasks are per-member now)
- [x] Card stack — dwell complete / active
- [x] Card stack — approve (swipe/button)
- [x] Card stack — reject → reason sheet
- [x] Card stack — reject → exit confirmation
- [x] Empty queue state
- [x] Proof already resolved (silent removal — confirm UX)
- [x] Proof expired
- [x] Network failure mid-vote

## 5. Settlement / Results
- [x] Daily Settlement Summary
- [x] Settlement — pending/processing
- [x] Settlement — failed to compute (error state)
- [x] Milestone Celebration (50/75/100%)
- [x] Milestone reached while app closed (notification deep-link)
- [x] Cycle Results (final day)
- [x] Cycle Results — non-creator waiting state
- [x] Cycle Results — force-closed banner

## 6. League
- [x] League Standings — full screen
- [x] League Standings — season not started
- [x] League Standings — group not yet ranked
- [x] League Standings — loading/offline
- [x] Group's League Widget (embedded)

## 7. Wallet
- [x] Wallet Home — balance breakdown
- [x] Wallet Home — zero balance state
- [x] Wallet Home — loading skeleton
- [x] Transaction History
- [x] Transaction History — empty
- [x] Transaction History — filter returns no results
- [x] Transaction Detail sheet (incl. Win Share example)

## 8. Subscription / Tier
- [x] Subscription screen (tier comparison table)
- [x] Upsell Modal
- [x] Upsell — dismiss/return state
- [x] Purchase Flow — Processing
- [x] Purchase Flow — Success
- [x] Purchase Flow — Failed
- [x] Purchase Flow — Cancelled
- [x] Purchase Flow — payment provider error

## 9. Profile / Account
- [x] Profile Home
- [x] Account Settings
- [x] Delete Account — confirmation
- [x] Logout confirmation

## 10. Notifications
- [x] Notification Inbox — populated
- [x] Notification Inbox — empty
- [x] Push permission-off banner

## 11. Permissions
- [x] Camera permission prompt
- [x] Camera — denied
- [x] Camera — permanently denied
- [x] Location permission prompt
- [x] Location — denied
- [x] Location — permanently denied
- [x] Location — OS-level services off

## 12. Global System States
(apply as shared components/patterns across all screens above, not one-off designs)
- [x] Loading / Skeleton pattern
- [x] Empty-state pattern (invitation-to-act tone)
- [x] Error/Retry pattern
- [x] Offline banner
- [x] Session expired / logged out redirect

---

## Consistency Audit Pass (do this after all screens are built)
Check each against the locked reference screens (Onboarding: Verify Each Other, Onboarding: Stake Coins, Sign Up, Login: Error State):
- [x] All buttons use the shared `Button` component (no inline/one-off styles)
- [x] All cards use the shared `Card` component
- [x] All title bars use the shared `TitleBar` component
- [x] Corner radius consistent across all components (pull from `theme/spacing.ts`)
- [x] Border weight consistent (pull from theme)
- [x] Color usage matches token roles (primary/secondary/error etc.) — no hardcoded hex values in screen code
- [x] Typography matches token roles (headline/body/label) — no inline font overrides
- [x] No stock/AI-generated photography anywhere — flat vector/icon only
- [x] Error states all use the shared `ErrorBanner` pattern
- [x] Status badges (task states) all use distinct color + icon, not color alone

**Total: 33 primary screens · 64 fallback/edge states · 97 items to design + build**
**(4 shared task-definition/scheduling items confirmed done via Stitch IDs; Join Group Invite Preview/Confirmation and Task Definition Management flagged for re-verification — see changelog note at top)**
