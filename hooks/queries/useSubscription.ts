/**
 * SynKrew — Subscription & Tier Limits Query & Mutation Hooks
 * Path: hooks/queries/useSubscription.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService } from '../../services/subscription';
import { UpgradePlanRequest } from '../../types/api';

export const SUBSCRIPTION_QUERY_KEYS = {
  all: ['subscription'] as const,
  plans: () => [...SUBSCRIPTION_QUERY_KEYS.all, 'plans'] as const,
  userSub: () => [...SUBSCRIPTION_QUERY_KEYS.all, 'user'] as const,
};

export function useSubscriptionPlansQuery() {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEYS.plans(),
    queryFn: () => SubscriptionService.getSubscriptionPlans(),
  });
}

export function useUserSubscriptionQuery() {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEYS.userSub(),
    queryFn: () => SubscriptionService.getUserSubscription(),
  });
}

export function useUpgradeSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpgradePlanRequest) =>
      SubscriptionService.upgradeSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEYS.userSub() });
    },
  });
}

export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => SubscriptionService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEYS.userSub() });
    },
  });
}
