/**
 * SynKrew — Tasks & Scheduling Service Boundary
 * Path: services/tasks.ts
 *
 * Implements member-scoped task definitions, 7-day schedule management,
 * and proof upload/submission workflows.
 */

import {
  TaskDefinition,
  TaskInstance,
  TaskSubmissionRequest,
  SaveTaskDefinitionsRequest,
  SaveTaskScheduleRequest,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const MOCK_MEMBER_TASKS: TaskDefinition[] = [
  {
    id: 'task_1',
    groupMembershipId: 'mem_user_grp_neon_runners',
    title: '5K_OUTDOOR_RUN',
    frequency: 'DAILY',
    target: 1,
    isPaused: false,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'task_2',
    groupMembershipId: 'mem_user_grp_neon_runners',
    title: 'READ_20_PAGES',
    frequency: 'DAILY',
    target: 1,
    isPaused: false,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'task_3',
    groupMembershipId: 'mem_user_grp_neon_runners',
    title: 'CODE_CHALLENGE',
    frequency: 'WEEKLY',
    target: 3,
    isPaused: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
];

const MOCK_SCHEDULE: Record<string, string[]> = {
  MONDAY: ['task_1', 'task_2'],
  TUESDAY: ['task_1'],
  WEDNESDAY: ['task_2', 'task_3'],
  THURSDAY: ['task_1', 'task_3'],
  FRIDAY: ['task_1', 'task_2'],
  SATURDAY: ['task_1'],
  SUNDAY: ['task_2'],
};

export const TasksService = {
  /**
   * Fetch current member's personal task definitions for a group.
   */
  async getMemberTaskDefinitions(groupId: string): Promise<TaskDefinition[]> {
    await simulateNetworkDelay();
    return [...MOCK_MEMBER_TASKS];
  },

  /**
   * Save / update member's task definitions.
   */
  async saveTaskDefinitions(payload: SaveTaskDefinitionsRequest): Promise<TaskDefinition[]> {
    await simulateNetworkDelay();
    return payload.tasks.map((t, index) => ({
      id: t.id || `task_${Date.now()}_${index}`,
      groupMembershipId: `mem_user_${payload.groupId}`,
      title: t.title,
      frequency: t.frequency,
      target: t.target,
      isPaused: t.isPaused || false,
      createdAt: new Date().toISOString(),
    }));
  },

  /**
   * Fetch current member's 7-day weekday schedule.
   */
  async getTaskSchedule(groupId: string): Promise<Record<string, string[]>> {
    await simulateNetworkDelay();
    return { ...MOCK_SCHEDULE };
  },

  /**
   * Save member's 7-day weekday schedule.
   */
  async saveTaskSchedule(payload: SaveTaskScheduleRequest): Promise<{ success: boolean; schedule: Record<string, string[]> }> {
    await simulateNetworkDelay();
    return { success: true, schedule: payload.schedule };
  },

  /**
   * Fetch today's task instances for the authenticated user.
   */
  async getTodayTasks(groupId?: string): Promise<TaskInstance[]> {
    await simulateNetworkDelay();
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'inst_1',
        taskDefinitionId: 'task_1',
        groupMembershipId: 'mem_user_grp_neon_runners',
        groupId: groupId || 'grp_neon_runners',
        taskTitle: '5K_OUTDOOR_RUN',
        ownerUsername: 'KrewMaster99',
        targetDate: today,
        status: 'not_started',
        approvalCount: 0,
        rejectionCount: 0,
      },
      {
        id: 'inst_2',
        taskDefinitionId: 'task_2',
        groupMembershipId: 'mem_user_grp_neon_runners',
        groupId: groupId || 'grp_neon_runners',
        taskTitle: 'READ_20_PAGES',
        ownerUsername: 'KrewMaster99',
        targetDate: today,
        status: 'pending_review',
        approvalCount: 1,
        rejectionCount: 0,
        frontPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
        backPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
        deviceTimestamp: '2026-08-30T08:30:00Z',
      },
    ];
  },

  /**
   * Submit dual photo proof + sensor metadata for a task instance.
   */
  async submitTaskProof(payload: TaskSubmissionRequest): Promise<TaskInstance> {
    await simulateNetworkDelay(600);
    return {
      id: payload.taskInstanceId,
      taskDefinitionId: 'task_1',
      groupMembershipId: 'mem_user_grp_neon_runners',
      groupId: 'grp_neon_runners',
      taskTitle: '5K_OUTDOOR_RUN',
      ownerUsername: 'KrewMaster99',
      targetDate: new Date().toISOString().split('T')[0],
      status: 'pending_review',
      frontPhotoUrl: payload.frontPhotoUri,
      backPhotoUrl: payload.backPhotoUri,
      geolocationLat: payload.latitude,
      geolocationLng: payload.longitude,
      deviceTimestamp: payload.deviceTimestamp,
      approvalCount: 0,
      rejectionCount: 0,
    };
  },
};
