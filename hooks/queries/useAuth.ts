/**
 * SynKrew — Auth Query & Mutation Hooks
 * Path: hooks/queries/useAuth.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../../services/auth';
import { LoginRequest, SignupRequest, VerifyOtpRequest } from '../../types/api';

export const AUTH_QUERY_KEY = ['auth', 'currentUser'] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => AuthService.getCurrentUser(),
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginRequest) => AuthService.login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignupRequest) => AuthService.signup(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    },
  });
}

export function useVerifyOtpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => AuthService.verifyOtp(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
