/**
 * SynKrew — Subscription & Tier Limits Service Boundary
 * Path: services/subscription.ts
 *
 * Implements capacity tier upgrades and limit verification.
 * Enforces principle: "Premium is a capacity upgrade, not an economy upgrade."
 */

import {
  SubscriptionPlan,
  UserSubscription,
  UpgradePlanRequest,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_free',
    tier: 'free',
    name: 'ARCADE FREE',
    priceMonthlyUsd: 0,
    maxGroupsJoined: 2,
    maxMembersPerGroup: 10,
    features: [
      'Join up to 2 active groups',
      'Max 10 members per group',
      'Standard daily verification',
      'Standard streak tracking',
    ],
  },
  {
    id: 'plan_premium',
    tier: 'premium',
    name: 'SYNCREW PRO',
    priceMonthlyUsd: 4.99,
    maxGroupsJoined: 5,
    maxMembersPerGroup: 20,
    features: [
      'Join up to 5 active groups',
      'Max 20 members per group',
      'Standard daily verification',
      'Standard streak tracking',
    ],
  },
];

let currentUserSub: UserSubscription = {
  id: 'sub_user_001',
  userId: 'user_master_99',
  planId: 'plan_free',
  tier: 'free',
  status: 'active',
  currentPeriodEnd: '2026-12-31T23:59:59Z',
};

export const SubscriptionService = {
  /**
   * Fetch all available subscription plans for comparison table.
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    await simulateNetworkDelay();
    return [...SUBSCRIPTION_PLANS];
  },

  /**
   * Fetch current user's active subscription tier and limits.
   */
  async getUserSubscription(): Promise<UserSubscription> {
    await simulateNetworkDelay();
    return { ...currentUserSub };
  },

  /**
   * Upgrade user subscription to Premium.
   */
  async upgradeSubscription(payload: UpgradePlanRequest): Promise<UserSubscription> {
    await simulateNetworkDelay(500);
    currentUserSub = {
      ...currentUserSub,
      planId: 'plan_premium',
      tier: 'premium',
      status: 'active',
    };
    return { ...currentUserSub };
  },

  /**
   * Cancel active paid subscription.
   */
  async cancelSubscription(): Promise<UserSubscription> {
    await simulateNetworkDelay();
    currentUserSub = {
      ...currentUserSub,
      status: 'cancelled',
    };
    return { ...currentUserSub };
  },
};
