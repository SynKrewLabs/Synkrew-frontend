/**
 * SynKrew — Settlement & Cycles Service Boundary
 * Path: services/settlement.ts
 *
 * Implements cycle settlement results, daily forfeit redistribution summaries,
 * and milestone progress.
 */

import {
  CycleResultsResponse,
  DailySettlementSummary,
  MilestoneProgress,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

export const SettlementService = {
  /**
   * Fetch complete end-of-cycle settlement results and rankings.
   */
  async getCycleResults(groupId: string, cycleId?: string): Promise<CycleResultsResponse> {
    await simulateNetworkDelay();
    return {
      cycle: {
        id: cycleId || 'cyc_001',
        groupId,
        cycleNumber: 1,
        startDate: '2026-02-01T00:00:00Z',
        endDate: '2026-03-02T00:00:00Z',
        cycleLengthDays: 30,
        totalForfeitedPool: 360,
        isSettled: true,
        settledAt: '2026-03-02T23:59:59Z',
      },
      group: {
        id: groupId,
        name: 'NEON RUNNERS',
        description: 'Daily 5K sprints and morning accountability rituals.',
        creatorId: 'user_master_99',
        status: 'active',
        cycleLengthDays: 30,
        dailyStakePercent: 60,
        memberCap: 10,
        currentMemberCount: 5,
        currentCycleDay: 30,
        level: 42,
        createdAt: '2026-02-01T00:00:00Z',
        isPrivate: false,
      },
      userStats: {
        daysPassed: 28,
        daysFailed: 2,
        daysSkipped: 0,
        netCoinChange: +145,
        longestStreakAchieved: 24,
        milestonesUnlocked: ['50% CYCLE CLEAR', '75% CYCLE CLEAR', 'PERFECT SPRINT'],
      },
      leaderboard: [
        { userId: 'user_master_99', username: 'KrewMaster99', passRatePercent: 93, totalEarnedCoins: 145 },
        { userId: 'user_pixel', username: 'PixelWarrior', passRatePercent: 87, totalEarnedCoins: 90 },
        { userId: 'user_synth', username: 'SynthRider', passRatePercent: 80, totalEarnedCoins: 45 },
      ],
    };
  },

  /**
   * Fetch daily forfeit redistribution and win share summary.
   */
  async getDailySummary(groupId: string, date?: string): Promise<DailySettlementSummary> {
    await simulateNetworkDelay();
    return {
      date: date || new Date().toISOString().split('T')[0],
      groupId,
      groupName: 'NEON RUNNERS',
      passingMembersCount: 4,
      failingMembersCount: 1,
      totalForfeitedCoins: 60,
      winSharePerPasser: 15,
      userOutcome: 'pass',
      userStakeReturned: 72,
      userWinShareEarned: 15,
    };
  },

  /**
   * Fetch milestone tier progress for active cycle.
   */
  async getMilestones(groupId: string): Promise<MilestoneProgress[]> {
    await simulateNetworkDelay();
    return [
      { thresholdPercent: 50, isUnlocked: true, bonusCoinsEarned: 25, unlockedAt: '2026-02-15T00:00:00Z' },
      { thresholdPercent: 75, isUnlocked: true, bonusCoinsEarned: 50, unlockedAt: '2026-02-22T00:00:00Z' },
      { thresholdPercent: 100, isUnlocked: false, bonusCoinsEarned: 100 },
    ];
  },
};
