/**
 * SynKrew — Profile & Account Query & Mutation Hooks
 * Path: hooks/queries/useProfile.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '../../services/profile';
import { UpdateProfileRequest } from '../../types/api';

export const PROFILE_QUERY_KEY = ['profile', 'currentUser'] as const;

export function useUserProfileQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => ProfileService.getUserProfile(),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) =>
      ProfileService.updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ProfileService.deleteAccount(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
