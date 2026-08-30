/**
 * SynKrew — Notifications Service Boundary
 * Path: services/notifications.ts
 *
 * Implements global inbox notifications and preference settings.
 */

import {
  AppNotification,
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_master_99',
    type: 'verification_needed',
    title: 'NEW PROOF TO VERIFY',
    body: 'PixelWarrior submitted proof for 5K Morning Sprint. 3 proofs waiting.',
    deepLinkPath: '/(verify)',
    isRead: false,
    createdAt: '2026-08-30T07:20:00Z',
  },
  {
    id: 'notif_2',
    userId: 'user_master_99',
    type: 'proof_verified',
    title: 'PROOF APPROVED ✓',
    body: 'Your 5K Outdoor Run was verified by the squad. 72 coins returned to Available.',
    deepLinkPath: '/(wallet)',
    isRead: true,
    createdAt: '2026-08-29T23:59:00Z',
  },
  {
    id: 'notif_3',
    userId: 'user_master_99',
    type: 'settlement_completed',
    title: 'DAILY WIN SHARE CREDITED',
    body: '+15 WIN SHARE earned from 1 forfeited stake in Neon Runners.',
    deepLinkPath: '/(wallet)',
    isRead: true,
    createdAt: '2026-08-29T23:59:00Z',
  },
];

let currentPreferences: NotificationPreferences = {
  taskReminders: true,
  verificationRequests: true,
  resultsAndSettlement: true,
  groupActivity: true,
  leagueUpdates: false,
  marketing: false,
};

export const NotificationsService = {
  /**
   * Fetch user's notification list.
   */
  async getNotifications(): Promise<AppNotification[]> {
    await simulateNetworkDelay();
    return [...INITIAL_NOTIFICATIONS];
  },

  /**
   * Mark a notification as read.
   */
  async markNotificationRead(notificationId: string): Promise<{ success: boolean }> {
    await simulateNetworkDelay(100);
    return { success: true };
  },

  /**
   * Fetch notification preferences.
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    await simulateNetworkDelay();
    return { ...currentPreferences };
  },

  /**
   * Update notification preferences.
   */
  async updateNotificationPreferences(
    payload: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    await simulateNetworkDelay();
    currentPreferences = {
      ...currentPreferences,
      ...payload,
    };
    return { ...currentPreferences };
  },
};
