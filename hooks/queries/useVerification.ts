/**
 * SynKrew — Verification Query & Mutation Hooks
 * Path: hooks/queries/useVerification.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VerificationService } from '../../services/verification';
import { SubmitVoteRequest } from '../../types/api';

export const VERIFICATION_QUERY_KEY = ['verification', 'queue'] as const;

export function useVerificationQueueQuery() {
  return useQuery({
    queryKey: VERIFICATION_QUERY_KEY,
    queryFn: () => VerificationService.getVerificationQueue(),
  });
}

export function useSubmitVoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitVoteRequest) =>
      VerificationService.submitVote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_QUERY_KEY });
    },
  });
}
