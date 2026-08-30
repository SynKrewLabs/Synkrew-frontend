/**
 * SynKrew — League & Leaderboard Query Hooks
 * Path: hooks/queries/useLeague.ts
 */

import { useQuery } from '@tanstack/react-query';
import { LeagueService } from '../../services/league';

export const LEAGUE_QUERY_KEY = ['league', 'standings'] as const;

export function useLeagueStandingsQuery(seasonId?: string) {
  return useQuery({
    queryKey: [...LEAGUE_QUERY_KEY, seasonId || 'current'],
    queryFn: () => LeagueService.getLeagueStandings(seasonId),
  });
}
