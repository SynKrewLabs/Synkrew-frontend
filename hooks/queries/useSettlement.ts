/**
 * SynKrew — Settlement & Cycles Query Hooks
 * Path: hooks/queries/useSettlement.ts
 */

import { useQuery } from '@tanstack/react-query';
import { SettlementService } from '../../services/settlement';

export const SETTLEMENT_QUERY_KEYS = {
  all: ['settlement'] as const,
  results: (groupId: string, cycleId?: string) =>
    [...SETTLEMENT_QUERY_KEYS.all, 'results', groupId, cycleId || 'latest'] as const,
  dailySummary: (groupId: string, date?: string) =>
    [...SETTLEMENT_QUERY_KEYS.all, 'daily', groupId, date || 'today'] as const,
  milestones: (groupId: string) =>
    [...SETTLEMENT_QUERY_KEYS.all, 'milestones', groupId] as const,
};

export function useCycleResultsQuery(groupId: string, cycleId?: string) {
  return useQuery({
    queryKey: SETTLEMENT_QUERY_KEYS.results(groupId, cycleId),
    queryFn: () => SettlementService.getCycleResults(groupId, cycleId),
    enabled: !!groupId,
  });
}

export function useDailySummaryQuery(groupId: string, date?: string) {
  return useQuery({
    queryKey: SETTLEMENT_QUERY_KEYS.dailySummary(groupId, date),
    queryFn: () => SettlementService.getDailySummary(groupId, date),
    enabled: !!groupId,
  });
}

export function useMilestonesQuery(groupId: string) {
  return useQuery({
    queryKey: SETTLEMENT_QUERY_KEYS.milestones(groupId),
    queryFn: () => SettlementService.getMilestones(groupId),
    enabled: !!groupId,
  });
}
