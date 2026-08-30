/**
 * SynKrew — Comprehensive API & ERD Typed Contracts
 * Path: types/api.ts
 *
 * Single source of truth for all entities, requests, and responses across domains.
 * Derived from ERD entities:
 *   - groups, group_memberships, task_definitions (member-scoped), task_schedules,
 *     task_instances, verifications, transactions, base_period_cycles,
 *     subscription_plans, user_subscriptions, group_league_standings, skip_day_grants.
 */

// ============================================================================
// 1. AUTH DOMAIN
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
  emailVerified: boolean;
}

export interface LoginRequest {
  emailOrUsername: string;
  password?: string;
  otpCode?: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password?: string;
  termsAccepted: boolean;
}

export interface VerifyOtpRequest {
  emailOrPhone: string;
  code: string;
  flow: 'signup' | 'login' | 'reset-password';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================================
// 2. GROUPS DOMAIN
// ============================================================================

export type GroupStatus = 'active' | 'paused' | 'archived';
export type MemberRole = 'creator' | 'admin' | 'member';

export interface Group {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  status: GroupStatus;
  cycleLengthDays: 7 | 30;
  dailyStakePercent: number; // e.g. 60 for 60%
  memberCap: number; // 10 for free, 20 for premium
  currentMemberCount: number;
  currentCycleId?: string;
  currentCycleDay: number;
  level: number;
  createdAt: string;
  isPrivate: boolean;
}

export interface GroupMembership {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  role: MemberRole;
  currentStreak: number;
  longestStreak: number;
  totalStakeLocked: number;
  joinedAt: string;
  status: 'active' | 'invited' | 'pending_approval' | 'banned' | 'left';
}

export interface GroupDetailResponse {
  group: Group;
  currentUserMembership: GroupMembership;
  members: GroupMembership[];
  todayTasks: TaskInstance[];
  currentCycle?: BasePeriodCycle;
  cycleProgressPercent: number;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  cycleLengthDays: 7 | 30;
  dailyStakePercent: number;
  initialTasks: Array<{
    title: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    target: number;
    assignedDays: string[];
  }>;
}

export interface JoinGroupRequest {
  inviteCode: string;
  tasks: Array<{
    title: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    target: number;
  }>;
  schedule: Record<string, string[]>;
}

export interface GroupInvitePreview {
  code: string;
  groupId: string;
  groupName: string;
  creatorHandle: string;
  memberCount: number;
  memberCap: number;
  cycleLengthDays: 7 | 30;
  dailyStakePercent: number;
  isPrivate: boolean;
  status: 'valid' | 'invalid' | 'expired' | 'full' | 'already_member' | 'banned' | 'revoked';
}

export interface TransferGroupOwnershipRequest {
  groupId: string;
  newCreatorUserId: string;
}

// ============================================================================
// 3. TASKS & SCHEDULING DOMAIN (Member-Scoped)
// ============================================================================

export interface TaskDefinition {
  id: string;
  groupMembershipId: string;
  title: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  target: number;
  isPaused: boolean;
  createdAt: string;
}

export interface TaskSchedule {
  id: string;
  taskDefinitionId: string;
  weekday: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
}

export type TaskInstanceStatus =
  | 'not_started'
  | 'capturing'
  | 'uploading'
  | 'pending_review'
  | 'verified'
  | 'failed'
  | 'auto_passed'
  | 'expired'
  | 'skipped';

export interface TaskInstance {
  id: string;
  taskDefinitionId: string;
  groupMembershipId: string;
  groupId: string;
  taskTitle: string;
  ownerUsername: string;
  targetDate: string; // YYYY-MM-DD
  status: TaskInstanceStatus;
  frontPhotoUrl?: string;
  backPhotoUrl?: string;
  geolocationLat?: number;
  geolocationLng?: number;
  deviceTimestamp?: string;
  approvalCount: number;
  rejectionCount: number;
  rejectReason?: string;
  autoPassDeadline?: string;
}

export interface TaskSubmissionRequest {
  taskInstanceId: string;
  frontPhotoUri: string;
  backPhotoUri: string;
  latitude?: number;
  longitude?: number;
  deviceTimestamp: string;
}

export interface SaveTaskDefinitionsRequest {
  groupId: string;
  tasks: Array<{
    id?: string;
    title: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    target: number;
    isPaused?: boolean;
  }>;
}

export interface SaveTaskScheduleRequest {
  groupId: string;
  schedule: Record<string, string[]>; // Weekday -> taskDefinitionId[]
}

// ============================================================================
// 4. VERIFICATION DOMAIN
// ============================================================================

export interface VerificationQueueItem {
  verificationId: string;
  taskInstanceId: string;
  groupId: string;
  groupName: string;
  ownerUserId: string;
  ownerUsername: string;
  taskTitle: string;
  frontPhotoUrl: string;
  backPhotoUrl: string;
  submittedAt: string;
  autoPassExpiresAt: string;
  currentVoteCount: number;
}

export interface SubmitVoteRequest {
  taskInstanceId: string;
  decision: 'approve' | 'reject';
  reason?: string;
}

export interface SubmitVoteResponse {
  success: boolean;
  resolvedStatus?: 'verified' | 'failed' | 'pending_review';
  remainingVotesNeeded: number;
}

// ============================================================================
// 5. SETTLEMENT & CYCLES DOMAIN
// ============================================================================

export interface BasePeriodCycle {
  id: string;
  groupId: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  cycleLengthDays: 7 | 30;
  totalForfeitedPool: number;
  isSettled: boolean;
  settledAt?: string;
}

export interface DailySettlementSummary {
  date: string;
  groupId: string;
  groupName: string;
  passingMembersCount: number;
  failingMembersCount: number;
  totalForfeitedCoins: number;
  winSharePerPasser: number;
  userOutcome: 'pass' | 'fail' | 'skip';
  userStakeReturned: number;
  userWinShareEarned: number;
}

export interface CycleResultsResponse {
  cycle: BasePeriodCycle;
  group: Group;
  userStats: {
    daysPassed: number;
    daysFailed: number;
    daysSkipped: number;
    netCoinChange: number;
    longestStreakAchieved: number;
    milestonesUnlocked: string[];
  };
  leaderboard: Array<{
    userId: string;
    username: string;
    avatarUrl?: string;
    passRatePercent: number;
    totalEarnedCoins: number;
  }>;
}

export interface MilestoneProgress {
  thresholdPercent: 50 | 75 | 100;
  isUnlocked: boolean;
  bonusCoinsEarned: number;
  unlockedAt?: string;
}

// ============================================================================
// 6. WALLET & TRANSACTIONS DOMAIN
// ============================================================================

export type TransactionType =
  | 'stake_locked'
  | 'stake_returned'
  | 'stake_forfeited'
  | 'win_share'
  | 'milestone_bonus'
  | 'penalty'
  | 'daily_checkin';

export interface WalletBalance {
  availableCoins: number;
  lockedCoins: number;
  totalCoins: number;
  todayEstimatedRisk: number;
  todayStakePercent: number;
}

export interface Transaction {
  id: string;
  userId: string;
  groupId?: string;
  groupName?: string;
  amount: number;
  type: TransactionType;
  description: string;
  stakeCalculationContext?: string; // e.g. "60% of 120 coins"
  settlementStatus: 'pending' | 'settled';
  createdAt: string;
}

export interface WalletHistoryResponse {
  balance: WalletBalance;
  transactions: Transaction[];
}

// ============================================================================
// 7. LEAGUE & GAMIFICATION DOMAIN
// ============================================================================

export interface GroupLeagueStanding {
  id: string;
  groupId: string;
  groupName: string;
  seasonId: string;
  rank: number;
  points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  taskConsistencyPercent: number;
  verificationConsistencyPercent: number;
  streakDays: number;
}

export interface LeagueLeaderboardResponse {
  seasonName: string;
  seasonEndsInDays: number;
  currentGroupRank?: number;
  standings: GroupLeagueStanding[];
}

// ============================================================================
// 8. SUBSCRIPTION DOMAIN
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  tier: 'free' | 'premium';
  name: string;
  priceMonthlyUsd: number;
  maxGroupsJoined: number; // 2 vs 5
  maxMembersPerGroup: number; // 10 vs 20
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodEnd: string;
}

export interface UpgradePlanRequest {
  planTier: 'premium';
  paymentToken?: string;
}

// ============================================================================
// 9. NOTIFICATIONS DOMAIN
// ============================================================================

export type NotificationType =
  | 'task_reminder'
  | 'verification_needed'
  | 'proof_verified'
  | 'proof_rejected'
  | 'cycle_ending'
  | 'settlement_completed'
  | 'milestone_reached'
  | 'league_rank_changed';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  deepLinkPath: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  taskReminders: boolean;
  verificationRequests: boolean;
  resultsAndSettlement: boolean;
  groupActivity: boolean;
  leagueUpdates: boolean;
  marketing: boolean;
}

export type UpdateNotificationPreferencesRequest = Partial<NotificationPreferences>;

// ============================================================================
// 10. PROFILE & USER PREFERENCES DOMAIN
// ============================================================================

export interface UserBadge {
  id: string;
  code: string;
  title: string;
  icon: string;
  earnedAt: string;
  description: string;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  activePactsCount: number;
  totalProofsCompleted: number;
  verificationApprovalRate: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  streaks: StreakStats;
  badges: UserBadge[];
  subscriptionTier: 'free' | 'premium';
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatarUrl?: string;
}
