/**
 * SynKrew — Groups Service Boundary
 * Path: services/groups.ts
 *
 * Implements mock backend methods with realistic network latency and typed contracts.
 */

import {
  Group,
  GroupDetailResponse,
  CreateGroupRequest,
  JoinGroupRequest,
  GroupInvitePreview,
  GroupStatus,
  TransferGroupOwnershipRequest,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const INITIAL_MOCK_GROUPS: Group[] = [
  {
    id: 'grp_neon_runners',
    name: 'NEON RUNNERS',
    description: 'Daily 5K sprints and morning accountability rituals.',
    creatorId: 'user_master_99',
    status: 'active',
    cycleLengthDays: 30,
    dailyStakePercent: 60,
    memberCap: 10,
    currentMemberCount: 5,
    currentCycleId: 'cyc_001',
    currentCycleDay: 12,
    level: 42,
    createdAt: '2026-02-01T00:00:00Z',
    isPrivate: false,
  },
  {
    id: 'grp_code_grind',
    name: 'MIDNIGHT CODERZ',
    description: 'Ship code every single day. No excuses.',
    creatorId: 'user_alice',
    status: 'active',
    cycleLengthDays: 7,
    dailyStakePercent: 50,
    memberCap: 10,
    currentMemberCount: 8,
    currentCycleId: 'cyc_002',
    currentCycleDay: 4,
    level: 19,
    createdAt: '2026-02-15T00:00:00Z',
    isPrivate: true,
  },
];

export const GroupsService = {
  /**
   * Fetch all active groups for current user.
   */
  async getGroups(): Promise<Group[]> {
    await simulateNetworkDelay();
    return [...INITIAL_MOCK_GROUPS];
  },

  /**
   * Fetch full group details including members and today's status.
   */
  async getGroupDetail(groupId: string): Promise<GroupDetailResponse> {
    await simulateNetworkDelay();
    const group = INITIAL_MOCK_GROUPS.find(g => g.id === groupId) || {
      ...INITIAL_MOCK_GROUPS[0],
      id: groupId,
    };

    return {
      group,
      currentUserMembership: {
        id: `mem_user_${groupId}`,
        groupId,
        userId: 'user_master_99',
        username: 'KrewMaster99',
        role: group.creatorId === 'user_master_99' ? 'creator' : 'member',
        currentStreak: 12,
        longestStreak: 24,
        totalStakeLocked: 120,
        joinedAt: '2026-02-01T00:00:00Z',
        status: 'active',
      },
      members: [
        {
          id: 'mem_1',
          groupId,
          userId: 'user_master_99',
          username: 'KrewMaster99',
          role: 'creator',
          currentStreak: 12,
          longestStreak: 24,
          totalStakeLocked: 120,
          joinedAt: '2026-02-01T00:00:00Z',
          status: 'active',
        },
        {
          id: 'mem_2',
          groupId,
          userId: 'user_pixel',
          username: 'PixelWarrior',
          role: 'member',
          currentStreak: 8,
          longestStreak: 14,
          totalStakeLocked: 85,
          joinedAt: '2026-02-02T00:00:00Z',
          status: 'active',
        },
        {
          id: 'mem_3',
          groupId,
          userId: 'user_synth',
          username: 'SynthRider',
          role: 'member',
          currentStreak: 4,
          longestStreak: 19,
          totalStakeLocked: 60,
          joinedAt: '2026-02-03T00:00:00Z',
          status: 'active',
        },
      ],
      todayTasks: [
        {
          id: 'inst_1',
          taskDefinitionId: 'task_1',
          groupMembershipId: `mem_user_${groupId}`,
          groupId,
          taskTitle: '5K_OUTDOOR_RUN',
          ownerUsername: 'KrewMaster99',
          targetDate: new Date().toISOString().split('T')[0],
          status: 'not_started',
          approvalCount: 0,
          rejectionCount: 0,
        },
        {
          id: 'inst_2',
          taskDefinitionId: 'task_2',
          groupMembershipId: `mem_user_${groupId}`,
          groupId,
          taskTitle: 'READ_20_PAGES',
          ownerUsername: 'KrewMaster99',
          targetDate: new Date().toISOString().split('T')[0],
          status: 'verified',
          approvalCount: 2,
          rejectionCount: 0,
        },
      ],
      currentCycle: {
        id: group.currentCycleId || 'cyc_001',
        groupId,
        cycleNumber: 1,
        startDate: '2026-02-01T00:00:00Z',
        endDate: '2026-03-02T00:00:00Z',
        cycleLengthDays: group.cycleLengthDays,
        totalForfeitedPool: 240,
        isSettled: false,
      },
      cycleProgressPercent: Math.round((group.currentCycleDay / group.cycleLengthDays) * 100),
    };
  },

  /**
   * Create a new group with creator task definitions & schedules.
   */
  async createGroup(payload: CreateGroupRequest): Promise<Group> {
    await simulateNetworkDelay();
    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: payload.name,
      description: payload.description,
      creatorId: 'user_master_99',
      status: 'active',
      cycleLengthDays: payload.cycleLengthDays,
      dailyStakePercent: payload.dailyStakePercent,
      memberCap: 10,
      currentMemberCount: 1,
      currentCycleDay: 1,
      level: 1,
      createdAt: new Date().toISOString(),
      isPrivate: false,
    };
    return newGroup;
  },

  /**
   * Join an existing group using invite code with member's tasks.
   */
  async joinGroup(payload: JoinGroupRequest): Promise<{ success: boolean; group: Group }> {
    await simulateNetworkDelay();
    const group = INITIAL_MOCK_GROUPS[0];
    return {
      success: true,
      group: {
        ...group,
        currentMemberCount: group.currentMemberCount + 1,
      },
    };
  },

  /**
   * Fetch invite code preview details and resolve edge states.
   */
  async getInvitePreview(inviteCode: string): Promise<GroupInvitePreview> {
    await simulateNetworkDelay();

    if (inviteCode === 'invalid') {
      return {
        code: inviteCode,
        groupId: '',
        groupName: '',
        creatorHandle: '',
        memberCount: 0,
        memberCap: 10,
        cycleLengthDays: 30,
        dailyStakePercent: 60,
        isPrivate: false,
        status: 'invalid',
      };
    }

    if (inviteCode === 'expired') {
      return {
        code: inviteCode,
        groupId: 'grp_neon_runners',
        groupName: 'NEON RUNNERS',
        creatorHandle: '@KrewMaster99',
        memberCount: 5,
        memberCap: 10,
        cycleLengthDays: 30,
        dailyStakePercent: 60,
        isPrivate: false,
        status: 'expired',
      };
    }

    if (inviteCode === 'full') {
      return {
        code: inviteCode,
        groupId: 'grp_neon_runners',
        groupName: 'NEON RUNNERS',
        creatorHandle: '@KrewMaster99',
        memberCount: 10,
        memberCap: 10,
        cycleLengthDays: 30,
        dailyStakePercent: 60,
        isPrivate: false,
        status: 'full',
      };
    }

    return {
      code: inviteCode,
      groupId: 'grp_neon_runners',
      groupName: 'NEON RUNNERS',
      creatorHandle: '@KrewMaster99',
      memberCount: 4,
      memberCap: 10,
      cycleLengthDays: 30,
      dailyStakePercent: 60,
      isPrivate: false,
      status: 'valid',
    };
  },

  /**
   * Update lifecycle state of a group (creator action).
   */
  async updateGroupStatus(groupId: string, status: GroupStatus): Promise<{ success: boolean; status: GroupStatus }> {
    await simulateNetworkDelay();
    return { success: true, status };
  },

  /**
   * Transfer ownership of a group to another member.
   */
  async transferOwnership(payload: TransferGroupOwnershipRequest): Promise<{ success: boolean }> {
    await simulateNetworkDelay();
    return { success: true };
  },

  /**
   * Permanently delete a group.
   */
  async deleteGroup(groupId: string): Promise<{ success: boolean }> {
    await simulateNetworkDelay();
    return { success: true };
  },
};
