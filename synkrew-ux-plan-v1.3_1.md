# SynKrew — Frontend UX Plan (v1.3)

**Update from v1.2**: folded in the coin-economy breakdown doc — added explicit Win Share transaction labeling and full economy flow diagram (§2.9), a Free-vs-Premium comparison table with the "capacity upgrade, not economy upgrade" principle (§2.10), and the League separation principle plus a proposed (unconfirmed) points formula (§2.8, §15).

**Update from v1.1**: Swipe Verification elevated from a standard component to a core UX pillar — full micro-interaction timeline, reject-pause-for-reason flow, and nav-badge treatment added (§0 Core UX Pillars, §1, §2.5, §4).

**Update from v1**: staking model changed from a flat coin amount locked for the whole cycle to a **creator-set percentage recalculated daily off each member's current balance** (see §2.9a). This affects Create Group (§2.2), Wallet (§2.9), and Settlement (§2.6). Several open questions this introduces are called out in §15 and are not yet resolved.

Scope: frontend only. Backend/API contracts owned separately — this plan assumes the data shapes from the existing ERD (groups, group_memberships, task_definitions, task_instances, verifications, transactions, base_period_cycles, subscription_plans).

Visual direction: retro 90s/Y2K desktop UI — chunky window title bars, pixel-ish icons, grid background, sparkle accents. Palette: pink, teal, purple, yellow. No mascot/gacha/character system — gamification is streaks, badges, and league rank only.

**Core UX pillar — Swipe Verification.** Of the product's functional systems (tasks, stakes, streaks, leagues, wallet), verification is the one designed to feel distinctive rather than purely utilitarian. The product framing is deliberately **"I have 3 proofs to verify"**, not "I need to go check on someone" — a quick social ritual (see a friend's proof → inspect → judge → swipe → move on), not a moderation queue. This shapes the nav bar treatment (§1), the full interaction spec (§2.5), and the component design (§4) — it's treated as load-bearing to the product's identity, not just one component among many.

---

## 1. App Shell & Navigation

```
App Shell
├── Bottom Tab Navigation (persistent, order: Profile, Groups, Verification, League, Wallet)
│   ├── Profile
│   ├── Groups
│   ├── Verification   ← badge count is the tab's primary visual weight (see below)
│   ├── League
│   └── Wallet
├── Global Modal Layer (overlays any tab)
│   ├── Create Group
│   ├── Join Group
│   ├── Upsell (tier limit hit)
│   └── Confirmations (leave group, delete task, etc.)
└── Notification Deep Links → route directly into the relevant screen
```

**Verification tab badge — "your daily job."** The badge count isn't a standard notification dot; it's a persistent, prominent number (e.g. a filled pill, not just a small red circle) sitting on the Verification tab whenever proofs are pending:
```
PROFILE   GROUPS   [✓ 3]   LEAGUE   WALLET
                     ↑
              your daily job
```
The number communicates "3 people are waiting on you," which is meant to create a light social obligation without reading as a chore — this is the entry point into the interaction described in §2.5, and it's why Verification gets its own tab instead of living inside Groups.

- **Stack vs modal**: Group Detail, Verify Queue, Wallet detail, Profile sub-screens are stack (back button returns to previous screen). Create Group, Join Group, Upsell, and all confirmations are modals (dismiss returns to wherever the modal was triggered from, not a stack "back").
- **Back behavior**: stack screens use native back gesture/button; modals close via explicit X or swipe-down, never native back.
- **Notification tap → deep link** examples: "Verification needed" → Verification tab, opened directly to that proof's card in the stack; "Settlement completed" → Results screen for that cycle; "Milestone reached" → Group Detail with celebration state active.
- **Global inbox/notification surface**: a bell icon in the top bar (visible from any tab) opening a chronological notification list, independent of push permission state.
- **Tab-switch loading**: each tab shows a skeleton on first load per session, then cached content on subsequent switches within the session.
- **Offline behavior**: tabs show last-cached data with a persistent "You're offline" banner; actions that require network (submit proof, vote, create group) are disabled with inline messaging rather than silently failing.

---

## 2. Core Flows

### 2.1 Onboarding (first run)
1. Welcome / value prop slides (2–3): "stake coins with friends," "verify each other," "build streaks"
2. Signup/login (see §9 Authentication)
3. Empty state → prompt to create or join first group

### 2.2 Create Group
1. Name + description
2. Add task definitions (title, repeat pattern) — at least 1 required; supports multiple tasks/day (see §5)
3. Set base period length (7 / 30 days) and **stake percentage** per day (creator picks a %, e.g. 60% — see §2.9a for how this applies daily). Slider or preset chips (25/50/60/75%) recommended over free text, to keep values sane and avoid a 0% or 100% edge case slipping through unconfirmed (see §15).
4. Invite members (contact picker / shareable link)
5. Review screen: member cap for current tier (10 free / 20 premium), groups-joined count vs. limit
   - At group-limit (2 free / 5 premium): block creation, show upsell instead of review
6. Confirmation → lands in new Group Detail

### 2.3 Join Group
The other half of growth — a first-class flow, not an afterthought.
1. Entry: invite link or code (deep link opens app directly to preview)
2. Group preview: name, creator, member count/cap, task + stake summary, group rules
3. Accept / Decline
4. Client-side check against user's group-count limit before allowing Accept
5. Join confirmation → lands in Group Detail

**Edge states**: invalid invite, expired invite, group full, already a member, user removed/banned from this group previously, private group (requires creator approval), invite revoked after link was opened.

### 2.4 Daily Task Submission
1. Home/Group Detail surfaces a "Today's Task" card per active task with countdown to cutoff (11:59 PM group timezone)
2. Tap → in-app camera only (no gallery picker) → capture front/back image
3. Auto-attach geolocation + device timestamp (silent chip overlay, not editable)
4. Submit → status becomes "Pending review"
5. Full state machine: see §2.14 Task Instance Lifecycle

**Capture/permission edge states** (see §8): camera denied, camera permanently denied, capture failure, location denied, location unavailable/inaccurate. If location can't be attached, submission is blocked with a clear explanation and a retry/settings-deep-link path — proof is never silently submitted without it.

**Offline submission** (see §10): capture works offline; upload queues and retries automatically; user sees Captured → Uploading → Submitted, or Captured → Upload failed → Retry if the network never returns before the cutoff.

### 2.5 Verification (Verification tab) — signature interaction, see also Core UX Pillars above
Own bottom-nav tab — not nested under Groups. Aggregates pending proofs across **all** of the user's groups into a single card-stack interface, one proof at a time (Tinder-style). This is the product's core daily loop: **submit → someone verifies you → you verify someone else**, and because the tab aggregates across groups, there's no navigating group-by-group to find work.

**Design principle**: this screen should never read as "Proof #4821 — Approve | Reject." It's a quick social ritual, not a moderation dashboard — the retro/Y2K visual language (chunky card frame, pixel indicators, sparkle completion feedback) does real work here, not just decoration.

**Micro-interaction timeline, per card:**

| Phase | What happens |
|---|---|
| **Card appears (0s)** | Proof image is the visual focus, full-bleed on the card. Submitter, group name, timestamp/location chip shown as secondary info. Circular dwell-timer ring begins filling around a corner or edge of the card. Swipe has no effect yet. Optional subtle label, e.g. `REVIEWING...` |
| **0–5s (dwell window)** | Card is inert to swipe input — a light resistance or dimmed-affordance treatment communicates "not yet," not "broken." This is the anti-collusion mechanic (see rationale below), so it should read as "take a look," not "you are being timed." |
| **5s (dwell complete)** | Ring completes. Approve/Reject affordances activate (color brightens, subtle card lift/scale). A small haptic tick confirms the card is now live. |
| **Swipe right → Approve** | Card exits with an `APPROVE ✓` stamp/animation, sparkle burst consistent with the visual language, next card loads immediately with its own fresh timer. |
| **Swipe left → Reject** | Card does **not** exit immediately — see reject sub-flow below, since a reason is mandatory (§6). |

**Reject sub-flow** (mandatory reason, per the existing v1 rule): swipe left → card pauses mid-exit (doesn't leave the stack yet) → a reason sheet slides up from the bottom → reason entered and submitted → card then completes its exit with a `REJECT ✕` stamp → next card loads. The pause is intentional: it keeps the reason-entry moment attached to the same gesture rather than feeling like a separate interruption.

**Button fallback** (required for accessibility, not optional — per §13): Approve/Reject buttons sit below the card at all times, respect the same 5-second lock as swipe, and trigger the identical animations/sub-flows. Screen-reader users and anyone unable to perform swipe gestures get full parity, not a degraded path.

**Anti-collusion rationale for the dwell timer**: it's a direct mitigation for the rubber-stamping risk around the milestone bonus (see project notes) — it can't stop a verifier from approving in bad faith, but it removes the "swipe through in under a second without looking" failure mode that made mass rubber-stamping trivial. Framing it as "take a look" rather than "you're being timed" is deliberate: the mechanic should feel like a natural pause, not a punitive gate.

**Other interaction details:**
- Live vote count shown per proof (e.g. "1 of 2 needed") — majority is 2-of-3, not unanimous
- Tab badge count (see §1) decrements in real time as cards are cleared
- Rejection reasons visible to the whole group afterward (transparency log, viewable from that group's Group Detail)

**Verifier queue states**: nothing assigned (empty state — see §3), one proof, multiple proofs, proof already resolved (removed from queue), proof expired, user not eligible to verify (e.g. it's their own proof), user already voted, voting window expired.

**Dispute/failure sub-flow** (v1 scope decision — see §6): a rejected proof cannot be appealed or resubmitted in v1; the outcome is final once majority is reached. This keeps the flow simple and matches the "strictly all-or-nothing per day" rule already set. Tie and single-voter cases are handled per §6.

### 2.6 Settlement / Results
1. End-of-day summary card (push notification + in-app): who passed/failed, coin movement. Since stakes are now per-member percentages of a moving balance (§2.9a), each member's forfeit/win amount is different even on the same day — the summary should show each member's own stake amount next to their result, not one shared cycle-wide number
2. Streak update: current streak, longest streak, milestone progress bar toward 50/75/100%
3. Milestone hit → celebratory moment (confetti/sparkle animation, no character/mascot) + bonus coin breakdown — **open question**: does the milestone bonus stay a flat pool split evenly (as originally designed), or does it also scale with each member's current balance under the percentage model? Flagged in §15, blocks final copy for this screen

### 2.7 Skip Day
1. From Group Detail, "Use Skip Day" button (only visible if grants available)
2. Confirmation modal explaining it marks the day skipped, not failed
3. Skip Day balance shown in Group Settings / Member profile within group

### 2.8 League / Standings
1. Season standings list per league tier, group's rank and points
2. Group Detail has a compact "League" widget linking to full standings
(Ranking is group-level, matching `group_league_standings` in the schema — not individual.)

**Stated principle — coins do not determine League rank.** League, Wallet, and Streak are three separate systems answering three separate questions, and this separation should hold in both logic and UI framing:
- **Wallet** — what happened to my coins (§2.9)
- **Streak** — how consistently am I personally succeeding (§10)
- **League** — how consistently is our group showing up

Concretely: Premium tier does not grant more League points, coin balance does not factor into rank, and no purchasable boost should ever touch League standing. This is a design constraint worth holding onto explicitly, since it's the thing that keeps the app from reading as "pay to win" even though a real subscription product sits next to it (§2.10).

**League points formula — proposed, not yet confirmed:**
> 50% Task Consistency + 50% Verification Consistency

i.e. half the score comes from the group's own task pass rate, half from how reliably its members participate in verifying others (both inside and outside the group, since Verification is cross-group per §2.5). This is currently a proposal, not a locked decision — exact points-per-day, tie-breaking, and promotion/relegation mechanics still need to be defined before the League screens (§2.8) can be built to spec. Tracked as an open item in §15.

### 2.9 Wallet
Balance is split, not a single number, so "where did my coins go" never becomes a support question:
```
COINS
────────────────
Available       840
Locked (staked)  200   ← recalculated daily, see §2.9a
────────────────
Total           1040
```
- Transaction history: stake locked, stake returned, stake forfeited (loss), **win share** (from others' forfeits — see labeling below), milestone bonus, penalty — filterable by group
- Tapping a transaction opens detail: amount, type, related group/task, timestamp, settlement status
- Pending transactions shown distinctly from settled ones
- Because the locked amount changes every day (§2.9a), each day's "stake locked" transaction shows the coin amount **and** the % it was calculated from, so the history stays legible even as the number moves (e.g. "Staked 72 (60% of 120)")
- **Win Share labeling**: the redistribution credit a passing member receives from others' forfeits should be its own distinct transaction type in the UI, not folded into a generic "stake returned" line — e.g. `+30 WIN SHARE — Morning Crew — from 1 member's forfeited stake`. This makes the causal link visible ("I got these coins because someone else failed today") rather than leaving it implicit in a balance change.

**Full daily economy flow** (for reference when designing the Wallet/Settlement screens):
```
              USER BALANCE
                   │
                   ▼
            Daily stake %
                   │
                   ▼
             ┌──────────┐
             │  LOCKED  │
             └────┬─────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      PASS       FAIL      SKIP
        │         │         │
        ▼         ▼         ▼
    RETURN     FORFEIT    NOTHING
        │         │
        │         ▼
        │   REDISTRIBUTION
        │         │
        └────┬────┘
             ▼
        PASSING MEMBERS
             │
             ▼
         WIN SHARE
```
Auto-pass follows the PASS branch (stake returns, counts as a pass for streak purposes); Expired follows the FAIL branch (per §2.14).

### 2.9a Daily Stake Recalculation (percentage model)
Replaces a flat per-cycle stake amount. The creator sets a **stake percentage** at group creation (§2.2), and each day's locked amount is that percentage of the member's **current total balance at the start of that day** — not a fixed number carried from Day 1.

**Per-member daily mechanic:**
1. At the start of each day, `stake = round(total_balance × stake_%)` moves from Available → Locked
2. If the day's task is **Verified**: the stake returns to Available, plus a share of that day's forfeited stakes from members who failed (split evenly among that day's passers)
3. If the day's task is **Failed / Expired**: the locked stake is forfeited entirely — it does not return to Available, and is redistributed to that day's passers
4. **Skipped** days: no stake is locked at all for that day (see §2.7); balance carries forward unchanged
5. Next day's stake recalculates off whatever the new total balance is — so a losing streak shrinks the amount at risk day over day, and a winning streak grows it

**Wallet UI implication:** the "Locked" figure is not stable across the cycle the way a flat stake would be — it should visibly update each day (e.g. a small "today's stake: 72 (60%)" label near the balance, not just a static Locked number) so members aren't confused when it doesn't match what they staked yesterday.

**Known open items** (not yet resolved — see §15): rounding rule for fractional coins, whether a floor/minimum stake applies as balances shrink toward zero, and whether the milestone bonus (§2.6) still pays as a flat split or also scales with balance.

### 2.10 Subscription / Tier Upsell
1. Profile → Subscription: current tier, limits (members/group, groups joined), free-vs-premium comparison table
2. Contextual upsell triggers (not only from Profile):
   - Attempting to add an over-cap member to a free-tier group
   - Attempting to create/join beyond the free group-count limit
3. Purchase flow → payment provider handoff → Processing → Success/Failed/Cancelled → limits update immediately in UI

**Free vs Premium comparison** (source for the table shown in-app):

| | Free | Premium |
|---|---:|---:|
| Groups joined | 2 | 5 |
| Members per group | 10 | 20 |
| Daily task/stake system | Same | Same |
| Verification | Same | Same |
| Coin economy | Same | Same |
| League | Same | Same |
| Streaks/badges | Same | Same |

**Stated principle — Premium is a capacity upgrade, not an economy upgrade.** Every row that isn't a hard numeric limit reads "Same" by design — Premium should never be framed or built as "better odds" or "more coins," only as more groups/members. This keeps the comparison table (and the upsell copy that draws from it) honest, and reinforces the League separation principle in §2.8. Premium payment itself is a distinct transaction type from any in-app coin transaction (§2.9) and should not be mixed into the Wallet transaction history — unless a future decision explicitly allows purchasing Premium with coins, which is out of scope for v1.

### 2.11 Group Lifecycle Management
Creator-only unless noted:
- Edit group (name/description)
- Add/remove members; remove is creator-only, leave is any member
- Transfer ownership
- Archive/delete group
- Pause group (holds cycle, no new task instances generated)
- Invite management: view active invites, regenerate link, revoke link
- **Creator leaves**: prompt to transfer ownership before leaving is allowed; if no other members exist, leaving = archiving the group

### 2.12 Cycle Lifecycle
```
Cycle starts → Day 1 → Day 2 → ... → Final day → Settlement → Results → Next cycle?
```
v1 decisions to reflect in UI (flag any not yet backend-confirmed):
- Next cycle does **not** start automatically — creator initiates a new cycle from the Results screen (prevents indefinite auto-restaking without consent)
- Stakes reset each cycle; streaks (`current_streak`/`longest_streak`) are continuous across cycles per `group_memberships`, not reset
- Mid-cycle join: new member's first active day is the day they join; no retroactive stake for prior days
- Mid-cycle leave: forfeits remaining locked stake for the current cycle to the group pool at settlement
*(Marked open pending backend confirmation — see §13.)*

### 2.13 Task Definition Management
- Add/edit/delete a task definition (creator-only)
- Pause a task without deleting it (stops generating new instances, keeps history)
- Change repeat pattern
- Groups support multiple active tasks per day — each gets its own status card and vote queue entry
- Editing a task definition does not retroactively change already-generated `task_instances`

### 2.14 Task Instance Lifecycle
Per-task-instance state machine (one instance per active task per member per day). This is the lifecycle a single "Today's Task" card moves through, distinct from the Cycle Lifecycle (§2.12) which governs the whole group's multi-day container.

```
Not started
     ↓ (member opens camera)
Capturing
     ↓ (photo taken)
Uploading ──────────────┐
     ↓ (success)         ↓ (network fails)
Pending review      Upload failed → Retry → back to Uploading
     ↓
     ├──→ Verified (2-of-3 approve)
     ├──→ Failed (2-of-3 reject, OR tie — see §6)
     ├──→ Auto-passed (12hr timeout with no majority reached)
     └──→ Expired (cutoff passed with no submission at all — treated as Failed for settlement)

Skipped — a separate branch, entered directly from Not started when a Skip Day grant is applied (see §2.7); bypasses camera/verification entirely
```

- **Terminal states**: Verified, Failed, Auto-passed, Expired, Skipped — none of these transition further (no appeal/resubmit, per §2.5/§6)
- **Settlement trigger**: reaching any terminal state feeds into that day's Settle step (§2.6); the instance itself doesn't change again after settlement, only the group's aggregate streak/wallet do
- **UI treatment per state**: matches the Task status badge component (§4) — each state needs a distinct color + icon (not color alone, per §13), since a member scanning Group Detail should be able to tell instance status at a glance across all active tasks

---

## 3. Key UI States to Design For

- **Empty states**: no groups yet, no pending verifications, no transactions, no notifications
- **Limit-reached states**: group full, group-count cap reached (upsell CTA)
- **Time-sensitive states**: countdown to daily cutoff, "auto-pass in Xh" on proofs nearing the 12-hour timeout, "cycle ending soon"
- **Verification transparency state**: rejected proof with visible reason, visible to whole group
- **Milestone states**: progress bar at 0–49% / 50–74% / 75–99% / 100%, distinct treatment at each threshold crossing
- **Standard transient-state system**, applied to every major screen: Loading → Skeleton → Success / Empty / Error → Retry / Offline / Permission denied / Expired / Locked

---

## 4. Component Inventory (high-level)

- Retro window-frame container (title bar, chunky border) — wraps cards/modals
- Task status badge (Not started / Uploading / Pending / Verified / Failed / Skipped / Auto-passed / Expired)
- Camera capture component (in-app only, geo/timestamp chip overlay, offline-capable with upload queue)
- **Verification card (signature component, see §2.5)** — swipeable proof card with: circular dwell-timer ring, phase-based affordance states (locked/dimmed → active/lifted), directional swipe stamps (`APPROVE ✓` / `REJECT ✕`), sparkle exit animation, pause-for-reason-sheet behavior on reject, nav-tab badge counter tied to stack size, button fallback pair for accessibility — this component carries more visual/motion design weight than other components in this inventory and should be prototyped early given its role in §0's Core UX Pillars
- Streak counter (current + longest, pixel-style icon)
- Milestone progress bar (segmented at 50/75/100)
- Member cap indicator (e.g. "7/10 members")
- Group-count indicator (e.g. "2/2 groups used")
- Tier badge (Free / Premium)
- Wallet balance breakdown (available / locked / total)
- Wallet transaction row + detail sheet
- Notification bell + inbox list
- Permission-prompt sheet (camera/location) with settings deep link

---

## 5. Permissions & Device States

**Camera**: granted / denied / permanently denied (route to OS settings) / camera unavailable / capture failure (retry).
**Location**: granted / denied / unavailable / inaccurate / disabled mid-session. If location can't be attached at submit time, submission is blocked (not silently allowed, not auto-failed) with a retry path — matches the geo+timestamp anti-reuse design already set.

---

## 6. Verification Edge Cases (v1 rules)

- **Tied vote** (unlikely at 2-of-3 but possible with variable group sizes/multiple verifiers): resolves to Fail — the stricter outcome, consistent with "strictly all-or-nothing."
- **Only one verifier available**: majority threshold still requires 2 votes; if unreachable, falls through to the 12-hour auto-pass timeout rather than blocking indefinitely.
- **Verifier doesn't vote**: no penalty in v1; the timeout mechanism absorbs this case.
- **Verifier tries to swipe before 5s elapses**: swipe is inert/ignored, not an error — dwell-lock indicator makes the wait visible so it doesn't read as a bug.
- **Verifier changes their vote**: not allowed once cast, in v1 — keeps the transparency log trustworthy.
- **No appeal/resubmit**: outcome is final once majority or timeout resolves it (see §2.5).

---

## 7. Notifications

Categories: task reminder, proof verified, proof rejected, verification needed, cycle ending, settlement completed, member joined/left group, milestone reached, league position changed, skip day expiring/available, subscription/payment result.

Preferences screen groups these into: Task reminders / Verification requests / Results / Group activity / League / Marketing — each independently toggleable.

---

## 8. Authentication Lifecycle

Signup/login, forgot password, email/phone verification (OTP + resend + invalid-code state), session expiry (silent re-auth or forced re-login), logout, account deletion, terms/privacy acceptance at signup. Social login is a nice-to-have, not required for v1.

---

## 9. Profile / Account

```
Profile
├── Avatar / Name / Username
├── Streak stats
├── Badges (earned, displayed; visible to other group members)
├── Subscription
├── Notification preferences
├── Account (change email, change password, delete account)
└── Help
```

---

## 10. Gamification Definition (v1 scope)

- **Streaks**: tracked per group membership (`current_streak`/`longest_streak` on `group_memberships`), not global or per-task. A Fail resets the streak; a Skip Day does **not** break it; an Auto-pass counts as a success for streak purposes.
- **Badges**: earned for milestones (e.g. first 7-day streak, first completed cycle, first milestone bonus). Displayed on Profile and visible to other members of shared groups. Exact badge set is a content/backend decision, not blocking frontend component work — the component just needs to render an icon + label + earned date.
- **League**: group-level ranking (not individual), per season, points-based per `group_league_standings`. Ties and promotion/relegation rules are a backend decision to confirm before building the standings screen's tie-breaking display logic.

---

## 11. Security / Trust UX

First-time users should understand what happens to their coins without digging: a lightweight "How it works" surface (accessible from Create Group and from the Wallet) covering — what a stake is, **why the locked amount changes every day** (the percentage model, §2.9a — this is the least intuitive part and the most likely source of "why did my stake go down" confusion), how verification works, why location/timestamp are required, how settlement works. Delivered as contextual tooltips/expandable cards rather than a wall of onboarding text (see §12).

---

## 12. First-Time Education

Non-obvious concepts (stake, verification, auto-pass, skip day, milestone, league, coins) get short contextual explainers at the point of first encounter rather than front-loaded onboarding — e.g. a "What's Auto-pass?" info icon next to the first pending proof a user ever sees, not a slide in the signup flow.

---

## 13. Accessibility & Responsive

- Don't rely on color alone for status (pair every status color with an icon/label) — important given the retro palette
- Minimum text size, contrast ratios, dynamic text scaling support
- Touch targets meet platform minimums despite pixel-art styling
- Reduced-motion mode for the sparkle/confetti celebration moments
- Screen reader labels on all icon-only controls
- iOS/Android safe-area handling, keyboard-avoidance on forms, camera orientation handling, dark/light mode

---

## 14. Analytics Events (frontend-emitted)

`signup_started`, `signup_completed`, `group_created`, `group_joined`, `task_started`, `proof_captured`, `proof_submitted`, `proof_approved`, `proof_rejected`, `verification_started`, `verification_completed`, `skip_day_used`, `upsell_viewed`, `subscription_started`, `milestone_reached`, `cycle_completed`, `notification_opened`.

---

## 15. Open Questions / Backend-Dependent Decisions

- Whether the 20-member premium cap lives on the user's subscription or a per-group boost purchase — changes upsell copy/flow ("upgrade account" vs. "boost this group")
- `verifications.reason` field and a 12-hour deadline field on `task_instances` need backend confirmation — flagged previously, not yet confirmed as built
- Cycle auto-restart, mid-cycle join/leave handling (§2.12) — UI reflects the decisions above as the working assumption; confirm before final build
- Tie-breaking and promotion/relegation rules for League (§10)
- **League points formula**: proposed as 50% Task Consistency + 50% Verification Consistency (§2.8), but exact points-per-day and how the two halves combine are not yet defined — needed before League screens can be built to spec

**Percentage-stake model (§2.9a) — newly introduced, needs resolution before build:**
- **Rounding rule**: daily stake = `total × stake_%` will produce fractional coins almost immediately (e.g. 72.0, then 43.2 the next loss). Round to nearest integer? Always round down? Store as decimal internally and only round for display? Affects every daily transaction and the wallet ledger.
- **Zero-floor behavior**: a losing streak shrinks the locked amount each day but mathematically never hits exactly zero (60% of a shrinking number stays positive). Does the existing "floor at zero, daily check-in grants one coin" rule (from the original edge-case list) still apply here, or is it obsolete under this model since balances asymptotically approach zero rather than hitting it? Needs an explicit minimum-stake or minimum-balance rule either way, or the UI will eventually show stakes like "1 coin (60% of 1)."
- **Milestone bonus interaction**: does the 50/75/100% milestone bonus stay a flat pool split evenly across members (original design), or scale with each member's current balance to stay consistent with the percentage model? Blocks final Settlement screen copy (§2.6).
- **Escalating risk on winning streaks**: since stake is a % of current total, a long winning streak means the *absolute* coins at risk each day keeps growing. Worth confirming this is an intended feature (higher stakes as tension escalates) rather than an unintended side effect, since it changes the emotional arc of a long streak from "safe lead" to "growing exposure."
- **Stake % bounds**: should the creator's stake percentage be constrained to a sane range (e.g. 10–75%) rather than free-entry, to prevent a 0% (no real stake) or 100% (one loss wipes the member out) group from being created accidentally?

---

## 16. Next Step

This plan is now flow-and-state complete but still one level above build-ready. The recommended next artifact is a **screen-by-screen spec**: for each screen — purpose, entry points, components used, all states, actions, navigation targets, API data needed, edge cases. Worth doing per-screen as each is built rather than all upfront.
