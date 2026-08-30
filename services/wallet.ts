/**
 * SynKrew — Wallet & Transactions Service Boundary
 * Path: services/wallet.ts
 *
 * Implements wallet balance retrieval and percentage-stake transaction ledgers.
 */

import {
  WalletBalance,
  Transaction,
  WalletHistoryResponse,
} from '../types/api';
import { simulateNetworkDelay } from '../lib/api-client';

const MOCK_BALANCE: WalletBalance = {
  availableCoins: 340,
  lockedCoins: 120,
  totalCoins: 460,
  todayEstimatedRisk: 72,
  todayStakePercent: 60,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    userId: 'user_master_99',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    amount: 15,
    type: 'win_share',
    description: 'Win share redistribution (from 1 failing member)',
    stakeCalculationContext: '4 passers split 60 forfeited coins',
    settlementStatus: 'settled',
    createdAt: '2026-08-29T23:59:00Z',
  },
  {
    id: 'tx_2',
    userId: 'user_master_99',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    amount: 72,
    type: 'stake_returned',
    description: 'Daily stake returned — proof verified',
    stakeCalculationContext: '60% of 120 coins',
    settlementStatus: 'settled',
    createdAt: '2026-08-29T23:59:00Z',
  },
  {
    id: 'tx_3',
    userId: 'user_master_99',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    amount: -72,
    type: 'stake_locked',
    description: 'Daily stake locked for active cycle day',
    stakeCalculationContext: '60% of 120 coins at day start',
    settlementStatus: 'settled',
    createdAt: '2026-08-29T00:01:00Z',
  },
  {
    id: 'tx_4',
    userId: 'user_master_99',
    groupId: 'grp_neon_runners',
    groupName: 'NEON RUNNERS',
    amount: 50,
    type: 'milestone_bonus',
    description: '75% Cycle Completion Milestone Bonus',
    settlementStatus: 'settled',
    createdAt: '2026-08-22T00:00:00Z',
  },
];

export const WalletService = {
  /**
   * Fetch user's current wallet balance and daily risk calculation.
   */
  async getWalletBalance(): Promise<WalletBalance> {
    await simulateNetworkDelay();
    return { ...MOCK_BALANCE };
  },

  /**
   * Fetch transaction history ledger, optionally filtered by group.
   */
  async getTransactionHistory(groupId?: string): Promise<WalletHistoryResponse> {
    await simulateNetworkDelay();
    const filtered = groupId
      ? MOCK_TRANSACTIONS.filter(t => t.groupId === groupId)
      : MOCK_TRANSACTIONS;

    return {
      balance: { ...MOCK_BALANCE },
      transactions: filtered,
    };
  },
};
