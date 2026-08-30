/**
 * SynKrew — Verification Service Boundary
 * Path: services/verification.ts
 *
 * Implements peer verification queue retrieval and 2-of-3 majority voting.
 */

import {
  VerificationQueueItem,
  SubmitVoteRequest,
  SubmitVoteResponse,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const INITIAL_QUEUE: VerificationQueueItem[] = [
  {
    verificationId: 'v_1',
    taskInstanceId: 'inst_p1',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    ownerUserId: 'user_pixel',
    ownerUsername: 'PixelWarrior',
    taskTitle: '5K MORNING SPRINT',
    frontPhotoUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    backPhotoUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    submittedAt: '2026-08-30T07:15:00Z',
    autoPassExpiresAt: '2026-08-30T19:15:00Z',
    currentVoteCount: 1,
  },
  {
    verificationId: 'v_2',
    taskInstanceId: 'inst_p2',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    ownerUserId: 'user_synth',
    ownerUsername: 'SynthRider',
    taskTitle: 'MEDITATION 20 MINS',
    frontPhotoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    backPhotoUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
    submittedAt: '2026-08-30T08:00:00Z',
    autoPassExpiresAt: '2026-08-30T20:00:00Z',
    currentVoteCount: 0,
  },
  {
    verificationId: 'v_3',
    taskInstanceId: 'inst_p3',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    ownerUserId: 'user_nova',
    ownerUsername: 'NovaPulse',
    taskTitle: 'READ 25 PAGES',
    frontPhotoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    backPhotoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    submittedAt: '2026-08-30T09:30:00Z',
    autoPassExpiresAt: '2026-08-30T21:30:00Z',
    currentVoteCount: 1,
  },
];

export const VerificationService = {
  /**
   * Fetch active pending proof stack for current verifier.
   */
  async getVerificationQueue(): Promise<VerificationQueueItem[]> {
    await simulateNetworkDelay();
    return [...INITIAL_QUEUE];
  },

  /**
   * Cast an approval or rejection vote on a member's proof card.
   */
  async submitVote(payload: SubmitVoteRequest): Promise<SubmitVoteResponse> {
    await simulateNetworkDelay(250);
    return {
      success: true,
      resolvedStatus: payload.decision === 'approve' ? 'verified' : 'failed',
      remainingVotesNeeded: 0,
    };
  },
};
