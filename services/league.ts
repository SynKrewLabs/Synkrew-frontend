/**
 * SynKrew — League & Standings Service Boundary
 * Path: services/league.ts
 *
 * Implements group seasonal rankings and leaderboard standings.
 */

import {
  GroupLeagueStanding,
  LeagueLeaderboardResponse,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const MOCK_STANDINGS: GroupLeagueStanding[] = [
  {
    id: 'l_1',
    groupId: 'grp_alpha_squad',
    groupName: 'ALPHA SQUAD',
    seasonId: 'season_01',
    rank: 1,
    points: 4820,
    tier: 'DIAMOND',
    taskConsistencyPercent: 98,
    verificationConsistencyPercent: 96,
    streakDays: 45,
  },
  {
    id: 'l_2',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    seasonId: 'season_01',
    rank: 2,
    points: 4210,
    tier: 'DIAMOND',
    taskConsistencyPercent: 94,
    verificationConsistencyPercent: 92,
    streakDays: 30,
  },
  {
    id: 'l_3',
    groupId: 'grp_midnight_coders',
    groupName: 'MIDNIGHT CODERZ',
    seasonId: 'season_01',
    rank: 3,
    points: 3950,
    tier: 'GOLD',
    taskConsistencyPercent: 90,
    verificationConsistencyPercent: 88,
    streakDays: 22,
  },
  {
    id: 'l_4',
    groupId: 'grp_zen_masters',
    groupName: 'ZEN MASTERS',
    seasonId: 'season_01',
    rank: 4,
    points: 3400,
    tier: 'GOLD',
    taskConsistencyPercent: 86,
    verificationConsistencyPercent: 84,
    streakDays: 18,
  },
];

export const LeagueService = {
  /**
   * Fetch current active season standings and leaderboard.
   */
  async getLeagueStandings(seasonId?: string): Promise<LeagueLeaderboardResponse> {
    await simulateNetworkDelay();
    return {
      seasonName: 'SEASON 01: ARCADE GENESIS',
      seasonEndsInDays: 14,
      currentGroupRank: 2,
      standings: [...MOCK_STANDINGS],
    };
  },
};
