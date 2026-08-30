/**
 * SynKrew — Tasks & Scheduling Query & Mutation Hooks
 * Path: hooks/queries/useTasks.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TasksService } from '../../services/tasks';
import {
  SaveTaskDefinitionsRequest,
  SaveTaskScheduleRequest,
  TaskSubmissionRequest,
} from '../../types/api';

export const TASKS_QUERY_KEYS = {
  all: ['tasks'] as const,
  definitions: (groupId: string) => [...TASKS_QUERY_KEYS.all, 'definitions', groupId] as const,
  schedule: (groupId: string) => [...TASKS_QUERY_KEYS.all, 'schedule', groupId] as const,
  today: (groupId?: string) => [...TASKS_QUERY_KEYS.all, 'today', groupId || 'global'] as const,
};

export function useMemberTasksQuery(groupId: string) {
  return useQuery({
    queryKey: TASKS_QUERY_KEYS.definitions(groupId),
    queryFn: () => TasksService.getMemberTaskDefinitions(groupId),
    enabled: !!groupId,
  });
}

export function useTaskScheduleQuery(groupId: string) {
  return useQuery({
    queryKey: TASKS_QUERY_KEYS.schedule(groupId),
    queryFn: () => TasksService.getTaskSchedule(groupId),
    enabled: !!groupId,
  });
}

export function useTodayTasksQuery(groupId?: string) {
  return useQuery({
    queryKey: TASKS_QUERY_KEYS.today(groupId),
    queryFn: () => TasksService.getTodayTasks(groupId),
  });
}

export function useSaveTasksMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveTaskDefinitionsRequest) =>
      TasksService.saveTaskDefinitions(payload),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEYS.definitions(groupId) });
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEYS.today(groupId) });
    },
  });
}

export function useSaveScheduleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveTaskScheduleRequest) =>
      TasksService.saveTaskSchedule(payload),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEYS.schedule(groupId) });
    },
  });
}

export function useSubmitTaskProofMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TaskSubmissionRequest) =>
      TasksService.submitTaskProof(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEYS.today() });
    },
  });
}
