/**
 * SynKrew — Notifications Query & Mutation Hooks
 * Path: hooks/queries/useNotifications.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationsService } from '../../services/notifications';
import { NotificationPreferences } from '../../types/api';

export const NOTIFICATIONS_QUERY_KEYS = {
  all: ['notifications'] as const,
  list: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'list'] as const,
  preferences: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'preferences'] as const,
};

export function useNotificationsQuery() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.list(),
    queryFn: () => NotificationsService.getNotifications(),
  });
}

export function useNotificationPreferencesQuery() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.preferences(),
    queryFn: () => NotificationsService.getNotificationPreferences(),
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationsService.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.list() });
    },
  });
}

export function useUpdateNotificationPreferencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<NotificationPreferences>) =>
      NotificationsService.updateNotificationPreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.preferences() });
    },
  });
}
