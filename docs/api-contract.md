# SynKrew — Backend API Specification & Contract Document (FastAPI + Supabase)

> **Document Version:** 1.0 (Backend-Ready Contract)  
> **Status:** Hand-off specification for FastAPI backend development  
> **Base URL:** `/api/v1`  
> **Authentication:** Bearer JWT in `Authorization: Bearer <token>` header (Supabase Auth compatible)

---

## 1. Architecture Overview & Principles

1. **Member-Scoped Task Manifest**:
   - Each member (creator + joining members) authors and manages their own 3 personal tasks.
   - `task_definitions` is keyed off `group_membership_id` (or `user_id` + `group_id`).
   - `task_schedules` joins `task_definition_id` with `weekday` (MONDAY..SUNDAY).
   - Daily `task_instances` are generated for each active day according to that member's schedule.

2. **Daily Percentage-Stake Recalculation**:
   - Creator sets `daily_stake_percent` (e.g. 60%).
   - Daily locked stake = `round(user_available_balance × (daily_stake_percent / 100))`.
   - On pass: stake returns + equal share of that day's forfeited pool from failing members (`win_share`).
   - On fail/expired: stake is forfeited and distributed among passing members.

3. **2-of-3 Peer Swipe Verification**:
   - Verifiers vote `approve` or `reject` (with reason).
   - Majority rule (2 approvals = pass; 2 rejections or tie = fail).
   - 12-hour timeout triggers `auto_passed` if majority is unreached.

4. **Capacity-Only Premium**:
   - Free tier: 2 groups max, 10 members/group.
   - Premium tier: 5 groups max, 20 members/group.
   - Economy, verification, and league logic remain strictly identical across tiers.

---

## 2. API Endpoints by Domain

### 2.1 Auth Domain

#### `POST /auth/signup`
- **Description**: Registers a new user with email/username.
- **Auth Required**: No
- **Consuming Screens**: `app/(auth)/signup.tsx`
- **Request Body**:
  ```json
  {
    "email": "pilot@synkrew.dev",
    "username": "KrewMaster99",
    "password": "SecurePassword123!",
    "termsAccepted": true
  }
  ```
- **Response Body (`201 Created`)**:
  ```json
  {
    "user": {
      "id": "user_01H...",
      "email": "pilot@synkrew.dev",
      "username": "KrewMaster99",
      "avatarUrl": null,
      "createdAt": "2026-08-30T00:00:00Z",
      "emailVerified": false
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "d8f9a2...",
    "expiresIn": 86400
  }
  ```

#### `POST /auth/login`
- **Description**: Authenticates user via email/handle + password or OTP.
- **Auth Required**: No
- **Consuming Screens**: `app/(auth)/login.tsx`
- **Request Body**:
  ```json
  {
    "emailOrUsername": "KrewMaster99",
    "password": "SecurePassword123!"
  }
  ```
- **Response Body (`200 OK`)**: Same as `AuthResponse` above.

#### `POST /auth/verify-otp`
- **Description**: Confirms 6-digit email/SMS OTP token.
- **Auth Required**: No
- **Consuming Screens**: `app/(auth)/verify.tsx`
- **Request Body**:
  ```json
  {
    "emailOrPhone": "pilot@synkrew.dev",
    "code": "482910",
    "flow": "signup"
  }
  ```
- **Response Body (`200 OK`)**: Same as `AuthResponse` above.

#### `POST /auth/forgot-password`
- **Description**: Triggers password reset email with recovery token.
- **Auth Required**: No
- **Consuming Screens**: `app/(auth)/forgot-password.tsx`
- **Request Body**: `{ "email": "pilot@synkrew.dev" }`
- **Response Body (`200 OK`)**: `{ "success": true, "message": "Reset instructions dispatched." }`

#### `GET /auth/me`
- **Description**: Returns authenticated user profile session.
- **Auth Required**: Yes
- **Consuming Screens**: `app/_layout.tsx`, `app/(onboarding)/splash.tsx`
- **Response Body (`200 OK`)**: `AuthUser` object.

---

### 2.2 Groups Domain

#### `GET /groups`
- **Description**: Lists all active/archived groups the authenticated user belongs to.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/index.tsx`, `app/(main)/groups.tsx`
- **Response Body (`200 OK`)**:
  ```json
  [
    {
      "id": "grp_neon_runners",
      "name": "NEON RUNNERS",
      "description": "Daily 5K sprints and morning accountability rituals.",
      "creatorId": "user_master_99",
      "status": "active",
      "cycleLengthDays": 30,
      "dailyStakePercent": 60,
      "memberCap": 10,
      "currentMemberCount": 5,
      "currentCycleId": "cyc_001",
      "currentCycleDay": 12,
      "level": 42,
      "createdAt": "2026-02-01T00:00:00Z",
      "isPrivate": false
    }
  ]
  ```

#### `GET /groups/{groupId}`
- **Description**: Detailed group hub data including members, streak, today's status, and cycle progress.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/detail.tsx`, `app/(groups)/settings.tsx`
- **Response Body (`200 OK`)**:
  ```json
  {
    "group": { ...Group },
    "currentUserMembership": {
      "id": "mem_01",
      "groupId": "grp_neon_runners",
      "userId": "user_master_99",
      "username": "KrewMaster99",
      "role": "creator",
      "currentStreak": 12,
      "longestStreak": 24,
      "totalStakeLocked": 120,
      "joinedAt": "2026-02-01T00:00:00Z",
      "status": "active"
    },
    "members": [ ...GroupMembership[] ],
    "todayTasks": [ ...TaskInstance[] ],
    "currentCycle": { ...BasePeriodCycle },
    "cycleProgressPercent": 40
  }
  ```

#### `POST /groups`
- **Description**: Creates a new group pact with creator's initial task definitions & schedules.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/create/*`
- **Request Body**:
  ```json
  {
    "name": "NEON RUNNERS",
    "description": "Daily 5K sprints.",
    "cycleLengthDays": 30,
    "dailyStakePercent": 60,
    "initialTasks": [
      {
        "title": "5K_OUTDOOR_RUN",
        "frequency": "DAILY",
        "target": 1,
        "assignedDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
      }
    ]
  }
  ```
- **Response Body (`201 Created`)**: `Group` object.

#### `GET /groups/invites/{inviteCode}`
- **Description**: Resolves invite code to group metadata or error terminal reason.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/join.tsx`, `app/(groups)/join/*`
- **Response Body (`200 OK`)**:
  ```json
  {
    "code": "KREW-99X",
    "groupId": "grp_neon_runners",
    "groupName": "NEON RUNNERS",
    "creatorHandle": "@KrewMaster99",
    "memberCount": 4,
    "memberCap": 10,
    "cycleLengthDays": 30,
    "dailyStakePercent": 60,
    "isPrivate": false,
    "status": "valid"
  }
  ```
  *(Status enum: `valid` | `invalid` | `expired` | `full` | `already_member` | `banned` | `revoked`)*

#### `POST /groups/join`
- **Description**: Accepts invite and enrolls member with their own 3 defined tasks & 7-day schedule.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/schedule-tasks.tsx`, `app/(groups)/join/confirmation.tsx`
- **Request Body**:
  ```json
  {
    "inviteCode": "KREW-99X",
    "tasks": [
      { "title": "5K_OUTDOOR_RUN", "frequency": "DAILY", "target": 1 },
      { "title": "MEDITATION_15M", "frequency": "DAILY", "target": 1 }
    ],
    "schedule": {
      "MONDAY": ["task_1", "task_2"],
      "TUESDAY": ["task_1"],
      "WEDNESDAY": ["task_1", "task_2"],
      "THURSDAY": ["task_1"],
      "FRIDAY": ["task_1", "task_2"],
      "SATURDAY": ["task_1"],
      "SUNDAY": ["task_2"]
    }
  }
  ```
- **Response Body (`200 OK`)**: `{ "success": true, "group": { ...Group } }`

#### `PATCH /groups/{groupId}/status`
- **Description**: Updates group lifecycle (`active` | `paused` | `archived`). Creator-only.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/settings.tsx`
- **Request Body**: `{ "status": "paused" }`

#### `POST /groups/{groupId}/transfer`
- **Description**: Transfers creator ownership to another member.
- **Auth Required**: Yes (Creator only)
- **Consuming Screens**: `app/(groups)/settings/transfer.tsx`
- **Request Body**: `{ "newCreatorUserId": "user_pixel" }`

#### `DELETE /groups/{groupId}`
- **Description**: Permanently archives / deletes group.
- **Auth Required**: Yes (Creator only)
- **Consuming Screens**: `app/(groups)/settings/delete.tsx`

---

### 2.3 Tasks & Scheduling Domain

#### `GET /groups/{groupId}/member-tasks`
- **Description**: Returns authenticated member's personal task definitions for that group.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/settings/tasks.tsx`
- **Response Body (`200 OK`)**: `TaskDefinition[]`

#### `PUT /groups/{groupId}/member-tasks`
- **Description**: Saves/updates member's task definitions (max 3, min 1).
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/settings/tasks.tsx`, `app/(groups)/define-tasks.tsx`
- **Request Body**:
  ```json
  {
    "tasks": [
      { "id": "task_1", "title": "5K_RUN", "frequency": "DAILY", "target": 1, "isPaused": false },
      { "title": "READ_20_PAGES", "frequency": "DAILY", "target": 1, "isPaused": false }
    ]
  }
  ```

#### `GET /groups/{groupId}/schedule`
- **Description**: Returns member's 7-day schedule map.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/settings/schedule.tsx`
- **Response Body (`200 OK`)**: `{ "MONDAY": ["task_1"], "TUESDAY": ["task_1", "task_2"], ... }`

#### `PUT /groups/{groupId}/schedule`
- **Description**: Updates member's 7-day schedule (every day must have ≥1 task).
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/settings/schedule.tsx`, `app/(groups)/schedule-tasks.tsx`
- **Request Body**: `{ "schedule": { ...DayScheduleMap } }`

#### `GET /tasks/today`
- **Description**: Returns today's active task instances across all joined groups.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(groups)/detail.tsx`, `app/(task)/*`
- **Response Body (`200 OK`)**: `TaskInstance[]`

#### `POST /tasks/{taskInstanceId}/submit`
- **Description**: Submits front/back photo proof, device timestamp, and geo-coordinates.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(task)/capture.tsx`, `app/(task)/uploading.tsx`
- **Request Body (Multipart or JSON with storage URLs)**:
  ```json
  {
    "taskInstanceId": "inst_01",
    "frontPhotoUri": "https://storage.synkrew.dev/proofs/front_01.jpg",
    "backPhotoUri": "https://storage.synkrew.dev/proofs/back_01.jpg",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "deviceTimestamp": "2026-08-30T07:14:22Z"
  }
  ```

---

### 2.4 Verification Domain

#### `GET /verification/queue`
- **Description**: Returns pending proof cards assigned to current user for peer review.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(verify)/index.tsx`
- **Response Body (`200 OK`)**: `VerificationQueueItem[]`

#### `POST /verification/vote`
- **Description**: Casts approval or rejection with reason.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(verify)/index.tsx`
- **Request Body**:
  ```json
  {
    "taskInstanceId": "inst_p1",
    "decision": "approve",
    "reason": null
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "success": true,
    "resolvedStatus": "verified",
    "remainingVotesNeeded": 0
  }
  ```

---

### 2.5 Settlement & Cycles Domain

#### `GET /groups/{groupId}/cycles/{cycleId}/results`
- **Description**: Cycle settlement report, total net coin change, and squad leaderboard.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(settlement)/cycle-results.tsx`
- **Response Body (`200 OK`)**: `CycleResultsResponse`

#### `GET /groups/{groupId}/settlement/daily`
- **Description**: Daily forfeit redistribution summary & user win share earnings.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(settlement)/daily-summary.tsx`
- **Response Body (`200 OK`)**: `DailySettlementSummary`

#### `GET /groups/{groupId}/milestones`
- **Description**: Milestone progress thresholds (50%, 75%, 100%) and unlocked bonuses.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(settlement)/milestone.tsx`
- **Response Body (`200 OK`)**: `MilestoneProgress[]`

---

### 2.6 Wallet & Transactions Domain

#### `GET /wallet/balance`
- **Description**: Available coins, locked stake coins, total balance, and today's estimated stake risk.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(wallet)/index.tsx`
- **Response Body (`200 OK`)**: `WalletBalance`

#### `GET /wallet/transactions`
- **Description**: Chronological transaction history including stake locks, returns, win shares, and bonuses.
- **Query Params**: `groupId` (optional), `page`, `limit`
- **Auth Required**: Yes
- **Consuming Screens**: `app/(wallet)/history.tsx`
- **Response Body (`200 OK`)**: `WalletHistoryResponse`

---

### 2.7 League Domain

#### `GET /league/standings`
- **Description**: Seasonal leaderboard standings, group points, and promotion tiers.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(league)/index.tsx`, `app/(groups)/league.tsx`
- **Response Body (`200 OK`)**: `LeagueLeaderboardResponse`

---

### 2.8 Subscription Domain

#### `GET /subscriptions/plans`
- **Description**: Free vs. Premium comparison matrix and feature tiers.
- **Auth Required**: No / Optional
- **Consuming Screens**: `app/(subscription)/index.tsx`, `app/(subscription)/upsell.tsx`
- **Response Body (`200 OK`)**: `SubscriptionPlan[]`

#### `GET /subscriptions/me`
- **Description**: Active user tier, status, and renewal period.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(subscription)/index.tsx`, `app/(profile)/index.tsx`
- **Response Body (`200 OK`)**: `UserSubscription`

#### `POST /subscriptions/upgrade`
- **Description**: Initiates subscription upgrade to Premium.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(subscription)/processing.tsx`
- **Request Body**: `{ "planTier": "premium", "paymentToken": "tok_..." }`

---

### 2.9 Notifications Domain

#### `GET /notifications`
- **Description**: Global inbox notifications list.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(notifications)/index.tsx`
- **Response Body (`200 OK`)**: `AppNotification[]`

#### `PATCH /notifications/{notificationId}/read`
- **Description**: Marks notification as read.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(notifications)/index.tsx`

#### `GET /notifications/preferences`
- **Description**: User notification category preferences.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(profile)/notifications.tsx`
- **Response Body (`200 OK`)**: `NotificationPreferences`

#### `PUT /notifications/preferences`
- **Description**: Updates user notification category preferences.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(profile)/notifications.tsx`
- **Request Body**: `Partial<NotificationPreferences>`

---

### 2.10 Profile & Account Domain

#### `GET /profile/me`
- **Description**: Authenticated user stats, streak metrics, and badge showcase.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(profile)/index.tsx`, `app/(profile)/settings.tsx`
- **Response Body (`200 OK`)**: `UserProfile`

#### `PUT /profile/me`
- **Description**: Updates handle, email, or avatar.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(profile)/settings.tsx`
- **Request Body**: `UpdateProfileRequest`

#### `DELETE /profile/me`
- **Description**: Requests permanent account deletion.
- **Auth Required**: Yes
- **Consuming Screens**: `app/(profile)/delete-confirm.tsx`

---

## 3. Open Product Decisions & Backend Flags

> [!IMPORTANT]
> The backend developer should be aware of the following unresolved product points when implementing database triggers and calculation jobs:

1. **Percentage Stake Rounding Rule (UX Plan §15, §2.9a)**:
   - When calculating `stake = balance × (stake_% / 100)`, fractional coins will occur (e.g. `120 × 0.60 = 72`, then on loss `48 × 0.60 = 28.8`).
   - *Current frontend assumption:* `Math.round(val)` to nearest integer.
   - *Backend dependency:* Confirm whether coins are stored as integers or decimals with integer display rounding.

2. **Zero-Floor Stake Behavior**:
   - A losing streak asymptotically approaches zero.
   - *Current frontend assumption:* Minimum 1 coin stake required if balance > 0.

3. **Task Deletion Schedule Fallback (UX Plan §15, §2.13a)**:
   - If a member deletes a task that leaves a scheduled day with 0 active tasks:
   - *Current frontend assumption:* **Block-until-reassigned** (member cannot delete or uncheck until a replacement task is designated).

4. **League Points Formula (UX Plan §15, §2.8)**:
   - *Proposed formula:* `50% Task Consistency + 50% Verification Consistency`.
   - *Backend dependency:* Define exact points per completed task, streak multiplier, and seasonal season reset cadence.
