/**
 * SynKrew — Profile & Account Service Boundary
 * Path: services/profile.ts
 *
 * Implements user profile, streaks, badges, and account preferences.
 */

import {
  UserProfile,
  UpdateProfileRequest,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const INITIAL_PROFILE: UserProfile = {
  id: 'user_master_99',
  username: 'KrewMaster99',
  email: 'pilot@synkrew.dev',
  createdAt: '2026-01-01T00:00:00Z',
  subscriptionTier: 'free',
  streaks: {
    currentStreak: 12,
    longestStreak: 24,
    activePactsCount: 2,
    totalProofsCompleted: 84,
    verificationApprovalRate: 98,
  },
  badges: [
    {
      id: 'badge_1',
      code: 'FIRST_PACT',
      title: 'FOUNDING PACT',
      icon: '🤝',
      earnedAt: '2026-01-02T00:00:00Z',
      description: 'Initialized first accountability circle.',
    },
    {
      id: 'badge_2',
      code: 'STREAK_7',
      title: '7-DAY RUNNER',
      icon: '⚡',
      earnedAt: '2026-01-08T00:00:00Z',
      description: 'Cleared 7 consecutive verified tasks.',
    },
    {
      id: 'badge_3',
      code: 'VERIFIER_10',
      title: 'SHARP EYE',
      icon: '👁️',
      earnedAt: '2026-01-15T00:00:00Z',
      description: 'Voted on 10 peer verification proofs.',
    },
  ],
};

let currentProfile = { ...INITIAL_PROFILE };

export const ProfileService = {
  /**
   * Fetch authenticated user's profile, streaks, and earned badges.
   */
  async getUserProfile(): Promise<UserProfile> {
    await simulateNetworkDelay();
    return { ...currentProfile };
  },

  /**
   * Update profile details (username, avatar, etc.).
   */
  async updateUserProfile(payload: UpdateProfileRequest): Promise<UserProfile> {
    await simulateNetworkDelay();
    currentProfile = {
      ...currentProfile,
      ...payload,
    };
    return { ...currentProfile };
  },

  /**
   * Delete account permanently.
   */
  async deleteAccount(): Promise<{ success: boolean }> {
    await simulateNetworkDelay(400);
    return { success: true };
  },
};
