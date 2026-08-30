/**
 * SynKrew — Groups Query & Mutation Hooks
 * Path: hooks/queries/useGroups.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupsService } from '../../services/groups';
import {
  CreateGroupRequest,
  JoinGroupRequest,
  GroupStatus,
  TransferGroupOwnershipRequest,
} from '../../types/api';

export const GROUPS_QUERY_KEYS = {
  all: ['groups'] as const,
  lists: () => [...GROUPS_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...GROUPS_QUERY_KEYS.all, 'detail', id] as const,
  invite: (code: string) => [...GROUPS_QUERY_KEYS.all, 'invite', code] as const,
};

export function useGroupsQuery() {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.lists(),
    queryFn: () => GroupsService.getGroups(),
  });
}

export function useGroupDetailQuery(groupId: string) {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.detail(groupId),
    queryFn: () => GroupsService.getGroupDetail(groupId),
    enabled: !!groupId,
  });
}

export function useInvitePreviewQuery(inviteCode: string) {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.invite(inviteCode),
    queryFn: () => GroupsService.getInvitePreview(inviteCode),
    enabled: !!inviteCode,
  });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupRequest) => GroupsService.createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.lists() });
    },
  });
}

export function useJoinGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JoinGroupRequest) => GroupsService.joinGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateGroupStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, status }: { groupId: string; status: GroupStatus }) =>
      GroupsService.updateGroupStatus(groupId, status),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.lists() });
    },
  });
}

export function useTransferOwnershipMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransferGroupOwnershipRequest) =>
      GroupsService.transferOwnership(payload),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.detail(groupId) });
    },
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => GroupsService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.lists() });
    },
  });
}
